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

The services provided by the Master Of VALAWAI are fully described in the file
[asyncapi.yml](https://github.com/VALAWAI/MOV/blob/main/asyncapi.yml), that you
can read it using the [swagger editor](https://editor-next.swagger.io/)
importing the URL of this file.

In the next sections, we describe the services that the MOV provides.


### Register a component

When a component wants to be visible by other VALAWAI components it must use this service
to register it as a possible topology node. For this purpose, the component must send
a message to the queue **valawai/component/register** with the next payload:

 - **type** of the component to register. It may be C0, C1 or C2.
 - **name** of the component to register. It must satisfy the ___c[0|1|2]_\\w+___.
 - **version** of the component. It must match the pattern ___\d\.\d\.\d___.
 - **asyncAPI** This is a string with the specification of the services that provides the component
 in [YAML](https://en.wikipedia.org/wiki/YAML) and using the [asyncapi](https://www.asyncapi.com/en) specification.

The MOV validate that the provided information is valid and if it is stored this information
on the database and automatically creates any possible connection of this component with the rest
of the components that are already registered. By default, if the new connections are between
different types of components they are enabled, and otherwise it is disabled.

The next JSON is an example of the message payload to register a component.

```
{
  "type": "C0",
  "name": "c0_voice_to_text",
  "version": "1.0.0",
  "asyncapi_yaml": "asyncapi: 2.6.0\ninfo:\n  title: Service To test\n  version: 1.5.0\n  description: This service is in charge of processing user signups\nchannels:\n  valawai/test_input:\n    subscribe:\n      message:\n        payload:\n          type: object\n          properties:\n            content:\n              type: string"
}
```

### Search for some components

If you want to obtain information on the registered components you can send a message with a query
to the queue **valawai/component/query** and you will receive the found component on the queue
**valawai/component/page**.

The payload of the query must have the following fields:

 - **id** is an optional field that defines the identifier query. This is used to know
 the found components to which the query is related.
 - **pattern** to match the name or description of the components to return. If it is
 defined between ___/___ it is considered a PCRE regular expression.
 - **type** to match the components to return. If it is defined between ___/___
 it is considered a PCRE regular expression.
 - **order**  in which the components have to be returned. It is formed by the field names,
 separated by a comma, and each of it with the ___-___ prefix for descending order or
 ___+___ for ascending. The possible fields are type, description, name or since.
 By default is ___+since___.
 - **offset** The index of the first component to return. It must be an integer number greater
 or equal to 0, By default is 0.
 - **limit** The maximum number of components to return. It must be an integer number greater than 0.
 By default is 20.

The next JSON is an example of the query payload.

```
{
  "id": "1elkjfg289",
  "pattern": "/.+voice.+/i",
  "type": "C0",
  "order": "type,name",
  "offset": "1",
  "limit": "5"
}
```

The MOV when receives the query a request on the database and publishes the result as a message
on the queue **valawai/component/page** with the following payload:

 - **query_id** is an optional field that defines the identifier query that this is the answer.
 - **total** The number of components that satisfy the query.
 - **components** that satisfy the query. It must be an array or ___null___ if any component
 matches the query. Each component will have the following fields:
   - **id** The identifier of the component.
   - **name** of the component.
   - **description** of the component.
   - **version** of the component.
   - **api_version** The version of the asyncapi that describes the services of the component.
   - **type** of the component. It can be C0, C1 or C2.
   - **since** The epoch time, in seconds, since the component is available.
   - **channels** the description of the services that the component provides. It must be an array
    or ___null___ if the component does not provide services. Each channel is described by the fields:
     - **id** The identifier of the channel it match the queue name.
     - **description** of the channel
     - **subscribe** The type of payload that the channel can receive. If it is ___null___ the channel
     not receive any message. The possible types are string, integer, boolean, object or an array.
     - **publish** The type of payload that the channel can send. If it is ___null___ the channel
     not send any message. The possible types are string, integer, boolean, object or an array.

The next JSON is an example of the payload of a message that responds to a query.

```
{
  "query_id": "1elkjfg289",
  "total": "5",
  "components": [
    {
      "id": "65c1f59ea4cb169f42f5edc4",
      "name": "c0_voice_to_text",
      "description": "Generate text from the ambient audio",
      "version": "1.0.5",
      "api_version": "2.3.0",
      "type": "C0",
      "since": "1709902001",
      "channels": [
        {
          "id": "valawai/c0_voice_to_text/audio",
          "description": "Provide the audio to convert to text",
          "subscribe": {
            "type": "BASIC"
          },
          "publish": {
            "type": "BASIC"
          }
        }
      ]
    }
  ]
}
```

### Unregister a component

When a component does not want to be visible by other VALAWAI components it must use this service
to unregister it. For this purpose, the component must send
a message to the queue **valawai/component/unregister** with the next payload:

 - **component_id** The identifier of the component to unregister.

The MOV mark the registered component as finished and it is not more visible by other components.
It also disables and removes any topology connection that this component is involved.

The next JSON is an example of the message payload to unregister a component.

```
{
  "component_id": "65c1f59ea4cb169f42f5edc4"
}
```


### Create topology connection


### Search for some topology connections


### Modify topology connection


### Add a log message




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






