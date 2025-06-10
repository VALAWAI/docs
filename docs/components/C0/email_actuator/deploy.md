---
sidebar_position: 3
---

# Deploying

The C0 e-mail actuator component is designed for deployment within a VALAWAI infrastructure managed 
by the [Master Of VALAWAI(MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy).
It is deployed as a [Docker](https://www.docker.com/) ontainer. The following sections detail the process 
of creating and deploying this container.

## Building the Docker Image

The recommended method for creating the C0 E-mail actuator Docker image involves the following steps:

 1. **Install Prerequisites**: Ensure that [Docker](https://docs.docker.com/get-docker/),
 [Docker Compose](https://docs.docker.com/compose/install/), and 
 [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are installed on your system.

 2. **Clone the Repository**: Obtain the source code from 
 [GitHub](https://github.com/VALAWAI/C0_email_actuator) using the following command:

    ```bash
    git clone https://github.com/VALAWAI/C0_email_actuator.git
    ```

 3. **Build the Docker Image**: Navigate to the cloned repository directory and execute 
 the provided build script:

    ```bash
    cd C0_email_actuator
    ./buildDockerImages.sh
    ```

    Upon successful execution, a Docker image named `valawai/c0_email_actuator:Z.Y.Z`
    will be created, where `X.Y.Z` represents the component's version.

 4. **Optional: Tagging the Image**: To tag the image with a different name, such as `latest`, 
 use the `-t` flag followed by the desired tag when calling the build script. For example:


    ` ``bash
    ./buildDockerImages.sh -t latest
    ` ``
     
    This command will generate an image named `valawai/c0_email_actuator:latest`.


### Docker image environment variables

This section details the primary environment variables available for configuring 
the Docker image, grouped by their specific functions. For a complete list of all 
possible configuration options supported by Quarkus, please refer to the official
[Quarkus configuration documentation](https://quarkus.io/guides/all-config).



#### RabbitMQ Connection

These environment variables control how the component connects to the RabbitMQ broker, 
which is typically used for interaction with the 
[Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy).

 - `RABBITMQ_HOST`: Specifies the hostname or IP address where the RabbitMQ broker is accessible.
 The default value is `mov-mq`.
 - `RABBITMQ_PORT`: Defines the port number used for connecting to the RabbitMQ broker.
 The default value is `5672`.
 - `RABBITMQ_USERNAME`: The username used for authentication with the RabbitMQ broker.
 The default value is `mov`.
 - `RABBITMQ_PASSWORD`: The password used to authenticate the specified `RABBITMQ_USERNAME`
 with the RabbitMQ broker. The default value is `password`. **Security Note**: Crucially, 
 this default password **MUST** be changed in any production deployment. Use a strong, unique, 
 and securely generated password.

For comprehensive details on configuring RabbitMQ broker access, refer to the official
[Quarkus RabbitMQ configuration documentation](https://quarkus.io/guides/rabbitmq-reference#configuring-the-rabbitmq-broker-access).

#### Mail Connection

The following environment variables configure how the component connects to an external SMTP 
(e-mail) server for sending emails.

 - `QUARKUS_MAILER_FROM`: Sets the "From" email address that will appear on outgoing emails
 The default value is `no-reply@valawai.eu`.
 - `QUARKUS_MAILER_HOST`: Specifies the hostname or IP address of the SMTP server. This variable 
 is **mandatory** and has no default.
 - `QUARKUS_MAILER_PORT`: Defines the port number on which the SMTP server is listening.
 Common ports include `587` for **STARTTLS** and `465` for **SSL/TLS**. This variable 
 is **mandatory** and has no default.
 - `QUARKUS_MAILER_USERNAME`: The username used to authenticate with the SMTP server.
 The default value is `no-reply@valawai.eu`.
 - `QUARKUS_MAILER_PASSWORD`: The password used to authenticate the specified `QUARKUS_MAILER_USERNAME`
 with the SMTP server. The default value is `password`. **Security Note**: Crucially, 
 this default password **MUST** be changed in any production deployment. Use a strong, unique, 
 and securely generated password.
 
Depending on the type of secure connection (e.g., **STARTTLS** or **SSL/TLS**) required 
by your email server, you may need to define additional Quarkus Mailer variables.
For example to connect to **Gmail** using **STARTTLS** you must set the following environment variables:

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

**Note for Gmail**: When connecting from applications, Google typically requires an "App password" 
instead of your regular Gmail account password if you have 2-Step Verification enabled. Refer 
to Google's documentation for generating [app passwords](https://support.google.com/accounts/answer/185833?hl=en).

For a comprehensive reference on configuring the email server connection, including more examples for
[common email providers,](https://quarkus.io/guides/mailer-reference#popular), please consult the official
[Quarkus Mailer configuration documentation](https://quarkus.io/guides/mailer-reference#configuration-reference).

#### Logging configuration

The following environment variables enable you to configure the primary elements of 
the logging system for the Docker image.

 - `QUARKUS_LOG_CONSOLE_LEVEL`: : Controls the minimum severity level for log messages displayed 
 on the console (standard output). The default value is `WARN`. Accepted values include: `OFF`,
 `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`.
 - `QUARKUS_LOG_FILE_LEVEL`: Sets the minimum severity level for log messages written to a dedicated 
 log file. The default value is `INFO`. Accepted values include: `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, 
 `DEBUG`, `TRACE`, and `ALL`.
 - `QUARKUS_LOG_FILE_PATH`: : Specifies the absolute path within the container where log messages 
 will be written to a file. The default value is `/deployments/var/run/log//quarkus.log`.
 - `QUARKUS_LOG_FILE_ROTATION_MAX_FILE_SIZE`: Defines the maximum size a log file can reach before 
 log rotation is triggered. Once this size is exceeded, the current log file is archived, 
 and a new one starts. The default value is `10M` (10 Megabytes). Accepted units are `K` (Kilobytes), 
 `M` (Megabytes), and `G` (Gigabytes).
 - `QUARKUS_LOG_FILE_ROTATION_MAX_BACKUP_INDEX`: Determines the maximum number of old log files (backups) 
 to retain during log rotation. Older backups are automatically deleted. The default value is `100`.
 
 
You can access the generated logs in a couple of ways:

 - **Console Logs**: Messages written to the console can be viewed in real-time or historically using 
 the Docker command:

    ```bash
    docker logs -f <container_name_or_id>
    ```

    The `-f` flag "follows" the log output, displaying new messages as they're generated.

 - **File Logs**: To access logs written to the file specified by `QUARKUS_LOG_FILE_PATH`, you have two main options:
 
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


For more comprehensive details on these and other advanced logging configuration options, refer to the official
[Quarkus logging configuration documentation](https://quarkus.io/guides/logging#loggingConfigurationReference).


### Image Health Check Endpoints

This component exposes several REST endpoints to assess its operational health. These endpoints are designed 
to provide insights into whether the component is running, ready to process messages, 
registered in the Master Of VALAWAI (MOV) or has successfully started.

 - `/q/health/live`: Verifies if the component is currently running. This is a basic liveness check.
 - `/q/health/ready`: Checks if the component is ready to process messages, specifically from 
 the VALAWAI infrastructure. This endpoint indicates operational readiness.
 - `/q/health/started`: Confirms if the component has successfully completed its startup sequence.
 - `/q/health`: Provides a consolidated view by aggregating the results of all the above 
 health check procedures.

These endpoints return a JSON payload with an overall `status` (`UP` or `DOWN`) and 
a detailed list of individual `checks`. An example response from `/q/health` would look like this:
 
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
 
For a visual health status, you can access the health user interface at 
[http://localhost:8080/q/health-ui/](http://localhost:8080/q/health-ui/).
These health endpoints are invaluable for configuring `docker-compose` health checks, 
as shown in the example below, ensuring services are truly operational 
before receiving traffic:


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



## Deploy 


This guide explains how to deploy the C0 E-mail actuator using Docker Compose. Before you begin, ensure 
you have the [`valawai/c0_email_actuator:latest`](/docs/components/C0/email_actuator/deploy#building-the-docker-image) 
Docker image and the Master Of VALAWAI (MOV) image built (refer to the 
[MOV deployment documentation](/docs/architecture/implementations/mov/deploy#building-the-docker-image) for details).


### Full Deployment (MOV, RabbitMQ, and Mail Catcher)

To deploy the C0 E-mail actuator along with the MOV, RabbitMQ, and a mail catcher, use the all Docker Compose profile:

```bash
COMPOSE_PROFILES=all docker compose up -d
```

Once these services are up, you can access:

 - The MOV at [http://localhost:8081](http://localhost:8081)
 - The RabbitMQ user interface at [http://localhost:8082](http://localhost:8082) (credentials: `mov:password`)
 - The mail catcher user interface at [http://localhost:8083](http://localhost:8083)

To stop all containers started with the all profile, execute:

```bash
COMPOSE_PROFILES=all docker compose down
```

This command will stop the MOV, RabbitMQ, and mail catcher containers.


### Understanding Docker Compose Profiles

The `docker-compose.yml` file includes different profiles, allowing you to start specific parts of the system:

 - `component`: Starts only the C0 E-mail actuator.
 - `mail`: Starts only the mail catcher.
 - `mov`: Starts only the MOV component.
 - `all`: Starts all components (MOV, RabbitMQ, mail catcher, and C0 E-mail actuator).


### Deploying Only the C0 E-mail actuator

If you only want to start the C0 E-mail actuator component, you can use the `component` profile:

```bash
COMPOSE_PROFILES=component docker compose up -d
```

When deploying only the component, you'll need to provide necessary connection details via a 
[.env](https://docs.docker.com/compose/environment-variables/env-file/) file. Create a file named `.env`
in the same directory as your `docker-compose.yml` with content similar to this:

```properties
MQ_HOST=host.docker.internal
MQ_USERNAME=mov
MQ_PASSWORD=password
C0_EMAIL_ACTUATOR_PORT=9080
MAIL_WEB=9083
```

### Docker compose environment variables

The `docker-compose.yml` file utilizes several configuration properties that can be customized 
to modify its behavior. The recommended way to define these variables is by creating a
[`.env`](https://docs.docker.com/compose/environment-variables/env-file/) file in the same 
directory as your `docker-compose.yml`. 

The following sections detail the available environment variables and their default values.


#### Docker image versions

These variables control the specific versions (tags) of the Docker images used in this deployment:

 - `C0_EMAIL_ACTUATOR_TAG`: The Docker image tag for the C0 E-mail actuator.
 The default value is `latest`.
 - `MOV_TAG`: The Docker image tag for the Master Of VALAWAI (MOV).
 The default value is `latest`.
 - `RABBITMQ_TAG`: The Docker image tag for the RabbitMQ broker.
 The default value is `management`.
 - `MONGODB_TAG`: The Docker image tag for the MongoDB database.
 The default value is `latest`.
 - `MAIL_CATCHER_TAG`: The Docker image tag for the Mail Catcher service.
 The default value is `latest`.

#### Master Of VALAWAI (MOV) Configuration

These environment variables are used to configure the
[Master Of VALAWAI (MOV)](https://valawai.github.io/docs/architecture/implementations/mov/deploy)
that the C0 E-mail Actuator and other components must interact with.

 - `MOV_MQ_HOST`: Specifies the hostname or IP address where the RabbitMQ broker is accessible 
 to the MOV. The default value is `mq`, which is the name of the started RabbitMQ container 
 within the docker-compose network.
 - `MOV_MQ_PORT`:  Defines the port number used for connecting to the RabbitMQ broker. The default 
 value is `5672`.
 - `MOV_MQ_USER`: The username used for authentication with the RabbitMQ broker.
 The default value is `mov`.
 - `MOV_MQ_PASSWORD`: The password used to authenticate the specified `RABBITMQ_USERNAME`
 with the RabbitMQ broker. The default value is `password`.
 - `MOV_DB_HOST`: Specifies the hostname or IP address where the MongoDB database is accessible 
 to the MOV. The default value is  `mongo`, which is the name of the started MongoDB container 
 within the docker-compose network.
 - `MOV_DB_PORT`: Defines the port number used for connecting to the MonGODB database.
 The default value is `27017`.
 - `MOV_DB_USER_NAME`: The username used for authentication with the MonGODB database.
 The default value is `mov`.
 - `MOV_DB_USER_PASSWORD`: The password used to authenticate the specified `MONGODB_USERNAME`
 with the MonGODB database. The default value is `password`.
 - `MOV_UI_PORT`: Defines the port on which the MOV user interface is available. The default 
 value is  `8081`.
 - `MOV_MQ_UI_PORT`:  Defines the port on which the RabbitMQ management user interface is 
 available. The default value is `8082`.

#### E-mail configuration

On a [previous section](#mail-connection) , we explained how to configure the mail server 
that the component must use to send e-mails. The following variables configure the connection 
to the included Mail Catcher service, which is designed for development and testing purposes. 
If you intend to use an external, production-ready mail server, you will need to modify these 
variables or add more variables in the environment section of the C0 E-mail Actuator service 
within your `docker-compose.yml`. For more details on advanced mailer configuration, consult 
the [Quarkus Mailer documentation](https://quarkus.io/guides/mailer-reference#configuration-reference).

 - `MAIL_HOST`: Defines the host where the email server (Mail Catcher) is expecting to receive 
 emails to send. The default value is `mail`,  which is the name of the Mail Catcher container 
 within the docker-compose network.
 - `MAIL_PORT`: Defines the port where the email server (Mail Catcher) is expecting to receive 
 emails to send. The default value is `1025`.
 - `MAIL_FROM`: Defines the email address used in the "From" field of the emails sent. The default 
 value is `no-reply@valawai.eu`.
 - `MAIL_USERNAME`: Defines the username to connect to the email server. The default value is `user`.
 - `MAIL_PASSWORD`: Defines the password of the user that is allowed to send emails to the server. 
 The default value is `password`.
 - `MAIL_STARTTLS`: Defines if the mail connection should use **STARTTLS**. The default value 
 is `DISABLED`.
 - `MAIL_TLS`: Defines if the mail connection should use **SSL/TLS**. The default value is `false`.
 - `MAIL_AUTH_METHODS`: Defines the type of login methods to use for authentication. The default 
 value is  `DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN`.

#### C0 E-mail Actuator Component Variable

This variable configures the C0 E-mail Actuator component itself:

 - `C0_EMAIL_ACTUATOR_PORT`: Defines the port on which the C0 E-mail Actuator provides its API. 
 The default value is 8080.
