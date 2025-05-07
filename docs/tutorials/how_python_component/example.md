---
sidebar_position: 5
---

# C1 Echo example

To help in the process we will working in the definition of a component 
that will echo the received messages. This component is a C1 component, 
that is listening for messages in the RabbitMQ queue and echo them.
All the code of this component is on in the [C1_echo_example_with_python_and_pika](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika) repository. 


## Prerequisites

Before you can start, you need to have [Docker](https://www.docker.com/) installed on your computer.


## `asyncapi.yaml` file

The `asyncapi.yaml` file is the file that defines the interaction between the component and the RabbitMQ queue.

### valawai/c1/echo/control/rgistered


## `__main___.py` file

The main file of this component is `__main__.py`. It contains the code that will be executed when the component is started.


## Message service

This service is the component that manage the interaciton of the component with the RaabbitMQ queue using the Pika library.


## MOV service

This service is used to interact with the Master Of VALAWAI (MOV). 


## Defining `Dokerfile` File



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


Explain health check.


## Defining `docker-compose.yaml` File

