---
sidebar_position: 2
---

# Component services

The services that your VALAWAI component provides and consumes are formally defined within
the `asyncapi.yaml` file. The [component definition](/docs/architecture/implementations/component#interaction-specification)
section provides detailed guidelines on how to specify these services, which essentially 
describe the messages your component can exchange via RabbitMQ queues.

This section will guide you through the practical implementation of connecting to RabbitMQ 
and implementing the mechanisms for both listening to (consuming) and publishing messages, 
all leveraging the capabilities of the [Pika libary](https://pika.readthedocs.io/en/stable/).
You can see the integration of all the concepts explained here in
the [Message service](/tutorials/how_python_component/example#message-service) subsection of 
the [Echo example](/tutorials/how_python_component/example) section.


## Create a connection

The [Pika documentation](https://pika.readthedocs.io/en/stable/modules/adapters/index.html) outlines
various methods for establishing a connection with RabbitMQ. The simplest approach is often using
a blocking connection, as demonstrated in the following example:

```python
import pika

# Connection parameters (adjust as needed)
credentials = pika.PlainCredentials('guest', 'guest')  # Default credentials
connection_parameters = pika.ConnectionParameters('localhost', credentials=credentials)

try:
    connection = pika.BlockingConnection(connection_parameters)
    channel = connection.channel()
    print("Successfully connected to RabbitMQ!")

except pika.exceptions.AMQPConnectionError as e:
    print(f"Failed to connect to RabbitMQ: {e}")
    # Handle the connection error appropriately (e.g., retry, exit)
    exit(1)
```

## Publish a message

The VALAWAI infrastructure relies on JSON-encoded messages for communication. You can achieve 
this encoding using the `dump()` method from the `json` library.

Once your message is encoded, you can publish it using the `basic_publish()` method 
of your connection's channel. For direct queue targeting, the `routing_key` should be 
the name of the destination queue, and the exchange parameter should be an empty string ('').

The following code illustrates how to send a [log message to the Master of VALAWAI](/docs/architecture/implementations/mov/add_log).

```python
import json
import pika

msg = {
    "level": "INFO",
    "message": "The component is active",
    "payload": "{\"pattern\":\"p1\"}",
    "component_id": "your_component_id"  # Replace with your component's ID
}
body = json.dumps(msg)
properties = pika.BasicProperties(content_type='application/json')
channel.basic_publish(exchange='', routing_key='valawai/log/add', body=body, properties=properties)
```
        

## Listening for messages

The [Pika documentation](https://pika.readthedocs.io/en/stable/) details various ways 
to listen for messages from RabbitMQ. We will focus on the blocking approach. With this method, 
message processing for a subscription doesn't begin until you explicitly call the `start_consuming()`
method on the channel. Once called, the current Python thread will be blocked until the connection
is closed or encounters an error.

Before invoking `start_consuming()`, you must declare the queues you intend to listen to and define 
the callback methods that will handle incoming messages.

```python
queue_name = 'my_queue'
channel.queue_declare(queue=queue_name, durable=True)
print(f"Queue '{queue_name}' declared.")
```

The callback methods responsible for processing received messages must accept four arguments:
`ch` (the channel object), `method` (delivery information), `properties` (message properties), 
and `body` (the message content as a JSON-encoded string). You can use the `loads()` method from 
the `json` library to deserialize the body into a Python dictionary.

The following example demonstrates how to define a class to manage messages received by 
a VALAWAI component from the queue `valawai/cx/name/control/parameters`:

```python
import pika
import json
import logging

class ChangeParametersHandler:

    def __init__(self, channel: pika.channel.Channel):
        channel.queue_declare(queue='valawai/cx/name/control/parameters',
                              durable=True,
                              exclusive=False,
                              auto_delete=False)
        channel.basic_consume(queue='valawai/cx/name/control/parameters',
                              auto_ack=True,
                              on_message_callback=self.handle_message)

    def handle_message(self, ch, method, properties, body):
        try:
            parameters = json.loads(body)
            # Implement your logic to process the received parameters
            print(f"Received parameters: {parameters}")

        except Exception:
            logging.exception(f"Unexpected message: {body.decode()}")
```

To make this handler effective, you need to instantiate it before calling `start_consuming()`. 
In the context of your component's main application (`src/cX_name/__main__.py`), you would 
typically initialize these handlers within the `start()` method of your main `App` class, 
as shown below:

```python 
import pika
import logging

class App:
    """The main application class for the component."""

    def __init__(self):
        self.connection = None

    def start(self):
        """Initializes the component."""
        try:
            # Create a connection to RabbitMQ
            credentials = pika.PlainCredentials('guest', 'guest')
            connection_parameters = pika.ConnectionParameters('localhost', credentials=credentials)
            self.connection = pika.BlockingConnection(connection_parameters)
            channel = self.connection.channel()

            # Create the handlers for the events
            ChangeParametersHandler(channel)

            # Start to process the received events
            logging.info("Started CX name")
            channel.start_consuming()

        except pika.exceptions.AMQPConnectionError as e:
            logging.error(f"Error connecting to RabbitMQ: {e}")
        except Exception as e:
            logging.exception(f"An error occurred during startup: {e}")
        finally:
            if self.connection and self.connection.is_open:
                self.connection.close()
                logging.info("Connection closed.")

    def stop(self):
        """Cleans up resources and stops the component."""
        logging.info("Stopping CX name")
        if self.connection and self.connection.is_open and self.connection.channel.is_consuming:
            self.connection.channel.stop_consuming()
        if self.connection and self.connection.is_open:
            self.connection.close()
        logging.info("CX name stopped.")

if __name__ == "__main__":
    app = App()
    try:
        app.start()
    except KeyboardInterrupt:
        app.stop()
```


## Key Considerations When Using Pika

When working with Pika's blocking connection, keep the following points in mind:

 * __Connection Resilience__: Establishing the initial blocking connection might fail 
 if RabbitMQ is not yet available. You might need to implement a retry mechanism with 
 a delay to handle this scenario gracefully.
 * __Clean Shutdown__: Before closing a blocking connection that is consuming messages, 
 ensure you call `stop_consuming()` on the channel. Failing to do so can lead to errors during 
 the connection closure.
 * __Queue Declaration__: Always declare queues before attempting to consume messages 
 from them to ensure they exist.
 * __Separate Connections for Publishing and Consuming (Blocking)__: With blocking connections, 
 it's generally recommended to use separate connections or channels if you need to simultaneously 
 publish and consume messages without blocking the consuming thread. However, the provided examples 
 often use the same channel for simplicity within a single-threaded context. For more complex 
 scenarios, consider using separate threads or asynchronous Pika adapters.

