# How to define a VALAWAI component with Quarkus

In this tutorial, we explain how to define a [VALAWAI component](/toolbox/component)
that is developed using [Quarkus framework](https://quarkus.io/). The main steps will be:

- Generate the Quakus project
- Add the VALAWAI component required files
- Implements the channels that will receive/publish messages.
- Interact with the Master Of VALAWAI.
- How to build and deploy the docker image


## Generate the project

To generate the seed code for the project you must follow the next steps.

1. Got to the [Quarkus code generation web](https://code.quarkus.io/).

2. After that, you must define the group and artifact of the component that you want to create.
The group identify your component from all the possible components. It follows 
the [maven's rules](https://maven.apache.org/guides/mini/guide-naming-conventions.html), thus the reverse
domain of your organization. if you do not have any you can use the VALAWAI one (**eu.valawai**).
On the other hand, the artifact must start with a  __c__ plus the level of the component followed by the name
of the component in [kebak case](https://en.wiktionary.org/wiki/kebab_case). For example for a **C0**
component named email sensor the artifact will be **c0-email-sensor**.

3. Select the packages:

 - Messaging - RabbitMQ Connector
 - REST Jackson
 - Container Image Docker

4. Click the button **Generate your application**.

Finally, you must have the seed code for your component.


## Adapt to be a VALAWAI component

After you have the seed for the Quarkus project is time to make some changes to match
a [VALAWAI component](/docs/toolbox/component). The first thing is to modify
the [README.md](/docs/toolbox/component#readmemd) to contain a short description of what the component
has done, at least a summary section, with the key element of the component, and a section that explains
how to build the docker image of the component and how to deploy it. For example, you can see
the read-me of the [C0 email sensor](https://github.com/VALAWAI/C0_email_sensor/blob/main/README.md).

After that, you must add the files:

 - **LICENSE** that will contain the information of the license that you distribute your component.
 As you can see on the [C0 email sensor](https://github.com/VALAWAI/C0_email_sensor/blob/main/LICENSE)
 the VALAWAI component uses GPLv3 as a license.

 - **CAHNGELOG.md** that will contain a description of the significant changes in all the public versions
 of the component, and any necessary instructions to upgrade between versions. For example, you can see
 you can see the changes in the [C0 email sensor](https://github.com/VALAWAI/C0_email_sensor/blob/main/CHANGELOG.md).

 - **asyncapi.yaml** that describes the services that provide the component following the conventions of 
 a [VALAWAI compoennt](/docs/toolbox/component#asyncapiyaml). For example, you can see you can see the services
 defined on the [C0 email sensor](https://github.com/VALAWAI/C0_email_sensor/blob/main/asyncapi.yaml).
 
 - **docker-compose.yml** that will be used to deploy the component following the conventions of 
 a [VALAWAI compoennt](/docs/toolbox/component#docker-composeyml). For example, you can see you can see
 the deployment of the [C0 email sensor](https://github.com/VALAWAI/C0_email_sensor/blob/main/docker-compose.yml).


Maybe at the beginning, you may not have all the necessary information to complete these files, but if you define
from the start, it is less provably that you miss any conventions to consider your component a VALAWAI component.


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


### Subscribe to messages

On the [asyncapi.yaml](/docs/toolbox/component#asyncapiyaml) of your component, you define the messages that
your component must be subscribed to. Thus, the messages that it can receive and process. To implement them
you must follow the next steps:

1. Define a class for each type of payload of the message that the component can receive. On these classes
fields are public and these are annotated as **@RegisterForReflection**.

2. Edit the **src/main/java/resources/application.properties** add add the configuration properties
**mp.messaging.incoming.CHANNEL_NAME.connector=smallrye-rabbitmq** and 
**mp.messaging.incoming.CHANNEL_NAME.queue.name=ASYNCAPI_CHANNEL_NAME**.

3. Define a class to manage the subscribed message that is annotated as **@ApplicationScoped**
and add into this class a public method for each subscription that must be annotated 
with **@Incoming** that receives as parameter a **Message\<JsonObject\>** and return
**CompletionStage\<Void\>**. The payload of the message is a **JsonObject**
that you can convert to the class of the message using the **mapTo** function. 
The return value can be generated using the message and calling the method **ack**
when the process is a success or the method **nack** when is not.

For example, the next **asyncapi** describes that a component is subscribed to receive
the information of a temperature sensor.

```yaml
asyncapi: '2.6.0'
info:
 title: C1 temperature controller
 version: '1.0.0'
 description: |
  This VALAWAI component controls the temperature of a room.
 license:
  name: GNU General Public License version 3
  url: https://opensource.org/license/gpl-3-0/
 contact:
  name: VALAWAI
  url: https://valawai.eu/

channels:
  valawai/c1/temperature_controller/data/temperature:
    description: The subscription to the temperature sensor.
    subscribe:
      message:
        $ref: '#/components/messages/temperature'

components:
  messages:
    temperature:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/temperature_payload'

  schemas:
    temperature_payload:
      description: The measured temperature.
      type: object
      properties:
        value:
          type: number
          description: The current temperature value.
        unit:
          type: string
          description: The unit of the temperature value.
          enum:
            - Celsius
            - Fahrenheit
            - Kelvin
          examples:
           - Kelvin
```

Following the described steps, the first thing to do is to define
the classes that contain the message payload as you can see in the next code.

```java 
import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The content of a temperature measurement.
 */
@RegisterForReflection
public class TemperaturePpayload {

	/**
	 * The current temperature value.
	 */
	public double value;

	/**
	 * The unit of the temperature value.
	 */
	public Unit unit;

	/**
	 * The possible units of the temperature.
	 */
	public static enum Unit {

		Celsius, Fahrenheit, Kelvin;
	}

}
```

After that, you must add to the **src/main/java/resources/application.properties**
the configuration of the subscribed channels. Following the example, we named the channel
as **temperature** and you must add the next properties.

```properties
mp.messaging.incoming.temperature.connector=smallrye-rabbitmq
mp.messaging.incoming.temperature.queue.name=valawai/c1/temperature_controller/data/temperature
```

Finally, the next code shows the definition of the manager to process the temperature
messages. In this file you can see:

 - At line 12 you see the annotation **@ApplicationScoped** that starts this service
 when the Quarkus will be started.
 - At line 22  you see the annotation **@Incoming** to define the subscription
 to the channel **temperature**.
 - At line 29 the JSON payload is converted to a **TempersturePayload**.
 - At line 34 the message processing finish notification that the temperature message
 has been processed.
 - At line 39 the message processing finish notification that the temperature message
 has not been processed.


```java showLineNumbers
import java.util.concurrent.CompletionStage;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;

import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * The class that manage the subscribed messages.
 */
@ApplicationScoped
public class TemperatureManager {

	/**
	 * Called to process the subscribed message .
	 *
	 * @param msg with the subscribed payload.
	 *
	 * @return the result if the message process.
	 */
	@Incoming("temperature")
	public CompletionStage<Void> receivedTemperature(Message<JsonObject> msg) {

		try {

			// Obtain the payload from the message
			final var payload = msg.getPayload();
			final var temperature = payload.mapTo(TemperaturePpayload.class);

			// Do something with the payload

			// Notify subscribed message is processed
			return msg.ack();

		} catch (final Throwable error) {

			// Notify subscribed message cannot be processed
			return msg.nack(error);
		}
	}

}
```
 
### Publish messages

On the [asyncapi.yaml](/docs/toolbox/component#asyncapiyaml) of your component, you define the messages that your component must publish. Thus, the messages that it can send.
To implement them you must follow the next steps:

1. Define a class for each type of payload of the message that the component can send. On these classes fields are public and these are annotated as **@RegisterForReflection**.

2. Edit the **src/main/java/resources/application.properties** add add the configuration properties
**mp.messaging.outgoing.CHANNEL_NAME.connector=smallrye-rabbitmq**,
**mp.messaging.outgoing.CHANNEL_NAME.queue.name=ASYNCAPI_CHANNEL_NAME**, and
**mp.messaging.outgoing.CHANNEL_NAME.exchange.name=""**
**mp.messaging.outgoing.CHANNEL_NAME.default-routing-key=ASYNCAPI_CHANNEL_NAME**.

3. Add to the class that manages the component a field of the type **Emitter\<M\>**
that is annotated with **@Inject** and **@Channel**. After that, you can publish a message calling the method **send**, but remember to add a handler to manage the result or the message will not be sent.

For example, the next **asyncapi** describes a component that publishes messages to 
control an HVAC.

```yaml
asyncapi: '2.6.0'
info:
 title: C1 temperature controller
 version: '1.0.0'
 description: |
  This VALAWAI component controls the temperature of a room.
 license:
  name: GNU General Public License version 3
  url: https://opensource.org/license/gpl-3-0/
 contact:
  name: VALAWAI
  url: https://valawai.eu/

channels:
  valawai/c1/temperature_controller/control/hvac_parameters:
    description: The action to change the parameters of the Heating, ventilation 
     and air conditioning system.
    publish:
      message:
        $ref: '#/components/messages/hvac_parameters'

components:
  messages:
    hvac_parameters:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/hvac_paramters_payload'
  schemas:
    hvac_parameter_state:
      type: string
      description: The possible state of an HVAC parameter.
      enum:
        - ON
        - OFF
      examples:
        - ON
    
    hvac_paramters_payload:
      description: The parameters to configure the HVAC.
      type: object
      properties:
        heating:
          description: If the HVAC must heat the air.
          oneOf:
            - $ref: '#/components/schemas/hvac_parameter_state'
        ventilation:
          description: The power of the fan.
          type: integer
          min: 0
          mac: 5
          examples:
          - 3
        ac:
          description: If the HVAC must cold the air.
          oneOf:
            - $ref: '#/components/schemas/hvac_parameter_state'
```

Following the described steps, the first thing to do is to define
the classes that contain the message payload as you can see in the next code.

```java 
import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The prameters to configure an Heating, ventilation and air conditioning system. (HVAC).
 */
@RegisterForReflection
public class HVACParameters {

	/**
	 * If the HVAC must heat the air.
	 */
	public State heating;

	/**
	 * If the HVAC must cold the air.
	 */
	public State ac;

	/**
	 * The power of the fan.
	 */
	public int ventilation;

	/**
	 * The possible state of the HVAC parameter.
	 */
	public static enum State {

		ON, OFF;
	}

}
```

After that, you must add to the **src/main/java/resources/application.properties**
the configuration of the published channels. Following the example, we named the channel
as **hvac** and you must add the next properties.

```properties
mp.messaging.outgoing.hvac.connector=smallrye-rabbitmq
mp.messaging.outgoing.hvac.queue.name=valawai/c1/temperature_controller/control/hvac_parameters
mp.messaging.outgoing.hvac.exchange.name=""
mp.messaging.outgoing.hvac.default-routing-key=valawai/c1/temperature_controller/control/hvac_parameters
```

Finally, the next code shows the definition of the field to send the messages to 
an HVAC. In this file you can see:

 - At line 12 you see the annotation **@ApplicationScoped** that starts this service
 when the Quarkus will be started and it's them when the **Emitter** will be injected.
 - At line 18 you see the annotation **@Channel** to define taht the messages
 will be published into the **hvac** channel.
 - At line 19 you see the annotation **@Inject** to notify Quarkus to set the emitter
 when the service will be created.
 - At line 20 you see the definition of the **Emitter** to publish **HVACParameters**
 messages.
 - At line 32 a message to turn off an HVAC is sent. It also you can see how 
 is handled the send process. ATTENTION: If you do not define this part the message
 will not be sent.
 - At line 34 is checked if the message has been sent and if not a log message is  
 generated.


```java showLineNumbers
import java.util.concurrent.CompletionStage;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;

import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * The class that manage the subscribed messages.
 */
@ApplicationScoped
public class TemperatureManager {

	/**
	 * The channel to send messages to an HVAC.
	 */
	@Channel("hvac")
	@Inject
	Emitter<HVACParameters> hvac;

	/**
	 * Turn off the hvac.
	 *
	 * @return the status of the send process.
	 */
	public void turnOff() {

		final var msg = new HVACParameters();
		msg.heating = State.OFF;
		msg.ac = State.OFF;
		this.hvac.send(msg).handle((success, error) -> {

			if (error != null) {

				Log.errorv(error, "Cannot send {0}", msg);
			}
			return null;
		});
	}

}
```


## Interaction with Master Of VALAWAI

The [Master Of VALAWAI (MOV)](/docs/tutorials/mov) is the responsible to mantains
the topology between the components that form the values aware application.


### register the compomnent

send teh message to the channel and store and use appicaiton started

### unregister a component

Use applicaiton finished

### C2 speciifc channels

## Dockerize the component

When you have [generated the project](#generate-the-project) you have added
the package to generate the docker container that will contain the Qarkus application.
The first thing that you must do is configure this component adding on 
the **src/main/java/resources/application.properties** the next properties:

```properties showLineNumbers
quarkus.container-image.builder=docker
quarkus.container-image.build=true
quarkus.container-image.group=valawai
quarkus.container-image.name=c1_temperature_controller
quarkus.container-image.tag=${quarkus.application.version}
```

In lines 3 and 4 you must define the name of the docker image to generate. Remember
that the docker image name must be in lowercase and use the Python case. For example,
if the version of the project is **1.0.0**, then the image that will be generated with
these parameters is **valawai/c1_temperature_controller:1.0.0**. You can read more about
this configuration on the [Quarkus documentation](https://quarkus.io/guides/container-image).

After that, you can generate the docker container image with the next maven call:

```bash
./mvnw clean package
```

The generated docker image can be configured using any [Quarkus configuration property](https://quarkus.io/guides/all-config) using a docker environment variable, 
but first, the property name has to be changed to uppercase and replace any nonword character by **_**. For example, the variable
**rabbitmq-host** which defines the host where the RabbitMQ broker is,
has to be renamed as **RABBITMQ_HOST**.
The minimum environment variables that must be defined when deploying the docker image are:

 - **RABBITMQ_HOST** is the host where the RabbitMQ is available.
 The default value is ___mov-mq___.
 - **RABBITMQ_PORT** defines the port of the RabbitMQ.
 The default value is ___5672___.
 - **RABBITMQ_USERNAME** contains the user's name that can access the RabbitMQ.
 The default value is ___mov___.
 - **RABBITMQ_PASSWORD** is the password to authenticate the user that can access the RabbitMQ.
 The default value is ___password___.


Remmeber to use this image on the **docekr-compose.yml** example to deploy this component
that is defined on the rrot.

src/dev/docker

buildDoclkerImage
startDevelopmentEn
stopDevelopEnv

