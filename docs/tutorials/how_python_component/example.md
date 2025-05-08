---
sidebar_position: 5
---

# Echo example

In this section, we will walk through the step-by-step creation of a C1 component named "echo." 
This component will receive messages and echo them back, as detailed in the preceding sections.

All the code for this example is publicly accessible in 
the [repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika) within 
the VALAWAI GitHub organization.
 

## Step 0. Prerequisites



## Step 1. Set up the Project Structure

To begin, we need to establish the fundamental file and directory organization for our "echo" 
component. Following the [recommended component skeleton structure](/docs/tutorials/how_python_component/skeleton#base-structure),
create the following files and directories in your project's root directory, which we'll assume
is named `C1_echo_example_with_python_and_pika/`:

```
C1_echo_example_with_python_and_pika/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── asyncapi.yaml
├── docker-compose.yml
├── pyproject.toml
├── src/
│    └── c1_echo_example_with_python_and_pika/
│        ├── __init__.py
│        └── __main__.py
└── tests/
```

The content to be added to these files will be explained in the subsequent steps.


## Step 2 (Optional). Set up the development environment

You can use docker to create the environemnt for develop the component. This is optional, and provide all the ncessary
sofware and tools to develop the component.

To set up this environment you must to create the next files and directories to your project.

```
C1_echo_example_with_python_and_pika/
├── startDevelopmentEnvironment.sh
├── stopDevelopmentEnvironment.sh
└── docker/
    └── dev/
        ├── Dokerfile
        └── doker-compose.yaml
```


The content to be added to these files will be explained in the subsequent steps.



but If you want to use the development environment, you can follow the instructions in the [development environment](/docs/tutorials/how_python_component/development_environment) section.


## Defining `asyncapi.yaml`

The `asyncapi.yaml` file is the file that defines the interaction between the component and the RabbitMQ queue.

### valawai/c1/echo/control/rgistered


## `__main___.py` file

The main file of this component is `__main__.py`. It contains the code that will be executed when the component is started.


## Message service

This service is the component that manage the interaciton of the component with the RaabbitMQ queue using the Pika library.


## MOV service

This service is used to interact with the Master Of VALAWAI (MOV). 


## Defining `Dokerfile`



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


## Defining `docker-compose.yml`

