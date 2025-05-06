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


## `__main___.py` file

The main file of this component is `__main__.py`. It contains the code that will be executed when the component is started.