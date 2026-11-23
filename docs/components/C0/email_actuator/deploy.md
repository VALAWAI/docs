---
sidebar_position: 3
---

# Deploying

The C0 e-mail actuator component is designed for deployment within a VALAWAI infrastructure managed by the [Master Of VALAWAI(MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy). It is deployed as a [Docker](https://www.docker.com/) container. The following sections detail the process of creating and deploying this container.

---

## 1. Building the Docker Image {#building-the-docker-image}

The recommended method for creating the C0 E-mail actuator Docker image involves the following steps:

* **Install Prerequisites**: Ensure that [Docker](https://docs.docker.com/get-docker/), [Docker Compose](https://docs.docker.com/compose/install/), and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are installed on your system.
* **Clone the Repository**: Obtain the source code from [GitHub](https://github.com/VALAWAI/C0_email_actuator) using the following command:
  ```bash
  git clone https://github.com/VALAWAI/C0_email_actuator.git
  ```
* **Build the Docker Image**: Navigate to the cloned repository directory and execute the provided build script:
  ```bash
  cd C0_email_actuator
  ./buildDockerImages.sh
  ```
  Upon successful execution, a Docker image named `valawai/c0_email_actuator:Z.Y.Z` will be created, where `X.Y.Z` represents the component's version.
* **Optional: Tagging the Image**: To tag the image with a different name, such as `latest`, use the `-t` flag followed by the desired tag when calling the build script. For example:
  ```bash
  ./buildDockerImages.sh -t latest
  ```
  This command will generate an image named `valawai/c0_email_actuator:latest`.

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
The following environment variables configure how the component connects to an external SMTP (e-mail) server for sending emails.

* `QUARKUS_MAILER_FROM`: Sets the "From" email address that will appear on outgoing emails (default: `no-reply@valawai.eu`).
* `QUARKUS_MAILER_HOST`: Specifies the hostname or IP address of the SMTP server. This variable is **mandatory** and has no default.
* `QUARKUS_MAILER_PORT`: Defines the port number on which the SMTP server is listening. Common ports include `587` for **STARTTLS** and `465` for **SSL/TLS**. This variable is **mandatory** and has no default.
* `QUARKUS_MAILER_USERNAME`: The username used to authenticate with the SMTP server (default: `no-reply@valawai.eu`).
* `QUARKUS_MAILER_PASSWORD`: The password used to authenticate the specified `QUARKUS_MAILER_USERNAME` with the SMTP server (default: `password`). **Security Note**: Crucially, this default password **MUST** be changed in any production deployment. Use a strong, unique, and securely generated password.

Depending on the type of secure connection (e.g., **STARTTLS** or **SSL/TLS**) required by your email server, you may need to define additional Quarkus Mailer variables. For example, to connect to **Gmail** using **STARTTLS**, you must set the following environment variables:

```properties
QUARKUS_MAILER_AUTH_METHODS=DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN
QUARKUS_MAILER_FROM=YOUREMAIL@gmail.com
QUARKUS_MAILER_HOST=smtp.gmail.com
QUARKUS_MAILER_PORT=587
QUARKUS_MAILER_START_TLS=REQUIRED
QUARKUS_MAILER_USERNAME=YOUREMAIL@gmail.com
QUARKUS_MAILER_PASSWORD=YOURGENERATEDAPPLICATIONPASSWORD
```

Or with **TLS/SSL**:

```properties
QUARKUS_MAILER_AUTH_METHODS=DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN
QUARKUS_MAILER_FROM=YOUREMAIL@gmail.com
QUARKUS_MAILER_HOST=smtp.gmail.com
QUARKUS_MAILER_PORT=465
QUARKUS_MAILER_TLS=true
QUARKUS_MAILER_USERNAME=YOUREMAIL@gmail.com
QUARKUS_MAILER_PASSWORD=YOURGENERATEDAPPLICATIONPASSWORD
```

> **Note for Gmail**: When connecting from applications, Google typically requires an "App password" instead of your regular Gmail account password if you have 2-Step Verification enabled. Refer to Google's documentation for generating [app passwords](https://support.google.com/accounts/answer/185833?hl=ca).

For a comprehensive reference on configuring the email server connection, including more examples for [common email providers](https://quarkus.io/guides/mailer-reference#popular), please consult the official [Quarkus Mailer configuration documentation](https://quarkus.io/guides/mailer-reference#configuration-reference).

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
            "name": "Registered C0 E-mail actuator",
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
email_actuator:
  image: valawai/c0_email_actuator:${C0_EMAIL_ACTUATOR_TAG:-latest}
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

This guide explains how to deploy the C0 E-mail actuator using [Docker Compose file](https://github.com/VALAWAI/C0_email_actuator/blob/main/docker-compose.yml) in the [repository](https://github.com/VALAWAI/C0_email_actuator). Before you begin, ensure you have the [`valawai/c0_email_actuator:latest`](/docs/components/C0/email_actuator/deploy#building-the-docker-image) Docker image and the Master Of VALAWAI (MOV) image built (refer to the [MOV deployment documentation](/docs/architecture/implementations/mov/deploy#building-the-docker-image) for details).

### Full Deployment (MOV, RabbitMQ, and Mail Catcher)
To deploy the C0 E-mail actuator along with the MOV, RabbitMQ, and a mail catcher, use the all Docker Compose profile:

```bash
COMPOSE_PROFILES=all docker compose up -d
```

Once these services are up, you can access:
* The MOV at [http://localhost:8081](http://localhost:8081)
* The RabbitMQ user interface at [http://localhost:8082](http://localhost:8082) (credentials: `mov:password`)
* The mail catcher user interface at [http://localhost:8083](http://localhost:8083)

To stop all containers started with the all profile, execute:

```bash
COMPOSE_PROFILES=all docker compose down
```

This command will stop the MOV, RabbitMQ, and mail catcher containers.

### Understanding Docker Compose Profiles

The [`docker-compose.yml`](https://github.com/VALAWAI/C0_email_actuator/blob/main/docker-compose.yml) file includes different profiles, allowing you to start specific parts of the system:
* `component`: Starts only the C0 E-mail actuator.
* `mail`: Starts only the mail catcher.
* `mov`: Starts only the MOV component.
* `all`: Starts all components (MOV, RabbitMQ, mail catcher, and C0 E-mail actuator).

### Deploying Only the C0 E-mail actuator
If you only want to start the C0 E-mail actuator component, you can use the `component` profile:

```bash
COMPOSE_PROFILES=component docker compose up -d
```

When deploying only the component, you'll need to provide necessary connection details via a [.env](https://docs.docker.com/compose/environment-variables/env-file/) file. Create a file named `.env` in the same directory as your `docker-compose.yml` with content similar to this:

```properties
MQ_HOST=host.docker.internal
MQ_USERNAME=mov
MQ_PASSWORD=password
C0_EMAIL_ACTUATOR_PORT=9080
MAIL_WEB=9083
```

### Docker Compose Environment Variables (`.env`)
The `docker-compose.yml` file utilizes several configuration properties that can be customized to modify its behaviour. The recommended way to define these variables is by creating a [`.env`](https://docs.docker.com/compose/environment-variables/env-file/) file in the same directory as your `docker-compose.yml`.

#### Docker Image Versions
* `C0_EMAIL_ACTUATOR_TAG`: The Docker image tag for the C0 E-mail actuator (default: `latest`).
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
The following variables configure the connection to the included Mail Catcher service designed for development and testing purposes. If you intend to use an external, production-ready mail server, you will need to modify these variables or add more variables in the environment section of the C0 E-mail Actuator service within your `docker-compose.yml`. For more details on advanced mailer configuration, consult the [Quarkus Mailer documentation](https://quarkus.io/guides/mailer-reference#configuration-reference).

* `MAIL_HOST`: Defines the host where the email server (Mail Catcher) is expecting to receive emails to send (default: `mail`).
* `MAIL_PORT`: Defines the port where the email server (Mail Catcher) is expecting to receive emails to send (default: `1025`).
* `MAIL_FROM`: Defines the email address used in the "From" field of the emails sent (default: `no-reply@valawai.eu`).
* `MAIL_USERNAME`: Defines the username to connect to the email server (default: `user`).
* `MAIL_PASSWORD`: Defines the password of the user that is allowed to send emails to the server (default: `password`).
* `MAIL_STARTTLS`: Defines if the mail connection should use **STARTTLS** (default: `DISABLED`).
* `MAIL_TLS`: Defines if the mail connection should use **SSL/TLS** (default: `false`).
* `MAIL_AUTH_METHODS`: Defines the type of login methods to use for authentication (default: `DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN`).

#### C0 E-mail Actuator Component Variable
* `C0_EMAIL_ACTUATOR_PORT`: Defines the port on which the C0 E-mail Actuator provides its API (default: `8080`).
