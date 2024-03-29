---
sidebar_position: 1
---

# Master of VALAWAI (MOV)

In the description of the VALAWAI toolbox, we have introduced the idea
of the [Master Of VALAWAI (MOV)](/toolbox/mov). This piece of software
is responsible for managing the topology of interactions between
the components that cooperate on the VALAWAI architecture. To succeed
in this task, the MOV is connected to a message queue, at the moment
[RabbitMQ](https://www.rabbitmq.com/), and listens for any messages
published by any VALAWAI components and following the topology decides
which components have to receive it. This is similar to an Internet router
but instead of the address specified in the message is the topology inside
the MOV that decides the route that a message has to follow.


## Get started with MOV

The easier way to run the Master of VALAWAI is by executing a script defined
on the source repository. The next steps explain how to do it:

1. Install [docker](https://docs.docker.com/get-docker/),
  [docker compose](https://docs.docker.com/compose/install/) and
  [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Get the code from GitHub

```
git clone https://github.com/VALAWAI/MOV.git
```

3. Execute the script.

```
./runMOV.sh
```

After that, if you open a browser and go to [http://localhost:8080](http://localhost:8080)
you can view the MOV user interface. Also, you can access the RabbitMQ user interface
at [http://localhost:8081](http://localhost:8081). The user credentials for this last
one are **mov:password**.

This script generates docker image [**valawai/mov:latest**](#create-docker-image-from-source),
if it is necessary, and start the [required software](#dependencies) using a
[docker-compose](https://github.com/VALAWAI/MOV/blob/main/src/main/docker/docker-compose.yml).
This last one has some variables that you can modify using a file named [**.env**](https://docs.docker.com/compose/environment-variables/env-file/) in the same directory of the script.For example, the next file shows
how to change the MOV port to 8043.

```
# Changed MOV port from 8080 to 8043
MOV_UI_PORT=8043
```

The defined variables are:

 - **RABBITMQ_TAG** the tag of the RabbitMQ docker image to use.
  The default value is ___management___.
 - **MQ_PORT** the port the message queue broker is available.
  The default value is ___5672___.
 - **MQ_UI_PORT** the port the message queue broker user interface is available.
  The default value is ___8081___.
 - **MQ_USER** the name of the user that can access the message queue broker.
  The default value is ___mov___.
 - **MQ_PASSWORD** the password to authenticate the user that can access the message queue broker.
  The default value is ___password___.
 - **MONGODB_TAG** the tag of the MongoDB docker image to use.
  The default value is ___latest___.
 - **MONGO_PORT** the port where MongoDB is available.
  The default value is ___27017___.
 - **MONGO_ROOT_USER** the name of the root user for the MongoDB.
  The default value is ___root___.
 - **MONGO_ROOT_PASSWORD** the password of the root user for the MongoDB.
  The default value is ___password___.
 - **MONGO_LOCAL_DATA** the local directory where the MongoDB will be stored.
  The default value is ___~/mongo_data/movDB___.
 - **DB_NAME** the name of the database used by the MOV.
  The default value is ___movDB___.
 - **DB_USER_NAME** the name of the user used by the MOV to access to the database.
  The default value is ___mov___.
 - **DB_USER_PASSWORD** the password of the user used by the MOV to access to the database.
  The default value is ___password___.
 - **MOV_TAG** the tag of the MOV docker image to use.
  The default value is ___latest___.
 - **MOV_UI_PORT** the port where MOV user interface is available.
  The default value is ___8080___.

The database is only created the first time where script is called. So, if you modify
any of the database parameters you must create again the database. For this, you must
remove the directory defined by the parameter **MONGO_LOCAL_DATA** and start again the MOV.

You can stop the MOV using the script:

```
./stopMOV.sh
```

This also stops the started dependencies of the MOV (RabbitMQ and MongoDB).


### Create docker image from source

If you want to create the docker container for the MOV you must follow the next steps:

1. Install [docker](https://docs.docker.com/get-docker/),
  [docker compose](https://docs.docker.com/compose/install/) and
  [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Get the code from GitHub

```
git clone https://github.com/VALAWAI/MOV.git
```

3. Generate the MOV docker image calling the script:

```
./buildDockerImages.sh
```

At the end you must have the docker image **valawai/mov:Z.Y.Z**
where **X.Y.Z** will be the version of the MOV. If you want to have
the image with another tag for example **latest** you must call the script
with this tag as parameter, for example:

```
./buildDockerImages.sh latest
```

And you will obtain the container **valawai/mov:latest**.

The most useful environment variables on the docker image are:

 - **RABBITMQ_HOST** is the host where the RabbitMQ is available.
  The default value is ___mov-mq___.
 - **RABBITMQ_PORT** defines the port of the RabbitMQ.
  The default value is ___5672___.
 - **RABBITMQ_USERNAME** contains the name of the user that can access the RabbitMQ.
  The default value is ___mov___.
 - **RABBITMQ_PASSWORD** is the password to authenticate the user that can access the RabbitMQ.
  The default value is ___password___.
 - **QUARKUS_MONGODB_DATABASE** defines the name of the MongoDB where MOV store its data.
  The default value is ___movDB___.
 - **QUARKUS_MONGODB_SERVER** contains the name of the MongoDB server where MOV store its data.
  The default value is ___mongo___.
 - **QUARKUS_MONGODB_PORT** is the port of the MongoDB server where MOV store its data.
  The default value is ___27017___.
 - **QUARKUS_MONGODB_CREDENTIALS_USERNAME** contains the name of the user that can access the MongoDB server.
  The default value is ___mov___.
 - **QUARKUS_MONGODB_CREDENTIALS_PASSWORD** defines the credential to authenticate the user that can access the MongoDB server.
  The default value is ___password__.
 - **QUARKUS_MONGODB_HOSTS** contains the name and port of the MongoDB servers where MOV store its data.
  The default value is ___mongo:27017__.
 - **MOV_LOG_LEVEL** defines the level of the log messages to be stored.
  The default value is ___INFO__.

The MOV is developed using [Quarkus](https://quarkus.io/), so you can change any environment
variable [defined on it](https://quarkus.io/guides/all-config).


### Dependencies

The Master Of VALAWAI has the next software dependencies:

- [RabbitMQ](https://www.rabbitmq.com/) the broker that is used to exchange
 messages between the VALAWAi components.
- [MongoDB](https://www.mongodb.com/) the database used to store information.



## Asyncapi

VALAWAY ayncapi


## Web user interface

Actions to do over the UI

Show components

register a component

unregister a component

show topology connections

create a connection

enable/diasable/remove connections

Show logs


## Web API






