---
sidebar_position: 3
---

# Deploying

The C1 treatment report generator component is designed for deployment within a VALAWAI infrastructure managed by the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy). It is deployed as a [Docker](https://www.docker.com/) container. The following sections detail the process of creating and deploying this container.

---

## 1. Building the Docker Image {#building-the-docker-image}

The recommended method for creating the C1 treatment report generator Docker image involves the following steps:

* **Install Prerequisites**: Ensure that [Docker](https://docs.docker.com/get-docker/), [Docker Compose](https://docs.docker.com/compose/install/), and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are installed on your system.
* **Clone the Repository**: Obtain the source code from [GitHub](https://github.com/VALAWAI/C1_treatment_report_generator) using the following command:
  ```bash
  git clone https://github.com/VALAWAI/C1_treatment_report_generator.git
  ```
* **Build the Docker Image**: Navigate to the cloned repository directory and execute the provided build script:
  ```bash
  cd C1_treatment_report_generator
  ./buildDockerImages.sh
  ```
  Upon successful execution, a Docker image named `valawai/c1_treatment_report_generator:X.Y.Z` will be created, where `X.Y.Z` represents the component's version, taken from the `<version>` element of the `pom.xml`.
* **Optional: Tagging the Image**: To tag the image with a different name, such as `latest`, pass the `-t` (or `--tag`) flag followed by the desired tag when calling the build script. For example:
  ```bash
  ./buildDockerImages.sh -t latest
  ```
  This command will generate an image named `valawai/c1_treatment_report_generator:latest`.

> **Note**: The build script only accepts the `-t`/`--tag` and `-h`/`--help` options. Passing a bare positional argument (for example `./buildDockerImages.sh latest`) is not supported and will make the script exit with an error.

---

## 2. Configuration & Environment Variables

This section details the primary environment variables available for configuring the Docker image, grouped by their specific functions. For a complete list of all possible configuration options supported by Quarkus, please refer to the official [Quarkus configuration documentation](https://quarkus.io/guides/all-config).

### RabbitMQ Connection
These environment variables control how the component connects to the RabbitMQ broker, which is typically used for interaction with the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy).

* `RABBITMQ_HOST`: Specifies the hostname or IP address where the RabbitMQ broker is accessible (default: `mq`).
* `RABBITMQ_PORT`: Defines the port number used for connecting to the RabbitMQ broker (default: `5672`).
* `RABBITMQ_USERNAME`: The username used for authentication with the RabbitMQ broker (default: `mov`).
* `RABBITMQ_PASSWORD`: The password used to authenticate the specified `RABBITMQ_USERNAME` with the RabbitMQ broker (default: `password`). **Security Note**: Crucially, this default password **MUST** be changed in any production deployment. Use a strong, unique, and securely generated password.

For comprehensive details on configuring RabbitMQ broker access, refer to the official [Quarkus RabbitMQ configuration documentation](https://quarkus.io/guides/rabbitmq-reference#configuring-the-rabbitmq-broker-access).

### Ollama & LLM Configuration {#ollama-llm-configuration} 
The component uses [Ollama](https://ollama.com/) to interact with Large Language Models (LLMs) for report generation. The following environment variables allow you to configure the connection and the model used:

* `QUARKUS_LANGCHAIN4J_OLLAMA_BASE_URL`: The base URL of the Ollama server (default: `http://host.docker.internal:11434`). Use `host.docker.internal` if Ollama is running on the host machine outside the Docker network.
* `QUARKUS_LANGCHAIN4J_OLLAMA_CHAT_MODEL_MODEL_NAME`: The name of the LLM model to be used for generation (default: `qwen3.8:27b-mlx`).
* `QUARKUS_LANGCHAIN4J_OLLAMA_CHAT_MODEL_TEMPERATURE`: Controls the randomness of the output; lower values make the output more deterministic (default: `0.1`).
* `QUARKUS_LANGCHAIN4J_TIMEOUT`: The timeout for LLM requests (default: `500s`).

### Logging Configuration
The following environment variables enable you to configure the primary elements of the logging system for the Docker image.

* `LOG_LEVEL`: Controls the minimum severity level for log messages, both the overall log level and the level written to the dedicated log file (default: `INFO`). Accepted values include: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`.

The console output is fixed at `WARN` level, while the remaining messages are written to a log file located (inside the container) at `var/run/log/quarkus.log`. This file rotates when it reaches `10M`, keeping up to `100` backups. You can access the generated logs in a couple of ways:
* **Console Logs**: Messages written to the console can be viewed in real-time or historically using the Docker command:
  ```bash
  docker logs -f <container_name_or_id>
  ```
  (The `-f` flag "follows" the log output, displaying new messages as they are generated).
* **File Logs**: To access the log file, you have two main options:
  1. **Accessing from within the container**: Connect to the container's shell and view the logs directly:
     ```bash
     docker exec -it <container_name_or_id> bash
     # Once inside, you can use 'cat', 'tail', 'less', etc.
     # Example: tail -f var/run/log/quarkus.log
     ```
  2. **Copying logs to your local machine**: Transfer the log file from the container to your host machine:
     ```bash
     docker cp <container_name_or_id>:var/run/log/quarkus.log .
     ```

For more comprehensive details on these and other advanced logging configuration options, refer to the official [Quarkus logging configuration documentation](https://quarkus.io/guides/logging#loggingConfigurationReference).

### HTTP Endpoints
The following environment variables control where the component exposes its REST health endpoints.

* `QUARKUS_HTTP_HOST`: The host the REST health endpoints are bound to (default: `0.0.0.0`).
* `QUARKUS_HTTP_PORT`: The port the REST health endpoints are exposed on (default: `8080`).

---

## 3. Image Health Check Endpoints

This component exposes several REST endpoints to assess its operational health. These endpoints are designed to provide insights into whether the component is running, ready to process messages, registered in the Master Of VALAWAI (MOV) or has successfully started.

* `/q/health/live`: Verifies if the component is currently running (basic liveness check).
* `/q/health/ready`: Checks if the component is ready to process messages, specifically from the VALAWAI infrastructure (indicates operational readiness).
* `/q/health/started`: Confirms if the component has successfully completed its startup sequence.
* `/q/health`: Provides a consolidated view by aggregating the results of all the above health check procedures.

These endpoints return a JSON payload with an overall `status` (`UP` or `DOWN`) and a detailed list of individual `checks`. An example response from `/q/health` would look like this:

```json
{
    "status": "UP",
    "checks": [
        {
            "name": "Treatment Report Generator",
            "status": "UP"
        },
        {
            "name": "SmallRye Reactive Messaging - liveness check",
            "status": "UP",
            "data": {
                "received_treatment": "[OK]",
                "registered": "[OK]",
                "send_log": "[OK]",
                "send_unregister_component": "[OK]",
                "send_register_component": "[OK]",
                "send_treatment_action_feedback": "[OK]"
            }
        },
        {
            "name": "SmallRye Reactive Messaging - readiness check",
            "status": "UP",
            "data": {
                "received_treatment": "[OK]",
                "registered": "[OK]",
                "send_log": "[OK]",
                "send_unregister_component": "[OK]",
                "send_register_component": "[OK]",
                "send_treatment_action_feedback": "[OK]"
            }
        },
        {
            "name": "SmallRye Reactive Messaging - startup check",
            "status": "UP"
        }
    ]
}
```

For a visual health status, you can access the health user interface at [http://localhost:8080/q/health-ui/](http://localhost:8080/q/health-ui/). These health endpoints are invaluable for configuring `docker-compose` health checks, as shown in the example below, ensuring services are truly operational before receiving traffic:

```yaml
treatment_report_generator:
  image: valawai/c1_treatment_report_generator:${C1_TREATMENT_REPORT_GENERATOR_TAG:-latest}
  healthcheck:
    test:
      [
        "CMD-SHELL",
        "curl -s http://localhost:8080/q/health | grep -m 1 -P \"^[\\s|\\{|\\\"]+status[\\s|\\:|\\\"]+.+\\\"\" |grep -q \"\\\"UP\\\"\"",
      ]
    interval: 1m
    timeout: 10s
    retries: 5
    start_period: 1m
    start_interval: 5s
```

---

## 4. Deploying via Docker Compose

This guide explains how to deploy the C1 treatment report generator using the [Docker Compose file](https://github.com/VALAWAI/C1_treatment_report_generator/blob/main/docker-compose.yml) in the [repository](https://github.com/VALAWAI/C1_treatment_report_generator). Before you begin, ensure you have the [`valawai/c1_treatment_report_generator:latest`](/docs/components/C1/treatment_report_generator/deploy#building-the-docker-image) Docker image and the Master Of VALAWAI (MOV) image built (refer to the [MOV deployment documentation](/docs/architecture/implementations/mov/deploy#building-the-docker-image) for details).

### Full Deployment (MOV, RabbitMQ, and MongoDB)
To deploy the C1 treatment report generator along with the MOV, RabbitMQ, and MongoDB, use the `all` Docker Compose profile:

```bash
COMPOSE_PROFILES=all docker compose up -d
```

Once these services are up, you can access:
* The MOV at [http://localhost:8081](http://localhost:8081)
* The RabbitMQ user interface at [http://localhost:8082](http://localhost:8082) (credentials: `mov:password`)
* The MongoDB database at `localhost:27017` (credentials: `mov:password`)
* The treatment report generator health endpoints at [http://localhost:8080/q/health](http://localhost:8080/q/health)

To stop all containers started with the `all` profile, execute:

```bash
COMPOSE_PROFILES=all docker compose down
```

This command will stop the MOV, RabbitMQ, and MongoDB containers.

### Understanding Docker Compose Profiles

The [`docker-compose.yml`](https://github.com/VALAWAI/C1_treatment_report_generator/blob/main/docker-compose.yml) file includes different profiles, allowing you to start specific parts of the system:
* `mov`: Starts the supporting infrastructure for the MOV (RabbitMQ and MongoDB) together with the MOV itself.
* `all`: Starts all components (MOV, RabbitMQ, MongoDB, and C1 treatment report generator).

> **Note**: The `treatment_report_generator` service has no profile attached, so it is **always** started regardless of which profile is active. This means `COMPOSE_PROFILES=all` brings up the full stack, while a plain `docker compose up -d` starts the component on its own.

### Deploying Only the C1 treatment report generator
If you only want to start the C1 treatment report generator — for example, connecting it to a MOV and RabbitMQ broker that are already running — run Docker Compose without any profile:

```bash
docker compose up -d
```

This starts the treatment report generator only, leaving the MOV, RabbitMQ, and MongoDB (which live behind the `mov` profile) stopped. You'll then need to provide the connection details to the message queue via a [.env](https://docs.docker.com/compose/environment-variables/env-file/) file. Create a file named `.env` in the same directory as your `docker-compose.yml` with content similar to this:

```properties
MOV_MQ_HOST=host.docker.internal
MOV_MQ_PORT=5672
MOV_MQ_USER=mov
MOV_MQ_PASSWORD=password
C1_TREATMENT_REPORT_GENERATOR_PORT=8080
```

### Docker Compose Environment Variables (`.env`)
The `docker-compose.yml` file utilizes several configuration properties that can be customized to modify its behaviour. The recommended way to define these variables is by creating a [`.env`](https://docs.docker.com/compose/environment-variables/env-file/) file in the same directory as your `docker-compose.yml`.

#### Docker Image Versions
* `C1_TREATMENT_REPORT_GENERATOR_TAG`: The Docker image tag for the C1 treatment report generator (default: `latest`).
* `MOV_TAG`: The Docker image tag for the Master Of VALAWAI (MOV) (default: `latest`).
* `RABBITMQ_TAG`: The Docker image tag for the RabbitMQ broker (default: `management`).
* `MONGODB_TAG`: The Docker image tag for the MongoDB database (default: `latest`).

#### Master Of VALAWAI (MOV) Configuration
* `MOV_MQ_HOST`: Hostname or IP address where the RabbitMQ broker is accessible to the MOV (default: `mq`).
* `MOV_MQ_PORT`: Port number used for connecting to the RabbitMQ broker (default: `5672`).
* `MOV_MQ_UI_PORT`: Port on which the RabbitMQ management user interface is available (default: `8082`).
* `MOV_MQ_USER`: Username used for authentication with the RabbitMQ broker (default: `mov`).
* `MOV_MQ_PASSWORD`: Password used to authenticate with the RabbitMQ broker (default: `password`).
* `MOV_DB_HOST`: Hostname or IP address where the MongoDB database is accessible to the MOV (default: `mongo`).
* `MOV_DB_PORT`: Port number used for connecting to the MongoDB database (default: `27017`).
* `MOV_DB_NAME`: Name of the database used by the MOV (default: `movDB`).
* `MOV_DB_USER_NAME`: Username used for authentication with the MongoDB database (default: `mov`).
* `MOV_DB_USER_PASSWORD`: Password used to authenticate the specified `MOV_DB_USER_NAME` with the MongoDB database (default: `password`).
* `MOV_UI_PORT`: Port on which the MOV user interface is available (default: `8081`).

#### MongoDB Configuration
* `MONGO_ROOT_USER`: Username of the root user for the MongoDB database (default: `root`).
* `MONGO_ROOT_PASSWORD`: Password of the root user for the MongoDB database (default: `password`).
* `MONGO_LOCAL_DATA`: Local host directory where the MongoDB data is persisted (default: `~/.mongo_data/treatmentreportgeneratorMovDB`).

#### C1 treatment report generator Component Variables
* `C1_TREATMENT_REPORT_GENERATOR_TAG`: The Docker image tag for the C1 treatment report generator (default: `latest`).
* `C1_TREATMENT_REPORT_GENERATOR_PORT`: Defines the port on which the C1 treatment report generator exposes its REST health endpoints (default: `8080`).

> **Note on the database**: The MongoDB database is only created the first time the `mov` profile is started. If you later change any of the database parameters, you must recreate the database by removing the directory defined by `MONGO_LOCAL_DATA` and starting Docker Compose again.
