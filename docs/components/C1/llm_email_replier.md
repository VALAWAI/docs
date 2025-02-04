# LLM e-mail replier

The C1 LLM e-mail replier component receives e-mails, generates a reply
using a large language model (LLM), and publish the reply e-mail.
Thus, this component subscribes to the e-mails received from the channel
**valawai/c1/llm_email_replier/data/received_e_mail**, generate
a response using a LLM, and publish the reply e-mail into the channel
**valawai/c1/llm_email_replier/data/reply_e_mail**.


## Services

The services of this component are described in the [asyncapi](https://raw.githubusercontent.com/VALAWAI/C1_llm_email_replier/main/asyncapi.yaml)
that you can find on the [source code of this component](https://github.com/VALAWAI/C1_llm_email_replier).


### Receive e-mail to reply

This component is subscribed to the channel **valawai/c1/llm_email_replier/data/received_e_mail**
to obtain the e-mails to reply. The received messages have the next fields.

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
  "subject": "How to create a VALAWAI component?",
  "mime_type": "text/plain",
  "content": "Hi! I am a new user of the VALAWAI and I do not know how to create a component. Can you help me with it?",
  "received_at": 1715342664
}
```


### Notify the e-mail to reply

This component when has obtained the reply of an e-mail, it publish a message on the channel
**valawai/c1/llm_email_replier/data/reply_e_mail**. This message has the next attributes:

 - **address** the information to who the message will be sent. Each is an object with
  the address type (TO, CC or BCC), the name of the user, and the e-mail address.
 - **subject** of the e-mail.
 - **is_html** is true if the content is HTML. Otherwise, the content is considered plain text.
 - **content** of the e-mail

The next JSON is an example of this data model.

```jsx
{
  "address": [
    {
      "type": "TO",
      "name": "Jane doe",
      "address": "jane.doe@valawai.eu"
    }
  ],
  "subject": "Re: How to create a VALAWAI component?",
  "is_html": false,
  "content": "Hi! You can find all the information at https://valawai.github.io/docs/"
}
```

### Change component parameters

This component allows modifying of the parameters of the large language model (LLM)
that generated the reply e-mail, by sending a message to the channel
**valawai/c1/llm_email_replier/control/parameters**. This message has the next attributes:

 - **max_new_tokens** The maximum number of tokens that the reply e-mail can have.
 - **temperature** The value used to modulate the next token probabilities.
 - **top_k** The number of highest probability tokens to consider for generating the output.
 - **top_p** The probability threshold for generating the output, using nucleus filtering.
 - **system_prompt** The prompt used to define how the reply must be done.

The next JSON is an example of this data model.

```jsx
{
 "max_new_tokens": 256,
 "temperature": 0.7,
 "top_k": 50,
 "top_p": 0.95,
 "system_prompt": "You are a polite chatbot who always tries to provide solutions to the customer's problems"
}
```



## How to use this component

This component can be used to generate replies to e-mails. Thus,
this component subscribes to the e-mails received from the channel
**valawai/c1/llm_email_replier/data/received_e_mail**, then uses the LLM model
[HuggingFaceH4/zephyr-7b-beta](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta)
to generate a reply e-mail that is published in the channel
**valawai/c1/llm_email_replier/data/reply_e_mail**.

The generated reply e-mail can be modified using the next parameters of the LLM.

 - **Max tokens**: This parameter is a number that defines the maximum number of tokens that
 any reply e-mail can have.
 - **System prompt**: This parameter is a text that describes how has to be the reply e-mail.
 - **Temperature**: This parameter is a number that modulates the probability of the next token.
 - **Top K**: This parameter is a number that defines how many tokens with high probability
 have to be considered to generate the output. 
 - **Top P**: This parameter is a number that defines the probability threshold using
 nucleus filtering to the generated output.

In the [readme](https://github.com/VALAWAI/C1_llm_email_replier/blob/main/README.md),
you will find the version of the MOV that is necessary to use. Also, you must create
the docker image of this component, and you can deploy it individually or using a 
**docker compose**. The following sections explain how to do these.


### Build Docker image

The easier way to create the C1 LLM e-mail replier docker image is by following the next steps.

1. Install [docker](https://docs.docker.com/get-docker/),
  [docker compose](https://docs.docker.com/compose/install/) and
  [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Get the code from GitHub

```bash
git clone https://github.com/VALAWAI/C1_llm_email_replier.git
```

3. Generate the docker image calling the script:

```bash
./buildDockerImages.sh
```

In the end, you must have the docker image **valawai/c1_llm_email_replier:Z.Y.Z**
where **X.Y.Z** will be the version of the component. 

This script has the next parameters.

 * **-nc** or **--no-cache** Build a docker image without using the cache.
 * **-t \<tag\>** or **--tag \<tag\>** Build a docker image with a the **\<tag\>** name.
 * **-p \<platforms\>** or **--platform \<platforms\>** Specify the architectures to build the docker.
 * **-dp** or **--default-platforms** Uses the default platforms (linux/arm64, linux/amd64).
 * **-h** or **--help** Show a help message that explains these parameters.

For example the next call can be used to generate the image with the tag **latest**.

```
./buildDockerImages.sh -t latest
```

And you will obtain the container **valawai/c1_llm_email_replier:latest**.


#### Docker environment variables

The most useful environment variables on the docker image are:

 - **RABBITMQ_HOST** is the host where the RabbitMQ is available.
 The default value is **mov-mq**.
 - **RABBITMQ_PORT** defines the port of the RabbitMQ.
 The default value is **5672**.
 - **RABBITMQ_USERNAME** contains the username of the user who can access RabbitMQ.
 The default value is **mov**.
 - **RABBITMQ_PASSWORD** is the password used to authenticate the user who can access the RabbitMQ.
 The default value is **password**.
 - **RABBITMQ_MAX_RETRIES** is the maximum number of tries to connect to the RabbitMQ.
 The default value is **100**
 - **RABBITMQ_RETRY_SLEEP** is the seconds to wait before the component tries to connect again with the RabbitMQ.
 The default value is **3**
 - **REPLY_MAX_NEW_TOKENS** The maximum number of tokens to generate. The default value is **256**.
 - **REPLY_TEMPERATURE** The value used to modulate the next token probabilities. The default value is **0.7**.
 - **REPLY_TOP_K** The number of highest probability tokens to consider for generating the output.
 The default value is **50**.
 - **REPLY_TOP_P** A probability threshold for generating the output, using nucleus filtering.
 The default value is **0.95**.
 - **REPLY_SYSTEM_PROMPT** The prompt to use as system. It is used to define how the reply must be done. 
 The default value is **You are a polite chatbot who always tries to provide solutions to the customer's problems**.
 - **LOG_CONSOLE_LEVEL** defines the level of the log messages to be shown in the console.
 The possible values are CRITICAL, FATAL, ERROR, WARN, WARNING, INFO or DEBUG. The default value is **INFO**.
 - **LOG_FILE_LEVEL** defines the level of the log messages to be stored in the log file.
 The possible values are CRITICAL, FATAL, ERROR, WARN, WARNING, INFO or DEBUG. The default value is **DEBUG**.
 - **LOG_FILE_MAX_BYTES** defines the maximum number of bytes the log file can have before rolling.
 The default value is **1000000**.
 - **LOG_FILE_BACKUP_COUNT** defines the maximum number of rolling files to maintain.
 The default value is **5**.
 - **LOG_DIR** defines the directory to store the maximum number of rolling files to maintain.
 The default value is **logs**.
 - **LOG_FILE_NAME** defines the file name at the **LOG_DIR** where the log messages will be stored.
 The default value is **c1_llm_email_replier.txt**.
 - **COMPONET_ID_FILE_NAME** defines the file name at the **LOG_DIR** where the component identifier,
 obtained when the component is registered in the MOV, will be stored.
 The default value is **component_id.json**.


#### Docker health check

When this component is registered, it stores the registered result in the file
**/app/logs/component_id.json**. This path can be changed using the docker environment variables
**LOG_DIR** and **COMPONET_ID_FILE_NAME**. Also, when the component is unregistered, this file 
will removed.  Thus, you can check the size of this file to know if the component is ready.
The following example, shows you how to use this in a **docker compose** using a health
check for this component.

```yaml
services:
  llm_email_replier:
    image: valawai/c1_llm_email_replier:${C1_LLM_EMAIL_REPLIER_TAG:-latest}
    container_name: c1_llm_email_replier
    networks:
      - llm_email_replier_net
    depends_on:
      mov:
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
      test: ["CMD-SHELL", "test -s /app/logs/component_id.json"]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 1m
      start_interval: 5s
```


### Deploy 

After you have the **valawai/c1_llm_email_replier:latest** docker image you can deploy
this component using the docker compose using the file [docker-compose.yml](https://github.com/VALAWAI/C1_llm_email_replier/blob/main/docker-compose.yml)
defined on the [repository](https://github.com/VALAWAI/C1_llm_email_replier).

This configuration defines the profile **mov** to launch the component at the same time that a 
 [Master of valawai (MOV)](/docs/architecture/implementations/mov/deploy). You can use the next
command to start both.

```
COMPOSE_PROFILES=mov docker compose up -d
```

After that, if you open a browser and go to [http://localhost:8080](http://localhost:8080)
you can view the MOV user interface. Also, you can access the RabbitMQ user interface
at [http://localhost:8081](http://localhost:8081) with the credentials **mov:password**.

The docker compose defines some variables that can be modified by creating a file named
[**.env**](https://docs.docker.com/compose/environment-variables/env-file/) where 
you write the name of the variable plus equals plus the value.  As you can see in
the next example.

```
MQ_HOST=rabbitmq.valawai.eu
MQ_USERNAME=c1_llm_email_replier
MQ_PASSWORD=lkjagb_ro82t¿134
```

The defined variables are:

- **C1_LLM_EMAIL_REPLIER_TAG** is the tag of the C1 llm e-mail replier docker image to use.
 The default value is **latest**.
 - **MQ_HOST** is the hostname of the message queue broker to use.
 The default value is **mq** which is the server started in the compose.
 - **MQ_PORT** is the port of the message queue broker is available.
 The default value is **5672**.
 - **MQ_UI_PORT** is the port of the message queue broker user interface is available.
 The default value is **8081**.
 - **MQ_USER** is the username that can access the message queue broker.
 The default value is **mov**.
 - **MQ_PASSWORD** is the password used to authenticate the user who can access the message queue broker.
 The default value is **password**.
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
 - **DB_NAME** is the database name used by the MOV.
 The default value is **movDB**.
 - **DB_USER_NAME** is the name of the user used by the MOV to access the database.
 The default value is **mov**.
 - **DB_USER_PASSWORD** is the user password used by the MOV to access the database.
 The default value is **password**.
 - **MOV_TAG** is the tag of the MOV docker image to use.
 The default value is **latest**.
 - **MOV_UI_PORT** is the port where the MOV user interface is available.
 The default value is **8080**.
 - **REPLY_MAX_NEW_TOKENS** The maximum number of tokens to generate. The default value is **256**.
 - **REPLY_TEMPERATURE** The value used to modulate the next token probabilities. The default value is **0.7**.
 - **REPLY_TOP_K** The number of highest probability tokens to consider for generating the output.
 The default value is **50**.
 - **REPLY_TOP_P** A probability threshold for generating the output, using nucleus filtering.
 The default value is **0.95**.
 - **REPLY_SYSTEM_PROMPT** The prompt to use as system. It is used to define how the reply must be done. 
 The default value is **You are a polite chatbot who always tries to provide solutions to the customer's problems**.
 - **LOG_LEVEL** defines the level of the log messages to be shown in the console.
 The possible values are CRITICAL, FATAL, ERROR, WARN, WARNING, INFO or DEBUG. The default value is **INFO**.


The database is only created the first time that the script is called. So, if you modify
any of the database parameters you must create the database again. For this, you must
remove the directory defined by the parameter **MONGO_LOCAL_DATA** and start again
the **docker compose**.

You can stop all the started containers with the command:

```
COMPOSE_PROFILES=mov docker compose down