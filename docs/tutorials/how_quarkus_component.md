# How to define a VALAWAI component with Quarkus

In this tutorial, we explain how to define a [VALAWAI component](/toolbox/component)
that is developed using [Quarkus framework](https://quarkus.io/). The main steps will be:

- Generate the Quakus project.
- Add the VALAWAI component required files.
- Implements the channels that will receive/publish messages.
- Interact with the Master Of VALAWAI.
- How to build and deploy the docker image.


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

 - Messaging - RabbitMQ Connector (quarkus-messaging-rabbitmq)
 - REST Jackson (quarkus-rest-jackson)
 - Container Image Docker (quarkus-container-image-docker)
 - SmallRye Health (quarkus-smallrye-health)

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

 - **CHANGELOG.md** that will contain a description of the significant changes in all the public versions
 of the component, and any necessary instructions to upgrade between versions. For example, you can see
 you can see the changes in the [C0 email sensor](https://github.com/VALAWAI/C0_email_sensor/blob/main/CHANGELOG.md).

 - **asyncapi.yaml** that describes the services that provide the component following the conventions of 
 a [VALAWAI compoennt](/docs/toolbox/component#asyncapiyaml). For example, you can see you can see the services
 defined on the [C0 email sensor](https://github.com/VALAWAI/C0_email_sensor/blob/main/asyncapi.yaml).
 
 - **docker-compose.yml** that will be used to deploy the component following the conventions of 
 a [VALAWAI compoennt](/docs/toolbox/component#dockercomposeyml). For example, you can see you can see
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
public class TemperaturePayload {

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
			final var temperature = payload.mapTo(TemperaturePayload.class);

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
control a Heating, ventilation and air conditioning system (HVAC).

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
 * The prameters to configure a Heating, ventilation and air conditioning system. (HVAC).
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

The [Master Of VALAWAI (MOV)](/docs/toolbox/mov) is responsible for managing
the topology of interactions between the components that cooperate on the VALAWAI
architecture. The interaction of your component with the MOV is done by publishing
messages to the MOV channels or subscribing to the channels that the MOV provide.
You can read more about all the defined services in the [MOV tutorial](/docs/tutorials/mov),
but in the next sections, we focus on the most common services that you may need to
use when developing your component.


### Topology services

One of the first things that any component must do is to be [registered](/docs/tutorials/mov#register-a-component)
into the Master Of VALAWAI (MOV) to be added to the topology. In this process, the component
provides its **asynapi.yaml** to the MOV, and it automatically creates the connections
between this new component and any other component if they are compatible. Thus,
the MOV checks the publishing channels of the new component and checks if any other
component defines a subscription to the same content. Also, it does the vice-verse, thus,
it checks the subscription of the new component exists any component that can publish
a compatible message. On the other hand, when the component is not more active it must
[unregister](/docs/tutorials/mov#unregister-a-component) and the MOV will disable any topology connection that this component will
be involved. 

Now that we know what we have to do, it is time to describe how to do it in Qarkus.
The first thing to do is to add the  **asyncapi-yaml** in the Java resources because we will need this information to register the component in the MOV. So, we need to modify the **pom.xml** to include this file in the resource plugin as you can see on the next example.

```xml-doc
<plugin>
  <artifactId>maven-resources-plugin</artifactId>
  <version>${resources-plugin.version}</version>
  <executions>
    <execution>
      <id>copy-resource-one</id>
      <phase>generate-sources</phase>
      <goals>
        <goal>copy-resources</goal>
      </goals>
      <configuration>
        <outputDirectory>${project.build.directory}/classes</outputDirectory>
        <resources>
          <resource>
            <directory>${basedir}</directory>
            <includes>
              <include>asyncapi.yaml</include>
            </includes>
          </resource>
        </resources>
      </configuration>
    </execution>
  </executions>
</plugin>
```

Now we have **asyncapi-yaml** in the resources, we can define the message to
[register the component](/docs/tutorials/mov#register-a-component). The next
class is an example of registering the component C1 temperature controller.

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import com.fasterxml.jackson.annotation.JsonRootName;

import io.quarkus.logging.Log;
import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The information necessary to register a component.
 */
@RegisterForReflection
@JsonRootName("register_component_payload")
public class RegisterComponentPayload {

	/**
	 * The type of the component to register.
	 */
	public String type = "C1";

	/**
	 * The name of the component to register.
	 */
	public String name = "c1_temperature_controller";

	/**
	 * The version of the component.
	 */
	public String version;

	/**
	 * The asyncapi specification in yaml.
	 */
	public String asyncapi_yaml = loadAsyncAPI();

	/**
	 * Load the resource with the asyncaoi.
	 *
	 * @return the asyncapi of the component or {@code null} if it is not defined.
	 */
	private static final String loadAsyncAPI() {

		try {

			final var loader = RegisterComponentPayload.class.getClassLoader();
			final var resource = loader.getResourceAsStream("asyncapi.yaml");
			final var bytes = resource.readAllBytes();
			return new String(bytes, StandardCharsets.UTF_8);

		} catch (final Throwable tryAgain) {

			try {

				return Files.readString(Path.of("asyncapi.yaml"));

			} catch (final Throwable error) {

				Log.errorv(error, "Cannot obtain the asyncapi.yaml");
				return null;
			}
		}
	}

}
```

On the other hand, we need to define the message to [unregister a component](/docs/tutorials/mov#unregister-a-component). The next class is an example of this
type of message.


```java
import com.fasterxml.jackson.annotation.JsonRootName;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The information necessary to unregister a component.
 */
@RegisterForReflection
@JsonRootName("unregister_component_payload")
public class UnregisterComponentPayload {

	/**
	 * The identifier of the component to unregister.
	 */
	public String component_id;

}
```

After the messages have been defined, it is necessary to define the channels into 
the **src/main/java/resources/application.properties** that will be used to register
and unregister the component. Thus, you must add to this file the next properties.

```properties showLineNumbers
mp.messaging.outgoing.send_register_component.connector=smallrye-rabbitmq
mp.messaging.outgoing.send_register_component.queue.name=valawai/component/register
mp.messaging.outgoing.send_register_component.exchange.name=""
mp.messaging.outgoing.send_register_component.default-routing-key=valawai/component/register

mp.messaging.incoming.registered.connector=smallrye-rabbitmq
mp.messaging.incoming.registered.queue.name=valawai/c1/temperature_controller/control/registered

mp.messaging.outgoing.send_unregister_component.connector=smallrye-rabbitmq
mp.messaging.outgoing.send_unregister_component.queue.name=valawai/component/unregister
mp.messaging.outgoing.send_unregister_component.exchange.name=""
mp.messaging.outgoing.send_unregister_component.default-routing-key=valawai/component/unregister
```

Apart from the channels to register and unregister the component, line 7 defines
the channel that will be used by the MOV to [notify the component when it has been
registered](/docs/tutorials/mov#notify-registered-component). Remember that the name
of this channel has to match the pattern **valawai/c[0|1|2]/\w+/control/registered**.

Finaly, you only must define a service to capture the start-uo event in the Quarkus
platform to register the component, and the shutdown event to unregister it.


```java
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Incoming;

import io.quarkus.logging.Log;
import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

/**
 * The class used to manage the component life cycle. Thus, this register the
 * component when started and unregister when shutdown.
 */
@ApplicationScoped
public class ComponentLifeCycle {

	/**
	 * The queue to send the registration message.
	 */
	@Inject
	@Channel("send_register_component")
	protected Emitter<RegisterComponentPayload> register;

	/**
	 * The queue to send the registration message.
	 */
	@Inject
	@Channel("send_unregister_component")
	protected Emitter<UnregisterComponentPayload> unregister;

	/**
	 * The current version of the component.
	 */
	@ConfigProperty(name = "quarkus.application.version")
	protected String version;

	/**
	 * The identifier of the component when it has been registered.
	 */
	protected String componentId;

	/**
	 * Called when the component is started and it must to register it on the
	 * VALAWAI infrastructure.
	 *
	 * @param event that contains the start status.
	 */
	public void handle(@Observes StartupEvent event) {

		final var payload = new RegisterComponentPayload();
		payload.version = this.version;
		this.register.send(payload).handle((success, error) -> {

			if (error == null) {

				Log.infov("Sent register {0}.", payload);

			} else {

				Log.errorv(error, "Cannot register the component.");
			}
			return null;
		});

	}

	/**
	 * Called when the component is finished and it has to unregister it from the
	 * VALAWAI infrastructure.
	 *
	 * @param event that contains the start status.
	 */
	public void handle(@Observes ShutdownEvent event) {

		if (this.componentId != null) {

			final var payload = new UnregisterComponentPayload();
			payload.component_id = this.componentId;
			this.unregister.send(payload).handle((success, error) -> {

				if (error == null) {

					Log.infov("Sent unregister {0}.", payload);

				} else {

					Log.errorv(error, "Cannot unregister the component.");
				}
				this.componentId = null;
				return null;
			});

		}

	}

	/**
	 * Called when the component is registered.
	 *
	 * @param payload with the component information.
	 */
	@Incoming("registered")
	public void handleControlRegistered(JsonObject payload) {

		this.componentId = payload.getString("id");
		Log.infov("Registered component {0}.", payload);

	}

}
```




### Logging service

The [Master Of VALAWAI (MOV)](/docs/tutorials/mov) provides different services
and one of them is a [centralized log system](/docs/tutorials/mov#add-a-log-message).
This service stores the log messages and shows them in a
[web user interface (WUI)](/docs/tutorials/mov#manage-logs).
This service helps in the developing process because you can see what happens in different
components in a unique view. Otherwise, you must access each docker component container
and see the logs.

As we did before, the first thing to do is define a class for the message to add the log, as you can see in the next class.

```java
import com.fasterxml.jackson.annotation.JsonRootName;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The information of a log message.
 */
@RegisterForReflection
@JsonRootName("add_log_payload")
public class AddLogPayload {

	/**
	 * The level of the log.
	 */
	public Level level;

	/**
	 * The identifier of the component that has generated the log message.
	 */
	public String component_id;

	/**
	 * The message of the log.
	 */
	public String message;

	/**
	 * The payload of the log.
	 */
	public String payload;

	/**
	 * The level of a log.
	 */
	public enum Level {

		/**
		 * A log message of the level error.
		 */
		ERROR,

		/**
		 * A log message of the level warning.
		 */
		WARN,

		/**
		 * A log message of the level info.
		 */
		INFO,

		/**
		 * A log message of the level debug.
		 */
		DEBUG;

	}
}
```

After the message has been defined, it is necessary to define the channel into 
the **src/main/java/resources/application.properties** that will be used to add
the log message. Thus, you must add to this file the next properties.

```properties
mp.messaging.outgoing.send_log.connector=smallrye-rabbitmq
mp.messaging.outgoing.send_log.queue.name=valawai/log/add
mp.messaging.outgoing.send_log.exchange.name=""
mp.messaging.outgoing.send_log.default-routing-key=valawai/log/add
```

Now you can define an **Emitter** to send the log messages as you can see on the next code.

```java
/**
 * The component to send the log messages.
 */
@Channel("send_log")
@Inject
Emitter<AddLogPayload> service;
```

This is enough, but it is better to define a service, as you can see in the next class,
that can be used in any component.


```java
import java.text.MessageFormat;

import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

import io.quarkus.logging.Log;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * The service to send log messages to the Master Of VALAWAI.
 *
 * @author UDT-IA, IIIA-CSIC
 */
@ApplicationScoped
public class LogService {

	/**
	 * The component to send the log messages.
	 */
	@Channel("send_log")
	@Inject
	Emitter<AddLogPayload> service;

	/**
	 * The status of the component.
	 */
	@Inject
	protected ComponentLifeCycle status;

	/**
	 * Send a log into the Master Of VALAWAI.
	 *
	 * @param payload with the log to report.
	 */
	public void send(AddLogPayload payload) {

		payload.component_id = this.status.componentId;
		this.service.send(payload).handle((success, error) -> {

			if (error == null) {

				Log.debugv("Sent log {0}.", payload);

			} else {

				Log.errorv(error, "Cannot send log {0}.", payload);
			}
			return null;
		});
	}

	/**
	 * Send a info log message.
	 *
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void info(String message, Object... params) {

		this.send(AddLogPayload.Level.INFO, null, message, params);
	}

	/**
	 * Send a info log message.
	 *
	 * @param payload for the message.
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void infoWithPayload(Object payload, String message, Object... params) {

		this.send(AddLogPayload.Level.INFO, payload, message, params);
	}

	/**
	 * Send a error log message.
	 *
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void error(String message, Object... params) {

		this.send(AddLogPayload.Level.ERROR, null, message, params);
	}

	/**
	 * Send a error log message.
	 *
	 * @param payload for the message.
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void errorWithPayload(Object payload, String message, Object... params) {

		this.send(AddLogPayload.Level.ERROR, payload, message, params);
	}

	/**
	 * Send a debug log message.
	 *
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void debug(String message, Object... params) {

		this.send(AddLogPayload.Level.DEBUG, null, message, params);
	}

	/**
	 * Send a debug log message.
	 *
	 * @param payload for the message.
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void debugWithPayload(Object payload, String message, Object... params) {

		this.send(AddLogPayload.Level.DEBUG, payload, message, params);
	}

	/**
	 * Send a warning log message.
	 *
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void warning(String message, Object... params) {

		this.send(AddLogPayload.Level.WARN, null, message, params);
	}

	/**
	 * Send a warning log message.
	 *
	 * @param payload for the message.
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void warningWithPayload(Object payload, String message, Object... params) {

		this.send(AddLogPayload.Level.WARN, payload, message, params);
	}

	/**
	 * Send a log message.
	 *
	 * @param level   of the log.
	 * @param payload for the message.
	 * @param message of the log message.
	 * @param params  parameters to replace on the message.
	 */
	public void send(AddLogPayload.Level level, Object payload, String message, Object... params) {

		final var log = new AddLogPayload();
		log.level = level;
		log.message = MessageFormat.format(message, params);
		if (payload != null) {

			log.payload = Json.encodePrettily(payload);
		}
		this.send(log);

	}

}
```

After that, you only need to inject the service to use it in any class that is annotated
as **@ApplicationScoped**.

```java
/**
 * The component to send log messages.
 */
@Inject
LogService log;
```


### Services for C2 components

A [C2 component](/docs/toolbox/architecture/value_awareness_architecture#c2-component)
is a special component that may need to listen to what the other components do to decide
witch topology connections must be enabled or disabled.
The [Master Of VALAWAI (MOV)](/docs/toolbox/mov) helps in this process because when
a C2 component is [registered](/docs/tutorials/mov#notify-about-a-sent-message-through-a-topology-connection),
it checks if exist any subscribed channel that must be [notified when a message is sent
through a topology connection](/docs/tutorials/mov#notify-about-a-sent-message-through-a-topology-connection).
Thus, the channel name must match the pattern **valawai/c2/\w+/control/\w+** and
the payload contains the fields: connection_id, source, target, message_payload,
and timestamp.


In the previous sections, we explained the creation of a temperature manager component
that controls a Heating, ventilation and air conditioning system (HVAC). Now is the time
to define a C2 component that checks that this component satisfies the value to be
eco-friendly. The **asyncapi** can be something like you show below.

```yaml
asyncapi: '2.6.0'
info:
 title: C2 ECO-friendly awarness
 version: '1.0.0'
 description: |
  This VALAWAI component checks that the components are ECO-friendly.
 license:
  name: GNU General Public License version 3
  url: https://opensource.org/license/gpl-3-0/
 contact:
  name: VALAWAI
  url: https://valawai.eu/

channels:
  valawai/c2/eco_friendly_awarness/control/temperature_listener:
    description: Receive the information of the temperature sensors.
    subscribe:
      message:
        $ref: '#/components/messages/temperature_event'
  valawai/c2/eco_friendly_awarness/control/hvac_listener:
    description: Receive the actions done over an HVAC.
    subscribe:
      message:
        $ref: '#/components/messages/hvac_event'

components:
  messages:
    temperature_event:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/temperature_event_payload'
    hvac_event:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/hvac_event_payload'
  schemas:
    temperature_event_payload:
      type: object
      properties:
        connection_id:
          description: The identifier of the topology connection that allows the message interchanging.
          type: string
          examples: 
            - "65c1f59ea4cb169f42f5edc4"
        source:
          description: The source component that has sent the message.
          oneOf:
            - $ref: "#/components/schemas/min_component_payload"
        target:
          description: The target component that has received the message.
          oneOf:
            - $ref: "#/components/schemas/min_component_payload"
        message_payload:
          description: The payload of the temperature that has been through the connection.
          oneOf:
            - $ref: "#/components/schemas/temperature_payload"
        timestamp:
          description: The epoch time, in seconds, when the message was sent.
          type: integer
          examples:
            - "1709902001"
    min_component_payload:
      type: object
      description: The information of a component that is involved in a message.
      properties:
        id:
          description: The identifier of the component.
          type: string
        name:
          description: The name of the component.
          type: string
        type:
          description: The type level of the component in the VALAWAI.
          oneOf:
            - $ref: "#/components/schemas/component_type"
    component_type:
      type: string
      enum:
        - "C0"
        - "C1"
        - "C2"
    hvac_event_payload:
      type: object
      properties:
        connection_id:
          description: The identifier of the topology connection that allows the message interchanging.
          type: string
          examples: 
            - "65c1f59ea4cb169f42f5edc4"
        source:
          description: The source component that has sent the message.
          oneOf:
            - $ref: "#/components/schemas/min_component_payload"
        target:
          description: The target component that has received the message.
          oneOf:
            - $ref: "#/components/schemas/min_component_payload"
        message_payload:
          description: The payload of the HVAC that has been through the connection.
          oneOf:
            - $ref: "#/components/schemas/hvac_parameter_state"
        timestamp:
          description: The epoch time, in seconds, when the message was sent.
          type: integer
          examples:
            - "1709902001"
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

From this specification, we need to create the classes that define the possible messages
that the component will listen to. The next classes are an example of those.

```java
import com.fasterxml.jackson.annotation.JsonRootName;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The minimal information of a component.
 */
@RegisterForReflection
@JsonRootName("min_component_payload")
public class MinComponentPayload {

	/**
	 * The identifier of the component.
	 */
	public String id;
	/**
	 * The name of the component.
	 */
	public String name;

	/**
	 * The type of the component.
	 */
	public Type type;

	/**
	 * The type of component.
	 */
	public enum Type {
		C0, C1, C2;
	}
}
```

```java
import com.fasterxml.jackson.annotation.JsonRootName;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The event with the information of the temperature.
 */
@RegisterForReflection
@JsonRootName("temperature_event_payload")
public class TemperatureEventPayload {

	/**
	 * The identifier of the topology connection.
	 */
	public String connection_id;

	/**
	 * The source component of the connection.
	 */
	public MinComponentPayload source;

	/**
	 * The target component of the connection.
	 */
	public MinComponentPayload target;

	/**
	 * The payload of the temperature that has been through the connection.
	 */
	public TemperaturePayload message_payload;

	/**
	 * The epoch time, in seconds, when the message was sent.
	 */
	public long timestamp;
}
```

```java
mport com.fasterxml.jackson.annotation.JsonRootName;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The event with the information of the HVAC.
 */
@RegisterForReflection
@JsonRootName("hvac_event_payload")
public class HVACEventPayload {

	/**
	 * The identifier of the topology connection.
	 */
	public String connection_id;

	/**
	 * The source component of the connection.
	 */
	public MinComponentPayload source;

	/**
	 * The target component of the connection.
	 */
	public MinComponentPayload target;

	/**
	 * The payload of the hvac that has been through the connection.
	 */
	public HVACParameters message_payload;

	/**
	 * The epoch time, in seconds, when the message was sent.
	 */
	public long timestamp;
}
```


After the message has been defined, it is necessary to define the channels into 
the **src/main/java/resources/application.properties** that will be used to listen.
Thus, you must add to this file the next properties.

```properties
mp.messaging.incoming.temperature_listener.connector=smallrye-rabbitmq
mp.messaging.incoming.temperature_listener.queue.name=valawai/c2/eco_friendly_awarness/control/temperature_listener
mp.messaging.incoming.hvac_listener.connector=smallrye-rabbitmq
mp.messaging.incoming.hvac_listener.queue.name=valawai/c2/eco_friendly_awarness/control/hvac_listener
```

Now we can define the component that listens to this events and decide if the components
are eco-friendly.

```java
import java.util.concurrent.CompletionStage;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.Message;

import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * The class that manage the events and decide if they are eco-friendly.
 */
@ApplicationScoped
public class EventListener {

	/**
	 * Called when a component send a temperature event thought a topology
	 * connection.
	 *
	 * @param msg with the temperature payload.
	 *
	 * @return the result if the message process.
	 */
	@Incoming("temperature_listener")
	public CompletionStage<Void> handleTemperatureEvent(Message<JsonObject> msg) {

		try {

			// Obtain the payload from the message
			final var payload = msg.getPayload();
			final var temperature = payload.mapTo(TemperatureEventPayload.class);

			// Do something with the payload

			// Notify subscribed message is processed
			return msg.ack();

		} catch (final Throwable error) {

			// Notify subscribed message cannot be processed
			return msg.nack(error);
		}
	}

	/**
	 * Called when a component send a HVAC event thought a topology connection.
	 *
	 * @param msg with the HVAC payload.
	 *
	 * @return the result if the message process.
	 */
	@Incoming("hvac_listener")
	public CompletionStage<Void> handleHVACEvent(Message<JsonObject> msg) {

		try {

			// Obtain the payload from the message
			final var payload = msg.getPayload();
			final var hvac = payload.mapTo(HVACEventPayload.class);

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

This component when wants to enable or disable a topology connection has to send
to the queue **valawai/topology/change** a message with the action and the connection
identifier as you can see on the [MOV tutorial](/docs/tutorials/mov#modify-a-topology-connection).
Thus, you need to define a class for the message something like you can see below.

```java
import com.fasterxml.jackson.annotation.JsonRootName;

import io.quarkus.runtime.annotations.RegisterForReflection;

/**
 * The information necessary to change the topology.
 */
@RegisterForReflection
@JsonRootName("change_topology_payload")
public class ChangeTopologyPayload {

	/**
	 * The type of action to do on the topology.
	 */
	public Action action;

	/**
	 * The identifier of the topology connection to change.
	 */
	public String connection_id;

	/**
	 * The type of action to do over the topology.
	 */
	public enum Action {

		/**
		 * Enable the connection between components.
		 */
		ENABLE,

		/**
		 * Disable the connection between components.
		 */
		DISABLE,

		/**
		 * Remove a connection between components.
		 */
		REMOVE;

	}
}
```

After the message has been defined, it is necessary to define the channels into 
the **src/main/java/resources/application.properties** that will be used to listen.
Thus, you must add to this file the next properties.

```properties
mp.messaging.outgoing.change_topology.connector=smallrye-rabbitmq
mp.messaging.outgoing.change_topology.queue.name=valawai/topology/change
mp.messaging.outgoing.change_topology.exchange.name=""
mp.messaging.outgoing.change_topology.default-routing-key=valawai/topology/change
```

As we described before, you can define an **Emitter** to send the message, but it is better to define
it as a service to be injected in any component that will be needed. In this case,
the service will be as you can see in the next class.

```java
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import test.ChangeTopologyPayload.Action;

/**
 * The service to manage the topology.
 */
@ApplicationScoped
public class TopologyService {

	/**
	 * The component to send the log messages.
	 */
	@Channel("change_topology")
	@Inject
	Emitter<ChangeTopologyPayload> service;

	/**
	 * Change the topology.
	 *
	 * @param payload with the change.
	 */
	public void send(ChangeTopologyPayload payload) {

		this.service.send(payload).handle((success, error) -> {

			if (error == null) {

				Log.debugv("Sent {0}.", payload);

			} else {

				Log.errorv(error, "Cannot send {0}.", payload);
			}
			return null;
		});
	}

	/**
	 * Enable the specified connection.
	 *
	 * @param connectionId identifier of the connection to enable.
	 */
	public void enable(String connectionId) {

		final var payload = new ChangeTopologyPayload();
		payload.action = Action.ENABLE;
		payload.connection_id = connectionId;
		this.send(payload);
	}

	/**
	 * Disable the specified connection.
	 *
	 * @param connectionId identifier of the connection to disable.
	 */
	public void disable(String connectionId) {

		final var payload = new ChangeTopologyPayload();
		payload.action = Action.DISABLE;
		payload.connection_id = connectionId;
		this.send(payload);
	}

	/**
	 * Remove the specified connection.
	 *
	 * @param connectionId identifier of the connection to remove.
	 */
	public void remove(String connectionId) {

		final var payload = new ChangeTopologyPayload();
		payload.action = Action.REMOVE;
		payload.connection_id = connectionId;
		this.send(payload);
	}

}
```


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

All this information has to be used when you define the example of
the [docker-compose.yml](/docs/toolbox/component#dockercomposeyml) 
to deploy the component.

