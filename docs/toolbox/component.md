---
sidebar_position: 2
---

# Component

The toolbox is a compilation of components that can be combined to provide a value
awareness application. These components follow the conventions and have the files
described in the next sections.


## Conventions

The architect teams of the VALAWAI project have defined the next conventions
related to the component definition.

### Name format

The name of a component starts with the type of component C0, C1 or C2 plus
the name of the component in lower and Python case. For example, the C0 component
named ‘voice to text’ will be named C0_voice_to_text.


### Version schema

All the components will follow the next version schema: [major, minor, and bug](https://semver.org/).
Thus, for the first major version, with the seven minor changes and the second
bug fixed the version will be: 1.7.2

The developers must provide backward compatibility only between minor versions. Thus backward compatibility is only applied to the versions that happen on the same major, and not between majors but developers may try to do it if it is feasible.

### License

The components defined on the RGNW toolbox will be distributed under the license
[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html). The use of this license is not
mandatory and you can find components that use other licenses.

### Repository

All the source code of the component provided by the VALAWAI partners will be accessible
on a public on GitHub under [VALAWAI organization](https://github.com/VALAWAI).

### Deployment

The components must be encapsulated in [Docker images](https://docs.docker.com/build/)
that will deployed using the [docker-compose](https://docs.docker.com/compose/).

### Interaction between components

Any components interact with the others sending and receiving messages using the 
[RabbitMQ](https://www.rabbitmq.com/). The routing of the messages is defined by
the topology that is maintained by the [Master Of VALAWAI](/docs/toolbox/mov).


## Required files

Any components defined on the RGNW toolbox must have the following files:

 - **README.md** contains a short description of what the component has done, at least 
 a summary section, with the key element of the component, and a section that explains
 how to build the docker image
 of the component and how to deploy it.
 - **LICENSE** of the component.
 - **CHANGELOG.md** will contain a description of the significant changes in all
 the public versions of the component, and any necessary instructions to upgrade
 between versions.
 - **asyncapi.yaml** that describes the services that provide the component.
 - **docker-compose.yml** that will be used to deploy the component.
 
In the next sections, we explain in more detail what these files must have.

### README.md

This file starts with the name of the component followed by a short description
of what the component can do. After that, we have a section with a summary of
the key elements of it. These elements must be:

 - **Type** of the component and may be C0, C1, or C2.
 - **Name** of the component in human-readable format.
 - **Version** of the component.
 - **API** is the version of the asyncapi that the component implements.
 - **VALAWAI API** with the VALAWAI version that this component is compatible with.
 - **Developed by** with the name of the responsible for developing the component.
 - **License** of the component.

After that section, there must exist a section that explains how to create the docker image
and how to deploy it.

Below you can see an example of this kind of file.

```
# C0_voice_to_text

This C0 VALAWAI component obtains text from audio files.

## Summary

 - Type: C0
 - Name: Voice to text
 - Version: 1.7.2 (September 23, 2024)
 - API: [1.0.0 (June 3,2024)](asyncapi.yaml)
 - VALAWAI API: [1.0.0 (April 2, 2023)](https://raw.githubusercontent.com/VALAWAI/MOV/ASYNCAPI_1.1.0/asyncapi.yml)
 - Developed By: [IIIA-CSIC](https://www.iiia.csic.es)
 - License: [GPL 3](LICENSE)
 
## Build docker image
 
You can build the docker image of this component with the next command:

DOCKER_BUILDKIT=1 docker build -f src/main/docker/Dockerfile -t valawai/co_voice_to_text:${TAG:-latest} .

Where TAG has the value of the image version to create. If it is not
specified it uses the **latest**.

## Deploy component

You must build the **latest** docker image of this component before deploying it
( see previous section). After that, you can deploy this component with the command:

docker-compose up -d

If you want to start it with the Master Of VALAWAI you must add the **mov** profile.

docker-compose --profile mov up -d

Also, you can modify the default variables creating an 
[**.env**](https://docs.docker.com/compose/environment-variables/env-file/).
The defined variables are:

 - **C0_VOICE_TO_TEXT_TAG** is the tag of this component to use.
  The default value is ___latest___.
 - **RABBITMQ_TAG** is the tag of the RabbitMQ docker image to use.
  The default value is ___management___.
 - **MQ_PORT** is the port of the message queue broker is available.
  The default value is ___5672___.
 - **MQ_UI_PORT** the port of the message queue broker user interface is available.
  The default value is ___8081___.
 - **MQ_USER** is the name of the user that can access the message queue broker.
  The default value is ___mov___.
 - **MQ_PASSWORD** is the password to authenticate the user that can access the message queue broker.
  The default value is ___password___.
 - **MOV_TAG** is the tag of the MOV docker image to use.
  The default value is ___latest___.
 - **MOV_UI_PORT** is the port where the MOV user interface is available.
  The default value is ___8080___.
 - **MONGODB_TAG** is the tag of the MongoDB docker image to be used by the MOV.
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

```

### asyncapi.yaml

This file describes the services that provide the component using a 
[asyncapi](https://www.asyncapi.com/en) specification. You must use
version ___2.6.0___ which is a rich standard that allows defining 
all the elements in the most-grained detail of how an asynchronous
application will interact. For toolbox components, we only need 
the following sections:

- **info**: describes the general information of the component.
- **channels**: describes which messages will sent or received.
- **components**: describes the message and its content.

In the **info** section, you must define the fields title, version, description,
contact and license. The title will be the name of the component in a human-readable
format starting with VALAWAI and the component type (C0, C1 or C2). For the contact
you only must add the partner name that developed the component and optimally a URL
to the website of the partner. If you wish you can add the information of the developers
(name or email), but remember this information will be public.

The **channels** section describes the services provided by the component,
one channel for each service. These services represent the messages that the component 
can receive (subscribe) or send (publish), whether it is from the data flow or
the control flow. The name of each channel follows the next template
___valawai/c[0|1|2]/component_name/[control/data]/operation_name___. This template only
contains lowercase letters, Python case separation and satisfies 
the [RFC 6570 URI template](https://tools.ietf.org/html/rfc6570). For example, a **C0** component
named **voice to text** that provides a service to process an audio file can be named as
___valawai/C0/voice_to_text/data/audio_to_process___. You can explain the channel action
using the **description** field, but you must define the channel as **publish** 
(when the channel sends a message) or **subscribe** (when the channel receives a message).
When you use both on the same channel specification you must use the  **summary** field
with a one-sentence description of the operation. In any case, you must add a reference
to the message that is sent or received on the channel.

The last section is the **components**, which will have two subsections: **messages** and **schemas**.
The first one is used to describe the messages associated with the channels and the second one
is to describe the message content (payload). The name of a message or a schema has to follow
the lowercase and Python case. For the messages, you must set as **contentType** the MIME
**application/json** and optionally you can define a **summary** (one-sentence description of the message).
The **payload** has to be a reference to a schema. You can use the **description** field if you want
to provide a more extended explanation. For the **schemas**, you only have to add the **description**
if the schema is not the payload of a message. The object **properties** names have to follow
the lowercase and Python case and you must define the fields **type** and **description**,
and if the value is not too complex add values on the **examples** field.

When you create the specification you can define a special channel that starts with **valawai**
plus the type of component, plus the name of the component and finish with **/control/registered**,
thus that match the pattern **valawai/c[0|1|2]/\w+/control/registered**. This channel must be subscribed
to receive messages with an object payload with the fields:

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
 
If this is present the [Master of VALAWAI](/docs/tutorials/mov#register-a-component) will notify this component
when it has been registered send a message to this channel with the information of the 
registered component. 

Below is an example of an asyncapi description of a **C0** component that can extract text
from an audio file. This component listens for messages with the audio data to process and
publish the extracted text from it. Also, it listens for changes in the default language
to use if it is not possible to infer from the audio.

```
asyncapi: '2.6.0'
info:
  title: VALAWAI C0 Voice to text
  version: '0.1.0'
  description: |
    This component converts an audio file into text.
  contact:
    name: IIIA-CSIC
    url: https://www.iiia.csic.es
  license:
    name: GPL v3
    url: https://opensource.org/license/gpl-3-0

channels:
  valawai/c0/voice_to_text/data/audio_to_process:
    subscribe:
      summary: Provide the audio text to extract the text.
      message:
        $ref: '#/components/messages/audio_content'

  valawai/c0/voice_to_text/data/text_extracted:
    publish:
      summary: Notify about the extracted text from a received audio.
      message:
        $ref: '#/components/messages/text_content'

  valawai/c0/voice_to_text/control/set_paremeters:
    subscribe:
      summary: Modify the parameters of the component.
      message:
        $ref: '#/components/messages/parameters_content'

  valawai/c0/voice_to_text/control/registered:
    description: The message to notify when the component has been registered.
    subscribe:
      message:
        $ref: '#/components/messages/registered_component'

components:
  messages:
    audio_content:
      contentType: application/json
      payload:
        $ref: "#/components/schemas/audio_payload"

    text_content:
      contentType: application/json
      payload:
        $ref: "#/components/schemas/text_payload"

    parameters_content:
      contentType: application/json
      payload:
        $ref: "#/components/schemas/parameters_payload"

    registered_component:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/component_payload'

  schemas:
    audio_payload:
      type: object
      properties:
        sample_ratio:
          type: string
          description: The frequency that this audio is sampled on kHz.
          examples:
            - 96
        encoded:
          type: string
          description: Type of the audio encoding.
          examples:
            - 'audio/ogg'
        sample:
          type: string
          description: The binary sample of the audio in Base64.
    text_payload:
      type: object
      properties:
        text:
          type: string
          description: The speech is found on the audio.
        language:
          type: string
          description: The detected language of the text.
          examples:
            - 'English'
        accuracy:
          type: number
          min: 0
          max: 100
          description: The accuracy that the text i what can be listening on the audio.
          examples:
            - 98.7
    parameters_payload:
      type: object
      properties:
        default_language:
          type: string
          description: The language to use if it is not possible to infer the audio language.
          examples:
            - 'English'

    component_payload:
      type: object
      properties:
        id:
          description: The identifier of the component.
          type: string
          pattern: '[0-9a-fA-F]{24}'
          examples: 
            - '65c1f59ea4cb169f42f5edc4'
        name:
          description: The name of the component.
          type: string
          examples: 
            - 'c0_voice_to_text'
        description:
          description: The description of the component.
          type: string
          examples: 
            - 'Generate text from the ambient audio'
        version:
          description: The component version.
          type: string
          pattern: '\d+\.\d+\.\d+'
          examples: 
            - '1.0.5'
        api_version:
          description: The version of the component API.
          type: string
          pattern: '\d+\.\d+\.\d+'
          examples: 
            - '2.3.0'
        type:
          description: The type level of the component in the VALAWAI.
          oneOf:
            - $ref: '#/components/schemas/component_type'
        since:
          description: The epoch time, in seconds, since the component is available in VALAWAI.
          type: integer
          minimum: 0
          examples: 
            - '1709902001'
        channels:
          description: The channels that the component have.
          type: array
          items:
            - $ref: '#/components/schemas/channel_schema'

    component_type:
      type: string
      enum:
        - 'C0'
        - 'C1'
        - 'C2'

    channel_schema:
      type: object
      description: A schema that define the messages that a channel can receive or send.
      properties:
        id:
          description: The identifier of the channel.
          type: string
          examples: 
            - 'valawai/c0_voice_to_text/audio'
        description:
          description: The description of the channel.
          type: string
          examples: 
            - 'Provide the audio to convert to text'
        subscribe:
          description: The type of payload that the channel can receive.
          oneOf:
            - $ref: '#/components/schemas/payload_schema'
        publish:
          description: The type of payload that the channel can send.
          oneOf:
            - $ref: '#/components/schemas/payload_schema'

    payload_schema:
      type: object
      discriminator: type
      properties:
        type:
          type: string
          enum:
            - BASIC
            - ENUM
            - OBJECT
            - ARRAY
            - CONST
            - REF
            - ONE_OF
            - ANY_OF
            - ALL_OF
      required:
        - type

    basic_payload_schema:
      description: The basic payload schema.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'BASIC'
            format:
              type: string
              description: The format of the basic type.
              enum:
                - 'INTEGER'
                - 'NUMBER'
                - 'BOOLEAN'
                - 'STRING'

    enum_payload_schema:
      description: A payload that is defined of one value of a set.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'ENUM'
            values:
              type: array
              description: The possible enum values.
              items:
                - type: string

    object_payload_schema:
      description: A definition of a schema that describe an object.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'OBJECT'
            id:
              type: integer
              description: The identifier used whne this schme is refer by other components.
            properties:
              description: The properties that define the object.
              additionalProperties:
                $ref: '#/components/schemas/payload_schema'
            
    array_payload_schema:
      description: A payload that is represented by an array of values.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'ARRAY'
            items:
              description: The type for the elements on the array.
              type: array
              items:
                - $ref: '#/components/schemas/payload_schema'

    constant_payload_schema:
      description: A payload that is a consatnt value.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'CONST'
            value:
              type: string
              description: The constant of the schema.

    reference_payload_schema:
      description: A payload that is a reference to another schema.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'REF'
            value:
              type: integer
              description: The identifier of the schema that this a reference.

    one_of_payload_schema:
      description: A payload that is one of the possible schemas.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'ONE_OF'
            items:
              description: The possible schemas.
              type: array
              items:
                - $ref: '#/components/schemas/payload_schema'

    any_of_payload_schema:
      description: A payload that is any of the possible schemas.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'ANY_OF'
            items:
              description: The possible schemas.
              type: array
              items:
                - $ref: '#/components/schemas/payload_schema'

    all_of_payload_schema:
      description: A payload that is a set of schemas.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'ALL_OF'
            items:
              description: The schemas that has to match.
              type: array
              items:
                - $ref: '#/components/schemas/payload_schema'

```

There is another special channel that can be defined only for the **C2** components.
This service is used to notify these components of the messages that are
interchanged in any topology connection.  The name of the channel must match the pattern
**valawai/c2/\w+/control/\w+**. For example, for a service named __sent_text__ on
a **C2** component named __text analyzer__, the channel must be named as
**valawai/c2/text_analyzer/control/sent_text**. This channel must define a **subscribe**
message with a payload with the following schema.

 - **connection_id** The identifier of the topology connection that allows the message
  interchanging.
 - **source** The source component that has sent the message. It will have the identifier,
  name and type of the source component.
 - **target** The target component that has received the message.  It will have the
  identifier,
  name and type of the source component.
 - **content** The payload of the message that has been through the connection.
 - **timestamp** The epoch time, in seconds, when the message was sent. 
 
When a connection is registered, it will be checked if exists any **C2**
registered component with this kind of channel with a payload that matches the message
that can be interchanged in the topology connection. If so, it will add to the connection
the necessary information to notify the **C2** component of the messages that will
be sent between the components through the connection.
 
 
 ```
 asyncapi: '2.6.0'
info:
  title: VALAWAI C2 text analyzer
  version: '0.1.0'
  description: |
    This component analyses the alignment of a text with some values.

channels:
  valawai/c2/text_analyzer/control/sent_text:
    subscribe:
      summary: Notified every time two components interchange a text.
      message:
        $ref: '#/components/messages/text_notitication_content'

components:
  messages:
    text_notitication_content:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/text_notification_payload'

  schemas:
    text_notification_payload:
      type: object
      properties:
        connection_id:
          description: The identifier of the topology connection that allows the message interchanging.
          type: string
          pattern: '[0-9a-fA-F]{24}'
          examples: 
            - '65c1f59ea4cb169f42f5edc4'
        source:
          description: The component that has sent the text.
          oneOf:
            - $ref: '#/components/schemas/min_component_payload'
        target:
          description: The target component that has received the text.
          oneOf:
            - $ref: '#/components/schemas/min_component_payload'
        content:
          description: The text that is interchanged between the components.
          oneOf: 
            - $ref: '#/components/schemas/text_payload'
        timestamp:
          description: The epoch time, in seconds, when the message was sent.
          type: integer
          examples:
            - '1709902001'
    text_payload:
      type: object
      properties:
        text:
          type: string
          description: The speech is found on the audio.
        language:
          type: string
          description: The detected language of the text.
          examples:
            - 'English'
        accuracy:
          type: number
          min: 0
          max: 100
          description: The accuracy that the text i what can be listening on the audio.
          examples:
            - 98.7
    min_component_payload:
      type: object
      description: The information of a component that is involved in a message.
      properties:
        id:
          description: The identifier of the component.
          type: string
          pattern: '[0-9a-fA-F]{24}'
          examples: 
            - '65c1f59ea4cb169f42f5edc4'
        name:
          description: The name of the component.
          type: string
          examples: 
            - 'c0_voice_to_text'
        type:
          description: The type level of the component in the VALAWAI.
          oneOf:
            - $ref: '#/components/schemas/component_type'
    component_type:
      type: string
      enum:
        - 'C0'
        - 'C1'
        - 'C2'

 ```
 
 The upper example shows you how this can be defined in this can of channels. In it,
 you can see that the **C2_Text_analyzer** component needs to be notified every time
 that two components interchange a text to validate if the text is aligned with some
 specific values.
 

### docker-compose.yml

This file contains all the necessary to deploy the component with any other required
resource, such as a database. The behaviour of this component must be modified using an 
[**.env** file](https://docs.docker.com/compose/environment-variables/env-file/),
and it must contain the variables necessary to connect the component to 
the message broker used by the infrastructure. These variables may be:

 - **MQ_HOST** is the host of the message queue broker is available.
 - **MQ_PORT** is the port of the message queue broker is available.
 - **MQ_USER** is the name of the user that can access the message queue broker.
 - **MQ_PASSWORD** is the password to authenticate the user that can access
  the message queue broker.

In the case that you want to provide an option to start the component with
the [Master Of VALAWAI](/docs/tutorials/mov), you must add this option as a profile,
such as you can see in the below example.

```
version: '3.7'
services:
  voice_to_text:
    image: valawai/c0_voice_to_text:${C0_VOICE_TO_TEXT_TAG:-latest}
    container_name: c0_voice_to_text
    networks:  
      - valawai-net
    depends_on:
      mov:
        condition: service_completed_successfully
        required: false
    environment:
      RABBITMQ_HOST: ${MQ_HOST:-mq}
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}

  mq:
    image: rabbitmq:${RABBITMQ_TAG:-management}
    container_name: mov_mq
    profiles: [mov]
    ports:
      - ${MQ_PORT:-5672}:5672
      - ${MQ_UI_PORT:-8081}:15672
    networks:
      - valawai-net
    environment:
      RABBITMQ_DEFAULT_USER: ${MQ_USER:-mov}
      RABBITMQ_DEFAULT_PASS: ${MQ_PASSWORD:-password}

  mongo:
    image: mongo:${MONGODB_TAG:-latest}
    container_name: mov_db
    profiles: [mov]
    ports:
      - ${MONGO_PORT:-27017}:27017
    networks:
      - valawai-net
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER:-root}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-password}
      MONGO_INITDB_DATABASE: ${DB_NAME:-movDB}
      DB_NAME: ${DB_NAME:-movDB}
      DB_USER_NAME: ${DB_USER_NAME:-mov}
      DB_USER_PASSWORD: ${DB_USER_PASSWORD:-password}
    volumes:
      - src/deploy/docker/initialize-movDB.js:/docker-entrypoint-initdb.d/init-mongo.js
      - ${MONGO_LOCAL_DATA:-~/mongo_data/emailSensorMovDB}:/data/db
  mov:
    image: valawai/mov:${MOV_TAG:-latest}
    container_name: mov
    profiles: [mov]
    depends_on:
      - mongo
      - mq
    ports:
      - ${MOV_UI_PORT:-8080}:8080
    networks:  
      - valawai-net
    environment:
      RABBITMQ_HOST: mq
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
      QUARKUS_MONGODB_DATABASE: ${DB_NAME:-movDB}
      QUARKUS_MONGODB_CREDENTIALS_USERNAME: ${DB_USER_NAME:-mov}
      QUARKUS_MONGODB_CREDENTIALS_PASSWORD: ${DB_USER_PASSWORD:-password}
      QUARKUS_MONGODB_HOSTS: mongo:${MONGO_PORT:-27017}

networks:
  valawai-net:

```

