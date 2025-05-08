# Step 2 (Optional): Isolated Development Environment with Docker

For a consistent and isolated development experience, you have the option 
to utilize Docker. This approach creates a self-contained environment with all 
the necessary software and tools for building and testing your component. By using Docker, 
you can minimize potential conflicts with your local system setup and ensure 
a reproducible development process.

To set up the isolated development environment, you will need to create 
a specific directory structure and the following files within your project's 
root directory (`C1_echo_example_with_python_and_pika/`):

```
C1_echo_example_with_python_and_pika/
├── startDevelopmentEnvironment.sh
├── stopDevelopmentEnvironment.sh
└── docker/
    └── dev/
        ├── Dokerfile
        └── docker-compose.yml
```


Each of these files contains configuration specific to 
the `c1_echo_example_with_python_and_pika` component. If you are adapting this setup for 
a different component, remember to replace all instances of `c1_echo_example_with_python_and_pika`
with the appropriate type and name of your component. The following subsections detail 
the purpose and content of each of these files.


## The `startDevelopmentEnvironment.sh` file

This script initiates the Docker-based development environment, launching the necessary 
tools and services for building and testing your component. The expected content 
for this file can be show below:

```bash reference {107} showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/startDevelopmentEnvironment.sh
```


## The `stopDevelopmentEnvironment.sh` file

This script gracefully shuts down the running Docker-based development environment 
and its associated services. The expected content for this file can be show below:

```bash reference {107} showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/stopDevelopmentEnvironment.sh
```

## The `docker/dev/Dockerfile` file

This file serves as a blueprint for creating the Docker image for your development 
environment. It typically includes instructions for setting up Python, installing 
dependencies, and defining a default command. The expected content for this file 
can be show below:

```docker reference {107} showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/docker/dev/Dockerfile
```
 
## The `docker/dev/docker-compose.yml` file

This file orchestrates the deployment of multiple Docker containers, defining 
the required services (such as RabbitMQ and the Master Of VALAWAI) and any helpful 
development tools. The expected content for this file can be show below:

```yaml reference {107} showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/develop/docker/dev/docker-compose.yml
```

## Starting and Stopping the Environment

To start the development environment, execute the `startDevelopmentEnvironment.sh` script. 
This will open a bash shell within the Docker container, providing access to all 
the necessary development tools.

To stop the environment, you can either type `exit` in the development bash shell or 
run the `stopDevelopmentEnvironment.sh` script from your project's root directory.

### Available Commands:

The development environment provides the following commands for common development tasks:

- `run`: Starts the component.
- `testAll`: Executes all unit tests within the codebase.
- `test <path_to_test_file>`: Executes the unit tests defined in the specified test 
file (e.g., `test test/test_something.py`).
- `test <path_to_test_file>::<ClassName>::<test_method>`: Executes a specific unit test method within 
a class in a test file (e.g., `test test/test_something.py::TestClassName::test_do_something`).
- `coverage`: Runs all unit tests and generates a code coverage report.
- `fmt`: Executes a static code analyzer to check and potentially fix code formatting
 and style issues.


### Development Tools and Services:

The development environment includes the following tools and services to aid in your
development process:

 - **RabbitMQ**: A message broker facilitating communication between different components.
  Access the management UI at [http://localhost:8081](http://localhost:8081) using 
  the credentials `mov:password`. (Caution: Avoid these default credentials in production 
  environments).
 - **MongoDB**: A NoSQL database utilized by the MOV component. The database name is movDB, 
 and you can access it using the credentials `mov:password`. (Caution: Avoid these default 
 credentials in production environments). 
 - **Mongo Express**: A web-based administration interface for interacting with the MongoDB 
 database. It is available at [http://localhost:8082](http://localhost:8082).
 - **Master Of VALAWAI (MOV)**: The central web interface for interacting with the MOV 
 component, accessible at [http://localhost:8083](http://localhost:8083).

### Important Security Note:

The default credentials (`mov:password`) used for RabbitMQ, MongoDB, and MOV within this 
development environment are not secure and should never be used in production deployments. 
Ensure you change these credentials to strong, unique values for any production environment.

