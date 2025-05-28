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

his section details the primary environment variables available for configuring 
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
            "name": "Registered C0 email actuator",
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
 
AFor a visual health status, you can access the health user interface at 
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

After you have the **valawai/c0_email_actuator:Z.Y.Z** docker image you can deploy directly using Docker,
but you must define at least the environment variables to connect the message queue where
the [Master of valawai (MOV)](/docs/architecture/implementations/mov/deploy) is deployed and the parameters to the server 
that will be used to send the emails. An easier way to do it is by using the provided [docker compose](https://github.com/VALAWAI/C0_email_actuator/blob/main/docker-compose.yml)
on the [repository](https://github.com/VALAWAI/C0_email_actuator) of this component.
On it are defined the profiles **mov** and **mail**. The first one is to launch
the [Master Of Valawai (MOV)](https://github.com/VALAWAI/MOV) and the second one is to start
an [e-mail catcher](https://github.com/dbck/docker-mailtrap). You can use the next
command to start this component with the MOV and the mail server.

```bash
COMPOSE_PROFILES=mov,mail docker compose up -d
```

After that, if you open a browser and go to [http://localhost:8080](http://localhost:8080)
you can view the MOV user interface. Also, you can access the RabbitMQ user interface
at [http://localhost:8081](http://localhost:8081) with the credentials **mov:password**.
Finally, you can access the mail catcher user interface at [http://localhost:8082](http://localhost:8082).

The docker compose defines some variables that can be modified by creating a file named
[**.env**](https://docs.docker.com/compose/environment-variables/env-file/) where 
you write the name of the variable plus equals plus the value.  As you can see in
the next example.

```properties
MQ_HOST=rabbitmq.valawai.eu
MQ_USERNAME=c0_email_actuator
MQ_PASSWORD=lkjagb_ro82t¿134
```

The defined variables are:

 - **C0_EMAIL_ACTUATOR_TAG** is the tag of the C0 email actuator docker image to use.
 The default value is **latest**.
 - **MQ_HOST** is the hostname of the message queue broker that is available.
 The default value is **mq**.
 - **MQ_PORT** is the port of the message queue broker is available.
 The default value is **5672**.
 - **MQ_UI_PORT** is the port of the message queue broker user interface is available.
 The default value is **8081**.
 - **MQ_USER** is the name of the user that can access the message queue broker.
 The default value is **mov**.
 - **MQ_PASSWORD** is the password used to authenticate the user who can access the message queue broker.
 The default value is **password**.
 - **MAIL_HOST** is the host to the e-mail server. The default value is **mail**.
 - **MAIL_PORT** defines the port of the e-mail server. The default value is **25**.
 - **MAIL_FROM** is the e-mail address that will appear in the form of the sent e-mails.
 The default value is **no-reply@valawai.eu**.
 - **MAIL_USERNAME** contains the user's name that can access the e-mail server.
 The default value is **user**.
 - **MAIL_PASSWORD** defines the credential to authenticate the user that can access the e-mail server.
 The default value is **password**.
 - **MAIL_STARTTLS** is used to define the connection of the e-mail server
 using a STARTTLS connection. The possible values are: DISABLED, OPTIONAL or REQUIRED.
 The default value is **DISABLED**.
 - **QUARKUS_MAILER_TLS** is used to define the connection of the e-mail server
 using a TTLS/SSL connection. The default value is **false**.
 - **QUARKUS_MAILER_AUTH_METHODS** is used to define the type of authentication methods
 that can be used in the e-mail server. The default value is **DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN**.
 - **MAIL_CATCHER_TAG** is the tag of the [email server](https://hub.docker.com/r/schickling/mailcatcher/) docker image to use.
 The default value is **latest**.
 - **RABBITMQ_TAG** is the tag of the RabbitMQ docker image to use.
 The default value is **management**.
 - **MONGODB_TAG** is the tag of the MongoDB docker image to use.
 The default value is **latest**.
 - **MONGO_PORT** is the port where MongoDB is available.
 The default value is **27017**.
 - **MONGO_ROOT_USER** is the name of the root user for the MongoDB.
 The default value is **root**.
 - **MONGO_ROOT_PASSWORD** is the password of the root user for the MongoDB.
 The default value is **password**.
 - **MONGO_LOCAL_DATA** is the local directory where the MongoDB will be stored.
 The default value is **~/mongo_data/movDB**.
 - **DB_NAME** is the name of the database used by the MOV.
 The default value is **movDB**.
 - **DB_USER_NAME** is the name of the user used by the MOV to access the database.
 The default value is **mov**.
 - **DB_USER_PASSWORD** is the password of the user used by the MOV to access the database.
 The default value is **password**.
 - **MOV_TAG** is the tag of the MOV docker image to use.
 The default value is **latest**.
 - **MOV_UI_PORT** is the port where the MOV user interface is available.
 The default value is **8080**.

The database is only created the first time where script is called. So, if you modify
any of the database parameters you must create again the database. For this, you must
remove the directory defined by the parameter **MONGO_LOCAL_DATA** and start again
the **docker compose**.

You can stop all the started containers with the command:

```bash
COMPOSE_PROFILES=mov,mail docker compose down
``` 

