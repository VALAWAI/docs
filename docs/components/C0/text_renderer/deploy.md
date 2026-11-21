---
sidebar_position: 3
---

# Deploying

The C0 Text Renderer component is designed for deployment within a VALAWAI infrastructure managed by the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy). It is deployed as a [Docker](https://www.docker.com/) container. The following sections detail the process of creating and deploying this container.

---

## 1. Building the Docker Image

The recommended method for creating the C0 Text Renderer Docker image involves the following steps:

* **Install Prerequisites**: Ensure that [Docker](https://docs.docker.com/get-docker/), [Docker Compose](https://docs.docker.com/compose/install/), and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are installed on your system.
* **Clone the Repository**: Obtain the source code from [GitHub](https://github.com/VALAWAI/C0_text_renderer) using the following command:
  ```bash
  git clone https://github.com/VALAWAI/C0_text_renderer.git
  ```
* **Build the Docker Image**: Navigate to the cloned repository directory and execute the provided build script:
  ```bash
  cd C0_text_renderer
  ./buildDockerImages.sh
  ```
  Upon successful execution, a Docker image named `valawai/c0_text_renderer:X.Y.Z` will be created, where `X.Y.Z` represents the component's version.
* **Optional: Tagging the Image**: To tag the image with a different name, such as `latest`, use the `-t` flag followed by the desired tag when calling the build script. For example:
  ```bash
  ./buildDockerImages.sh -t latest
  ```
  This command will generate an image named `valawai/c0_text_renderer:latest`.

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

### Component Configuration
These variables define the operational settings for the Text Renderer.

* `C0_TEXT_RENDERER_URL`: The base URL where the Text Renderer is accessible (e.g., `http://0.0.0.0:8080`).

### Logging Configuration
The following environment variables enable you to configure the primary elements of the logging system for the Docker image.

* `QUARKUS_LOG_CONSOLE_LEVEL`: Controls the minimum severity level for log messages displayed on the console (standard output) (default: `WARN`). Accepted values include: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`.
* `QUARKUS_LOG_FILE_LEVEL`: Sets the minimum severity level for log messages written to a dedicated log file (default: `INFO`). Accepted values include: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`.
* `QUARKUS_LOG_FILE_PATH`: Specifies the absolute path within the container where log messages will be written to a file (default: `/deployments/var/run/log//quarkus.log`).
* `QUARKUS_LOG_FILE_ROTATION_MAX_FILE_SIZE`: Defines the maximum size a log file can reach before log rotation is triggered (default: `10M`).
* `QUARKUS_LOG_FILE_ROTATION_MAX_BACKUP_INDEX`: Determines the maximum number of old log files (backups) to retain during log rotation (default: `100`).

---

## 3. Image Health Check Endpoints

This component exposes several REST endpoints to assess its operational health.

* `/q/health/live`: Verifies if the component is currently running (basic liveness check).
* `/q/health/ready`: Checks if the component is ready to process messages.
* `/q/health/started`: Confirms if the component has successfully completed its startup sequence.
* `/q/health`: Provides a consolidated view by aggregating the results of all the above health check procedures.

These endpoints return a JSON payload with an overall `status` (`UP` or `DOWN`). For a visual health status, you can access the health user interface at [http://localhost:8080/q/health-ui/](http://localhost:8080/q/health-ui/).

Example `docker-compose` health check:

```yaml
text_renderer:
  image: valawai/c0_text_renderer:${C0_TEXT_RENDERER_TAG:-latest}
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

This guide explains how to deploy the C0 Text Renderer using Docker Compose.

### Full Deployment (MOV, RabbitMQ, and MongoDB)
To deploy the C0 Text Renderer along with the MOV, RabbitMQ, and MongoDB, use the `all` Docker Compose profile:

```bash
COMPOSE_PROFILES=all docker compose up -d
```

Once these services are up, you can access:
* The MOV at [http://localhost:8081](http://localhost:8081)
* The RabbitMQ user interface at [http://localhost:8082](http://localhost:8082) (credentials: `mov:password`)
* The Text Renderer at [http://localhost:8080](http://localhost:8080)

To stop all containers started with the `all` profile, execute:

```bash
COMPOSE_PROFILES=all docker compose down
```

### Understanding Docker Compose Profiles
The `docker-compose.yml` file includes different profiles:
* `component`: Starts only the C0 Text Renderer.
* `mov`: Starts only the MOV infrastructure (MOV, RabbitMQ, MongoDB).
* `all`: Starts all components.

### Deploying Only the C0 Text Renderer
If you only want to start the C0 Text Renderer component, you can use the `component` profile:

```bash
COMPOSE_PROFILES=component docker compose up -d
```

When deploying only the component, provide connection details via a `.env` file:

```properties
MOV_MQ_HOST=host.docker.internal
MOV_MQ_USERNAME=mov
MOV_MQ_PASSWORD=password
C0_TEXT_RENDERER_PORT=9080
```

### Docker Compose Environment Variables (`.env`)

#### Docker Image Versions
* `C0_TEXT_RENDERER_TAG`: The Docker image tag for the C0 Text Renderer (default: `latest`).
* `MOV_TAG`: The Docker image tag for the Master Of VALAWAI (MOV) (default: `latest`).
* `RABBITMQ_TAG`: The Docker image tag for the RabbitMQ broker (default: `management`).
* `MONGODB_TAG`: The Docker image tag for the MongoDB database (default: `latest`).

#### Master Of VALAWAI (MOV) Configuration
* `MOV_MQ_HOST`: Hostname or IP address of the RabbitMQ broker (default: `mq`).
* `MOV_MQ_PORT`: Port number for RabbitMQ (default: `5672`).
* `MOV_MQ_USER`: Username for RabbitMQ (default: `mov`).
* `MOV_MQ_PASSWORD`: Password for RabbitMQ (default: `password`).
* `MOV_DB_HOST`: Hostname or IP address of the MongoDB database (default: `mongo`).
* `MOV_DB_PORT`: Port number for MongoDB (default: `27017`).
* `MOV_DB_USER_NAME`: Username for MongoDB (default: `mov`).
* `MOV_DB_USER_PASSWORD`: Password for MongoDB (default: `password`).
* `MOV_UI_PORT`: Port for the MOV user interface (default: `8081`).
* `MOV_MQ_UI_PORT`: Port for the RabbitMQ management UI (default: `8082`).

#### C0 Text Renderer Component Variable
* `C0_TEXT_RENDERER_PORT`: Port on which the C0 Text Renderer exposes its web interface (default: `8080`).
