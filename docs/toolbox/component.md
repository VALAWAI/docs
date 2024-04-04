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
 - **asyncapi.yaml** that describe the services that provide the component.
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

This C0 VALAWAI component obtain text from audio files.

## Summary

 - Type: C0
 - Name: Voice to text
 - Version: 1.7.2 (September 23, 2023)
 - API: [1.0.0 (February 3,2023)](asyncapi.yaml)
 - VALAWAI API: [0.1.0 (August 2, 2023)](https://raw.githubusercontent.com/VALAWAI/MOV/ASYNCAPI_0.1.0/asyncapi.yml)
 - Developed By: [IIIA-CSIC](https://www.iiia.csic.es)
 - License: [GPL 3](LICENSE)
 
 ## TO DO ....

```

### asyncapi.yaml

This file describe the services that provide the component using a 
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
___valawai/C0/voice_to_text/data/audio_to_process___. The only field that you must define on the channel
is publish (when the channel sends a message) or subscribe (when the channel receives a message).
In both cases, you must add a **summary** (one-sentence description of the operation)
and the message as a reference of a component. If you need to add a more extensive explanation
you can use the **description** field.

Finally, the **components** section will have two subsections: **messages** and **schemas**.
The first one is used to describe the messages associated with the channels and the second one
is to describe the message content (payload). The name of a message or a schema has to follow
the lowercase and Python case. For the messages, you must set as **contentType** the MIME
**application/json** and optionally you can define a **summary** (one-sentence description of the message).
The **payload** has to be a reference to a schema. You can use the **description** field if you want
to provide a more extended explanation. For the **schemas**, you only have to add the **description**
if the schema is not the payload of a message. The object **properties** names have to follow
the lowercase and Python case and you must define the fields **type** and **description**,
and if the value is not too complex add values on the **examples** field.

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
  valawai/C0/voice_to_text/data/audio_to_process:
    subscribe:
      summary: Provide the audio text to extract the text.
      message:
        $ref: '#/components/messages/audio_content'

  valawai/C0/voice_to_text/data/text_extracted:
    publish:
      summary: Notify about the extracted text from a received audio.
      message:
        $ref: '#/components/messages/text_content'

  valawai/C0/voice_to_text/control/set_paremeters:
    subscribe:
      summary: Modify the parameters of the component.
      message:
        $ref: '#/components/messages/parameters_content'

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
```



### docker-compose.yml

435

Below you can see an example of a [docker-compose.yml](https://github.com/VALAWAI/C0_email_sensor/blob/main/docker-compose.yml).

```
step::
```

