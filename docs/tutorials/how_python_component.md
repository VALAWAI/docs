# How to define a VALAWAI component in Python with Pika

In this tutorial, we explain how to define a [VALAWAI component](/docs/architecture/implementations/component)
that is developed using [Python language](https://www.python.org/) with
the [Pika libary](https://pika.readthedocs.io/en/stable/). The main steps will be:

- Generate the project skeleton.
- Define the services of the component.
- Implements the channels that will receive/publish messages.
- Interact with the Master Of VALAWAI.
- How to build and deploy the docker image.


## Generate the project skeleton

The first thing is to define the necessary files that any [VALAWAI component](/docs/architecture/implementations/component)
must-have. Thus, the files:

 - **LICENSE** that will contain the information of the license that you distribute your component.
 As you can see on the [C1 LLM e-mail replier](https://github.com/VALAWAI/CX_name/blob/main/LICENSE)
 the VALAWAI component uses GPLv3 as a license.

 - **CHANGELOG.md** with a description of the significant changes in all
 the public versions of the component, and any necessary instructions to upgrade between versions.
 For example, you can see you can see the changes in 
 the [C1 LLM e-mail replier](https://github.com/VALAWAI/CX_name/blob/main/CHANGELOG.md).

 - **asyncapi.yaml** describes the services that provide the component following the conventions
 of a [VALAWAI compoennt](/docs/architecture/implementations/component#interaction-specification). For example, you can see you can
 see the services defined on the [C1 LLM e-mail replier](https://github.com/VALAWAI/CX_name/blob/main/asyncapi.yaml).
 
 - **docker-compose.yml** that will be used to deploy the component following the conventions of 
 a ___VALAWAI compoennt___. For example, you can see you can see
 the deployment of the [C1 LLM e-mail replier](https://github.com/VALAWAI/CX_name/blob/main/docker-compose.yml).
 
Maybe at the beginning, you may not have all the necessary information to complete these files,
but if you define from the start, it is less probable that you miss any conventions to consider
your component a VALAWAI component.
 
After that, it is time to define the files for a Python project. We follow the recommended
structure by [Kenneth Reitz](https://docs.python-guide.org/writing/structure/). You can follow
any other one that matches your requirements or preferences.

The first thing to do is create the directory **tests**, which will contain the unit tests,
and a directory with the component name, in which the component Python code will be.
For example in the [C1 LLM e-mail replier component](https://github.com/VALAWAI/CX_name/tree/main)
this last directory is named [CX_name](https://github.com/VALAWAI/CX_name/tree/main/CX_name). 
To simplify the following explanations we use **CX_name** as the component name.
 
The next step is to add the following files:
 
 - **requirements.txt** that contains the required libraries to run the Python program.
 We recommended to generate it with the command:

```
pip freeze > requirements.txt 
```

 - **setup.py** which contains the name, version and dependencies of the component. The minimum
 configuration will contain **Pika**, for interacting with the RabbitMQ, and **pytest**,
 to run the unit tests. The next code is an example of it.
 
```python
from setuptools import setup, find_packages
setup(
    name='CX_name',
    version='1.0.0',
    packages=find_packages(include=['CX_name', 'CX_name.*']),
    install_requires=[
        'pika>=1.3.2'
    ],
    setup_requires=['pytest-runner'],
    tests_require=['pytest']
)
```
 
 - **setup.cfg** defines the different profiles defined on the **setup.py**. By default,
 you only need to define the **test** profile as you can see on the next code.
 
```
[aliases]
test=pytest
```
 
 - **CX_name/\_\_init\_\_.py** contains the necessary code to initialize the component.
 To simplify the **imports**, we recommend that this file contains the following code.
 
```python
import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
```

 - **CX_name/\_\_main\_\_.py** contains the code to launch the component. In this file,
 you must configure the [Python logginng](https://docs.python.org/3/library/logging.html),
 register to capture the signals that finish the Python process, start the connection
 to the RabbitMQ, subscribe to the necessary channels, and when the component finishes
 close this connection. The following code is a skeleton that contains all these steps.

```python
import logging
import os
import logging.config
import signal

class App:
    """The class used as application of the CX name
    """
    
    def __init__(self):
        """Initilaize the application
        """
        # Capture when the docker container is stopped
        signal.signal(signal.SIGINT, self.exit_gracefully)
        signal.signal(signal.SIGTERM, self.exit_gracefully)
        
    def exit_gracefully(self, signum, frame):
        """Called when the docker container is closed
        """
        self.stop()
        
    def stop(self):
        """Finalize the component.
        """
    
        try:
            # close the RabbitMQ connections
            # TO DO

            logging.info("Finished CX name")
            
        except Exception:
    
            logging.exception("Could not stop the component")

    def start(self):
        """Initialize the component
        """
        try:
            # Create a connection to RabbitMQ
            # TO DO
            
            # Create the handlers for the events 
            # TO DO
            
            # Register the component
            # TO DO

            # Start to process the received events
            logging.info("Started CX name")
            # TO DO 
    
        except Exception:
    
            logging.exception("Could not start the component")

def configure_log():
    """Configure the logging system
    """

    try:
        
        console_level = logging.getLevelName(os.getenv("LOG_CONSOLE_LEVEL","INFO"))
        file_level = logging.getLevelName(os.getenv("LOG_FILE_LEVEL","DEBUG"))
        file_max_bytes = int(os.getenv("LOG_FILE_MAX_BYTES","1000000"))
        file_backup_count = int(os.getenv("LOG_FILE_BACKUP_COUNT","5"))
        
        if not os.path.exists("logs"):
            os.makedirs("logs")
        file_name=os.path.join('logs','cx_name.txt')

        logging.config.dictConfig(
            { 
                'version': 1,
                'disable_existing_loggers': True,
                'formatters': { 
                    'standard': { 
                        'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
                    },
                    'precise': { 
                        'format': '%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s'
                    }
                },                
                'handlers': { 
                    'console': { 
                        'level': console_level,
                        'formatter': 'standard',
                        'class': 'logging.StreamHandler',
                        'stream': 'ext://sys.stdout',
                    },
                    'file':{
                        'level': file_level,
                        'formatter': 'precise',
                        'class': 'logging.handlers.RotatingFileHandler',
                        'filename': file_name,
                        'maxBytes': file_max_bytes,
                        'backupCount': file_backup_count
                    }
                },
                'loggers': {
                    '': {
                        'handlers': ['console','file'],
                        'level': 'DEBUG',
                        'propagate': True
                    }
                }
            }
        )

    except Exception as error:
        
        print(error)
        logging.basicConfig(level=logging.INFO)        
        logging.exception("Could not configure the logging")


def main():
    """The function to launch the CX name component
    """
    configure_log()
    app = App()
    app.start()
    app.stop()

if __name__ == "__main__":
    
    main()
```

When you have finished creating all this infrastructure you can use the next commands
to so some common actions.

* **pip install -e .** to install all the dependencies.

* **RABBITMQ_HOST=host.docker.internal python CX_name** to start the component, using the **RabbitMQ**
launched by **Docker**.

* **python setup.py test** to run all the unit tests

* **python -m unittest test/test_something.py** to run the tests defined on the file **test_something.py**

* **python -m unittest test/test_something.py -k test_do_something** to run the test named **test_do_something** defined on the file **test_something.py**


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


## Interaction with Master Of VALAWAI

The [Master Of VALAWAI (MOV)](/docs/architecture/implementations/mov) is responsible for managing
the topology of interactions between the components that cooperate on the VALAWAI
architecture. The interaction of your component with the MOV is done by publishing
messages to the MOV channels or subscribing to the channels that the MOV provide.
You can read more about all the defined services in the [MOV tutorial](/docs/architecture/implementations/mov),
but in the next sections, we focus on the most common services that you may need to
use when developing your component.


### Topology services

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

### Logging service

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

### Services for C2 components

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


## Dockerize the component

If you have followed the [skeleton](/docs/tutorials/how_python_component#generate-the-project-skeleton) described
at the beginning of this tutorial, you only have to create a file named **Dokerfile** with the following content.
Remember to change **CX_name** to the name of your component.  

```dokerfile
# syntax=docker/dockerfile:experimental
FROM python:3.9.19-bullseye

RUN apt-get -qy update && \
    apt-get -qy full-upgrade && \
    apt-get -qy install pip
	
WORKDIR /app

COPY setup.py .
COPY requirements.txt .
COPY LICENSE .
COPY *.md .
COPY asyncapi.yaml .
COPY CX_name/ CX_name/

RUN pip install -e .

ENV RABBITMQ_HOST=mov-mq
ENV RABBITMQ_PORT=5672.
ENV RABBITMQ_USERNAME=mov.
ENV RABBITMQ_PASSWORD=password
ENV RABBITMQ_MAX_RETRIES=100
ENV RABBITMQ_RETRY_SLEEP=3

ENV LOG_CONSOLE_LEVEL=INFO
ENV LOG_FILE_LEVEL=DEBUG
ENV LOG_FILE_MAX_BYTES=1000000
ENV LOG_FILE_BACKUP_COUNT=5

CMD ["python", "CX_name"]
```

After that, you can create the docker image using the following command.

```bash
docker build .
```

You can automatically create the image tagged with the version of the component using the following
script code.

```bash
#!/bin/bash
if ! docker stats --no-stream >/dev/null 2>&1; then
    echo "Docker does not seem to be running, run it first and retry"
    exit 1
else
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
	pushd $DIR > /dev/null
	VERSION=$(grep --max-count=1 "version='" setup.py  | awk -F "'" '{ print $2 }')
	DOCKER_ARGS=""
	if [ "no-cache" = "$1" ];
	then
		DOCKER_ARGS="$DOCKER_ARGS --no-cache"
		TAG=${2:-$VERSION}
	else
		TAG=${1:-$VERSION}
	fi
	pushd $DIR > /dev/null

	DOCKER_BUILDKIT=1 docker build $DOCKER_ARGS -f Dockerfile -t valawai/cx_name:$TAG .
	popd > /dev/null
fi
```

The generated docker image can be configured using the following properties.

* __RABBITMQ_HOST__ is the host where the RabbitMQ is available. The default value is __mov-mq__.
* __RABBITMQ_PORT__ defines the port of the RabbitMQ. The default value is __5672__.
* __RABBITMQ_USERNAME__ contains the user's name that can access the RabbitMQ. The default value is __mov__.
* __RABBITMQ_PASSWORD__ is the password to authenticate the user that can access the RabbitMQ. The default value is __password__.
* __RABBITMQ_MAX_RETRIES__ represent the number of tries to connect to the RabbitMQ. The default value is __100__.
* __RABBITMQ_RETRY_SLEEP__ is the seconds that have to wait between retry to connect to the RabbitMQ. The default value is __3__.
* __LOG_CONSOLE_LEVEL__ defines the level of the log messages on the console. The default value is __INFO__.
* __LOG_FILE_LEVEL__ defines the level of the log messages to be stored in the file. The default value is __DEBUG__.
* __LOG_FILE_MAX_BYTES__ defines the maximum length, in bytes, for the log file. The default values is __1000000__
* __LOG_FILE_BACKUP_COUNT__ defines the maximum number of log files to maintain. the default value is __5__.


All this information has to be used when you define the example of
the docker-compose.yml to deploy the component.
