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
this last directory is named [C1_llm_email_replier]([https://github.com/VALAWAI/C1_llm_email_replier/tree/main/C1_llm_email_replier). 
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


## Implementing the services

Quarkus offers a comprehensive suite of messaging that simplifies the interaction with different messaging
infrastructures such as RabbitMQ. This tutorial only shows you the basics of this suite that allow you to develop
a VALAWAI component. You can read more about this suite on 
the [Quarkus documentation](https://quarkus.io/guides/messaging) and also you can find how it is integrated with the 
[RabbitMQ](https://quarkus.io/guides/rabbitmq).

The basic things you need to know about this suite are:

- Channels are identified by a unique name and declared using a set of annotations.

- Each message type is defined in a different class where the fields are public and these classes must be annotated 
as **@RegisterForReflection**.

- The annotation **@Incoming** is used on the methods that process the messages received from a channel. The classes
where this method is defined must be annotated as **@ApplicationScoped**.

- The annotation **@Outcoming** is used when defining a method that will return 
the messages to be published on a channel.

- The annotation **@Channel** is used when inject into a class an **Emitter**
to publish messages on a channel.

- The definition of channels are defined on the **src/main/java/resources/application.properties**
with the properties that start with **mp.messaging**.

In the next sections, you can read in more detail how to provide the services defined in the **asyncapi.yaml**.


### publish

### subccribe


## Interaction with Master Of VALAWAI


## Dockerize the component

lore ipsum lore