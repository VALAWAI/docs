---
sidebar_position: 1
---

# Component skeleton


s section outlines the essential directories and files for a 
[VALAWAI component](/docs/architecture/implementations/component) developed using the
[Python programming language](https://www.python.org/) and
the [Pika libary](https://pika.readthedocs.io/en/stable/). While adherence to standard 
Python project conventions is recommended, the specific organizational structure 
can be adapted to project requirements.


## Base structure

The foundational step in developing your VALAWAI component involves establishing 
a well-organized directory structure to house all necessary files. Adhering to 
the [VALAWAI component naming conventions](/docs/architecture/implementations/component#name-format)
your primary directory should follow the pattern **C[0|1|2]_component_name**.

For instance, a c1 component named "echo" should reside within a directory named **C1_echo**. 

Within this base directory, the following files and subdirectories are essential 
for a robust and well-documented component:

 - `README.md`: This file serves as the entry point for understanding your component. 
 It should provide a comprehensive overview, including a concise description, key features 
 and functionalities, build and deployment instructions, and a clear list of dependencies.
 - `LICENSE`This file contains the full text of the license under which your component 
 is distributed, ensuring clarity regarding usage rights and restrictions.
 - `CHANGELOG.md`: Maintain a detailed record of significant changes across all public versions
 of your component. This includes new features, bug fixes, enhancements, breaking changes, 
 and any necessary upgrade instructions.
 - `asyncapi.yaml` This file defines your component's services using the standard AsyncAPI 
 specification. It details the available endpoints, message structures, and parameters, 
 providing a clear contract for interaction with other VALAWAI components. Refer to the
 [VALAWAI component interaction specification](/docs/architecture/implementations/component#interaction-specification)
 for detailed guidelines.
 - `docker-compose.yml`This file is crucial for containerized deployment. It outlines the configuration
 for running your component as a Docker container, including necessary environment variables 
 and any dependent services. The specifics of this file are elaborated in 
 the [Dokerize the component section](/docs/tutorials/how_python_component/docker_image).
 - `pyproject.toml`: This file defines the build system requirements, project metadata 
 (such as name and version), and both runtime and development dependencies for your Python 
 project. Detailed instructions for creating this file can be found in the [Defining 
 the `pyproject.toml`](/docs/tutorials/how_python_component/skeleton#defining-the-pyprojecttoml) section.
 - `src/cX_component_name`: This subdirectory will house the core Python code for your component. 
 The name of the inner directory (`cX_component_name`) must be identical to your base directory
 but in lowercase. For instance, if your base directory is `C1_echo`, this directory should be 
 `src/c1_echo/`. Within this directory, you will find:
 
	* `__init__.py`: This file manages the initialization of your component's package. Further details are available
	 in the [Defining the `__init__.py`](/docs/tutorials/how_python_component/skeleton#defining-the-__init__py) section.
	* `__main__.py`: This file contains the main entry point and execution logic for your component. More information
	 can be found in the [Defining the `__main__.py`](/docs/tutorials/how_python_component/skeleton#defining-the-__main__py) section.
	
 - `test/`: This directory is dedicated to containing the unit tests for your component, 
 ensuring its reliability and correctness.
 
The subsequent sections of this tutorial will delve into the specific content and configuration
required for each of these files and directories.
 

## Defining the `pyproject.toml`

For robust project management and dependency handling, it is highly recommended to define your 
Python project using a `pyproject.toml` file. This file serves as a standardized configuration
file that specifies build system requirements, project metadata, and dependencies. We propose
to use [Hatchling](https://hatch.pypa.io/latest/) as your build backend, because it offers a modern
and user-friendly approach to Python project management, simplifying the configuration process.

To define your VALAWAI component using Hatchling, create a pyproject.toml file at the root 
of your component's base directory (e.g., C1_echo). Here's a basic example tailored for a VALAWAI 
component with Pika:

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "C1_echo"  # Replace with your component's name
version = "0.1.0"  # Initial version of your component
authors = [
  { name="Your Name", email="your.email@example.com" },
]
description = "A simple VALAWAI echo component." # A concise description
keywords = ["VALAWAI", "C1", "echo"] # Replace with your component's keywords
readme = "README.md"
license = "GPL-3.0" # Replace with your component's license
license-files = [ "LICENSE"]
classifiers = [
  "Development Status :: 5 - Production/Stable", # Replace with your component's classification
  "License :: OSI Approved :: GNU General Public License v3 (GPLv3)", # Replace with your component's license
  "Programming Language :: Python :: 3.10"
]
requires-python = ">=3.10"
dependencies = [
  "pika>=1.3.2",  # Specify the minimum required version of Pika
  "pydantic >= 2.11.4" # Specify the minimum required version of Pydantic
]

[project.urls]
"Documentation" = "https://valawai.github.io/docs/components/C1/echo"   # Replace with your component's documentation URL
"Changelog" = "https://github.com/VALAWAI/C1_echo/blob/main/CHANGELOG.md"   # Replace with your component's Changelog file URL
"Source" = "https://github.com/VALAWAI/C1_echo/tree/main"   # Replace with your component's source repository URL

[tool.hatch.version]
path = "c1_echo/__init__.py"   # Replace with your component's name

[tool.hatch.build.targets.sdist]
include = [
    "/c1_echo",  # Replace with your component's name
]

[tool.pytest.ini_options]
addopts = [
    "--import-mode=importlib",
]
	
[tool.hatch.envs.test]
dependencies = [
	"pytest>=8.3.5",
	"coverage>=7.8.0"
]
	
[tool.hatch.envs.hatch-test]
extra-dependencies = [
	"requests>=2.32.3",
	"unittest-parametrize>=1.6.0"
]
	
[tool.coverage.run]
omit = [
    "tests/*"
]

[tool.coverage.report]
show_missing = true
```

Let's examine the key sections of this file:

 * **[build-system]**: This section is crucial for specifying Hatchling as your build backend.
 * **[project]**: Defines the project metadata, including name, version, description, and dependencies.
 * **[project.urls]**: Specifies the URLs for documentation, changelog, and source repository.
 * **[tool.hatch.version]**: Specifies the path to the version file.
 * **[tool.hatch.build.targets.sdist]**: Specifies the files to include in the source distribution.
 * **[tool.pytest.ini_options]**: Configures the pytest runner.
 * **[tool.hatch.envs.test]**: Defines the test environment.
 * **[tool.hatch.envs.hatch-test]**: Defines the hatch-test environment.
 * **[tool.coverage.run]**: Configures the coverage runner.
 * **[tool.coverage.report]**: Configures the coverage report.

After that you can install the dependencies with the command `pip install -e` and the hatch 
with `pip install hatch`. With this you can run the next commands:

 * `hatch clean` to remove any previous build artifacts.
 * `hatch test` to pass all the unit tests.
 * `hatch text -vv  test/test_something.py` to run the tests defined on the file `test_something.py`.
 * `hatch text -vv  test/test_something.pytest/test_something.py::TestClassName::test_do_something` to run 
 a specific unit test named `test_do_something` defined within the class `TestClassName` 
 in the file `test_something.py`.
 * `hatch test --cover` to test all the unit tests and generate a coverage report.
 * `hatch fmt --unsafe-fixes` to do the general code analysis and checks.
 
For a comprehensive understanding of all available options and configurations within 
the `pyproject.toml` file when using Hatchling, please refer to 
the [official documentation](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/). 
This resource offers detailed explanations of each setting and its impact on your project.

## Defining the `__init__.py`

The `__init__.py` file designates a directory as a Python package, enabling the import
of its modules. It executes upon package import and can expose submodules or functions 
for easier access. To streamline local imports within your component, we recommend including 
the following lines in this file:
 
```python
import os, sys; 
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
```

This snippet dynamically adds the current directory to Python's system path, simplifying relative 
imports within your package. For instance, if you have a module named `services.py` in the same directory,
you can directly import it as `from services import ...` without needing to specify the component 
name explicitly in every import statement within the package.


## Defining the `__main__.py`

The `__main__.py` file, located within your component's package directory (e.g., `src/c1_echo/`),
acts as the primary entry point when your VALAWAI component is executed. Running a command like
`python src/c1_echo` instructs Python to find and execute this `__main__.py` file.

This file is where you'll implement the core logic for initializing and running your component, 
typically encompassing the following essential steps:

 - **Enabling the logging system**: Configuring Python's logging module for effective 
 monitoring and debugging. You can read more about it in the [Enabling the logging system](/docs/tutorials/how_python_component/skeleton#enabling-the-logging-system) subsection.
 - **Capturing signals for graceful component shutdown**: Implementing signal handling to ensure
 a clean exit, including unregistering from the Master Of VALAWAI (MOV). You can read more about
 it in the [Graceful Component Shutdown](/docs/tutorials/how_python_component/skeleton#graceful-component-shutdown)
 subsection.
 - **Start the component services**:  Setting up the communication channel using the Pika library
 to connect to RabbitMQ. This includes registering message handlers, registering the component 
 with the MOV, initiating the process of listening for incoming messages, and Ensuring proper resource
 cleanup when the component finishes its execution. You can read more 
 about this in the [Component services](/docs/tutorials/how_python_component/services) section.
 
ou can find a comprehensive example in the
[Echo example](/docs/tutorials/how_python_component/echo_example/step_01#fill-in-the-__main__py-file) section.


### Graceful Component Shutdown

As your component will be deployed using Docker, it's crucial to capture signals that indicate 
the termination of the Python process. This allows for a graceful shutdown procedure. Typically, 
a graceful shutdown involves unregistering the component from the Master Of VALAWAI (MOV), 
effectively removing it from the active topology. You can find more details on this process 
in the  [Unregister component](/docs/tutorials/how_python_component/mov_interaction#unregister-component) 
section.


The following code snippet demonstrates how to capture the `SIGINT` (typically triggered by Ctrl+C) 
and `SIGTERM` (sent by Docker to stop a container) signals to initiate a safe shutdown of your component:

```python
import signal

class App:
    """The main application class for the component."""

    def __init__(self):
        """Initializes the application and sets up signal handlers."""
        signal.signal(signal.SIGINT, self.exit_gracefully)
        signal.signal(signal.SIGTERM, self.exit_gracefully)

    def exit_gracefully(self, _signum, _frame):
        """Handles signals for graceful shutdown."""
        
        # Add your logic here to unregister from the MOV
```


### Enabling the logging system

Python offers a built-in `logging` module, a standard and flexible system for emitting
log messages within your component. Configuration of this system is typically performed 
in your component's entry point, the `__main__.py` file. For a comprehensive understanding 
of the logging module, please refer to the 
[official Python documentation](https://docs.python.org/3/library/logging.html).

Alternatively, the following example demonstrates how to configure the logging system 
to simultaneously output log messages to both a file and the console:

```python
import logging
import os
import logging.config

def configure_log():
    """Configure the logging system
    """

    try:
        
        console_level = logging.getLevelName(os.getenv("LOG_CONSOLE_LEVEL","INFO"))
        file_level = logging.getLevelName(os.getenv("LOG_FILE_LEVEL","DEBUG"))
        file_max_bytes = int(os.getenv("LOG_FILE_MAX_BYTES","1000000"))
        file_backup_count = int(os.getenv("LOG_FILE_BACKUP_COUNT","5"))
        
        if not os.path.exists("logs"):
            os.makedirs("logs")
        file_name=os.path.join('logs','cx_name.txt')

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
                        'filename': file_name,
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

    except Exception as error:
        
        print(error)
        logging.basicConfig(level=logging.INFO)        
        logging.exception("Could not configure the logging")
```
