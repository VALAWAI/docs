#!/bin/bash

# Retrieve the latest stable MOV release
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/MOV.git

# Navigate to the MOV directory
cd MOV

# Launch the MOV (and build the Docker container if needed)
./runMOV.sh