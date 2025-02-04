# E-mail 

This is a basic demonstrator of how to use the VALAWAI Architecture](/docs/architecture/value_awareness_architecture)
to create a simple Value-awareness application. It uses some components
to obtain e-mails from a server, generate a reply e-mail, send it and
check that this reply is aligned with a value. These components are:

 - [C0 E-mail sensor](/docs/components/C0/email_sensor) This component is used
 to obtain the e-mails to reply.
 - [C0 E-mail actuator](/docs/components/C0/email_actuator) This component
 is used to send the replies.
 - [C1 E-mail replier](/docs/components/C1/llm_email_replier) This component
 is used to provide a reply message to a received e-mail.
 - [C2 E-mail analizer](/docs/components/C2/email_analizer) This component
 is used to check if an e-mail is aligned with some values.
 
To orchestrate all these components we need to create a file named **docker-compose.yml**
with the following content.

```yaml
services:
  email_actuator:
    image: valawai/c0_email_actuator:${C0_EMAIL_ACTUATOR_TAG:-latest}
    container_name: c0_email_actuator
    networks:
      - email_net
    depends_on:
      mov:
        condition: service_healthy
        restart: true
      mailtrap:
        condition: service_healthy
        restart: true
    environment:
      RABBITMQ_HOST: ${MQ_HOST:-mq}
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
      QUARKUS_MAILER_HOST: ${MAIL_HOST:-mailtrap}
      QUARKUS_MAILER_PORT: ${MAIL_PORT:-25}
      QUARKUS_MAILER_FROM: ${MAIL_FROM:-no-reply@valawai.eu}
      QUARKUS_MAILER_USERNAME: ${MAIL_USERNAME:-user}
      QUARKUS_MAILER_PASSWORD: ${MAIL_PASSWORD:-password}
      QUARKUS_MAILER_START_TLS: ${MAIL_STARTTLS:-DISABLED}
      QUARKUS_MAILER_TLS: ${MAIL_STARTTLS:-false}
      QUARKUS_MAILER_AUTH_METHODS: ${MAIL_AUTH_METHODS:-DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN}
    healthcheck:
      test:
        [
          "CMD",
          "echo",
          "0"
        ]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s
    
  email_sensor:
    image: valawai/c0_email_sensor:${C0_EMAIL_SENSOR_TAG:-latest}
    container_name: c0_email_sensor
    networks:
      - email_net
    depends_on:
      mov:
        condition: service_healthy
        restart: true
      mailtrap:
        condition: service_healthy
        restart: true
    environment:
      RABBITMQ_HOST: ${MQ_HOST:-mq}
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
      MAIL_PROTOCOL: ${MAIL_PROTOCOL:-imaps}
      MAIL_HOST: ${MAIL_HOST:-mailtrap}
      MAIL_PORT: ${MAIL_PORT:-993}
      MAIL_USERNAME: ${MAIL_USERNAME:-user}
      MAIL_PASSWORD: ${MAIL_PASSWORD:-password}
    healthcheck:
      test:
        [
          "CMD",
          "echo",
          "0"
        ]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s

  mailtrap:
    image: dbck/mailtrap:${MAILTRAP_TAG:-latest}
    container_name: mailtrap
    hostname: ${MAIL_HOST:-mail}
    ports:
      - "${MAIL_LOCAL_SMTP:-1025}:25"
      - "${MAIL_LOCAL_PORT:-1993}:993"
      - "${MAIL_LOCAL_WEB:-8082}:80"
    networks:
      - email_net
    environment:
      MAILTRAP_USER: ${MAIL_USERNAME:-user}
      MAILTRAP_PASSWORD: ${MAIL_PASSWORD:-password}

  llm_email_replier:
    image: valawai/c1_llm_email_replier:${C1_LLM_EMAIL_REPLIER_TAG:-latest}
    container_name: c1_llm_email_replier
    networks:
      - email_net
    depends_on:
      mov:
        condition: service_healthy
        restart: true
      email_actuator:
        condition: service_healthy
        restart: true
      email_sensor:
        condition: service_healthy
        restart: true
    environment:
      RABBITMQ_HOST: ${MQ_HOST:-mq}
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
      REPLY_MAX_NEW_TOKENS: ${REPLY_MAX_NEW_TOKENS:-256}
      REPLY_TEMPERATURE: ${REPLY_TEMPERATURE:-0.7}
      REPLY_TOP_K: ${REPLY_TOP_K:-50}
      REPLY_TOP_P: ${REPLY_TOP_P:-0.95}
      REPLY_SYSTEM_PROMPT: ${REPLY_SYSTEM_PROMPT:-"You are a polite chatbot who always try to provide solutions to the customers problems"}
      LOG_CONSOLE_LEVEL: ${LOG_LEVEL:-INFO}
    healthcheck:
      test:
        [
          "CMD",
          "curl",
          "-f",
          "http://localhost:8080/"
        ]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s

  mq:
    image: rabbitmq:${RABBITMQ_TAG:-management}
    container_name: mov_mq
    hostname: ${MQ_HOST:-mq}
    ports:
      - ${MQ_LOCAL_PORT:-5672}:5672
      - ${MQ_LOCAL_UI_PORT:-8081}:15672
    networks:
      - email_net
    environment:
      RABBITMQ_DEFAULT_USER: ${MQ_USER:-mov}
      RABBITMQ_DEFAULT_PASS: ${MQ_PASSWORD:-password}
    healthcheck:
      test:
        [
          "CMD",
          "rabbitmq-diagnostics",
          "-q",
          "ping"
        ]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s

  mongo:
    image: mongo:${MONGODB_TAG:-latest}
    container_name: mov_db
    hostname: ${DB_HOST:-mongo}
    ports:
      - ${MONGO_LOCAL_PORT:-27017}:27017
    networks:
      - email_net
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER:-root}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-password}
      MONGO_INITDB_DATABASE: ${DB_NAME:-movDB}
      DB_NAME: ${DB_NAME:-movDB}
      DB_USER_NAME: ${DB_USER_NAME:-mov}
      DB_USER_PASSWORD: ${DB_USER_PASSWORD:-password}
    volumes:
      - ./src/deploy/docker/initialize-movDB.js:/docker-entrypoint-initdb.d/init-mongo.js
      - ${MONGO_LOCAL_DATA:-~/mongo_data/emailActuatorMovDB}:/data/db
    healthcheck:
      test:
        [
          "CMD",
          "mongosh",
          "--quiet",
          "localhost/${DB_NAME:-movDB}",
          "--eval",
          "'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)'",
        ]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s

  mov:
    image: valawai/mov:${MOV_TAG:-latest}
    container_name: mov
    depends_on:
      mongo:
        condition: service_healthy
        restart: true
      mq:
        condition: service_healthy
        restart: true
    ports:
      - ${MOV_UI_PORT:-8080}:8080
    networks:
      - email_net
    environment:
      RABBITMQ_HOST: ${MQ_HOST:-mq}
      RABBITMQ_PORT: ${MQ_PORT:-5672}
      RABBITMQ_USERNAME: ${MQ_USER:-mov}
      RABBITMQ_PASSWORD: ${MQ_PASSWORD:-password}
      QUARKUS_MONGODB_DATABASE: ${DB_NAME:-movDB}
      QUARKUS_MONGODB_CREDENTIALS_USERNAME: ${DB_USER_NAME:-mov}
      QUARKUS_MONGODB_CREDENTIALS_PASSWORD: ${DB_USER_PASSWORD:-password}
      QUARKUS_MONGODB_HOSTS: ${DB_HOST:-mongo}:${MONGO_PORT:-27017}
    healthcheck:
      test:
        [
          "CMD",
          "curl",
          "-f",
          "http://localhost:8080/"
        ]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s

networks:
  email_net:
```

After that, you can run the application using the following command.

```sh
docker compose up -d
```

If you want to stop the application use the following command.

```sh
docker compose down
```

If it is running you can show the logs of all the containers using the following command.

```sh
docker compose logs -f
```

When the application is running you have access to the following user interfaces:

* [Master Of VALAWAI](/docs/architecture/implementations/mov) at **[http://localhost:8080](http://localhost:8080)**
* RabbitMQ manager at **[http://localhost:8081](http://localhost:8081)**
* Mailtrap at **[http://localhost:8082](http://localhost:8082)**


