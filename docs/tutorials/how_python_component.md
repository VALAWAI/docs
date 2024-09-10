# How to define a VALAWAI component in Python with Pika

In this tutorial, we explain how to define a [VALAWAI component](/toolbox/component)
that is developed using [Python language](https://www.python.org/) with
the [Pika libary](https://pika.readthedocs.io/en/stable/). The main steps will be:

- Generate the project skeleton.
- Define the services of the component.
- Implements the channels that will receive/publish messages.
- Interact with the Master Of VALAWAI.
- How to build and deploy the docker image.


## Generate the project skeleton

The first thing is to define the necessary files that any [VALAWAI component](/docs/toolbox/component)
must-have. Thus, the files:

 - **LICENSE** that will contain the information of the license that you distribute your component.
 As you can see on the [C1 LLM e-mail replier](https://github.com/VALAWAI/C1_llm_email_replier/blob/main/LICENSE)
 the VALAWAI component uses GPLv3 as a license.

 - **CHANGELOG.md** with a description of the significant changes in all
 the public versions of the component, and any necessary instructions to upgrade between versions.
 For example, you can see you can see the changes in 
 the [C1 LLM e-mail replier](https://github.com/VALAWAI/C1_llm_email_replier/blob/main/CHANGELOG.md).

 - **asyncapi.yaml** describes the services that provide the component following the conventions
 of a [VALAWAI compoennt](/docs/toolbox/component#asyncapiyaml). For example, you can see you can
 see the services defined on the [C1 LLM e-mail replier](https://github.com/VALAWAI/C1_llm_email_replier/blob/main/asyncapi.yaml).
 
 - **docker-compose.yml** that will be used to deploy the component following the conventions of 
 a [VALAWAI compoennt](/docs/toolbox/component#docker composeyml). For example, you can see you can see
 the deployment of the [C1 LLM e-mail replier](https://github.com/VALAWAI/C1_llm_email_replier/blob/main/docker-compose.yml).
 
Maybe at the beginning, you may not have all the necessary information to complete these files,
but if you define from the start, it is less probable that you miss any conventions to consider
your component a VALAWAI component.
 
After that, it is time to define the files for a Python project. We follow the recommended
structure by [Kenneth Reitz](https://docs.python-guide.org/writing/structure/). You can follow
any other one that matches your requirements or preferences.

The first thing to do is create the directory **tests**, which will contain the unit tests,
and a directory with the component name, in which the component Python code will be.
For example in the [C1 LLM e-mail replier component](https://github.com/VALAWAI/C1_llm_email_replier/tree/main)
this last directory is named [C1_llm_email_replier](https://github.com/VALAWAI/C1_llm_email_replier/tree/main/C1_llm_email_replier). 
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
            # Create connection to RabbitMQ
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
On the [component definition](/docs/toolbox/component#asyncapiyaml) documentation, you can read how these services must be defined.


## Implementing the services

To implement the services defined in the **asyncapi.yaml** file we are going to use 
the [Pika libary](https://pika.readthedocs.io/en/stable/). This is not a full tutorial
on how to use this library, we only show the minimum necessary to develop the services
of a VALAWAI component. Below we refer to some important things about the **Pika library**
that you need to keep in mind.

- When a new connection is created, if the **RabbitMQ** is not ready an exception is thrown.
So, you may need a loop to try to start the connection several times until
the **RabbitMQ** is ready, or you consider that the connection can not be established.

- The **Pika library** does not start to process the subscription messages until
you call the method **start_consuming** on the channel connection.

- When you call the method **start_consuming**, it captures the **Python thread** and
until the connection is closed or the connection fails.

- When you call the method **start_consuming**, it captures the **Python thread** and
until the connection is closed or the connection fails.

- When you try to close the connection you must call **stop_consuming** before to
call the method s**close** in the connection.

- You must use a different connection for **consume** and **publish** messages.

- You must to **declare** the queue before to **consume** its messages.


### Create the connection

you must to define a preocss that try sevetal times becaus ethe RabbitMQ my be not 
ready
when the conneciton is created

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
            and if it is not defined uses '5672'.
        username : str
            The user name of the credential to connect to the RabbitMQ serve. By default uses the environment
            variable RABBITMQ_USERNAME and if it is not defined uses 'mov'.
        password : str
            The password of the credential to connect to the RabbitMQ serve. By default uses the environment
            variable RABBITMQ_PASSWORD and if it is not defined uses 'password'.
        max_retries : int
            The number maximum of tries to create a connection with the RabbitMQ server. By default uses
            the environment variable RABBITMQ_MAX_RETRIES and if it is not defined uses '100'.
        retry_sleep_seconds : int
            The seconds to wait between the tries for create a connection with the RabbitMQ server.
            By default uses the environment variable RABBITMQ_RETRY_SLEEP and if it is not defined uses '3'.
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

### publish

you must encode the message to json string before to send
the cahhnel has to be define in teh routing_key and teh exchange must be an empty string
and properties must be json

 body=json.dumps(msg)
        properties=pika.BasicProperties(
            content_type='application/json'
        )
        self.publish_connection.channel.basic_publish(exchange='',routing_key=queue,body=body,properties=properties)
        logging.debug("Publish message to the queue %s",queue)
        
        

### subccribe

you must to declare the queue before to listen

you must define a callback method with the next parameters:

the received message is a string you must to convert to json and validate



## Interaction with Master Of VALAWAI


## Dockerize the component

lore ipsum lore