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

```bash
git clone https://github.com/VALAWAI/MOV.git
```

3. Execute the script.

```bash
./runMOV.sh
```

After that, if you open a browser and go to [http://localhost:8080](http://localhost:8080)
you can view the MOV user interface. Also, you can access the RabbitMQ user interface
at [http://localhost:8081](http://localhost:8081). The user credentials for this last
one are **mov:password**.

This script generates docker image [**valawai/mov:latest**](#create-a-docker-image-from-the-source),
if it is necessary, and start the [required software](#dependencies) using a
[docker compose](https://github.com/VALAWAI/MOV/blob/main/src/main/docker/docker-compose.yml).
This last one has some variables that you can modify using a file named [**.env**](https://docs.docker.com/compose/environment-variables/env-file/) in the same directory of the script. For example, the next file shows
how to change the MOV port to 8043.

```properties
# Changed MOV port from 8080 to 8043
MOV_UI_PORT=8043
```

The defined variables are:

 - **RABBITMQ_TAG** is the tag of the RabbitMQ docker image to use.
  The default value is ___management___.
 - **MQ_PORT** is the port of the message queue broker is available.
  The default value is ___5672___.
 - **MQ_UI_PORT** is the port of the message queue broker user interface is available.
  The default value is ___8081___.
 - **MQ_USER** is the name of the user that can access the message queue broker.
  The default value is ___mov___.
 - **MQ_PASSWORD** is the password to authenticate the user that can access the message queue broker.
  The default value is ___password___.
 - **MONGODB_TAG** is the tag of the MongoDB docker image to use.
  The default value is ___latest___.
 - **MONGO_PORT** is the port where MongoDB is available.
  The default value is ___27017___.
 - **MONGO_ROOT_USER** is the name of the root user for the MongoDB.
  The default value is ___root___.
 - **MONGO_ROOT_PASSWORD** is the password of the root user for the MongoDB.
  The default value is ___password___.
 - **MONGO_LOCAL_DATA** is the local directory where the MongoDB will be stored.
  The default value is ___~/mongo_data/movDB___.
 - **DB_NAME** is the name of the database used by the MOV.
  The default value is ___movDB___.
 - **DB_USER_NAME** is the name of the user used by the MOV to access the database.
  The default value is ___mov___.
 - **DB_USER_PASSWORD** is the password of the user used by the MOV to access the database.
  The default value is ___password___.
 - **MOV_TAG** is the tag of the MOV docker image to use.
  The default value is ___latest___.
 - **MOV_UI_PORT** is the port where the MOV user interface is available.
  The default value is ___8080___.

The database is only created the first time where script is called. So, if you modify
any of the database parameters you must create again the database. For this, you must
remove the directory defined by the parameter **MONGO_LOCAL_DATA** and start again the MOV.

You can stop the MOV using the script:

```bash
./stopMOV.sh
```

This also stops the started dependencies of the MOV (RabbitMQ and MongoDB).


### Create a Docker image from the source

If you want to create the docker container for the MOV you must follow the next steps:

1. Install [docker](https://docs.docker.com/get-docker/),
  [docker compose](https://docs.docker.com/compose/install/) and
  [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Get the code from GitHub

```bash
git clone https://github.com/VALAWAI/MOV.git
```

3. Generate the MOV docker image calling the script:

```bash
./buildDockerImages.sh
```

At the end you must have the docker image **valawai/mov:Z.Y.Z**
where **X.Y.Z** will be the version of the MOV. If you want to have
the image with another tag for example **latest** you must call the script
with this tag as a parameter, for example:

```bash
./buildDockerImages.sh latest
```

And you will obtain the container **valawai/mov:latest**.

#### Docker environment variables

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
 - **QUARKUS_HTTP_HOST** contains the server host that will expose the user interface and the REST API.
 The default value is __0.0.0.0__.
 - **QUARKUS_HTTP_PORT** defines the server port that will expose the user interface and the REST API.
 The default value is __8080__.


The MOV is developed using [Quarkus](https://quarkus.io/), so you can change any environment
variable [defined on it](https://quarkus.io/guides/all-config).

#### Docker health check

This component exposes the following REST endpoints to check their health status.

 - **/q/health/live** can be used to check if the component is running.
 - **/q/health/ready** can be used to check if the component can process the messages
  from the VALAWAI infrastructure.
 - **/q/health/started** can be used to check if the component has started.
 - **/q/health** can be used to obtain all the previous check procedures in the component.
 
All of them will return a JSON which will have the **status** of the state (**UP** or **DOWN**)
and the list of **checks** that have been evaluated. It looks like the following example was obtained
from doing a **GET** over the **/q/health** endpoint.

 
```jsx
{
    "status": "UP",
    "checks": [
        {
            "name": "SmallRye Reactive Messaging - liveness check",
            "status": "UP",
            "data": {
                "query_components": "[OK]",
                "query_connections": "[OK]",
                "change_topology": "[OK]",
                "create_connection": "[OK]",
                "register_component": "[OK]",
                "add_log": "[OK]",
                "unregister_component": "[OK]",
                "send_unregister_component": "[OK]",
                "send_create_connection": "[OK]",
                "send_change_topology": "[OK]",
                "send_register_component": "[OK]",
                "components_page": "[OK]",
                "connections_page": "[OK]"
            }
        },
        {
            "name": "RabbitMQ service",
            "status": "UP"
        },
        {
            "name": "MongoDB connection health check",
            "status": "UP",
            "data": {
                "<default>": "OK",
                "<default-reactive>": "OK"
            }
        },
        {
            "name": "SmallRye Reactive Messaging - readiness check",
            "status": "UP",
            "data": {
                "query_components": "[OK]",
                "query_connections": "[OK]",
                "change_topology": "[OK]",
                "create_connection": "[OK]",
                "register_component": "[OK]",
                "add_log": "[OK]",
                "unregister_component": "[OK]",
                "send_unregister_component": "[OK]",
                "send_create_connection": "[OK]",
                "send_change_topology": "[OK]",
                "send_register_component": "[OK]",
                "components_page": "[OK]",
                "connections_page": "[OK]"
            }
        },
        {
            "name": "SmallRye Reactive Messaging - startup check",
            "status": "UP"
        }
    ]
}
 ```
 
An alternative is to see the state of the component using the health user interface that
is exposed at [/q/health-ui/](http://localhost:8080/q/health-ui/).
 
These endpoints are useful for doing the **healthcheck** in a **docker-compose** as
you can see in the following example.


```yaml
services:
  mov:
    image: valawai/mov:${MOV_TAG:-latest}
    container_name: mov_ui
    restart: unless-stopped
    depends_on:
      mongo:
        condition: service_healthy
        restart: true
      mq:
        condition: service_healthy
        restart: true
    ports:
      - ${MOV_UI_PORT:-8080}:8080
    networks:
      - mov
    environment:
      RABBITMQ_HOST: mq
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
      QUARKUS_MONGODB_DATABASE: ${DB_NAME:-movDB}
      QUARKUS_MONGODB_CREDENTIALS_USERNAME: ${DB_USER_NAME:-mov}
      QUARKUS_MONGODB_CREDENTIALS_PASSWORD: ${DB_USER_PASSWORD:-password}
      QUARKUS_MONGODB_HOSTS: mongo:${MONGO_PORT:-27017}
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "curl -s http://localhost:8080/q/health | grep -m 1 -P \"^[\\s|\\{|\\\"]+status[\\s|\\:|\\\"]+.+\\\"\" |grep -q \"\\\"UP\\\"\"",
        ]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s
```


### Dependencies

The Master Of VALAWAI has the following software dependencies:

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
 - **name** of the component to register. It must satisfy the ___c[0|1|2]_\w+___.
 - **version** of the component. It must match the pattern ___\d\.\d\.\d___.
 - **asyncAPI** This is a string with the specification of the services that provide the component
 in [YAML](https://en.wikipedia.org/wiki/YAML) and using the [asyncapi](https://www.asyncapi.com/en) specification.

The next JSON is an example of the message payload to register a component.

```json
{
  "type": "C0",
  "name": "c0_voice_to_text",
  "version": "1.0.0",
  "asyncapi_yaml": "asyncapi: 2.6.0\ninfo:\n  title: Service To test\n  version: 1.5.0\n  description: This service is in charge of processing user signups\nchannels:\n  valawai/test_input:\n    subscribe:\n      message:\n        payload:\n          type: object\n          properties:\n            content:\n              type: string"
}
```

The MOV validate that the provided information is valid and if it is stored this information
on the database and [automatically creates any possible connection](#create-a-topology-connection)
of this component with the rest of the components that are already registered. By default,
if the new connections are between different types of components they are enabled, and otherwise
it is disabled. 

If the specification of the new component has a channel to be [notified that the component is registered](#notify-registered-component)
the MOV will send a message when the component has been registered. It also if the new component
is of the type **C2** and has a channel to be [notified of a message interchanged on a topology connection](#notify-about-a-sent-message-through-a-topology-connection)
the MOV will search for any registered connection that matches the expected message notification.


### Notify registered component

When a component is [registered](#register-a-component) if in the [specification](/docs/toolbox/component#asyncapiyaml)
has a channel that starts with **valawai** plus the type of component, plus the name of the component and
finishes with **/control/registered**, thus that matches the pattern **valawai/c[0|1|2]/\w+/control/registered**. Also,
if it has a subscription to receive messages with an object payload with the fields:

 - **id** The identifier of the component.
 - **name** of the component.
 - **description** of the component.
 - **version** of the component.
 - **api_version** The version of the asyncapi that describes the services of the component.
 - **type** of the component. It can be C0, C1 or C2.
 - **since** The epoch time, in seconds, since the component is available.
 - **channels** the description of the services that the component provides. It must
   be an array or ___null___ if the component does not provide services. Each channel
   is described by the fields:
    - **id** The identifier of the channel that matches the queue name.
    - **description** of the channel
    - **subscribe** The type of payload that the channel can receive. If it is ___null___
     the channel does not receive any messages. The possible types are string, integer, boolean,
     object, an array, a constant, a reference to another object, or a type combination that must
     select one of, any of or all of.
    - **publish** The type of payload that the channel can send. If it is ___null___ the channel
     does not send any message. The possible types are string, integer, boolean, object, an array,
     a constant, a reference to another object, or a type combination that must select one of,
     any of or all of.
   
The next JSON is an example of the message payload to notify that the component is registered.

```json
{
   "id":"65c1f59ea4cb169f42f5edc4",
   "name":"c0_voice_to_text",
   "description":"Generate text from the ambient audio",
   "version":"1.0.5",
   "api_version":"2.3.0",
   "type":"C0",
   "since": 1709902001,
   "channels":[
      {
         "id":"valawai/c0/voice_to_text/data/audio_to_process",
         "description":"Provide the audio text to extract the text.",
         "subscribe":{
            "type":"OBJECT",
            "properties":{
               "sample_ratio":{
                  "type":"BASIC",
                  "format":"STRING"
               },
               "encoded":{
                  "type":"BASIC",
                  "format":"STRING"
               },
               "sample":{
                  "type":"BASIC",
                  "format":"STRING"
               }
            }
         }
      },
      {
         "id":"valawai/c0/voice_to_text/data/text_extracted",
         "description":"Notify about the extracted text from a received audio.",
         "publish":{
            "type":"OBJECT",
            "properties":{
               "text":{
                  "type":"BASIC",
                  "format":"STRING"
               },
               "language":{
                  "type":"BASIC",
                  "format":"STRING"
               },
               "accuracy":{
                  "type":"BASIC",
                  "format":"NUMBER"
               }
            }
         }
      }
   ]
}
```


### Notify about a sent message through a topology connection

When a **C2** [component is registered](#register-a-component) if in the [specification](/docs/toolbox/component#asyncapiyaml)
has a channel that matches the pattern **valawai/c2/\w+/control/\w+**. And also, if it has
a subscription to an object payload with the fields:

 - **connection_id** The identifier of the topology connection that allows the message
  interchanging.
 - **source** The source component that has sent the message. It will have the identifier,
  name and type of the source component.
 - **target** The target component that has received the message.  It will have the
  identifier,
  name and type of the source component.
 - **message_payload** The payload of the message that has been through the connection.
 - **timestamp** The epoch time, in seconds, when the message was sent. 
 

It also when a [connection is created](#create-a-topology-connection) the MOV will
check if any registered component will be notified of the type of messages
that are interchanged in the topology connection.


The next JSON is an example of the message payload that will be sent to the **C2**
component to notify of the sent message. Be aware that the **message_payload** may be different
in each type of connection. 

```json
{
  "connection_id": "65c1f59ea4cb169f42f5edc4",
  "source": {
    "id": "65c1f59ea4cb169f42f5edc4",
    "name": "c0_voice_to_text",
    "type": "C0"
  },
  "target": {
    "id": "65c1f59ea4cb169f42f5edc4",
    "name": "c0_voice_to_text",
    "type": "C0"
  },
  "message_payload": {
  
  },
  "timestamp": 1709902001
}
```

### Search for some components

If you want to obtain information on the registered components you can send a message with
a query to the queue **valawai/component/query** and you will receive the found component
on the queue **valawai/component/page**.

The payload of the query must have the following fields:

 - **id** is an optional field that defines the identifier query. This is used to know
 the found components to which the query is related.
 - **pattern** to match the name or description of the components to return. If it is
 defined between ___/___ it is considered a PCRE regular expression.
If it is __null__ this field is not used on the query.
 - **type** to match the components to return. If it is defined between ___/___
 it is considered a PCRE regular expression.
If it is __null__ this field is not used on the query.
 - **order**  in which the components have to be returned. It is formed by the field names,
 separated by a comma, and each of it with the ___-___ prefix for descending order or
 ___+___ for ascending. The possible fields are type, description, name or since.
 By default is ___+since___.
 - **offset** The index of the first component to return. It must be an integer number greater
 or equal to 0.
 - **limit** The maximum number of components to return. It must be an integer number
 greater than 0.

The next JSON is an example of the query payload.

```json
{
  "id": "1elkjfg289",
  "pattern": "/.+voice.+/i",
  "type": "C0",
  "order": "type,name",
  "offset": 1,
  "limit": 5
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
   - **channels** the description of the services that the component provides. It must
    be an array or ___null___ if the component does not provide services. Each channel
    is described by the fields:
     - **id** The identifier of the channel that matches the queue name.
     - **description** of the channel
     - **subscribe** The type of payload that the channel can receive. If it is ___null___
     the channel does not receive any messages. The possible types are string, integer, boolean,
     object, an array, a constant, a reference to another object, or a type combination that must
     select one of, any of or all of.
     - **publish** The type of payload that the channel can send. If it is ___null___ the channel
     does not send any message. The possible types are string, integer, boolean, object, an array,
     a constant, a reference to another object, or a type combination that must select one of,
     any of or all of.

The next JSON is an example of the payload of a message that responds to a query.

```json
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
      "since": 1709902001,
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

```json
{
  "component_id": "65c1f59ea4cb169f42f5edc4"
}
```


### Create a topology connection

When a component is registered, the Master Of VALAWAI automatically creates any connection
of this new component with any other registered component. Thus, this service is something
that rarely will be used but we provide for any case that may be necessary. For example,
if a connection is removed and you want to create again. In any case, if you use this service
you must be sure that the message that is published by the source component of the connection
matches the messages that the target component expects to receive.

To create a topology connection you must send a message to the queue **valawai/topology/create**
with the following payload:

 - **source** The information of the node that is the source of the
 connection. For the node is necessary the next information:
   * **component_id** The identifier of the component that the topology
   connection starts.
   * **channle_name** The name of the component's channel that
   will publish the messages that enter into the connection.
 - **target** The information of the node that is the connection's target.
   For the node is necessary the next information:
   * **component_id** The identifier of the component that the topology
   connection ends.
   * **channle_name** The name of the component's channel that
   will subscribe to the messages that pass through the connection.
 - **enabled** This is ___true___ if the connection must to be enabled.


The next JSON is an example of the message payload to create a topology connection.

```json
{
  "source": {
    "component_id": "65c1f59ea4cb169f42f5edc4",
    "channel_name": "valawai/C0_voice_to_text/audio"
  },
  "target": {
    "component_id": "65c1f59ea4cb169f42f5edc4",
    "channel_name": "valawai/C0_voice_to_text/audio"
  },
  "enabled": true
}
```

After the topology connection is registered, the MOV will check if any registered **C2** must
be notified of the messages that are interchanged on it. Thus, The MOV will search for all
the **C2** component that has a subscribed channel witch name matches **valawai/c2/\w+/control/\w+**
and the schema matches the [notification message](#notify-about-a-sent-message-through-a-topology-connection)
where the field **message_payload** ahs to match the messages that are interchanged in the
topology connection. 


### Search for some topology connections

If you want to obtain information on the topology connections you can send a message with
a query to the queue **valawai/topology/query** and you will receive the found connections
on the queue **valawai/topology/page**.

The payload of the query must have the following fields:

 - **id** is an optional field that defines the identifier query. This is used to know
 the found components to which the query is related.
 - **source_channel_name** to match the name of the source channel of the connection.
 If it is defined between ___/___ it is considered a PCRE regular expression.
If it is __null__ this field is not used on the query.
 - **source_component_id** to match the source component identifier to return.
 If it is defined between ___/___ it is considered a PCRE regular expression.
 If it is __null__ this field is not used on the query.
 - **target_channel_name** to match the name of the target channel of the connection.
 If it is defined between ___/___ it is considered a PCRE regular expression.
 If it is __null__ this field is not used on the query.
 - **target_component_id** to match the target component identifier to return.
 If it is defined between ___/___ it is considered a PCRE regular expression.
 If it is __null__ this field is not used on the query.
 - **order**  in which the components have to be returned. It is formed by the field names,
 separated by a comma, and each of it with the ___-___ prefix for descending order or
 ___+___ for ascending. The possible fields are createTimestamp, updateTimestamp, enabled,
 source.componentId, source.channelName, target.componentId or target.channelName.
 By default is ___-updateTimestamp___.
 - **offset** The index of the first component to return. It must be an integer number greater
 or equal to 0.
 - **limit** The maximum number of components to return. It must be an integer number
 greater than 0.

The next JSON is an example of the query payload.

```json
{
  "id": "1elkjfg289",
  "source_channel_name": "/.+voice.+/i",
  "source_component_id": "/[65c1f59ea4cb169f42f5edc4|65c1f59ea4cb169f42f5edc5]/",
  "target_channel_name": "c0_voice_to_text",
  "target_component_id": "65c1f59ea4cb169f42f5edc6",
  "order": "enabled",
  "offset": 1,
  "limit": 5
}
```

The MOV when receives the query a request on the database and publishes the result as a message
on the queue **valawai/topology/page** with the following payload:

 - **query_id** is an optional field that defines the identifier query that this is the answer.
 - **total** The number of components that satisfy the query.
 - **connections** that satisfy the query. It must be an array or ___null___ if any connection
 matches the query. Each connection will have the following fields:
   - **id** The identifier of the topology connection.
   - **create_timestamp** The epoch time, in seconds, when the connection has been created.
   - **update_timestamp** The epoch time, in seconds, when the connection has been updated.
   - **source** The node that is the source of the connection.
     * **component_id** The identifier of the component that the topology connection starts.
     * **channle_name** The name of the component's channel that will publish the messages
     that enter into the connection.
   - **target** The node that is the target of the connection.
     * **component_id** The identifier of the component that the topology connection ends.
     * **channle_name** The name of the component's channel that will subscribe to the messages
     that pass through the connection.
   - **enabled** This is ___true___ if the connection is enabled.

The next JSON is an example of the payload of a message that responds to a query.

```json
{
  "query_id": "1elkjfg289",
  "total": 5,
  "connections": [
    {
      "id": "65c1f59ea4cb169f42f5edc4",
      "create_timestamp": 1709902001,
      "update_timestamp": 1709902001,
      "source": {
        "component_id": "65c1f59ea4cb169f42f5edc4",
        "channel_name": "valawai/C0_voice_to_text/audio"
      },
      "target": {
        "component_id": "65c1f59ea4cb169f42f5edc4",
        "channel_name": "valawai/C0_voice_to_text/audio"
      },
      "enabled": true
    }
  ]
}
```

### Modify a topology connection

As we describe on the [value awareness architecture](/toolbox/architecture/value_awareness_architecture)
the data and control flow of messages are interchanged by the VALAWAi components
as described by a topology that in our case will be managed by the Master Of VALAWAI(MOV).
In the previous section, we describe the services to create and search for these connections,
the service that remains is the capability of the C2 components to enable, disable or
remove these connections. For this purpose, the C2 component must be sent to the queue
**valawai/topology/change** a message with the following payload:

 - **action** to change the topology connection. It can be ENABLE, DISABLE or REMOVE.
 - **connection_id** The identifier of the topology connection to change.

The MOV has to enable a topology connection it subscribes to the source channel and publishes
the received messages on the target channel. On the other hand, when disabling the connection
unsubscribe to the source channel. Finally, if the topology connection is also enabled
before marking it as deleted on the database.

The next JSON is an example of the message payload to modify a topology connection.

```json
{
  "action": "ENABLE",
  "connection_id": "65c1f59ea4cb169f42f5edc4"
}
```

### Add a log message

The [VALAWAI architecture](/toolbox/architecture) if formed by some
components that interact sending messages following a topology.
This generated by default a distributed architecture and to facilitate
the monitoring and debugging of these interactions, the Master Of
VALAWAI (MOV) provides a logging infrastructure. This is based on a
web user interface where as used you can search and view the log
messages, and the queue **valawai/log/add** where the components publish
the log messages. The payload of this message must have:


 - **level** of the log message. It can be ERROR, WARN, INFO or DEBUG.
 - **message** of the log.
 - **payload** Extra information to rich the log message. By default is expected
 a json value encoded as a string.
 - **component_id** This filed is optional and it sill contain the identifier
 of the component that has generated the log.


The next JSON is an example of the message payload to add a new
log message.

```json
{
  "level": "INFO",
  "message": "The component is active",
  "payload": "{\"pattern:\"p1\"}",
  "component_id": "66cde28c8a23fa5af0000c8b"
}
```

## Web user interface

When you start the Master Of VALAWAI (MOV) you can access to
the web user interface if you go to [http://localhost:8080](http://localhost:8080).

In the next sections, we describe what you can do on this user interface.

### Manage components

If you click on the upper left a menu appears and you select **Components**, or you click
over **Components** on the footer left menu, you will see all the registered components
on the Master of VALAWAI (MOv) as you can see in the next image.

![Screen shot of the components view](/img/tutorials/mov/components.png)

As you can see in the previous image on the top you have a form that you can use to filter
the components to view. This form has the following fields:

 - The first field is used to return the components that the name or description matches
 the text written on it. You can use __*__ as a wildcard to match any character.
 - The seconds are used to define in which order the components to return.
 You can order by type name or description of the component. Also if you check the box,
 the returned components will be in reverse order.
 - The last form is used to select the types of components to return.


This view does not load dynamically the components, so if you want to obtain the last
components that satisfy the query that you have filled in you must click the button **Reload**.

The last column of the table has the next actions that can be done over a component:

 - **Show** This action opens a new page where you can see all the details of
 the component as you can see on the below image.
 - **Unregister** This action is used to remove a component from the infrastructure.
 This action automatically removes and disables any connection in which this component
 is involved.
 - **Show connections** This action is used to show all the topology connections
 where this component is involved. Thus, the component is the source or the target
 of the topology connection.

![Screen shot of a component view](/img/tutorials/mov/component.png)

You can notify the MOV that exist a new component if you click on the button
**Register a new component**. We discourage you from using it, because is the new component,
when is available, that has to do this action over the VALAWAI infrastructure.


### Manage topology

If you click on the upper left a menu appears and you select **Topology**, or you click
over **Topology** on the footer left menu, you will see all the registered topology
connections on the Master of VALAWAI (MOv) as you can see in the next image.

![Screen shot of the topology connections view](/img/tutorials/mov/topology_connections.png)

As you can see in the previous image on the top, you can specify the text to match
the source or target of the connections to return. You can use __*__ as a wildcard
to match any character. After that, you can define the order to return the connections.

This view does not load dynamically the topology connections, so if you want to obtain the last
connections that satisfy the query that you have filled in you must click the button **Reload**.

The actions that you can do over the found connections are:

 - **Show** This action opens a new page where you can see all the details of
 the topology connection as you can see on the below image.
 - **Enable** This action is used to enable the connection if it is disabled.
 - **Disable** This action is used to disable the connection if it is enabled.
 - **Remove** This action is used to remove the connections. If the connection is enabled
 it is disabled before removing it.

![Screen shot of the topology connections view](/img/tutorials/mov/topology_connection.png)

You can create a new topology connection if you click on the button **Create a new connection**.
We discourage you from using it because the connections are automatically created
when a component is registered. We provide it if you want to restore a removed connection.
Otherwise, if you use it to create a connection you must be sure that the source channel content
is equal to the target channel content.


### Manage logs

If you click on the upper left a menu appear and you select **Logs**, or you click
over **Logs** on the footer left menu, you will see all the notified logs on
the Master of VALAWAI (MOv) as you can see in the next image.

![Screen shot of the logs view](/img/tutorials/mov/logs.png)

As you can see in the previous image on the top, you can specify a text that has
to match for the log messages to return. You can use __*__ as a wildcard
to match any character. After that, you can define the order to return the logs,
and finally, you have to select the level of the log messages to return.
This view does not load dynamically the logs, so if you want to obtain the last logs
that satisfy the query that you have filled in you must click the button **Reload**.


### API

The Master Of VALAWAI provides also web services to interact as you can interact
as the user interface. You can view the full documentation of these services
on the file [openapi.yaml](https://editor.swagger.io/?url=https://raw.githubusercontent.com/VALAWAI/MOV/main/openapi.yaml)
The provided services are:

 - Get some components
 - Get the information of a component.
 - Register a component.
 - Unregister a component.
 - Get some topology connections.
 - Get the information on a topology connection.
 - Modify a topology connection.
 - Get some log messages.

