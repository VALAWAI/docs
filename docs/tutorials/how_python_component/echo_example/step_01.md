# Step 1: Set up the Project Structure

We'll begin by organizing the fundamental files and directories for our "echo" component, adhering to the
[recommended component skeleton structure](/docs/tutorials/how_python_component/skeleton#base-structure).
This standardized layout ensures consistency and facilitates project management as it evolves. 
Please create the following within your project's root directory, which we'll assume is named
`C1_echo_example_with_python_and_pika/`:

```
C1_echo_example_with_python_and_pika/
├── README.md
├── LICENSE
├── CHANGELOG.md
├── asyncapi.yaml
├── docker-compose.yml
├── pyproject.toml
├── src/
│    └── c1_echo_example_with_python_and_pika/
│        ├── __init__.py
│        └── __main__.py
└── tests/
```

Here's a brief overview of each:

- `README.md`: Project overview and usage instructions.
- `LICENSE`: Defines the component's licensing terms.
- `CHANGELOG.md`: Records significant changes over time.
- `asyncapi.yaml`: Describes the component's asynchronous API.
- `docker-compose.yml`: Defines services for development using Docker.
- `pyproject.toml`: Python project build configuration.
- `src/`: Contains the main source code.
    - `c1_echo_example_with_python_and_pika/`: Component-specific Python package.
        - `__init__.py`: Marks the directory as a Python package.
        - `__main__.py`: Main entry point for direct execution.
- `tests/`: Holds the component's test suite.

This provides a concise summary of each item, suitable for an introductory section 
where more detailed explanations will follow.

## Fill in the `README.md`file

This file serves as the entry point for your component's documentation. It typically
includes an overview of the component, how to use it, installation instructions, 
and any other relevant information for users and developers. It's written in Markdown 
format. You can use the next code as an example:

```md reference
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/README.md
```

## Fill in the `LICENSE` file

This file specifies the licensing terms under which your component is distributed. 
It's crucial for open-source projects as it defines the permissions and restrictions 
for others to use, modify, and share your code. As we explained in the
[component specification](http://localhost:3000/docs/architecture/implementations/component#license)
the preferred license for the components is the 
[GNU General Public License version 3](https://opensource.org/license/gpl-3-0/).


## Fill in the `CHANGELOG.md` file

This file keeps a chronological record of significant changes made to your component 
over time, including new features, bug fixes, and API updates. Following a consistent 
format (like Keep a Changelog) makes it easy for users to track the evolution of your 
component. You can use the next code as an example:

```md reference
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/CHANGELOG.md
```

## The `asyncapi.yaml` file

This file defines the asynchronous API of your component using the AsyncAPI specification. 
It describes the messages your component consumes and produces, the channels they interact 
on, and other relevant details for event-driven architectures. The following code shows 
an example of the minimum required content for this file.

```yaml showLineNumbers
asyncapi: '2.6.0'
info:
 title: C1 Echo
 version: '1.0.0'
 description: |
  This VALAWAI component echo the received messages.
 license:
  name: GNU General Public License version 3
  url: [https://opensource.org/license/gpl-3-0/](https://opensource.org/license/gpl-3-0/)
 contact:
  name: VALAWAI
  url: [https://valawai.eu/](https://valawai.eu/)

channels:
  # Here will be the component services
components:
  messages:
    # Here will be the payloads of the services
  schemas:
    # Here will be the schemas used on the payloads
```


If you are using this as a template for your own component you must change the `title` (line 3), 
the `description` (line 6) and the `contact` (lines 10-12). If you are using a license other than 
the GPL V3 you must change the lines 8 and 9.

On the next steps we are going to modify it until we have the final version of the `asyncapi.yaml`
file that will match the defined can on the 
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/asyncapi.yaml)
of the echo example.

## The `docker-compose.yml` file

This file utilizes Docker Compose to define and manage multi-container Docker applications. 
In the context of development and testing, it typically specifies the necessary services 
for your component, such as a RabbitMQ instance or other dependencies.

As discussed in a [previous section](https://www.google.com/search?q=/docs/tutorials/how_python_component/docker_image), 
a basic `docker-compose.yml` for the echo component might look like this:

```yaml
services:
  echo:
    image: valawai/c1_echo_example_with_python_and_pika:latest
    container_name: c1_echo
```

A more comprehensive `docker-compose.yml` file for the echo example, suitable for deployment, 
will be detailed in [Step 5](/docs/tutorials/how_python_component/echo_example/step_05)
and can also be found in the 
[repository.](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/docker-compose.yml). 


## Fill in the `pyproject.toml`file

This file serves as the standard build system configuration for Python projects, as defined 
in PEP 518. It typically includes project metadata, build backend specifications, and dependency
information.

As detailed in a [previous section](https://www.google.com/search?q=/docs/tutorials/how_python_component/skeleton%23defining-the-pyprojecttoml), 
the following code block presents the content of this file for the echo example:

```toml reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/pyproject.toml
```

When adapting this template for your own component, ensure you modify the following lines 
with your project's specific details:

- `name` (line 7)
- `version` (line 8)
- `description` (line 9)
- `keywords` (line 14)
- `authors` (line 15)
- Project URLs (lines 27-29)
- Paths in lines 32 and 36 (replace c1_echo_example_with_python_and_pika with your component's name).
- License information if you are not using GPL V3 (line 12).


## Fill in the `__init__.py` file

This file marks the `c1_echo_example_with_python_and_pika/` directory as a Python package, allowing 
you to import modules from it. It can also contain package-level initialization code.
As we have explained [before](/docs/tutorials/how_python_component/skeleton#defining-the-__init__py)
the content of this file will be something like:

```python reference
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/src/c1_echo_example_with_python_and_pika/__init__.py
```

## Fill in the `__main__.py` file

This file allows you to execute the package directly from the command line using
`python -m c1_echo_example_with_python_and_pika`. It often contains the main entry point of your component's 
application logic. As we have explained [before](/docs/tutorials/how_python_component/skeleton#defining-the-__main__py)
the content of this file will be something like:

```python
import logging
import logging.config
import os

class App:
    """The class used as application of the C1 Echo"""

    def __init__(self):
        """Initilaize the application"""


    def stop(self):
        """Finalize the component."""

        try:
            # Here will be the code to stop the component
            logging.info("Finished C1 Echo")

        except (OSError, ValueError):

            logging.exception("Could not stop the component")

    def start(self):
        """Initialize the component"""

        try:
            # Here will be the code to start the component
            logging.info("Started C1 Echo")
            # Normally the component will be blocked here until stop

        except (OSError, ValueError):

            logging.exception("Could not start the component")


def configure_log():
    """Configure the logging system"""

    try:

        console_level = logging.getLevelName(os.getenv("LOG_CONSOLE_LEVEL","INFO"))
        file_level = logging.getLevelName(os.getenv("LOG_FILE_LEVEL","DEBUG"))
        file_max_bytes = int(os.getenv("LOG_FILE_MAX_BYTES","1000000"))
        file_backup_count = int(os.getenv("LOG_FILE_BACKUP_COUNT","5"))

        log_dir = os.getenv("LOG_DIR","logs")
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        log_file_name=os.path.join(log_dir,os.getenv("LOG_FILE_NAME","c1_echo_example_with_python_and_pika.txt"))

        logging.config.dictConfig(
            {
                'version': 1,
                'disable_existing_loggers': True,
                'formatters': {
                    'standard': {
                        'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
                    },
                    'precise': {
                        'format': '%(name)s: %(asctime)s | %(levelname)s | %(filename)s:%(lineno)s | %(process)d >>> %(message)s'
                    }
                },
                'handlers': {
                    'console': {
                        'level': console_level,
                        'formatter': 'standard',
                        'class': 'logging.StreamHandler',
                        'stream': 'ext://sys.stdout',
                    },
                    'file':{
                        'level': file_level,
                        'formatter': 'precise',
                        'class': 'logging.handlers.RotatingFileHandler',
                        'filename': log_file_name,
                        'maxBytes': file_max_bytes,
                        'backupCount': file_backup_count
                    }
                },
                'loggers': {
                    '': {
                        'handlers': ['console','file'],
                        'level': 'DEBUG',
                        'propagate': True
                    }
                }
            }
        )

    except BaseException:

        logging.basicConfig(level=logging.INFO)
        logging.exception("Could not configure the logging")


def main():
    """The function to launch the C1 Echo component"""

    configure_log()
    app = App()
    app.start()
    app.stop()


if __name__ == "__main__":

    main()

```

On the next steps we are going to modify it until we have the final version of the `__main__.py`
file that will match the defined can on the 
[repository](https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/src/c1_echo_example_with_python_and_pika/__main__.py)
of the echo example.
