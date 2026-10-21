---
sidebar_position: 3
---

# Deploying

The C0 e-mail sensor component is designed for deployment within a VALAWAI infrastructure managed by the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy). It is deployed as a [Docker](https://www.docker.com/) container. The following sections detail the process of creating and deploying this container.

---

## 1. Building the Docker Image

The recommended method for creating the C0 E-mail sensor Docker image involves the following steps:

* **Install Prerequisites**: Ensure that [Docker](https://docs.docker.com/get-docker/), [Docker Compose](https://docs.docker.com/compose/install/), and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are installed on your system.
* **Clone the Repository**: Obtain the source code from [GitHub](https://github.com/VALAWAI/C0_email_sensor) using the following command:
  ```bash
  git clone [https://github.com/VALAWAI/C0_email_sensor.git](https://github.com/VALAWAI/C0_email_sensor.git)
  ```
* **Build the Docker Image**: Navigate to the cloned repository directory and execute the provided build script:
  ```bash
  cd C0_email_sensor
  ./buildDockerImages.sh
  ```
  Upon successful execution, a Docker image named `valawai/c0_email_sensor:Z.Y.Z` will be created, where `X.Y.Z` represents the component's version.
* **Optional: Tagging the Image**: To tag the image with a different name, such as `latest`, use the `-t` flag followed by the desired tag when calling the build script. For example:
  ```bash
  ./buildDockerImages.sh -t latest
  ```
  This command will generate an image named `valawai/c0_email_sensor:latest`.

---

## 2. Configuration & Environment Variables

This section details the primary environment variables available for configuring the Docker image, grouped by their specific functions. For a complete list of all possible configuration options supported by Quarkus, please refer to the official [Quarkus configuration documentation](https://quarkus.io/guides/all-config).

### RabbitMQ Connection
These environment variables control how the component connects to the RabbitMQ broker, which is typically used for interaction with the [Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy).

* `RABBITMQ_HOST`: Specifies the hostname or IP address where the RabbitMQ broker is accessible (default: `mov-mq`).
* `RABBITMQ_PORT`: Defines the port number used for connecting to the RabbitMQ broker (default: `5672`).
* `RABBITMQ_USERNAME`: The username used for authentication with the RabbitMQ broker (default: `mov`).
* `RABBITMQ_PASSWORD`: The password used to authenticate the specified `RABBITMQ_USERNAME` with the RabbitMQ broker (default: `password`). **Security Note**: Crucially, this default password **MUST** be changed in any production deployment. Use a strong, unique, and securely generated password.

For comprehensive details on configuring RabbitMQ broker access, refer to the official [Quarkus RabbitMQ configuration documentation](https://quarkus.io/guides/rabbitmq-reference#configuring-the-rabbitmq-broker-access).

### Mail Connection
These environment variables define how the Email Sensor connects to the user email account to extract e-mails.

* `MAIL_PROTOCOL`: This variable defines the specific protocol used to connect to the email server (`imap`, `pop3`, `imaps`, or `pop3s`; default: `imaps`).
* `MAIL_HOST`: This specifies the hostname or IP address of your email server (default: `mail`).
* `MAIL_PORT`: This defines the port number on which the email server is listening (default: `993`).
* `MAIL_SECURED`: Set this variable to `true` to establish a secure connection, for example, using SSL/TLS (default: `true`).
* `MAIL_USER_NAME`: This is the username, often the full email address, for the account from which the sensor will fetch emails (default: `user`).
* `MAIL_USER_PASSWORD`: This variable holds the password required to authenticate with the email account for fetching emails (default: `password`).

> **Connection Behavior:** When using an IMAP (or IMAPS) connection, the component is designed to fetch only those emails that are currently unread, and once successfully retrieved, they are marked as read on the server. Conversely, with POP3 (or POP3S) connections, the component will fetch all messages from the server and subsequently remove them after successful retrieval.

### Logging Configuration
The following environment variables enable you to configure the primary elements of the logging system for the Docker image.

* `QUARKUS_LOG_CONSOLE_LEVEL`: Controls the minimum severity level for log messages displayed on the console (standard output) (default: `WARN`). Accepted values include: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`.
* `QUARKUS_LOG_FILE_LEVEL`: Sets the minimum severity level for log messages written to a dedicated log file (default: `INFO`). Accepted values include: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`.
* `QUARKUS_LOG_FILE_PATH`: Specifies the absolute path within the container where log messages will be written to a file (default: `/deployments/var/run/log//quarkus.log`).
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
     # Example: tail -f /deployments/var/run/log/quarkus.log
     ```
  2. **Copying logs to your local machine**: Transfer the log file from the container to your host machine:
     ```bash
     docker cp <container_name_or_id>:/deployments/var/run/log/quarkus.log .
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
                "change_parameters": "[OK]",
                "send_log": "[OK]",
                "send_unregister_component": "[OK]",
                "send_register_component": "[OK]",
                "send_email": "[OK]"
            }
        },
        {
            "name": "Registered C0 email sensor",
            "status": "UP"
        },
        {
            "name": "SmallRye Reactive Messaging - readiness check",
            "status": "UP",
            "data": {
                "registered": "[OK]",
                "change_parameters": "[OK]",
                "send_log": "[OK]",
                "send_unregister_component": "[OK]",
                "send_register_component": "[OK]",
                "send_email": "[OK]"
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
email_sensor:
  image: valawai/c0_email_sensor:${C0_EMAIL_SENSOR_TAG:-latest}
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

This guide explains how to deploy the C0 E-mail sensor using Docker Compose. Before you begin, ensure you have the [`valawai/c0_email_sensor:latest`](/docs/components/C0/email_sensor/deploy#building-the-docker-image) Docker image and the Master Of VALAWAI (MOV) image built (refer to the [MOV deployment documentation](/docs/architecture/implementations/mov/deploy#building-the-docker-image) for details).

### Full Deployment (MOV, RabbitMQ, and Mailpit)
To deploy the C0 E-mail sensor along with the MOV, RabbitMQ, and a mail catcher (Mailpit), use the all Docker Compose profile:

```bash
COMPOSE_PROFILES=all docker compose up -d
```

Once these services are up, you can access:
* The MOV at [http://localhost:8081](http://localhost:8081)
* The RabbitMQ user interface at [http://localhost:8082](http://localhost:8082) (credentials: `mov:password`)
* The Mailpit user interface for the received e-mails is at [http://localhost:8083](http://localhost:8083) and for send e-mails is at [http://localhost:8083/api/v1/#post-/api/v1/send](http://localhost:8083/api/v1/#post-/api/v1/send).

To stop all containers started with the all profile, execute:

```bash
COMPOSE_PROFILES=all docker compose down
```

This command will stop the MOV, RabbitMQ, and Mailpit containers.

### Understanding Docker Compose Profiles
The `docker-compose.yml` file includes different profiles, allowing you to start specific parts of the system:
* `component`: Starts only the C0 E-mail sensor.
* `mail`: Starts only Mailpit.
* `mov`: Starts only the MOV component.
* `all`: Starts all components (MOV, RabbitMQ, mail catcher, and C0 E-mail sensor).

### Deploying Only the C0 E-mail Sensor
If you only want to start the C0 E-mail sensor component, you can use the `component` profile:

```bash
COMPOSE_PROFILES=component docker compose up -d
```

When deploying only the component, you'll need to provide necessary connection details via a [.env](https://docs.docker.com/compose/environment-variables/env-file/) file. Create a file named `.env` in the same directory as your `docker-compose.yml` with content similar to this:

```properties
MQ_HOST=host.docker.internal
MQ_USERNAME=mov
MQ_PASSWORD=password
C0_EMAIL_SENSOR_PORT=9080
MAIL_WEB=9083
```

### Docker Compose Environment Variables (`.env`)
The `docker-compose.yml` file utilizes several configuration properties that can be customized to modify its behaviour. The recommended way to define these variables is by creating a [`.env`](https://docs.docker.com/compose/environment-variables/env-file/) file in the same directory as your `docker-compose.yml`.

#### Docker Image Versions
* `C0_EMAIL_SENSOR_TAG`: The Docker image tag for the C0 E-mail sensor (default: `latest`).
* `MOV_TAG`: The Docker image tag for the Master Of VALAWAI (MOV) (default: `latest`).
* `RABBITMQ_TAG`: The Docker image tag for the RabbitMQ broker (default: `management`).
* `MONGODB_TAG`: The Docker image tag for the MongoDB database (default: `latest`).
* `MAIL_CATCHER_TAG`: The Docker image tag for the Mail Catcher service (default: `latest`).

#### Master Of VALAWAI (MOV) Configuration
* `MOV_MQ_HOST`: Hostname or IP address where the RabbitMQ broker is accessible to the MOV (default: `mq`).
* `MOV_MQ_PORT`: Port number used for connecting to the RabbitMQ broker (default: `5672`).
* `MOV_MQ_USER`: Username used for authentication with the RabbitMQ broker (default: `mov`).
* `MOV_MQ_PASSWORD`: Password used to authenticate with the RabbitMQ broker (default: `password`).
* `MOV_DB_HOST`: Hostname or IP address where the MongoDB database is accessible to the MOV (default: `mongo`).
* `MOV_DB_PORT`: Port number used for connecting to the MongoDB database (default: `27017`).
* `MOV_DB_USER_NAME`: Username used for authentication with the MongoDB database (default: `mov`).
* `MOV_DB_USER_PASSWORD`: Password used to authenticate with the MongoDB database (default: `password`).
* `MOV_UI_PORT`: Port on which the MOV user interface is available (default: `8081`).
* `MOV_MQ_UI_PORT`: Port on which the RabbitMQ management user interface is available (default: `8082`).

#### E-mail Configuration
In a previous section, we covered how to configure the email server that the Email Sensor connects to for fetching user emails. The variables below are specifically configured for the included Mailpit service, which is designed for development and testing. If you plan to use an external, production-ready mail server, you'll need to adjust these variables or add more within the C0 Email Sensor service section in your `docker-compose.yml` file.

* `MAIL_HOST`: Hostname or IP address of the email server hosting the user account (default: `mail`).
* `MAIL_PORT`: Port number on which the email server is listening (default: `1110`).
* `MAIL_PROTOCOL`: Protocol used to connect to the email server (default: `pop3`).
* `MAIL_SECURED`: Set this to `true` if the mail connection should use SSL/TLS for security (default: `false`).
* `MAIL_USER_NAME`: Username for connecting to the email server (default: `user`).
* `MAIL_USER_NAME`: Password that authenticates the user on the email server (default: `password`).
* `MAIL_SMTP_PORT`: Port number on which Mailpit is listening to receive e-mails (default: `1025`).
* `MAIL_POP3_PORT`: Port number on which Mailpit provides pop3 services (default: `1110`).
* `MAIL_WEB`: Port within which Mailpit must provide the user interface (default: `8083`).

> **Protocol Note:** The default configuration for this setup uses the `pop3` protocol, meaning the Email Sensor will remove emails from the server once fetched. If you prefer to keep your emails on the server after they've been processed, you must switch to the `imap` protocol (refer to the development [docker compose](https://github.com/VALAWAI/C0_email_sensor/blob/main/src/dev/docker/docker-compose.yml) file for Mailtrap IMAP testing examples).

#### C0 E-mail Sensor Component Variable
* `C0_EMAIL_SENSOR_PORT`: Port on which the C0 Email Sensor exposes its API (default: `8080`).
* `C0_EMAIL_SENSOR_FETCH_INTERVAL`: Interval, in seconds, at which the C0 Email Sensor will check for new emails (default: `60`).