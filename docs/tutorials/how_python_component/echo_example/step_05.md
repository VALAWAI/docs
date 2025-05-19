# Step 5: Component Deployment via Docker

As previously detailed in the [section](/docs/tutorials/how_python_component/docker_image)
concerning the dockerization of components, we now address its practical application within 
the context of the echo example.

To facilitate this, the subsequent files and directories must be established at the root 
level of your project  (`C1_echo_example_with_python_and_pika/`):

```
C1_echo_example_with_python_and_pika/
├── buildDockerImages.sh
└── docker/
    └── main/
        └── Dokerfile
```

The `buildDockerImages.sh` script serves to automate the Docker image creation process for 
the component. Concurrently, the  `docker/main/Dockerfile` provides the requisite directives 
for Docker to construct the component's image. The subsequent sections will elaborate 
on the specifics of each of these files.


## The `buildDockerImages.sh` file

This script furnishes a streamlined method for building the Docker image of the component. 
Its content is accessible at the following location:

```bash reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/buildDockerImages.sh
```

This script autonomously retrieves the component's version (refer to line 8) and
the Docker image name (refer to line 10) from the `pyproject.toml` file. Furthermore, 
it accepts the following command-line arguments to afford greater control over 
the build process:

 - `-nc` or `--no-cache`: This option enforces a build of the Docker image that bypasses 
 the cache. It is advisable in scenarios where modifications to underlying files necessitate 
 their inclusion in the resultant image.
 - `-t <tag>` or `--tag <tag>`: This parameter enables the specification of a tag for the Docker 
 image, thereby facilitating version management and distinct identification of component builds. 
 For instance, tagging an image with the component's version number is a common practice.
 - `-p <platforms>` or `--platform <platforms>`: This argument allows for the definition of target 
 architecture(s) for the Docker image build. This is essential to ensure the component's 
 operability across diverse hardware. Multiple platforms can be specified, separated by 
 commas (e.g., `linux/arm64,linux/amd64`).
 - `-dp` or `--default-platforms`: This option employs a predefined set of common platforms 
 (`linux/arm64, linux/amd64`) for image construction, thereby ensuring broad compatibility.
 - `-h` or `--help`: This argument displays a concise help message detailing the usage 
 of the aforementioned parameters.

For comprehensive information regarding the available base images and supported platforms, 
please consult the official Docker Hub page for [python:3-slim](https://hub.docker.com/_/python). 
This resource provides insights into the operating systems and architectures upon which 
your component can be built.


## The `docker/main/Dockerfile` file

Acknowledging the previously defined `Dockerfile` we now incorporate the specification 
of environment properties and introduce a health check. Consequently, the content 
of this file evolves to the following:

```docker reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/docker/main/Dockerfile
```

This file incorporates the subsequent specifications for environment variables (lines 3 to 20):

* **`RABBITMQ_HOST`**: Specifies the hostname or IP address where the RabbitMQ server 
is accessible. The default value is `mov-mq`.
* **`RABBITMQ_PORT`**: Defines the network port on which the RabbitMQ server is listening 
for connections. The default value is `5672`.
* **`RABBITMQ_USERNAME`**: Contains the username for authenticating with the RabbitMQ server. 
The default value is `mov`.
* **`RABBITMQ_PASSWORD`**: Provides the password corresponding to the specified `RABBITMQ_USERNAME` 
for RabbitMQ authentication. The default value is `password`.
* **`RABBITMQ_MAX_RETRIES`**: Represents the maximum number of attempts the component 
will make to establish a connection with the RabbitMQ server. The default value is `100`.
* **`RABBITMQ_RETRY_SLEEP`**: Defines the duration, in seconds, that the component will wait 
between successive attempts to connect to the RabbitMQ server. The default value is `3`.
* **`LOG_DIR`**: Specifies the directory within the container where the component's log files 
will be stored. The default value is `logs`.
* **`LOG_CONSOLE_LEVEL`**: Determines the verbosity level of log messages that will be outputted 
to the console. The default value is `INFO`.
* **`LOG_FILE_LEVEL`**: Defines the verbosity level of log messages that will be written to 
the log file. The default value is `DEBUG`.
* **`LOG_FILE_MAX_BYTES`**: Specifies the maximum size, in bytes, that the log file can reach 
before it is rotated. The default value is `1000000`.
* **`LOG_FILE_BACKUP_COUNT`**: Defines the number of older log files to retain when the current 
log file reaches the maximum size. The default value is `5`.
* **`LOG_FILE_NAME`**: Specifies the name of the file where the component's log messages 
will be stored. The default value is `log_messages.txt`.
* **`COMPONET_ID_FILE_NAME`**: Defines the name of the file that will contain the component's unique 
identifier once it has successfully registered. The default value is `component_id.json`.


As discussed in [step 3](/docs/tutorials/how_python_component/echo_example/step_03#understanding-the-movservice),
the `MOVService` maintains a file containing the component's identifier. This file can serve 
as a mechanism for implementing a health check for the Docker image. As evident on line 35 of the
`Dokerfile` , the image now includes a health check that reports the component as healthy 
if this identifier file exists. Thus, the Docker image of the Python component is considered 
healthy as long as the component remains registered.


## Improve the `docker-compose.yml` file

The previous `docker-compose.yml` configuration, as detailed in the
[Dockerize component](/docs/tutorials/how_python_component/docker_image) section, was limited 
to defining a single component. We have now enhanced this configuration by introducing profiles. 
These profiles enable the simultaneous launch of the
[Master Of VALAWAI (MOV)](/docs/architecture/implementations/mov/deploy) alongside the component. 
Consequently, for the echo example, we now have the following `docker-compose.yaml` file:

```yaml reference showLineNumbers
https://github.com/VALAWAI/C1_echo_example_with_python_and_pika/blob/main/docker-compose.yml
```

The component's definition spans lines 2 to 24. Within this section, lines 12 to 17 specify 
the environment variables that configure the RabbitMQ connection parameters and the logging 
verbosity level. Crucially, line 19 implements a health check by verifying the existence of 
the component ID file, thereby indicating the component's operational status.

Lines 27 to 46 configure the RabbitMQ service, which is activated when the `mov` profile is enabled. 
Notably, line 41 defines a health check to ascertain when the RabbitMQ service is ready 
and responsive.

The MongoDB service, utilized by the MOV, is configured from lines 48 to 75 and
activated when the `mov`profile is enabled. A health check to determine the database's readiness
is implemented on line 67. Furthermore, lines 73 to 74 associate a default configuration file 
for the MongoDB database, the content of which is defined in lines 114 to 123.

Finally, the MOV service configuration is detailed in lines 77 to 108 and enabled only on 
the `mov` profile. A health check is defined on line 103 to monitor the MOV's status and determine 
its readiness.

## Deploy the component

To deploy the component utilizing the previously described configurations, the initial step 
involves building the Docker image for the component using the provided script:

```bash
./buildDockerImages.sh -t latest
```

Upon successful image creation, you can leverage Docker Compose to start both the component 
and the Master Of VALAWAI (MOV) by executing the following command:

```bash
COMPOSE_PROFILES=mov docker compose up -d
```

Once executed, both the MOV and your component will be running in detached mode, and you will 
have access to the following services:

 - MOV UI: Accessible via the URL [http://localhost:8081](http://localhost:8081)
 - RabbitMQ Management UI: Accessible via the URL [http://localhost:8082](http://localhost:8082)
 
To stop the running component and associated services, you can use the command:

```bash
COMPOSE_PROFILES=mov docker compose down
```

If you choose not to use the `COMPOSE_PROFILES` variable, only the component itself will be launched, 
without the MOV. In this scenario, it is recommended to define a `.env` file at the root of 
your project to configure the necessary environment variables for the component. For instance, 
you can specify the credentials for accessing RabbitMQ within this file:

```properties
RABBITMQ_HOST=host.docker.internal
RABBITMQ_USERNAME=component_user
RABBITMQ_PASSWORD=secret
```

