---
sidebar_position: 3
---

# Interaction with Master Of VALAWAI

The [Master Of VALAWAI (MOV)](/docs/architecture/implementations/mov) is responsible for managing
the topology of interactions between the components that cooperate on the VALAWAI
architecture. The interaction of your component with the MOV is done by publishing
messages to the MOV channels or subscribing to the channels that the MOV provide.
You can read more about all the defined services in the [MOV tutorial](/docs/architecture/implementations/mov),
but in the next sections, we focus on the most common services that you may need to
use when developing your component.


## Register component

## Unregister component


## Topology services

One of the first things that any component must do is to be [registered](/docs/architecture/implementations/mov/register_component)
into the Master Of VALAWAI (MOV) to be added to the topology. In this process, the component
provides its **asynapi.yaml** to the MOV, and it automatically creates the connections
between this new component and any other component if they are compatible. Thus,
the MOV checks the publishing channels of the new component and checks if any other
component defines a subscription to the same content. Also, it does the vice-verse, thus,
it checks the subscription of the new component exists any component that can publish
a compatible message. On the other hand, when the component is not more active it must
[unregister](/docs/architecture/implementations/mov/unregister_component) and the MOV will disable any
topology connection that this component will be involved.

If you created the VALAWAI component following the proposed [skeleton](/docs/tutorials/how_python_component#generate-the-project-skeleton)
at the beginning of this tutorial, you can get the necessary data to register the component
from the file **setup.py** that contains the component version, and on the file **asyncapi.yaml**
you can get the description of the component services.

As we have told you in the [create connection section](/docs/tutorials/how_python_component#create-the-connection)
you need to use a different connection for consume and publish messages because we use
the blocking option.

With all the previous in mind the following code is an example of how the component can be
registered or unregistered from the MOV.


```python 
import sys
import os.path
import re
import pika

class MOVService(object):
    
    def __init__(self, listener:pika.channel.Channel):
        """Initialize the handler foe the topology actions
        
        Parameters
        ----------
        listener : pika.channel.Channel
            The channel to receive messages from RabbitMQ
        """
        listener.queue_declare(queue='valawai/cx/name/control/registered',
                              durable=True,
                              exclusive=False,
                              auto_delete=False)
        listener.basic_consume(queue='valawai/cx/name/control/registered',
                              auto_ack=True,
                              on_message_callback=self.registered_component)

    def __read_file(self, path:str):
        """Read a file and return its content.
        """
        class_file_path = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(class_file_path, path)
        with open(file_path, 'r') as file:
            content = file.read()
        return content
        
    def register_component_msg(self):
        """The message to register this component into the MOV (https://valawai.github.io/docs/architecture/implementations/mov/register_component)
        """
        
        setup = self.__read_file('../setup.py')
        version = re.findall(r"version='(\d+\.\d+\.\d+)'", setup)[0]
        async_api = self.__read_file('../asyncapi.yaml')
             
        msg = {
            "type": "C1",
            "name": "CX_name",
            "version": version,
            "asyncapi_yaml":async_api
            }
        return msg

    def register_component(self,publisher:pika.channel.Channel):
        """Register this component into the MOV (https://valawai.github.io//docs/architecture/implementations/mov/register_component)
        Parameters
        ----------
        publisher : pika.channel.Channel
            The channel to send messages to RabbitMQ
        """
        
        msg = self.register_component_msg()
        publisher.publish_to('valawai/component/register',msg)
        
    def registered_component(self, ch, method, properties, body):
        """Called when the component has been registered.
        """
        logging.debug("Received registered component %s",body)
        msg=json.loads(body)
        self.component_id=msg['id']
        logging.info(f"Register CX name with the identifier '{self.component_id}'")
    
    def unregister_component(self,publisher:pika.channel.Channel):
        """Unregister this component from the MOV (https://valawai.github.io/docs/architecture/implementations/mov/unregister_component)
        Parameters
        ----------
        publisher : pika.channel.Channel
            The channel to send messages to RabbitMQ
        """
        if self.component_id != None:
            
            msg = {"component_id":self.component_id}
            publisher.publish_to('valawai/component/unregister',msg)
            logging.info(f"Unregisterd CX name with the identifier '{self.component_id}'")
            self.component_id = None
```

After that, you must modify the [CX_name/__main__.py](/docs/tutorials/how_python_component#generate-the-project-skeleton) to use this class on the methods **start** and **stop** in the **App** class.

```python 
# ...

class App:

    # ...
    
    def stop(self):
        """Finalize the component.
        """
    
        try:
            # Unregister the component
            if self.mov != None and self.mov.component_id != None:
                
                self.mov.unregister_component(self.publisher.channel)
            
            # close the RabbitMQ connections
            if self.listener != None:
                
                self.listener.close()
                self.listener =  None          

            if self.publisher != None:
                
                self.publisher.close()
                self.publisher =  None          

            logging.info("Finished CX name")
            
        except Exception:
    
            logging.exception("Could not stop the component")

    def start(self):
        """Initialize the component
        """
        try:
            # Create connection to RabbitMQ
            self.listener = RabbitMQConnection()
            self.publisher = RabbitMQConnection()
            
            # Create the handlers for the component services 
            # ...
            
            # Register the component
            self.mov = MOVService(self.listener)
            self.mov.register_component(self.publisher.channel)
            
            # Start to process the received events
            logging.info("Started CX name")
            self.listener.channel.start_consuming()
            
        except KeyboardInterrupt:
            
            logging.info("Stop listening for events")
            
        except pika.exceptions.ConnectionClosedByBroker:
            
            logging.info("Closed connection")

        except Exception:
    
            logging.exception("Could not start the component")
```

## Logging service

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

## Services for C2 components

A [C2 component](/docs/architecture/value_awareness_architecture#c2-component)
is a special component that may need to listen to what the other components do to decide
witch topology connections must be enabled or disabled.
The [Master Of VALAWAI (MOV)](/docs/architecture/implementations/mov) helps in this process because when
a C2 component is [registered](/docs/architecture/implementations/mov/register_component),
it checks if exist any subscribed channel that must be [notified when a message is sent
through a topology connection](/docs/architecture/implementations/mov/notify_c2_components).
Thus, the channel name must match the pattern **valawai/c2/\w+/control/\w+** and
the payload contains the fields: connection_id, source, target, message_payload,
and timestamp.

The following code is an example of how to [listen](/docs/tutorials/how_python_component#listening-for-messages)
for this type of message.

```python
import pika
import json

class MessageAnalyzer(Object):
    """The component to analyze the messages and change the topology if it is necessary.
    """
    
    def __init__(self,listener:pika.channel.Channel):
         """Initialize the analyzer. 
        
        Parameters
        ----------
        listener: pika.channel.Channel
            The connection to receive messages form the  RabbitMQ

         """
         listener.queue_declare(queue='valawai/cx/name/control/message_analizer',
                              durable=True,
                              exclusive=False,
                              auto_delete=False)
         listener.basic_consume(queue='valawai/cx/name/control/message_analizer',
                              auto_ack=True,
                              on_message_callback=self.analize_message)


    def analize_message(self, ch, method, properties, body):
        """Called when a message has to be analyzed.
        """
        
        msg=json.loads(body)

        # Analyze the msg to decide what to do with the topology
        
        # get the connection identifier
        msg['connection_id']
        
        # Access source component information
        msg['source']['id']
        msg['source']['name']
        msg['source']['type']
        
        # Access target component information
        msg['target']['id']
        msg['target']['name']
        msg['target']['type']
        
        # The message that are interchanged
        msg['message_payload']

        # The epoch time, in seconds, when the message is interchanged        
        msg['timestamp']
```

Also, you can use the following class to [change the topology](/docs/architecture/implementations/mov/modify_connection)
managed by the MOV.


```python
import pika
import json

class TopologyService(Object):
    """The service to modify the topology managed by the MOV.
    """
    
    def __init__(self,channel:pika.channel.Channel):
         """Initialize the topology service. 
        
        Parameters
        ----------
        channel: pika.channel.Channel
            The connection to the RabbitMQ to publish messages

         """
         selg.channel = channel
         self.component_id = None

    
    def enable(self,connection_id:str):
        """Enable a connection defined in the topology.
        
        Parameters
        ----------
        connection_id : str
            Identifier of the connection to enable.
        """
        self.__change_topology('ENABLE',connection_id)

    def disable(self,connection_id:str):
        """Disable a connection defined in the topology.
        
        Parameters
        ----------
        connection_id : str
            Identifier of the connection to disable.
        """
        self.__change_topology('DISABLE',connection_id)


    def remove(self,connection_id:str):
        """Remove a connection defined in the topology.
        
        Parameters
        ----------
        connection_id : str
            Identifier of the connection to remove.
        """
        self.__change_topology('REMOVE',connection_id)
        
    def __change_topology(self,action:str,connection_id:str):
        """Change the topology managed by the MOV (https://valawai.github.io//docs/architecture/implementations/mov/modify_connection)
        
        Parameters
        ----------
        action : str
            The action to do over the topology connection
        connection_id : str
            Identifier of the connection to modify.
        """

        msg = {
            "action":action,
            "connection_id": connection_id
        }
        body=json.dumps(msg)
        properties=pika.BasicProperties(
            content_type='application/json'
        )
        self.channel.basic_publish(exchange='',routing_key='valawai/topology/change',body=body,properties=properties)
```
