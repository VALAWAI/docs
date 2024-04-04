# How to define a VALAWAI component with Quarkus

In this tutorial, we explain how to define a [VALAWAI component](/toolbox/component)
that is developed using [Quarkus framework](https://quarkus.io/). We are going
to use the [C0 e-mail sensor](/docs/components/C0/email_sensor) as example of this process.
This component extracts information from e-mails and propagates them to other
VALAWAI components. 


## Create VALAWAI component schema

The first thing to do when it is defining a new [VALAWAI component](/docs/toolbox/component)
is to define its name. The name has to start with the component type plus
a significant name that describes the component in Python case. For example 
**C0_email_sensor**. After that, we can create a directory with this name and start
to populate with the next necessary files:

 - [README.md](https://github.com/VALAWAI/C0_email_sensor/blob/main/README.md)
 that will describe the component and how to use it.
 - [LICENSE](https://github.com/VALAWAI/C0_email_sensor/blob/main/LICENSE) of the component.
 - [CHANGELOG.md](https://github.com/VALAWAI/C0_email_sensor/blob/main/CHANGELOG.md)
 describes the changes that have been done to the component between public versions.
 - [asyncapi.yaml](https://github.com/VALAWAI/C0_email_sensor/blob/main/asyncapi.yaml)
 describe the services that provide the component.
 - [docker-compose.yml](https://github.com/VALAWAI/C0_email_sensor/blob/main/docker-compose.yml)
  that will be used to deploy the component.



## Generate the quarkus skeletomn.


## Add required VALAWAI component files


## Manage asyncaoi


## Deploy