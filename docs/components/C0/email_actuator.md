# E-mail actuator

The C0 e-mail actuator component sends e-mails outside the VALAWAI infrastructure.
Thus, this component converts the messages  received into the channel
**valawai/c0/email_actuator/data/e_mail** to e-mails that send to a server.


## Services

The services of this component are described in the [asyncapi](https://raw.githubusercontent.com/VALAWAI/C0_email_actuator/main/asyncapi.yaml)
that you can find on the [source code of this component](https://github.com/VALAWAI/C0_email_actuator).


### Send e-mail

This component converts any message received on the channel **valawai/c0/email_actuator/data/e_mail**
into an email that will be sent to a server. This message has the next attributes:

 - **address** the information from which the message is, and to which the message is sent.
 Each is an object with the address type (TO, CC or BCC), the name of the user, and the e-mail address.
 - **subject** of the e-mail.
 - **is_html** is true if the content is HTML. Otherwise, the content is considered plain text.
 - **content** of the e-mail

The next JSON is an example of this data model.

```jsx
{
  "address": [
    {
      "type": "TO",
      "address": "info@valawai.eu"
    },
    {
      "type": "CC",
      "name": "Jane doe",
      "address": "jane.doe@valawai.eu"
    }
  ],
  "subject": "How to publish a component?",
  "is_html": false,
  "content": "Hi! Could you please inform me about the necessary steps to have a component available in the VALAWAI?"
}
```


## How to use this component

This component can be used to send e-mails. Thus, it can provide information to a user of
the value awareness application through an e-mail. These e-mails are generated from the messages
that this component receives on the channel **valawai/c0/email_actuator/data/e_mail**,
and delivered to an e-mail server for its publication. In this case, the [Master of VALAWAI (MOV)](/toolbox/mov)
will be responsible for redirecting the published messages by C1 components to this component and converted
to e-mails to be delivered to the users. In the [readme](https://github.com/VALAWAI/C0_email_actuator/blob/main/README.md),
you will find the version of the MOV that is necessary to use. Also, you must create the docker image of this component,
and you can deploy it individually or using a docker-compose. The following sections explain how to do these.


### Build Docker image

The easier way to create the C0 E-mail actuator docker image is by following the next steps.

1. Install [docker](https://docs.docker.com/get-docker/),
  [docker compose](https://docs.docker.com/compose/install/) and
  [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2. Get the code from GitHub

```bash
git clone https://github.com/VALAWAI/C0_email_actuator.git
```

3. Generate the docker image calling the script:

```bash
./buildDockerImages.sh
```

At the end you must have the docker image **valawai/c0_email_actuator:Z.Y.Z**
where **X.Y.Z** will be the version of the component. If you want to have
the image with another tag for example **latest** you must call the script
with this tag as a parameter, for example:

```bash
./buildDockerImages.sh latest
```

And you will obtain the image **valawai/c0_email_actuator:latest**.

The most useful environment variables on the docker image are:

 - **RABBITMQ_HOST** is the host where the RabbitMQ is available.
 The default value is **mov-mq**.
 - **RABBITMQ_PORT** defines the port of the RabbitMQ.
 The default value is **5672**.
 - **RABBITMQ_USERNAME** contains the user's name that can access the RabbitMQ.
 The default value is **mov**.
 - **RABBITMQ_PASSWORD** is the password used to authenticate the user who can access the RabbitMQ.
 The default value is **password**.
 - **LOG_LEVEL** defines the level of the log messages to be stored.
 The default value is **INFO**.
 - **QUARKUS_MAILER_FROM** defines the address that specifies from which the e-mails will come.
 The default value is **no-reply@valawai.eu**.
 - **QUARKUS_MAILER_HOST** the host where the e-mail server is.
 - **QUARKUS_MAILER_PORT** is the port where the e-mail server is listening.
 - **QUARKUS_MAILER_USERNAME** is the name of the user who will connect to the e-mail server.
 The default value is **no-reply@valawai.eu**.
 - **QUARKUS_MAILER_PASSWORD** is the credential to identify the user that can connect to the e-mail server.
 The default value is **password**.
 
Other variables depend on the type of secure connection to the e-mail server. For example,
you must define the next variables to  connect to GMail with **STARTTLS**: 

```
QUARKUS_MAILER_AUTH_METHODS=DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN
QUARKUS_MAILER_FROM=YOUREMAIL@gmail.com
QUARKUS_MAILER_HOST=smtp.gmail.com
QUARKUS_MAILER_PORT=587
QUARKUS_MAILER_START_TLS=REQUIRED
QUARKUS_MAILER_USERNAME=YOUREMAIL@gmail.com
QUARKUS_MAILER_PASSWORD=YOURGENERATEDAPPLICATIONPASSWORD
```

Or with **TLS/SSL**:

```
QUARKUS_MAILER_AUTH_METHODS=DIGEST-MD5 CRAM-SHA256 CRAM-SHA1 CRAM-MD5 PLAIN LOGIN
QUARKUS_MAILER_FROM=YOUREMAIL@gmail.com
QUARKUS_MAILER_HOST=smtp.gmail.com
QUARKUS_MAILER_PORT=465
QUARKUS_MAILER_TLS=true
QUARKUS_MAILER_USERNAME=YOUREMAIL@gmail.com
QUARKUS_MAILER_PASSWORD=YOURGENERATEDAPPLICATIONPASSWORD
```

On the [Quarkus mail configuration](https://quarkus.io/guides/mailer-reference#configuration-reference) documentation you can read more about the variables to configure the connection to the e-mail server and also some examples to the [most common](https://quarkus.io/guides/mailer-reference#popular) e-mail servers.


### Deploy 

After you have the **valawai/c0_email_actuator:Z.Y.Z** docker image you can deploy directly using Docker,
but you must define at least the environment variables to connect the message queue where
the [Master of valawai (MOV)](/tutorials/mov) is deployed and the parameters to the server 
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

