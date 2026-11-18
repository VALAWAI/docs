---
sidebar_position: 3
---

# Deploying

The C2 Treatment Beneficence Valuator component is designed for deployment within a VALAWAI infrastructure managed by the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy). It is deployed as a [Docker](https://www.docker.com/) container. The following sections detail the process of creating and deploying this container.

---

## 1. Building the Docker Image

The recommended method for creating the C2 Treatment Beneficence Valuator Docker image involves the following steps:

* **Install Prerequisites**: Ensure that [Docker](https://docs.docker.com/get-docker/), [Docker Compose](https://docs.docker.com/compose/install/), and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are installed on your system.
* **Clone the Repository**: Obtain the source code from [GitHub](https://github.com/VALAWAI/C2_treatment_beneficence_valuator) using the following command:
  ```bash
  git clone https://github.com/VALAWAI/C2_treatment_beneficence_valuator.git
  ```
* **Build the Docker Image**: Navigate to the cloned repository directory and execute the provided build script:
  ```bash
  cd C2_treatment_beneficence_valuator
  ./buildDockerImages.sh -t latest
  ```
  Upon successful execution, a Docker image named `valawai/c2_treatment_beneficence_valuator:latest` will be created.

---

## 2. Configuration & Environment Variables

This section details the primary environment variables available for configuring the Docker image.

### RabbitMQ Connection
These environment variables control how the component connects to the RabbitMQ broker, which is used for interaction with the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy).

* `RABBITMQ_HOST`: Specifies the hostname or IP address where the RabbitMQ broker is accessible (default: `mq`).
* `RABBITMQ_PORT`: Defines the port number used for connecting to the RabbitMQ broker (default: `5672`).
* `RABBITMQ_USERNAME`: The username used for authentication with the RabbitMQ broker (default: `mov`).
* `RABBITMQ_PASSWORD`: The password used to authenticate the specified `RABBITMQ_USERNAME` with the RabbitMQ broker (default: `password`). **Security Note**: This default password **MUST** be changed in any production deployment.

### Logging Configuration
The following environment variable enables you to configure the logging level for the component.

* `LOG_LEVEL`: Controls the minimum severity level for log messages (default: `INFO`).

The component writes logs to a file located (inside the container) at `/app/logs/component_id.json`. You can access these logs using:
* **Accessing from within the container**:
  ```bash
  docker exec -it c2_treatment_beneficence_valuator bash
  # Example: tail -f /app/logs/component_id.json
  ```
* **Copying logs to your local machine**:
  ```bash
  docker cp c2_treatment_beneficence_valuator:/app/logs/component_id.json .
  ```

---

## 3. Image Health Check

The C2 Treatment Beneficence Valuator uses a file-based health check to verify its operational status. The health check monitors the existence and size of the component ID log file.

* **Health Check Command**: `test -s /app/logs/component_id.json`

This ensures that the container is considered `healthy` only after it has successfully initialized and written its identity to the log system.

---

## 4. Deploying via Docker Compose

This guide explains how to deploy the C2 Treatment Beneficence Valuator using the [Docker Compose file](https://github.com/VALAWAI/C2_treatment_beneficence_valuator/blob/main/docker-compose.yml) in the [repository](https://github.com/VALAWAI/C2_treatment_beneficence_valuator).

### Full Deployment (MOV, RabbitMQ, and MongoDB)
To deploy the C2 Treatment Beneficence Valuator along with the MOV, RabbitMQ, and MongoDB, use the `all` Docker Compose profile:

```bash
COMPOSE_PROFILES=all docker compose up -d
```

Once these services are up, you can access:
* The MOV at [http://localhost:8081](http://localhost:8081)
* The RabbitMQ user interface at [http://localhost:8082](http://localhost:8082) (credentials: `mov:password`)
* The MongoDB database at `localhost:27017` (credentials: `mov:password`)

To stop all containers started with the `all` profile, execute:

```bash
COMPOSE_PROFILES=all docker compose down
```

### Understanding Docker Compose Profiles

The [`docker-compose.yml`](https://github.com/VALAWAI/C2_treatment_beneficence_valuator/blob/main/docker-compose.yml) file includes different profiles:
* `mov`: Starts the supporting infrastructure for the MOV (RabbitMQ and MongoDB) together with the MOV itself.
* `all`: Starts all components (MOV, RabbitMQ, MongoDB, and C2 Treatment Beneficence Valuator).

> **Note**: The `treatment_beneficence_valuator` service has no profile attached, so it is **always** started regardless of which profile is active.

### Deploying Only the C2 Treatment Beneficence Valuator
If you want to start the valuator connecting to an existing MOV/RabbitMQ infrastructure, run:

```bash
COMPOSE_PROFILES=component docker compose up -d
```

You will need a [`.env` file](https://docs.docker.com/compose/environment-variables/env-file/) in the same directory with connection details:

```properties
MOV_MQ_HOST=host.docker.internal
MOV_MQ_USERNAME=mov
MOV_MQ_PASSWORD=password
```

### Docker Compose Environment Variables (`.env`)

#### Docker Image Versions
* `C2_TREATMENT_BENEFICENCE_VALUATOR_TAG`: The Docker image tag for the C2 Treatment Beneficence Valuator (default: `latest`).
* `MOV_TAG`: The Docker image tag for the Master Of VALAWAI (MOV) (default: `latest`).
* `RABBITMQ_TAG`: The Docker image tag for the RabbitMQ broker (default: `management`).
* `MONGODB_TAG`: The Docker image tag for the MongoDB database (default: `latest`).

#### Master Of VALAWAI (MOV) Configuration
* `MOV_MQ_HOST`: Hostname or IP address of the RabbitMQ broker (default: `mq`).
* `MOV_MQ_PORT`: Port number for RabbitMQ (default: `5672`).
* `MOV_MQ_UI_PORT`: Port for RabbitMQ management UI (default: `8082`).
* `MOV_MQ_USER`: RabbitMQ username (default: `mov`).
* `MOV_MQ_PASSWORD`: RabbitMQ password (default: `password`).
* `MOV_DB_HOST`: Hostname or IP address of the MongoDB database (default: `mongo`).
* `MOV_DB_PORT`: Port number for MongoDB (default: `27017`).
* `MOV_DB_NAME`: Name of the database used by the MOV (default: `movDB`).
* `MOV_DB_USER_NAME`: MongoDB username (default: `mov`).
* `MOV_DB_USER_PASSWORD`: MongoDB password (default: `password`).
* `MOV_UI_PORT`: Port for the MOV user interface (default: `8081`).

#### MongoDB Configuration
* `MONGO_ROOT_USER`: Root username for MongoDB (default: `root`).
* `MONGO_ROOT_PASSWORD`: Root password for MongoDB (default: `password`).
* `MONGO_LOCAL_DATA`: Local directory where MongoDB data is persisted (default: `~/.mongo_data/treatmentBeneficenceValuatorMovDB`).

#### C2 Treatment Beneficence Valuator Component Variables
* `C2_TREATMENT_BENEFICENCE_VALUATOR_TAG`: The Docker image tag (default: `latest`).
