---
sidebar_position: 3
---

# Interaction with Master Of VALAWAI

The [Master Of VALAWAI (MOV)](/docs/architecture/implementations/mov/) plays a central 
role in managing the communication pathways and overall topology of components within 
the VALAWAI architecture. Your component interacts with the MOV by publishing messages 
to specific MOV channels and by subscribing to channels that the MOV provides for control 
and information dissemination.

This section will guide you through the fundamental interactions with essential MOV services. 
You can observe the practical application of these concepts in 
the [MOV service](/tutorials/how_python_component/example#mov-service) subsection of
the [Echo example](/tutorials/how_python_component/example) section.


## Register component

Upon startup, a VALAWAI component must register (refer to 
the [registration documentation](/docs/architecture/implementations/mov/register_component)) 
itself with the Master Of VALAWAI (MOV). This crucial step ensures that your component becomes 
discoverable by other components and is integrated into the active communication topology 
of the VALAWAI ecosystem.

Before initiating the [registration process](/docs/architecture/implementations/mov/registered_notification),
your component needs to be prepared to listen for the MOV's confirmation message, which signifies
successful registration. This notification is dispatched by the MOV to a specific channel 
that you define within your `asyncapi.yaml` file. This channel's name must adhere to the predefined pattern:
**valawai/c[0|1|2]/\w+/control/registered**. You can find a concrete example of this channel definition
within the [Echo example](/docs/tutorials/how_python_component/example#valawaic1echocontrolrgistered).

To formally [register your component](/docs/architecture/implementations/mov/register_component) 
with the MOV, you must publish a JSON-formatted message to the designated **valawai/component/register** 
channel. This message must encapsulate the following key information about your component: its type, 
its unique name, its current version, and the complete content of your `asyncapi.yaml` file, provided 
as a string. The subsequent Python code snippet illustrates the construction and publication of 
this essential registration message:

```python
import os
import pika
import json

file_path = 'asyncapi.yaml'  # Replace with the actual path to your asyncapi.yaml file
try:
    with open(file_path, 'r') as file:
        async_api = file.read()
except FileNotFoundError:
    print(f"Error: asyncapi.yaml not found at {file_path}")
    exit(1)

msg = {
    "type": "C1",  # Replace with the specific type of your component (e.g., C0, C1, C2)
    "name": "c1_echo",  # Replace with the unique name of your component (matching your directory structure)
    "version": "1.0.0",  # Replace with the current version of your component
    "asyncapi_yaml": async_api
}
body = json.dumps(msg)
properties = pika.BasicProperties(content_type='application/json')
# Ensure you have a Pika channel object named 'publish_channel' available
publish_channel.basic_publish(exchange='', routing_key='valawai/component/register', body=body, properties=properties)
```

Upon receiving this specific registration message, the Master of VALAWAI (MOV) initiates 
a comprehensive validation process to rigorously verify the integrity and correctness of 
the payload content. Following successful validation, the component's information is securely 
persisted within the MOV's database. Furthermore, the MOV automatically analyzes potential 
connections between this newly registered component and other existing components within 
the VALAWAI ecosystem. This intelligent analysis enables the MOV to dynamically update 
the overall VALAWAI component topology, facilitating seamless inter-component communication.

Once your component has been successfully registered and processed by the MOV, it will receive 
a confirmation message directly on the control channel that you defined earlier in your 
`asyncapi.yaml` file (following the **valawai/c[0|1|2]/\w+/control/registered** pattern). 
This confirmation signals that your component is now a recognized and active member of 
the VALAWAI architecture.


## Unregister component

When your component is shutting down, it is crucial to 
[unregister](/docs/architecture/implementations/mov/unregister_component)
itself from the Master Of VALAWAI (MOV). This action removes the component from the active 
communication topology, ensuring a clean and accurate representation of the VALAWAI ecosystem.

To unregister, your component simply needs to publish a message containing its unique 
identifier to the **valawai/component/unregister** channel. The following Python code 
snippet demonstrates how to construct and publish this unregistration message:

```python
import pika
import json

# Ensure that the variable 'component_id' holds the unique identifier
# assigned to your component during the registration process.
component_id = "your_component_id_here"  # Replace with your actual component ID

msg = {
    "component_id": component_id
}
body = json.dumps(msg)
properties = pika.BasicProperties(content_type='application/json')
# Ensure you have a Pika channel object named 'publish_channel' available
publish_channel.basic_publish(exchange='', routing_key='valawai/component/unregister', body=body, properties=properties)
```

Once your component successfully publishes this unregistration message, the MOV will process it,
and your component will be removed from the active VALAWAI topology. Following unregistration,
your component will no longer receive new messages routed through the MOV from other registered
components.

## Topology management

The Master Of VALAWAI (MOV) is central to maintaining the dynamic topology of the VALAWAI architecture.
 It automatically establishes connections between components upon their successful
[registration](/docs/architecture/implementations/mov/register_component).  Therefore, explicitly sending
messages to [create a connection](/docs/architecture/implementations/mov/create_connection) 
between components is generally unnecessary.

However, **C2** components have a unique role in potentially influencing the topology based 
on the observed interactions between other components. To facilitate this, the MOV offers a mechanism 
for **C2** components to receive notifications about messages exchanged through topology connections. 
When a **C2** component registers, the MOV examines its `asyncapi.yaml` for any subscribed channels 
matching the pattern **valawai/c2/\w+/control/\w+**. If such subscriptions exist, the MOV will publish 
messages to these channels whenever a message is sent via a topology connection. The payload 
of these notification messages contains crucial information: `connection_id`, `source` component 
details (id, name, type), `target` component details (id, name, type), the `message_payload `itself, 
and the `timestamp` of the exchange.

The following code provides an example of how a *C2* component can 
[listen](/docs/tutorials/how_python_component/services#listening-for-messages) for messages containing 
topology interaction information:

```python
import pika
import json

class MessageAnalyzer:
    """Component to analyze messages and potentially adjust the topology."""

    def __init__(self, listener: pika.channel.Channel):
        """Initialize the analyzer.

        Parameters:
            listener: pika.channel.Channel
                The Pika channel for receiving messages from RabbitMQ.
        """
        queue_name = 'valawai/cx/name/control/message_analyzer' # Adapt 'cx/name' to your C2 component's identifier
        listener.queue_declare(queue=queue_name,
                               durable=True,
                               exclusive=False,
                               auto_delete=False)
        listener.basic_consume(queue=queue_name,
                               auto_ack=True,
                               on_message_callback=self.analyze_message)
        print(f"Listening for topology messages on queue: {queue_name}")

    def analyze_message(self, ch, method, properties, body):
        """Callback function to analyze incoming topology messages."""
        try:
            msg = json.loads(body)

            # Analyze the message content to decide on topology modifications
            print(f"Analyzing topology message for connection ID: {msg.get('connection_id')}")

            # Access connection identifier
            connection_id = msg.get('connection_id')

            # Access source component information
            source = msg.get('source')
            if source:
                print(f"  Source ID: {source.get('id')}, Name: {source.get('name')}, Type: {source.get('type')}")

            # Access target component information
            target = msg.get('target')
            if target:
                print(f"  Target ID: {target.get('id')}, Name: {target.get('name')}, Type: {target.get('type')}")

            # The actual message exchanged
            message_payload = msg.get('message_payload')
            print(f"  Payload: {message_payload}")

            # The timestamp of the message exchange
            timestamp = msg.get('timestamp')
            print(f"  Timestamp: {timestamp}")

            # Based on the analysis, you might decide to modify the topology
            # For example:
            # if some_condition(msg):
            #     self.modify_topology(connection_id, "DISABLE")

        except json.JSONDecodeError:
            print(f"Error decoding JSON: {body.decode()}")
        except Exception as e:
            print(f"An error occurred during message analysis: {e}")
```

Based on the analysis of these intercepted messages, a *C2* component might decide to modify
a connection. To do so, it needs to send a message to the **valawai/topology/change channel**, 
specifying the `connection_id` and the desired `action` (e.g., `DISABLE`, `ENABLE`, or `REMOVE`). 
The following Python code snippet illustrates how to construct and publish a message to disable
a specific connection:

```python
import pika
import json

action = "DISABLE"  # Replace with "ENABLE" to activate or "REMOVE" to delete
connection_id = "your_connection_id_here"  # Replace with the actual connection ID to modify

msg = {
    "action": action,
    "connection_id": connection_id
}
body = json.dumps(msg)
properties = pika.BasicProperties(content_type='application/json')
# Ensure you have a Pika channel object named 'publish_channel' available
publish_channel.basic_publish(exchange='', routing_key='valawai/topology/change', body=body, properties=properties)
```

The MOV also provides a channel for querying
[topology connections](http://localhost:3000/docs/architecture/implementations/mov/connection_query),
but this advanced feature is not covered in this introductory tutorial as it represents 
a less common interaction pattern.


## Add log message

The [Master Of VALAWAI (MOV)](/docs/architecture/implementations/mov) provides different services
and one of them is a [centralized log system](/docs/architecture/implementations/mov/add_log).
This service stores the log messages and shows them in a
[web user interface (WUI)](/docs/architecture/implementations/mov/user_interface#manage-logs).
This service helps in the developing process because you can see what happens in different
components in a unique view. Otherwise, you must access each docker component container and
see the logs.

Adding a log message on the MOV only requires to send a [log message](/docs/architecture/implementations/mov/add_log)
to the queue **valawai/log/add**. In this message, you can add the level, the log message, a payload
and the component identifier obtained when it has been [registered](/docs/architecture/implementations/mov/registered_notification).
The following code is a class for sending log messages to the MOV.

```python
import pika
import json
import logging

class LogService(Object):
    """The service to add log into the MOV.
    """
    
    def __init__(self,channel:pika.channel.Channel):
         """Initialize the log service. 
        
        Parameters
        ----------
        channel: pika.channel.Channel
            The connection to the RabbitMQ to publish messages

         """
         selg.channel = channel
         self.component_id = None

    
    def debug(self,msg:str,payload=None):
        """Send a debug log message to the MOV
        
        Parameters
        ----------
        msg : str
            The log message
        payload: object
            The payload associated to the log message.
        """
        self.__log('DEBUG',msg,payload)
        logging.debug(msg)

    def info(self,msg:str,payload=None):
        """Send an info log message to the MOV
        
        Parameters
        ----------
        msg : str
            The log message
        payload: object
            The payload associated to the log message.
        """
        self.__log('INFO',msg,payload)
        logging.info(msg)

    def warn(self,msg:str,payload=None):
        """Send a warning log message to the MOV
        
        Parameters
        ----------
        msg : str
            The log message
        payload: object
            The payload associated to the log message.
        """
        self.__log('WARN',msg,payload)
        logging.warn(msg)

    def error(self,msg:str,payload=None):
        """Send an error log message to the MOV
        
        Parameters
        ----------
        msg : str
            The log message
        payload: object
            The payload associated to the log message.
        """
        self.__log('ERROR',msg,payload)
        logging.error(msg)
        
    def __log(self,level:str,msg:str,payload=None):
        """Send a log message to the MOV (https://valawai.github.io//docs/architecture/implementations/mov/add_log)
        
        Parameters
        ----------
        level : str
            The log level
        msg : str
            The log message
        payload: object
            The payload is associated with the log message.
        """

        msg = {
            "level":level,
            "message": msg
        }
        
        if payload != None:
            
            msg["payload"] = json.dumps(payload)
            
        if self.component_id != None:
            
            msg["component_id"] = self.component_id
        
        body=json.dumps(msg)
        properties=pika.BasicProperties(
            content_type='application/json'
        )
        self.channel.basic_publish(exchange='',routing_key='valawai/log/add',body=body,properties=properties)
```
