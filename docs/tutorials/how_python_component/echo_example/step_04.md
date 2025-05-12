# Step 4: Component Services

Now, we'll define the specific services this component provides: listening 
for incoming messages and then echoing them back. This involves modifying 
the `asyncapi.yaml` file to specify the channels for both receiving and publishing 
messages. Subsequently, we'll implement the message handler and update the `start`
method in `__main__.py` to register this handler for incoming messages.


## Modifying `asyncapi.yaml` to add the services.

Within the asyncapi.yaml file, in the channels section, we need to define the following:

 - `valawai/c1/echo_example_with_python_and_pika/data/received_message`: This channel 
 will be used to receive the messages that need to be echoed.
 - `valawai/c1/echo_example_with_python_and_pika/data/publish_message`: This channel 
 will be used to publish the echoed messages.

The following YAML snippet demonstrates how these services can be defined:

```yaml showLineNumbers
channels:
  valawai/c1/echo_example_with_python_and_pika/data/received_message:
    description: Receive the message to echo.
    subscribe:
      message:
        $ref: '#/components/messages/echo_message'

  valawai/c1/echo_example_with_python_and_pika/data/publish_message:
    description: Publish the echoed message.
    publish:
      message:
        $ref: '#/components/messages/echo_message'

components:
  messages:
    ech_message:
      contentType: application/json
      payload:
        $ref: '#/components/schemas/echo_payload'

  schemas:   
    echo_payload:
      description: A payload of a message to echo.
      type: object
      properties:
        content:
          description: The content of the message.
          type: string
          minLength: 1
```

As you can see, on line 2, we define the `received_message` channel with a subscribe operation, 
indicating it's used for receiving messages. Similarly, on line 8, the `publish_message` channel 
is defined with a publish operation for sending out echoed messages. Both channels reference 
the same `echo_message` defined in the `components/messages` section (line 15). This message, in turn, 
refers to the `echo_payload` schema (line 21), which simply contains a content field of type string.

For a more comprehensive understanding of defining component interactions, you can refer to the 
[component specification](/docs/architecture/implementations/component#interaction-specification). 
Additionally, the complete `asyncapi.yaml` file can be found in the 
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/asyncapi.yaml).


## Implement the echo services

To bring the echo functionality to life, we need to create the following files within your project's 
root directory (`C1_echo_example_with_python_and_pika/`):

```
C1_echo_example_with_python_and_pika/
├── src/
│   └── c1_echo_example_with_python_and_pika
│       ├── echo_payload.py
│       └── echo_handler.py
└── tests/
    ├── test_echo_payloadr.py
    └── test_echo_hanlder.py
```

Here's a brief overview of the purpose of each file:

 - `echo_handler.py`: Contains the core logic for processing incoming messages and publishing 
 their echoed counterparts.
 - `echo_payload.py`: Defines the data structure (using Pydantic for validation) for the content 
 of both incoming and outgoing messages.
 - `test_echo_payload.py`: Includes unit tests to ensure the `echo_payload.py` model functions as expected.
 - `test_echo_handler.py`: Contains unit tests to verify the behavior of the message handling logic in `echo_handler.py`.

Let's delve into the details of each file.

### Filing in the `echo_payload.py` file

As defined in the asyncapi.yaml, the echo_payload includes a content field with a minimum 
length of 1, ensuring it's not empty. To enforce this constraint and provide robust data validation, 
we utilize the `pydantic` library to define our data model. You can see the implementation in 
the `echo_payload.py` file here:

```python reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/src/c1_echo_example_with_python_and_pika/echo_payload.py
```

Specifically, line 25 of this file defines the `content` field with the constraint that its length must 
be at least 1.


### Filing in the `echo_handler.py` file

To handle messages arriving on the `valawai/c1/echo_example_with_python_and_pika/data/received_message` channel, 
we create a dedicated handler in the `echo_handler.py` file.


```python reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/src/c1_echo_example_with_python_and_pika/echo_handler.py
```

On line regitert the listener

parse json

validate

send eco msg


### Filing in the `test_echo_payload.py` file

This file contains unit tests to ensure the `EchoPayload` model defined in `echo_payload.py` behaves as expected, 
particularly regarding the validation constraints. You can find the test implementation here:

```python reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/tests/test_echo_payload.py
```


### Filing in the `test_echo_hanlder.py` file

This file focuses on testing the logic within the `echo_handler.py` that manages the received echo messages. 
Here's the content of the test file:

```python reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/tests/test_echo_handler.py
```

Within this file, several key aspects are tested:

- On line 41, the test setup registers a handler for outgoing messages, allowing the test to capture 
what the handler publishes.
- Line 52 defines a method that is called whenever the handler publishes a message, enabling the test 
to inspect the published content.
- Finally, the core test logic on line 66 verifies that whenever a message is sent to 
the `valawai/c1/echo_example_with_python_and_pika/data/received_message channel`, the `EchoHandler` correctly publishes 
the echoed message to the `valawai/c1/echo_example_with_python_and_pika/data/publish_message` channel.


## Modifying `__main__.py` to add the echo handler

The final step in enabling the echo functionality is to register the message handler within 
the `start` method of your `__main__.py` file. This handler will be responsible for processing 
incoming messages on the designated channel and publishing the echoed versions.

Here's how the `start` method in `__main__.py` should be structured:


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

        EchoHandler(self.message_service, self.mov)

        # Register the component
        self.mov.register_component()

        # Start to process the received events
        logging.info("Started C1 Echo")
        self.message_service.start_consuming()

    except (OSError, ValueError):

        logging.exception("Could not start the component")
```

In the code above, the crucial line for registering the echo handler is line 15: `EchoHandler(self.message_service, self.mov)`. 
This line instantiates the `EchoHandler`, which contains the logic for receiving messages 
and publishing their echoes. By creating an instance of this handler, you are effectively 
registering it with the `message_service`to listen for the channel defined in your `asyncapi.yaml`.

You can find the complete implementation of the __main__.py file in the
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/src/c1_echo_example_with_python_and_pika/__main__.py).
