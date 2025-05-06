---
sidebar_position: 2
---

# Component Services

## Defining the services

The services for the new VALAWAI component must be described in the **asyncapi.yaml** file.
On the [component definition](/docs/architecture/implementations/component#interaction-specification) documentation, you can read how these services must be defined.


## Implementing the services

To implement the services defined in the **asyncapi.yaml** file we are going to use 
the [Pika libary](https://pika.readthedocs.io/en/stable/). This is not a full tutorial
on how to use this library, we only show the minimum necessary to develop the services
of a VALAWAI component.


### Create the connection

On the [Pika documentation](https://pika.readthedocs.io/en/stable/modules/adapters/index.html),
you can read different ways to create a connection with the RabbitMQ, we are going to show 
you how to use the blocking one. One thing you must take care of is when a new connection is created,
if the **RabbitMQ** is not ready an exception is thrown. So, you may need a loop to try to start
the connection several times until the **RabbitMQ** is prepared, or you consider that the connection
can not be established.

When you close this connection, you must call **stop_consuming** before calling
the method **close** in the connection. Otherwise, this last method will fail.

On the other hand, how you are using the blocking connection is required to use a different connection
for **consume** and **publish** messages.

The following code is an example of a class that can manage this connection.

```python
import os
import pika
import time
import logging

class RabbitMQConnection(object):
    
    def __init__(self,
             host:str=os.getenv('RABBITMQ_HOST','mov-mq'),
             port:int=int(os.getenv('RABBITMQ_PORT',"5672")),
             username:str=os.getenv('RABBITMQ_USERNAME','mov'),
             password:str=os.getenv('RABBITMQ_PASSWORD','password'),
             max_retries:int=int(os.getenv('RABBITMQ_MAX_RETRIES',"100")),
             retry_sleep_seconds:int=int(os.getenv('RABBITMQ_RETRY_SLEEP',"3")),
             ):
        """Initialize the connection to the RabbitMQ
        
        Parameters
        ----------
        host : str
            The RabbitMQ server host name. By default uses the environment variable RABBITMQ_HOST
            and if it is not defined uses 'mov-mq'.
        port : int
            The RabbitMQ server port. By default uses the environment variable RABBITMQ_PORT
            and if it is not defined the default value is '5672'.
        username : str
            The user name of the credential to connect to the RabbitMQ server. By default uses the environment
            variable RABBITMQ_USERNAME and if it is not defined the default value is 'mov'.
        password : str
            The password of the credential to connect to the RabbitMQ server. By default uses the environment
            variable RABBITMQ_PASSWORD and if it is not defined the default value is 'password'.
        max_retries : int
            The number maximum of tries to create a connection with the RabbitMQ server. By default uses
            the environment variable RABBITMQ_MAX_RETRIES and if it is not defined the default value is '100'.
        retry_sleep_seconds : int
            The seconds to wait between the tries to create a connection with the RabbitMQ server.
            By default uses the environment variable RABBITMQ_RETRY_SLEEP and if it is not defined the default value is '3'.
        """
        
        tries=0
        while tries < max_retries:
            
            try:
            
                credentials = pika.PlainCredentials(username=username,password=password)
                self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=host,port=port,credentials=credentials))
                self.channel = self.connection.channel()
                return
            
            except Exception:

                logging.exception("Connection was closed, retrying...")
                time.sleep(retry_sleep_seconds)
                
            tries+=1
            
        raise Exception("Cannot connect with the RabbitMQ")

    def close(self):
        """Close the connection.
        """
        
        try:
            
            if self.connection.is_open == True:
                self.channel.stop_consuming()
                self.connection.close()

        except Exception:

            logging.exception("Cannot close the connection.")


```

### Publish a message

The VALAWAI infrastructure exchanges messages that are encoded in JSON. You can do it using
the **dump** method of the **json** library.

When you have the encoded message you only have to call the method **basic_publish** from
the channel of the connection where the **routing_key** must be the name of the queue to
send the message and the **exchange** must be an empty string.

The following code is an example of sending a [log message to the Master of VALAWAI](/docs/architecture/implementations/mov/add_log).

```python
msg={
  "level": "INFO",
  "message": "The component is active",
  "payload": "{\"pattern:\"p1\"}",
  "component_id": "66cde28c8a23fa5af0000c8b"
}
body=json.dumps(msg)
properties=pika.BasicProperties(content_type='application/json')
connection.channel.basic_publish(exchange='',routing_key='valawai/log/add',body=body,properties=properties)
```
        

### Listening for messages

On the [Pika documentation](https://pika.readthedocs.io/en/stable/),
you can read different ways to listen for messages from the RabbitMQ, we are going to show 
you how to use the blocking one. This one does not start to process the subscription messages
until you call the method **start_consuming** on the channel connection. After that,
the **Python thread** is captured until the connection is closed or the connection fails.

Before calling this method you must declare the queues and the methods that will consume
the messages that you want to receive from RabbitMQ. The methods that will be called
when a new message is received must have the parameters: ch, method, properties, and body.
In this last one contains a string with the body of the message encoded in JSON. You can use
the **loads** method of the **json** library, to obtain a dictionary with the values of
the message.

The following example shows how to define a class that will be responsible to manage
the messages that will receive a VALAWAi component from the queue
**valawai/cx/name/control/parameters**.

```python
import pika
import json
import logging

class ChangeParametersHandler(object):

    def __init__(self,channel:pika.channel.Channel):
        channel.queue_declare(queue='valawai/cx/name/control/parameters',
                              durable=True,
                              exclusive=False,
                              auto_delete=False)
        channel.basic_consume(queue='valawai/cx/name/control/parameters',
                              auto_ack=True,
                              on_message_callback=self.handle_message)
                                
    def handle_message(self,ch, method, properties, body):
        try:
            
            parameters=json.loads(body)

            # Do something with the parameters

        except Exception:
            
            logging.exception(f"Unexpected message {body}")
```

Remember, that for this class to be effective you must initialize it before you call
**start_consuming**. In our case, you must modify in the [CX_name/__main__.py](/docs/tutorials/how_python_component#generate-the-project-skeleton)
the methods **start** and **stop** in the **App** class, as you can see in the following code.


```python 

# ...
                                  
class App:

    # ...
	
   def stop(self):
        """Finalize the component.
        """
    
        try:
            # close the RabbitMQ connections
            if self.connection != None:
                
                self.connection.close()
                self.connection =  None          

            logging.info("Finished CX name")
            
        except Exception:
    
            logging.exception("Could not stop the component")

    def start(self):
        """Initialize the component
        """
        try:
            # Create a connection to RabbitMQ
            self.connection = RabbitMQConnection()
            
            # Create the handlers for the events 
            ChangeParametersHandler(self.connection.channel)

            # Start to process the received events
            logging.info("Started CX name")
            self.connection.channel.start_consuming()
            
        except KeyboardInterrupt:
            
            logging.info("Stop listening for events")
            
        except pika.exceptions.ConnectionClosedByBroker:
            
            logging.info("Closed connection")

        except Exception:
    
            logging.exception("Could not start the component")
```


