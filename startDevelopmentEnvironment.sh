#!/bin/bash
if [ -f /.dockerenv ]; then
   echo "You can not start the development environment inside a docker container"
else
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
	pushd $DIR >/dev/null
	DOCKER_BUILDKIT=1 docker build -f docker/dev/Dockerfile -t valawai/docs:dev .
	if [ $? -eq 0 ]; then
		docker run --rm --name docs_dev -v /var/run/docker.sock:/var/run/docker.sock -v ${PWD}:/app -p 3000:3000 -it valawai/docs:dev /bin/bash
		./stopDevelopmentEnvironment.sh
	fi
	popd >/dev/null
fi