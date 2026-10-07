# NIT protocol manager

The C1 NIT protocol manager receives treatments and checks if they follow the NIT protocol.
Thus, this component subscribes to the treatments received from the channel
**valawai/c1/nit_protocol_manager/data/treatment**, and provides feedback if the treatment
actions follows the NIT protocol into the channel
**valawai/c1/nit_protocol_manager/data/treatment_action_feedback**.

## Services

The services of this component are described in the [asyncapi](https://raw.githubusercontent.com/VALAWAI/C1_nit_protocol_manager/main/asyncapi.yaml)
that you can find on the [source code of this component](https://github.com/VALAWAI/C1_nit_protocol_manager).


### Check treatment

This component check all the treatments received on the channel **valawai/c1/nit_protocol_manager/data/treatment**
that if they satisfy the NIT protocol. This treatment has the next attributes:

 - **id** the identifier of the treatment.
 - **patient_id** the identifier of the patient to apply the treatment.
 - **created_time** the epoch time, in seconds, that the treatment is created.
 - **before_status** the status before to apply the treatment.
 - **actions** to apply to the patient.
 - **expected_status** the status of the patient after the treatment has been applied.
 
The next JSON is an example of this data model.

```jsx
{
  "id": "1234",
  "patient_id": "4321",
  "created_time": 1715342664,
  "before_status": {
    "age_range": "AGE_BETWEEN_0_AND_19",
    "ccd": true,
    "maca": true,
    "expected_survival": "LESS_THAN_12_MONTHS",
    "frail_VIG": "LOW",
    "clinical_risk_group": "PROMOTION_AND_PREVENTION",
    "has_social_support": true,
    "independence_at_admission": "TOTAL",
    "independence_instrumental_activities": 8,
    "has_advance_directives": true,
    "is_competent": true,
    "has_been_informed": true,
    "is_coerced": true,
    "has_cognitive_impairment": "ABSENT",
    "has_emocional_pain": true,
    "discomfort_degree": "LOW",
    "nit_level": "ONE"
  },
  "actions": [
    "CPR"
  ],
  "expected_status": {
    "age_range": "AGE_BETWEEN_0_AND_19",
    "ccd": true,
    "maca": true,
    "expected_survival": "LESS_THAN_12_MONTHS",
    "frail_VIG": "LOW",
    "clinical_risk_group": "PROMOTION_AND_PREVENTION",
    "has_social_support": true,
    "independence_at_admission": "TOTAL",
    "independence_instrumental_activities": 8,
    "has_advance_directives": true,
    "is_competent": true,
    "has_been_informed": true,
    "is_coerced": true,
    "has_cognitive_impairment": "ABSENT",
    "has_emocional_pain": true,
    "discomfort_degree": "LOW",
    "nit_level": "ONE"
  }
}
```

### Notify about the treatment action feedback

This component every time that receive informaiton of a treatment it validates if follow the NIT protocol and
provide feedback. If so, it publish the feedback into the channel **valawai/c1/nit_protocol_manager/data/treatment_action_feedback**, and this has the next attributes:

 - **addrtreatment_idess** the identifier where the action will be applied..
 - **action** treatment action that is checked if follows the NIT protocol.
 - **feedback** if the actions is allowed, denied or does not have enough information to take a decision.

The next JSON is an example of this data model.

```jsx
{
  "treatment_id": "1234",
  "action": "CPR",
  "feedback": "ALLOW"
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

This component checks that the treatments to apply to a patient follow the NIT protocol. This protocol
allows or not do some actions over the patients depending of its NIt level.


### Build Docker image

The easier way to create the C1 NIT protocol manager docker image is by following the next steps.

1. Install [docker](https://docs.docker.com/get-docker/),
  [docker compose](https://docs.docker.com/compose/install/) and
  [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Get the code from GitHub

```bash
git clone https://github.com/VALAWAI/C1_nit_protocol_manager.git
```

3. Generate the docker image calling the script:

```bash
./buildDockerImages.sh
```

At the end you must have the docker image **valawai/c1_nit_protocol_manager:Z.Y.Z**
where **X.Y.Z** will be the version of the component. If you want to have
the image with another tag for example **latest** you must call the script
with this tag as a parameter, for example:

```bash
./buildDockerImages.sh latest
```

And you will obtain the image **valawai/c1_nit_protocol_manager:latest**.

#### Docker environment variables

The generated Docker image has the next environment variables:

 - **RABBITMQ_HOST** is the host where the RabbitMQ is available.
 The default value is **mov-mq**.
 - **RABBITMQ_PORT** defines the port of the RabbitMQ.
 The default value is **5672**.
 - **RABBITMQ_USERNAME** contains the username of the user who can access RabbitMQ.
 The default value is **mov**.
 - **RABBITMQ_PASSWORD** is the password used to authenticate the user who can access the RabbitMQ.
 The default value is **password**.
 - **LOG_LEVEL** defines the level of the log messages to be stored.
 The default value is **INFO**.
 - **QUARKUS_HTTP_HOST** contains the server host that will expose the REST health endpoints.
 The default value is __0.0.0.0__.
 - **QUARKUS_HTTP_PORT** defines the server port that will expose the REST health endpoints.
 The default value is __8080__.
 - **C1_NIT_PROTOCOL_MANAGER_NORMS_FILE** contains the path to the file with the norms to validate
 the NIT protocol. The default value is ___eu/valawai/c1_nit_protocol_manager/nit-protocol.drl___.
 - **C1_NIT_PROTOCOL_MANAGER_NORMS_TYPE** contains the name of the type of the norms expressed in the file.
 The default value is ___DRL___.


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
            "name": "Registered C1 NIT protocol manager",
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
            "name": "Norm engine",
            "status": "UP"
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
 
An alternative is to see the state of the component using the health user interface that
is exposed at [/q/health-ui/](http://localhost:8080/q/health-ui/).
 
These endpoints are useful for doing the **healthcheck** in a **docker-compose** as
you can see in the following example.


```yaml
services:
  nit_protocol_manager:
    image: valawai/c1_nit_protocol_manager:${C1_NIT_PROTOCOL_MANAGER_TAG:-latest}
    container_name: c1_nit_protocol_manager
    networks:  
      - nit_protocol_manager_net
    ports:
      - ${C1_NIT_PROTOCOL_MANAGER_PORT:-8080}:8080
    depends_on:
      mov:
        condition: service_healthy
        restart: true
        required: false
    environment:
      RABBITMQ_HOST: ${MQ_HOST:-mq}
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
    healthcheck:
      test: ["CMD-SHELL", "curl -s http://localhost:8080/q/health | grep -m 1 -P \"^[\\s|\\{|\\\"]+status[\\s|\\:|\\\"]+.+\\\"\" |grep -q \"\\\"UP\\\"\""]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s
```

Finally, remember that the  docker environment variables **QUARKUS_HTTP_HOST** and **QUARKUS_HTTP_PORT**
can be used to configure where the REST health endpoints will be exposed by the component.


### Deploy 

After you have the **valawai/c1_nit_protocol_manager:Z.Y.Z** docker image you can deploy directly using Docker,
but you must define at least the environment variables to connect the message queue where
the [Master of valawai (MOV)](/docs/architecture/implementations/mov/deploy) is deployed and the parameters to the server where
will be received the e-mails to read. An easier way to do it is by using the provided [docker compose](https://github.com/VALAWAI/C1_nit_protocol_manager/blob/main/docker-compose.yml)
on the [repository](https://github.com/VALAWAI/C1_nit_protocol_manager) of this component.
 On this file is defined
the profile **mov**, that can be used to launch
the [Master Of Valawai (MOV)](https://github.com/VALAWAI/MOV). You can use the next
command to start this component with the MOV.

```bash
COMPOSE_PROFILES=mov docker compose up -d
```

After that, if you open a browser and go to [http://localhost:8081](http://localhost:8081)
you can view the MOV user interface. Also, you can access the RabbitMQ user interface
at [http://localhost:8082](http://localhost:8082) with the credentials **mov:password**.

The docker compose defines some variables that can be modified by creating a file named
[**.env**](https://docs.docker.com/compose/environment-variables/env-file/) where 
you write the name of the variable plus equals plus the value.  As you can see in
the next example.

```properties
MQ_HOST=rabbitmq.valawai.eu
MQ_USERNAME=c1_nit_protocol_manager
MQ_PASSWORD=lkjagb_ro82t¿134
```

The defined variables are:


 - **C1_NIT_PROTOCOL_MANAGER_TAG** is the tag of the C1 NIT protocol manager docker image to use.
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
 - **MOV_DB_NAME** is the name of the database used by the MOV.
  The default value is ___movDB___.
 - **MOV_DB_USER_NAME** is the name of the user used by the MOV to access the database.
  The default value is ___mov___.
 - **MOV_DB_USER_PASSWORD** is the password of the user used by the MOV to access the database.
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
COMPOSE_PROFILES=mov docker compose down
``` 
