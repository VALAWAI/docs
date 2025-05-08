---
sidebar_position: 4
---

# Dockerize the component

As stipulated in the [component specification](/docs/architecture/implementations/component#deployment),
containerization via Docker is the recommended methodology for component deployment, often managed 
through a `docker-compose.yml` configuration file. This section demonstrates how to create a Docker image 
and subsequently deploy it using Docker Compose.

The creation of a Docker image necessitates the definition of a `Dockerfile`, which encapsulates 
a set of directives for image construction. The subsequent code block presents an example 
of a `Dockerfile` tailored for a Python code component named "echo" (type c1), adhering 
to the prescribed [file structure](/docs/tutorials/how_python_component/skeleton#base-structure).

```docker
FROM python:3-slim
	
WORKDIR /app

COPY pyproject.toml .
COPY LICENSE .
COPY *.md .
COPY asyncapi.yaml .
COPY src/ src/
RUN pip install -e .

CMD ["python", "src/c1_echo"] 
```

It's important to note that this basic Dockerfile omits configurations for environment variables 
(e.g., RabbitMQ connection details) and health check mechanisms. A more comprehensive example 
incorporating these features can be found in 
the [Echo example](/docs/tutorials/how_python_component/example#defining-dokerfile).

The directives within this `Dockerfile` are as follows:

 - `FROM python:3-slim`: Specifies the base Python 3 image.
 - `WORKDIR /app`: Sets /app as the working directory.
 - `COPY ...`: Transfers project files (configuration, license, documentation, API specification) to the container.
 - `COPY src/ src/`: Copies the component's source code.
 - `RUN pip install -e .`: Installs dependencies from `pyproject.toml`.
 - `CMD ["python", "src/c1_echo"]`: Defines the command to run the component.

Following the creation of the `Dockerfile`, the Docker image can be built using the following command:

```bash
docker build -t c1_echo:latest .
```

To deploy the generated image, it is necessary to define its execution environment using 
a `docker-compose.yml` configuration file. This file allows for the deployment of the component's Docker 
image alongside its dependencies, such as databases, RabbitMQ, or the Master Of VALAWAI. The following 
code provides a minimal example for deploying a component named C1_echo without external dependencies.

```yaml
services:
  echo:
    image: valawai/c1_echo:latest
    container_name: c1_echo
```

After defining the `docker-compose.yml` file, the component can be deployed using the following command:

```bash
docker compose up -d
```

This represents the most basic definition of a `docker-compose.yml` file for deploying a single component. 
However, it lacks configurations for specifying the RabbitMQ connection or defining different profiles 
to also launch the MOV, as demonstrated in the more detailed 
[Echo example](/docs/tutorials/how_python_component/example#defining-docker-composeyaml).
