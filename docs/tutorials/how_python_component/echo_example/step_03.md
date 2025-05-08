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

To simplify interaction with the Master Of VALAWAI (MOV) via Pika, as described 
in the [Component Services](/docs/tutorials/how_python_component/services) section, 
we will add the following files within your project's root directory 
(`C1_echo_example_with_python_and_pika/`):

```
C1_echo_example_with_python_and_pika/
├── src/
│   └── c1_echo_example_with_python_and_pika
│       ├── message_service.py
│       └── mov.py
└── tests/
    ├── __init__.py
    ├── test_message_service.py
    └── test_mov.py
```

Here's a brief overview of each:

- `message_service.py`: Service class to manage interaction with RabbitMQ using Pika.
- `mov.py`: Service to interact with the Master of VALAWAI.
- `__init__.py`: Facilitates the execution of tests within the `tests` directory.
- `test_message_service.py`: Unit tests for the service that manages interaction 
with RabbitMQ using Pika.
- `test_mov.py`: Unit tests for the service that interacts with the Master of VALAWAI.


### Message service class

This class is defined in [`src/c1_echo_example_with_python_and_pika/services/message_service.py`](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/src/c1_echo_example_with_python_and_pika/services/message_service.py)

 ```python reference
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/src/c1_echo_example_with_python_and_pika/services/message_service.py
```


### MOV class

This provides a concise summary of each item, suitable for an introductory section 
where more detailed explanations will follow.

 
 ```python reference
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/src/c1_echo_example_with_python_and_pika/services/mov.py
```

## Adapt `asyncapi.yaml` to implement the lifecycle

Add the following code to the `asyncapi.yaml` file to implement the lifecycle of the component.

```yaml showLineNumbers
```

on the line we define to receive when is registered.


 
## Adapt `__main__.py` ti implement the lifecycle
 
WE need to modify the methos `start()` to implement the lifecycle of the component. And we obtain the
next code.

```python
function(){
}
```

On the line 1 qe do somethonf. on teh line 2 otehr.

