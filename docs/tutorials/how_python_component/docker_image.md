---
sidebar_position: 5
---
# Dockerize the component

If you have followed the [skeleton](/docs/tutorials/how_python_component#generate-the-project-skeleton) described
at the beginning of this tutorial, you only have to create a file named **Dokerfile** with the following content.
Remember to change **CX_name** to the name of your component.  

```dokerfile
# syntax=docker/dockerfile:experimental
FROM python:3.9.19-bullseye

RUN apt-get -qy update && \
    apt-get -qy full-upgrade && \
    apt-get -qy install pip
	
WORKDIR /app

COPY setup.py .
COPY requirements.txt .
COPY LICENSE .
COPY *.md .
COPY asyncapi.yaml .
COPY CX_name/ CX_name/

RUN pip install -e .

ENV RABBITMQ_HOST=mov-mq
ENV RABBITMQ_PORT=5672.
ENV RABBITMQ_USERNAME=mov.
ENV RABBITMQ_PASSWORD=password
ENV RABBITMQ_MAX_RETRIES=100
ENV RABBITMQ_RETRY_SLEEP=3

ENV LOG_CONSOLE_LEVEL=INFO
ENV LOG_FILE_LEVEL=DEBUG
ENV LOG_FILE_MAX_BYTES=1000000
ENV LOG_FILE_BACKUP_COUNT=5

CMD ["python", "CX_name"]
```

After that, you can create the docker image using the following command.

```bash
docker build .
```

You can automatically create the image tagged with the version of the component using the following
script code.

```bash
#!/bin/bash
if ! docker stats --no-stream >/dev/null 2>&1; then
    echo "Docker does not seem to be running, run it first and retry"
    exit 1
else
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
	pushd $DIR > /dev/null
	VERSION=$(grep --max-count=1 "version='" setup.py  | awk -F "'" '{ print $2 }')
	DOCKER_ARGS=""
	if [ "no-cache" = "$1" ];
	then
		DOCKER_ARGS="$DOCKER_ARGS --no-cache"
		TAG=${2:-$VERSION}
	else
		TAG=${1:-$VERSION}
	fi
	pushd $DIR > /dev/null

	DOCKER_BUILDKIT=1 docker build $DOCKER_ARGS -f Dockerfile -t valawai/cx_name:$TAG .
	popd > /dev/null
fi
```

The generated docker image can be configured using the following properties.

* __RABBITMQ_HOST__ is the host where the RabbitMQ is available. The default value is __mov-mq__.
* __RABBITMQ_PORT__ defines the port of the RabbitMQ. The default value is __5672__.
* __RABBITMQ_USERNAME__ contains the user's name that can access the RabbitMQ. The default value is __mov__.
* __RABBITMQ_PASSWORD__ is the password to authenticate the user that can access the RabbitMQ. The default value is __password__.
* __RABBITMQ_MAX_RETRIES__ represent the number of tries to connect to the RabbitMQ. The default value is __100__.
* __RABBITMQ_RETRY_SLEEP__ is the seconds that have to wait between retry to connect to the RabbitMQ. The default value is __3__.
* __LOG_CONSOLE_LEVEL__ defines the level of the log messages on the console. The default value is __INFO__.
* __LOG_FILE_LEVEL__ defines the level of the log messages to be stored in the file. The default value is __DEBUG__.
* __LOG_FILE_MAX_BYTES__ defines the maximum length, in bytes, for the log file. The default values is __1000000__
* __LOG_FILE_BACKUP_COUNT__ defines the maximum number of log files to maintain. the default value is __5__.


All this information has to be used when you define the example of
the docker-compose.yml to deploy the component.
