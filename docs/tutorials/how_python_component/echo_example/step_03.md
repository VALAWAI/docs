# Step 3: Component Lifecycle

The lifecycle defines the various states that a VALAWAI component 
can transition through. The general lifecycle of any VALAWAI component 
involves these key stages:

- **Register Message Handlers:** The component first registers the functions 
or methods that will handle the different types of messages it is designed 
to receive.
- **Register with MOV:** The component then registers itself with the Master 
Of VALAWAI (MOV), making its presence and capabilities known to the system.
- **Start Listening for Messages:** Once registered, the component begins actively 
listening for incoming messages on the designated channels.
- **Unregister and Stop:** When the component is stopped or completes its execution, 
it must unregister itself from the MOV and cease listening for incoming messages, 
ensuring a clean shutdown.

In the next sections, we will implement these steps within the different code files.

## Utility Classes

To streamline interaction with the Master Of VALAWAI (MOV) via Pika, as detailed
in the [Component Services](/docs/tutorials/how_python_component/services) section, 
the following files will be added to your project's root directory 
(`C1_echo_example_with_python_and_pika/`):

```
C1_echo_example_with_python_and_pika/
├── src/
│   └── c1_echo_example_with_python_and_pika
│       ├── message_service.py
│       └── mov_service.py
└── tests/
    ├── __init__.py
    ├── test_message_service.py
    └── test_mov_service.py
```

Here's a refined overview of each component:

- `message_service.py`: This module defines the `MessageService` class, responsible 
for managing communication with RabbitMQ using the Pika library. It encapsulates 
the logic for connecting to RabbitMQ, publishing messages to queues, and consuming 
messages from queues. You can read more about it at the 
[Understanding the `MessageService`](#understanding-the-messageservice) section.
- `mov_service.py`: This module will contain the `MOVService` class, which provides 
an abstraction layer for interacting specifically with the Master of VALAWAI (MOV). 
This service will likely utilize the `MessageService` to send commands to and receive 
responses from the MOV via RabbitMQ. You can read more about it at the 
[Understanding the `MOVService`](#understanding-the-movservice) section.
- `__init__.py`: This file, located within the tests directory, is crucial for enabling 
the execution of tests as a package. You can obtain the standard content for this file from the echo 
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/tests/__init__.py).
- `test_message_service.py`: This module contains unit tests specifically designed to verify 
the functionality of the `MessageService` class. These tests ensure that the connection 
to RabbitMQ is established correctly, messages are published as expected, and message 
consumption mechanisms function properly. The source code for these tests can be found in the echo 
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/tests/test_message_service.py).
- `test_mov_service.py`: This module houses the unit tests for the `MOVService`. These tests will focus 
on validating the interactions between your component and the Master of VALAWAI, 
ensuring that commands are sent correctly and responses are handled appropriately. 
The implementation details for these tests are available in the echo 
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/tests/test_mov_service.py).


### Understanding the `MessageService`

The `MessageService` provides a streamlined interface for interacting with RabbitMQ, simplifying message publishing and consumption within your application.

You can see the implementation below:

```python reference
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/src/c1_echo_example_with_python_and_pika/message_service.py
```

It offers the following key functionalities:

 - **Initialization** (`__init__`): Establishes a resilient connection to your RabbitMQ server. 
It dynamically configures the connection using environment variables for host, port, username, 
and password. The service is designed to handle initial connection challenges by employing 
a robust retry mechanism with a configurable maximum number of attempts and a backoff delay.
 - **Connection Closure** (`close`): Gracefully terminates the established connection with the RabbitMQ 
server, ensuring proper resource cleanup.
 - **Message Subscription** (`listen_for`): Enables you to register a dedicated callback function 
for processing messages received from a specific queue. This allows your application 
to react to incoming messages in a well-defined manner.
 - **Message Publication** (`publish_to`): Provides a straightforward way to send messages 
 to a designated queue, facilitating communication between different parts of your system.
 - **Blocking Message Consumption** (`start_consuming`): Initiates a process that continuously 
 listens for and processes incoming messages from subscribed queues. Important: This method 
 is blocking, meaning it will occupy the current thread until the service is explicitly stopped.
 - **Non-Blocking Message Consumption** (`start_consuming_and_forget`): Starts the message consumption 
 process in a separate, non-blocking manner. This allows your application to continue 
 executing other tasks while concurrently listening for and processing messages in the background.


#### Configuration via Environment Variables
 
The MessageService relies on the following environment variables for its configuration:

 - `RABBITMQ_HOST`: Specifies the hostname or IP address of the RabbitMQ server. The default 
 value is `mov-mq`.
 - `RABBITMQ_PORT`: Defines the port number used for communication with the RabbitMQ server. 
 The default value is `5672`.
 - `RABBITMQ_USERNAME`: Sets the username for authenticating with the RabbitMQ server. The default 
 value is `mov`.
 - `RABBITMQ_PASSWORD`: Provides the password for authenticating with the RabbitMQ server. 
 The default value is `password`.
 - `RABBITMQ_MAX_RETRIES`: Determines the maximum number of attempts the `MessageService` will make 
 to establish a connection with the RabbitMQ server during initialization. This is essential 
 to handle scenarios where RabbitMQ might not be immediately available when the component starts. 
 The default value is `100`.
 - `RABBITMQ_RETRY_SLEEP`: Specifies the delay (in seconds) between consecutive connection attempts 
 to the RabbitMQ server. This delay helps to avoid overwhelming the server with rapid connection 
 requests during startup. The default value is `3`.
 

### Understanding the `MOVService`

The `MOVService` provides a dedicated abstraction layer to facilitate seamless communication 
with the Master of VALAWAI (MOV) within your application.

For implementation details, please refer to:

```python reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/src/c1_echo_example_with_python_and_pika/mov_service.py
```

The `MOVService` offers the following core functionalities:

 - **Initialization** (`__init__`): Create the service using a `MessageService` instance. 
 - **Component Information Retrieval**:
   - **Get Component Version** (`load_default_project_version`): Retrieves the component's 
   version information from the `pyproject.toml` file.
   - **Get Service Definitions** (`load_default_asyncapi_yaml`): Loads the service's API 
   definitions from the `asyncapi.yaml` file.
   - **Get Component Name** (`extract_default_component_name`): Extracts the component's name 
   from the description within the loaded AsyncAPI specification.
 - **Component Registration Management**:
   - **Listen for Component Registration** (`listen_for_registered_component`): Subscribes 
   to a specific channel to receive confirmation when the component has been successfully 
   registered with the MOV.
   - **Registration Notification** (`registered_component`): An internal callback function 
   that is automatically invoked upon receiving the component registration confirmation 
   from the MOV.
   - **Register the Component** (`register_component`): Sends a request to the MOV to register 
   this component within the VALAWAI ecosystem.
   - **Unregister the Component** (`unregister_component`): Sends a request to the MOV to unregister 
   this component.
 - **Logging Integration with MOV**:
   - **Add Debug Log Message** (`debug`): Sends a debug-level log message to the MOV 
   for centralized logging and monitoring.
   - **Add Info Log Message** (`info`): Sends an informational-level log message to the MOV.
   - **Add Warn Log Message** (`warn`): Sends a warning-level log message to the MOV. 
   - **Add Error Log Message** (`error`): Sends an error-level log message to the MOV.


#### Component Registration Status and Identifier Persistence:

Upon successful registration with the MOV, the `MOVService`'s `component_id` field will be populated 
with the unique identifier assigned by the MOV. Conversely, if the `component_id` field remains `None`, 
it signifies that the component has not yet been successfully registered.

Furthermore, this service persists the component's identifier as a JSON object within a file located 
in the logs directory. The path to this directory is determined by the `LOG_DIR` environment variable, 
defaulting to `logs`. Similarly, the filename is governed by the `COMPONET_ID_FILE_NAME` environment variable, 
with a default value of `component_id.json` (lines 108-123). This file is automatically removed when 
the component is unregistered from the MOV  (lines 129-141).


## Adapt `asyncapi.yaml` to implement the lifecycle

The lifecycle of a component, particularly its registration within the Master Of VALAWAI (MOV), 
directly influences its service definitions. As detailed in the 
[MOV documentation](/docs/architecture/implementations/mov/register_component) registering a component 
necessitates updating the `asyncapi.yaml` to capture the information file to capture relevant information. 
To listen for component registration events, you must define a listener on a channel adhering 
to the pattern `valawai/c[0|1|2]/\w+/control/registered`. Consequently, for the eco example component, 
the  channel should be named `valawai/c1/echo_example_with_python_and_pika/control/registered`. The following code 
demonstrates the necessary modifications to your `asyncapi.yaml` to enable listening for these registration 
messages.

```yaml showLineNumbers
channels:
  valawai/c1/echo_example_with_python_and_pika/control/registered:
    description: Receive the notification that the component is registered.
    subscribe:
      message:
        $ref: '#/components/messages/registered_component'

components:
  messages:
    registered_component:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/component_payload'

  schemas:
    component_payload:
      type: object
      properties:
        id:
          description: The identifier of the component.
          type: string
          pattern: '[0-9a-fA-F]{24}'
          examples: 
            - '65c2f59ea4cb169f42f5edc4'
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
          description: The channels that the component has.
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
      description: A schema that defines the messages that a channel can receive or send.
      properties:
        id:
          description: The identifier of the channel.
          type: string
          examples: 
            - 'valawai/c0/voice_to_text/data/audio'
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
      description: A payload that is defined as one value of a set.
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
      description: A definition of a schema that describes an object.
      allOf:
        - $ref: '#/components/schemas/payload_schema'
        - type: object
          properties:
            type:
              const: 'OBJECT'
            id:
              type: integer
              description: The identifier used when this scheme is referred to by other components.
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
      description: A payload that is a constant value.
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

On line 2, this channel is defined, and its content schema is specified on line 10. 
This message's payload structure is detailed starting on line 16. The payload includes 
the following key fields:

 - `id`: The unique identifier of the component.
 - `name`: The human-readable name of the component.
 - `description`: A textual description of the component's purpose.
 - `version`: The semantic version of the component itself.
 - `api_version`: The semantic version of the component's API, as defined in its registered asyncapi.yaml.
 - `type`: The classification or category of the component.
 - `since`: The Unix epoch timestamp (in seconds) indicating when the component was registered.
 - `channels`: A list or map detailing the channels defined in the component's asyncapi.yaml.

When defining a new component, you can generally reuse this specification. Simply update the 
channel name  to match the type and name of your new component.

 
## Adapt `__main__.py` ti implement the lifecycle

This section details how the `start` and `stop` methods in your `__main__.py` implement the component's 
lifecycle.

```python showLineNumbers
def start(self):
    """Initialize the component"""

    try:
        # Create connection to RabbitMQ
        self.message_service = MessageService()
        self.mov = MOV(self.message_service)

        # Create the handlers for the events
        version = self.mov.load_default_project_version()
        asyncapi_yaml = self.mov.load_default_asyncapi_yaml()
        name = self.mov.extract_default_component_name(asyncapi_yaml)
        self.mov.listen_for_registered_component(name)

        # Register the component
        self.mov.register_component()

        # Start to process the received events
        logging.info("Started C1 Echo")
        self.message_service.start_consuming()

    except (OSError, ValueError):

        logging.exception("Could not start the component")
```

The `start` method initializes the component and implements the first three lifecycle steps:

 - **Register Message Handlers**: On line 13, the `listen_for_registered_component` method is called 
 to set up a handler that will be triggered when a component registration message is received.
 - **Register with MOV**: Line 16 utilizes the `MOVService` to register the current component with 
 the Master Of VALAWAI. This registration uses the component's version (obtained from `pyproject.toml`) 
 and its name and API definition (extracted from the `asyncapi.yaml`).
 - **Start Listening for Messages**: Finally, on line 20, `self.message_service.start_consuming()`
 initiates the process of listening for and processing incoming messages on the defined channels.


```python showLineNumbers
 def stop(self):
     """Finalize the component."""

     try:

         self.mov.unregister_component()
         self.message_service.close()
         logging.info("Finished C1 Echo")

     except (OSError, ValueError):

         logging.exception("Could not stop the component")

```

The `stop` method handles the final lifecycle steps:

 - **Unregister**: Line 6 uses the `MOVService` to unregister the component from the Master Of VALAWAI.
 - **Stop**: The subsequent line (line 7) closes the connection to the RabbitMQ message broker, 
 effectively stopping the component's ability to send and receive messages.
 
You can find the complete code for `__main__.py` in the 
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/src/c1_echo_example_with_python_and_pika/__main__.py) 
of the echo example.
