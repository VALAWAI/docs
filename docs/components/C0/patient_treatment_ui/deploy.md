---
sidebar_position: 3
---

# Deploying

The C0 Patient treatment UI component is designed for deployment within a VALAWAI
infrastructure managed by the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy).
It is deployed as a [Docker](https://www.docker.com/) container that serves a web
interface (an Angular application bundled with Quarkus through Quinoa) allowing a
medical professional to manage patient records, define treatment plans, and monitor
real-time feedback on NIT protocol adherence and ethical value alignment.
The component stores its data in a [PostgreSQL](https://www.postgresql.org/) database
and communicates with the rest of the infrastructure through RabbitMQ.
The following sections detail the process of creating and deploying this container.

---

## 1. Building the Docker Image {#building-the-docker-image}

The recommended method for creating the C0 Patient treatment UI Docker image involves the following steps:

* **Install Prerequisites**: Ensure that [Docker](https://docs.docker.com/get-docker/), [Docker Compose](https://docs.docker.com/compose/install/), and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are installed on your system.
* **Clone the Repository**: Obtain the source code from [GitHub](https://github.com/VALAWAI/C0_patient_treatment_ui) using the following command:
  ```bash
  git clone https://github.com/VALAWAI/C0_patient_treatment_ui.git
  ```
* **Build the Docker Image**: Navigate to the cloned repository directory and execute the provided build script:
  ```bash
  cd C0_patient_treatment_ui
  ./buildDockerImages.sh
  ```
  Upon successful execution, a Docker image named `valawai/c0_patient_treatment_ui:X.Y.Z` will be created, where `X.Y.Z` represents the component's version (read from the `<version>` of the `pom.xml` file).
* **Optional: Tagging the Image**: To tag the image with a different name, such as `latest`, use the `-t` flag followed by the desired tag when calling the build script. For example:
  ```bash
  ./buildDockerImages.sh -t latest
  ```
  This command will generate an image named `valawai/c0_patient_treatment_ui:latest`.

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

### PostgreSQL Connection
The following environment variables configure how the component connects to the PostgreSQL database where it stores the patient records and treatment plans.

* `QUARKUS_DATASOURCE_USERNAME`: The username used to authenticate with the PostgreSQL database (default: `c0_patient_treatment_ui`).
* `QUARKUS_DATASOURCE_PASSWORD`: The password used to authenticate the specified `QUARKUS_DATASOURCE_USERNAME` with the PostgreSQL database (default: `password`). **Security Note**: Crucially, this default password **MUST** be changed in any production deployment. Use a strong, unique, and securely generated password.
* `QUARKUS_DATASOURCE_REACTIVE_URL`: The URL used to connect to the PostgreSQL database through the reactive (Vert.x) driver (default: `vertx-reactive:postgresql://pg:5432/c0_patient_treatment_ui_db`).

> **Note**: The schema of the database is managed automatically by the component (`quarkus.hibernate-orm.schema-management.strategy=update`), so no manual migration steps are required.

For a comprehensive reference on configuring the PostgreSQL connection, including connection pool tuning and driver options, please consult the official [Quarkus PostgreSQL configuration documentation](https://quarkus.io/guides/datasource#postgresql).

### Component URL
The following environment variable is used by the component itself to announce where its user interface is available:

* `C0_PATIENT_TREATMENT_UI_URL`: The URL used to access the C0 Patient treatment UI user interface. This value is reported to the MOV when the component registers itself (default: `http://0.0.0.0:8080`). In a deployed environment, set it to the URL reachable from outside the container, for example `http://localhost:8080` or the public address of the host running the container.

### Logging Configuration
The following environment variables enable you to configure the primary elements of the logging system for the Docker image.

* `LOG_LEVEL`: Controls the minimum severity level used for the application and for the log file (default: `INFO`). Accepted values include: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`.

In addition, the following standard Quarkus logging variables are available:

* `QUARKUS_LOG_CONSOLE_LEVEL`: Controls the minimum severity level for log messages displayed on the console (standard output) (default: `WARN`).
* `QUARKUS_LOG_FILE_LEVEL`: Sets the minimum severity level for log messages written to a dedicated log file (default: `INFO`).
* `QUARKUS_LOG_FILE_PATH`: Specifies the path within the container where log messages will be written to a file (default: `var/run/log/quarkus.log`).
* `QUARKUS_LOG_FILE_ROTATION_MAX_FILE_SIZE`: Defines the maximum size a log file can reach before log rotation is triggered (default: `10M`). Accepted units are `K` (Kilobytes), `M` (Megabytes), and `G` (Gigabytes).
* `QUARKUS_LOG_FILE_ROTATION_MAX_BACKUP_INDEX`: Determines the maximum number of old log files (backups) to retain during log rotation (default: `100`).

You can access the generated logs in a couple of ways:
* **Console Logs**: Messages written to the console can be viewed in real-time or historically using the Docker command:
  ```bash
  docker logs -f <container_name_or_id>
  ```
  (The `-f` flag "follows" the log output, displaying new messages as they're generated).
* **File Logs**: To access logs written to the file specified by `QUARKUS_LOG_FILE_PATH`, you have two main options:
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
            "name": "SmallRye Reactive Messaging - liveness check",
            "status": "UP",
            "data": {
                "registered": "[OK]",
                "send_register_component": "[OK]",
                "send_unregister_component": "[OK]",
                "send_log": "[OK]",
                "publish_treatment": "[OK]",
                "received_treatment_value_feedback": "[OK]",
                "received_treatment_action_feedback": "[OK]"
            }
        },
        {
            "name": "Registered C0 patient treatment UI",
            "status": "UP"
        },
        {
            "name": "SmallRye Reactive Messaging - readiness check",
            "status": "UP",
            "data": {
                "registered": "[OK]",
                "send_register_component": "[OK]",
                "send_unregister_component": "[OK]",
                "send_log": "[OK]",
                "publish_treatment": "[OK]",
                "received_treatment_value_feedback": "[OK]",
                "received_treatment_action_feedback": "[OK]"
            }
        },
        {
            "name": "SmallRye Reactive Messaging - startup check",
            "status": "UP"
        }
    ]
}
```

These health endpoints are invaluable for configuring `docker-compose` health checks, as shown in the example below, ensuring services are truly operational before receiving traffic:

```yaml
patient_treatment_ui:
  image: valawai/c0_patient_treatment_ui:${C0_PATIENT_TREATMENT_UI_TAG:-latest}
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

This guide explains how to deploy the C0 Patient treatment UI using the [Docker Compose file](https://github.com/VALAWAI/C0_patient_treatment_ui/blob/main/docker-compose.yml) in the [repository](https://github.com/VALAWAI/C0_patient_treatment_ui). Before you begin, ensure you have the [`valawai/c0_patient_treatment_ui:latest`](#building-the-docker-image) Docker image and the Master Of VALAWAI (MOV) image built (refer to the [MOV deployment documentation](/docs/architecture/implementations/mov/deploy#building-the-docker-image) for details).

### Full Deployment (MOV, RabbitMQ, MongoDB, and PostgreSQL)
To deploy the C0 Patient treatment UI along with the MOV, RabbitMQ, MongoDB, and a PostgreSQL database, use the `all` Docker Compose profile:

```bash
COMPOSE_PROFILES=all docker compose up -d
```

Once these services are up, you can access:
* The C0 Patient treatment UI user interface at [http://localhost:8080](http://localhost:8080)
* The MOV at [http://localhost:8081](http://localhost:8081)
* The RabbitMQ user interface at [http://localhost:8082](http://localhost:8082) (credentials: `mov:password`)
* The MongoDB database at `localhost:27017` (credentials: `mov:password`)
* The PostgreSQL database at `localhost:5432` (credentials: `c0_patient_treatment_ui:password`)

To stop all containers started with the `all` profile, execute:

```bash
COMPOSE_PROFILES=all docker compose down
```

This command will stop the C0 Patient treatment UI, the MOV, RabbitMQ, MongoDB, and PostgreSQL containers.

### Understanding Docker Compose Profiles

The [`docker-compose.yml`](https://github.com/VALAWAI/C0_patient_treatment_ui/blob/main/docker-compose.yml) file includes different profiles, allowing you to start specific parts of the system:
* `component`: Starts the C0 Patient treatment UI together with its PostgreSQL database.
* `mov`: Starts only the MOV, RabbitMQ, and MongoDB.
* `all`: Starts all components (MOV, RabbitMQ, MongoDB, PostgreSQL, and C0 Patient treatment UI).

### Deploying Only the C0 Patient treatment UI
If you only want to start the C0 Patient treatment UI component (for example, connecting it to an already running MOV/RabbitMQ), you can use the `component` profile:

```bash
COMPOSE_PROFILES=component docker compose up -d
```

When deploying only the component, you'll need to provide the connection details for the RabbitMQ broker via a [.env](https://docs.docker.com/compose/environment-variables/env-file/) file. Create a file named `.env` in the same directory as your `docker-compose.yml` with content similar to this:

```properties
MOV_MQ_HOST=host.docker.internal
MOV_MQ_USER=mov
MOV_MQ_PASSWORD=password
C0_PATIENT_TREATMENT_UI_PORT=8080
```

### Docker Compose Environment Variables (`.env`)
The `docker-compose.yml` file utilizes several configuration properties that can be customized to modify its behaviour. The recommended way to define these variables is by creating a [`.env`](https://docs.docker.com/compose/environment-variables/env-file/) file in the same directory as your `docker-compose.yml`.

#### Docker Image Versions
* `C0_PATIENT_TREATMENT_UI_TAG`: The Docker image tag for the C0 Patient treatment UI (default: `latest`).
* `MOV_TAG`: The Docker image tag for the Master Of VALAWAI (MOV) (default: `latest`).
* `RABBITMQ_TAG`: The Docker image tag for the RabbitMQ broker (default: `management`).
* `MONGODB_TAG`: The Docker image tag for the MongoDB database (default: `latest`).
* `POSTGRES_TAG`: The Docker image tag for the PostgreSQL database (default: `17`).

#### Master Of VALAWAI (MOV) Configuration
* `MOV_MQ_HOST`: Hostname or IP address where the RabbitMQ broker is accessible to the MOV and to the component (default: `mq`).
* `MOV_MQ_PORT`: Port number used for connecting to the RabbitMQ broker (default: `5672`).
* `MOV_MQ_USER`: Username used for authentication with the RabbitMQ broker (default: `mov`).
* `MOV_MQ_PASSWORD`: Password used to authenticate with the RabbitMQ broker (default: `password`).
* `MOV_MQ_UI_PORT`: Port on which the RabbitMQ management user interface is available (default: `8082`).
* `MOV_DB_HOST`: Hostname or IP address where the MongoDB database is accessible to the MOV (default: `mongo`).
* `MOV_DB_PORT`: Port number used for connecting to the MongoDB database (default: `27017`).
* `MOV_DB_NAME`: Name of the MongoDB database used by the MOV (default: `movDB`).
* `MOV_DB_USER_NAME`: Username used to authenticate with the MongoDB database (default: `mov`).
* `MOV_DB_USER_PASSWORD`: Password used to authenticate with the MongoDB database (default: `password`).
* `MONGO_ROOT_USER`: Root username used to initialize the MongoDB database (default: `root`).
* `MONGO_ROOT_PASSWORD`: Password used to initialize the MongoDB database (default: `password`).
* `MONGO_LOCAL_DATA`: Local host path mounted as the MongoDB data volume (default: `~/.mongo_data/patienttreatmentuiMovDB`).
* `MOV_UI_PORT`: Port on which the MOV user interface is available (default: `8081`).

#### PostgreSQL Configuration
The following variables configure the PostgreSQL database used by the C0 Patient treatment UI.

* `PG_HOST_NAME`: Hostname or IP address where the PostgreSQL database is accessible to the component (default: `pg`).
* `PG_PORT`: Port number used for connecting to the PostgreSQL database (default: `5432`).
* `PG_USER_NAME`: Username used to authenticate with the PostgreSQL database (default: `c0_patient_treatment_ui`).
* `PG_USER_PASSWORD`: Password used to authenticate with the PostgreSQL database (default: `password`). **Security Note**: Crucially, this default password **MUST** be changed in any production deployment.
* `PG_DB_NAME`: Name of the PostgreSQL database (default: `c0_patient_treatment_ui_db`).
* `PG_LOCAL_DATA`: Local host path mounted as the PostgreSQL data volume (default: `~/.pg_data/c0_patient_treatment_ui_db`).

#### C0 Patient treatment UI Component Variable
* `C0_PATIENT_TREATMENT_UI_PORT`: Defines the port on which the C0 Patient treatment UI provides its user interface and API (default: `8080`).
