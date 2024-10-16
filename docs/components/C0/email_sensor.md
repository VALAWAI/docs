# E-mail sensor

The C0 e-mail sensor component extracts information from e-mails that are
receive by a user into an e-mail server, and publish this information to be used
by other VALAWAI components. Thus, this component fetches the e-mails of a user
account in an email server normalizes them and publishes them in the channel
**valawai/c0/email_sensor/data/e_mail**.


## Services

The services of this component are described in the [asyncapi](https://raw.githubusercontent.com/VALAWAI/C0_email_sensor/main/asyncapi.yaml)
that you can find on the [source code of this component](https://github.com/VALAWAI/C0_email_sensor).


### Notify about the unread received e-mails

This component has a task that periodically checks if in the account of the defined used
exists any non-readed e-mail. If so, it gets all of them, normalize them into the next model
and publishes them into the channel **valawai/c0/email_sensor/data/e_mail**.

 - **address** the information from which the message is, and to which the message is sent.
 Each one is an object with the type of address (FROM, TO, CC or BCC), the name of the user,
 and the e-mail address.
 - **subject** of the e-mail.
 - **mime_type** that describes how the content of the e-mail is encoded.
 - **content** of the e-mail
 - **received_at** the epoch time, in seconds, when the e-mail is received.

The next JSON is an example of this data model.

```jsx
{
  "address": [
    {
      "type": "FROM",
      "name": "Jane doe",
      "address": "jane.doe@valawai.eu"
    },
    {
      "type": "TO",
      "address": "info@valawai.eu"
    }
  ],
  "subject": "How to publish a component?",
  "mime_type": "text/plain",
  "content": "Hi! Could you please inform me about the necessary steps to have a component available in the VALAWAI?",
  "received_at": 1715342664
}
```

### Change component parameters

This component only have the parameter that define the time that has to pass between the fetching intervals.
Thus the time that the component must wait to ask again to the e-mail server if exist any no-read e-mail.
To modify this parameter is necessary send to the channel **valawai/c0/email_sensor/control/change_parameters**
a payload with the **fetching_interval** value in seconds.

The next JSON is an example of payload of the message to change the interval to check for new unread e-mails
in intervlas of 5 minutes.

```jsx
{
  "fetching_interval": 300
}
```

## How to use this component

As a sensor, this component provides information from the world to other components
that form the value-aware application. In this case, it provides e-mails that will 
be published into the channel **valawai/c0/email_sensor/data/e_mail**. The [Master of VALAWAI (MOV)](/toolbox/mov)
will be responsible for redistributing this information to the other components depending
on the current topology of the application. In the [readme](https://github.com/VALAWAI/C0_email_sensor/blob/main/README.md),
you will find the version of the MOV that is necessary to use. Also, you must create the docker image of this component,
and you can deploy it individually or using a docker-compose. The following sections explain how to do these.


### Build Docker image

The easier way to create the C0 E-mail sensor docker image is by following the next steps.

1. Install [docker](https://docs.docker.com/get-docker/),
  [docker compose](https://docs.docker.com/compose/install/) and
  [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Get the code from GitHub

```bash
git clone https://github.com/VALAWAI/C0_email_sensor.git
```

3. Generate the docker image calling the script:

```bash
./buildDockerImages.sh
```

At the end you must have the docker image **valawai/c0_email_sensor:Z.Y.Z**
where **X.Y.Z** will be the version of the component. If you want to have
the image with another tag for example **latest** you must call the script
with this tag as a parameter, for example:

```bash
./buildDockerImages.sh latest
```

And you will obtain the image **valawai/c0_email_sensor:latest**.

#### Docker environment variables

The generated Docker image has the next environment variables:

 - **RABBITMQ_HOST** is the host where the RabbitMQ is available.
  The default value is ___mov-mq___.
 - **RABBITMQ_PORT** defines the port of the RabbitMQ.
  The default value is ___5672___.
 - **RABBITMQ_USERNAME** contains the name of the user that can access the RabbitMQ.
  The default value is ___mov___.
 - **RABBITMQ_PASSWORD** is the password to authenticate the user that can access the RabbitMQ.
  The default value is ___password___.
 - **MAIL_PROTOCOL** defines the protocol to connect to the e-mail server to fetch the e-mails.
  It can be **pop3**, **pop3s**, **imap** or **imap2**. The default value is ___imaps___.
 - **MAIL_HOST** is the host to the e-mail server. The default value is ___mail___.
 - **MAIL_PORT** defines the port of the e-mail server. The default value is ___993___.
 - **MAIL_SECURED** this is **true** is the connection uses the secured TLS.
  The default value is ___true___.
 - **MAIL_USERNAME** contains the name of the user that can access the e-mail server.
  The default value is ___user___.
 - **MAIL_PASSWORD** defines the credential to authenticate the user that can access the e-mail server.
  The default value is ___password__.
 - **C0_EMAIL_SENSOR_FETCHING_INTERVAL** contains the seconds that have to pass between fetching e-mail
  intervals. The default value is ___60__.
 - **LOG_LEVEL** defines the level of the log messages to be stored.
  The default value is ___INFO__.
 - **QUARKUS_HTTP_HOST** contains the server host that will expose the REST health endpoints.
 The default value is __0.0.0.0__.
 - **QUARKUS_HTTP_PORT** defines the server port that will expose the REST health endpoints.
 The default value is __8080__.


#### Docker health check

This component exposes the following REST endpoints to check their health status.

 - **/q/health/live** can be used to check if the component is running.
 - **/q/health/ready** can be used to check if the component can process the messages
  from the VALAWAI infrastructure.
 - **/q/health/started** can be used to check if the component has started.
 - **/q/health** can be used to obtain all the previous check procedures in the component.
 
All of them will return a JSON which will have the **status** of the state (**UP** or **DOWN**)
and the list of **checks** that have been evaluated. It looks like the following example was obtained
from doing a **GET** over the **/q/health** endpoint.

 
```jsx
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
 
An alternative is to see the state of the component using the health user interface that
is exposed at [/q/health-ui/](http://localhost:8080/q/health-ui/).
 
These endpoints are useful for doing the **healthcheck** in a **docker-compose** as
you can see in the following example.


```yaml
services:
  email_sensor:
    image: valawai/c0_email_sensor:${C0_EMAIL_SENSOR_TAG:-latest}
    container_name: c0_email_sensor
    networks:
      - email_sensor
    depends_on:
      mov:
        condition: service_healthy
        restart: true
      mail:
        condition: service_started
        required: false
    environment:
      RABBITMQ_HOST: ${MQ_HOST:-mq}
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
      MAIL_PROTOCOL: ${MAIL_PROTOCOL:-imaps}
      MAIL_HOST: ${MAIL_HOST:-mail}
      MAIL_PORT: ${MAIL_PORT:-993}
      MAIL_USERNAME: ${MAIL_USERNAME:-user}
      MAIL_PASSWORD: ${MAIL_PASSWORD:-password}
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

Finally, remember that the  docker environment variables **QUARKUS_HTTP_HOST** and **QUARKUS_HTTP_PORT**
can be used to configure where the REST health endpoints will be exposed by the component.


### Deploy 

After you have the **valawai/c0_email_sensor:Z.Y.Z** docker image you can deploy directly using Docker,
but you must define at least the environment variables to connect the message queue where
the [Master of valawai (MOV)](/tutorials/mov) is deployed and the parameters to the server where
will be received the e-mails to read. An easier way to do it is by using the provided [docker compose](https://github.com/VALAWAI/C0_email_sensor/blob/main/docker-compose.yml)
on the [repository](https://github.com/VALAWAI/C0_email_sensor) of this component.
On it are defined the profiles **mov** and **mail**. The first one is to launch
the [Master Of Valawai (MOV)](https://github.com/VALAWAI/MOV) and the second one is to start
a [mocked e-mail server](https://github.com/dbck/docker-mailtrap). You can use the next
command to start this component with the MOV and the mail server.

```bash
COMPOSE_PROFILES=mov,mail docker compose up -d
```

After that, if you open a browser and go to [http://localhost:8080](http://localhost:8080)
you can view the MOV user interface. Also, you can access the RabbitMQ user interface
at [http://localhost:8081](http://localhost:8081). Finally, you can access the mail server
user interface at [http://localhost:8082](http://localhost:8082). 
one are **mov:password**.

The docker compose defines some variables that can be modified by creating a file named
[**.env**](https://docs.docker.com/compose/environment-variables/env-file/) where 
you write the name of the variable plus equals plus the value.  As you can see in
the next example.

```properties
MQ_HOST=rabbitmq.valawai.eu
MQ_USERNAME=c0_email_sensor
MQ_PASSWORD=lkjagb_ro82t¿134
```

The defined variables are:


 - **C0_EMAIL_SENSOR_TAG** is the tag of the C0 email sensor docker image to use.
  The default value is ___latest___.
 - **MQ_HOST** is the hostname of the message queue broker that is available.
  The default value is ___mq___.
 - **MQ_PORT** is the port of the message queue broker is available.
  The default value is ___5672___.
 - **MQ_UI_PORT** is the port of the message queue broker user interface is available.
  The default value is ___8081___.
 - **MQ_USER** is the name of the user that can access the message queue broker.
  The default value is ___mov___.
 - **MQ_PASSWORD** is the password to authenticate the user that can access the message queue broker.
  The default value is ___password___.
 - **MAIL_PROTOCOL** defines the protocol to connect to the e-mail server to fetch the e-mails.
  It can be **pop3**, **pop3s**, **imap** or **imap2**. The default value is ___imaps___.
 - **MAIL_HOST** is the host to the e-mail server. The default value is ___mail___.
 - **MAIL_PORT** defines the port of the e-mail server. The default value is ___993___.
 - **MAIL_SECURED** this is **true** is the connection uses the secured TLS.
  The default value is ___true___.
 - **MAIL_USERNAME** contains the name of the user that can access the e-mail server.
  The default value is ___user___.
 - **MAIL_PASSWORD** defines the credential to authenticate the user that can access the e-mail server.
  The default value is ___password__.
 - **MAILTRAP_TAG** is the tag of the [email server](https://github.com/dbck/docker-mailtrap) docker image to use.
  The default value is ___latest___.
 - **RABBITMQ_TAG** is the tag of the RabbitMQ docker image to use.
  The default value is ___management___.
 - **MONGODB_TAG** is the tag of the MongoDB docker image to use.
  The default value is ___latest___.
 - **MONGO_PORT** is the port where MongoDB is available.
  The default value is ___27017___.
 - **MONGO_ROOT_USER** is the name of the root user for the MongoDB.
  The default value is ___root___.
 - **MONGO_ROOT_PASSWORD** is the password of the root user for the MongoDB.
  The default value is ___password___.
 - **MONGO_LOCAL_DATA** is the local directory where the MongoDB will be stored.
  The default value is ___~/mongo_data/movDB___.
 - **DB_NAME** is the name of the database used by the MOV.
  The default value is ___movDB___.
 - **DB_USER_NAME** is the name of the user used by the MOV to access the database.
  The default value is ___mov___.
 - **DB_USER_PASSWORD** is the password of the user used by the MOV to access the database.
  The default value is ___password___.
 - **MOV_TAG** is the tag of the MOV docker image to use.
  The default value is ___latest___.
 - **MOV_UI_PORT** is the port where the MOV user interface is available.
  The default value is ___8080___.

The database is only created the first time where script is called. So, if you modify
any of the database parameters you must create again the database. For this, you must
remove the directory defined by the parameter **MONGO_LOCAL_DATA** and start again
the **docker compose**.

You can stop all the started containers with the command:

```bash
COMPOSE_PROFILES=mov,mail docker compose down
``` 
