#!/bin/bash

# Define the components and their repositories
components=(
    "MOV"
    "C0_patient_treatment_ui"
    "C1_nit_protocol_manager"
    "C2_treatment_autonomy_valuator"
    "C2_treatment_beneficence_valuator"
    "C2_treatment_justice_valuator"
    "C2_treatment_nonmaleficence_valuator"
)

function docker_git () {
    (docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git "$@")
}

# Iterate through the components
for component_name in "${components[@]}"; do

    if [ -d "$component_name" ]; then
        echo "Directory $component_name exists. Checking for updates."
        pushd "$component_name" >/dev/null
        docker_git pull origin main || { echo "Error updating $component_name"; exit 1; }

    else
        echo "Directory $component_name does not exist. Cloning repository."
        component_repo="https://github.com/VALAWAI/${component_name}.git"
        docker run -ti --rm -v "${HOME}:/root" -v "$(pwd):/git" alpine/git clone $component_repo
        pushd "$component_name" >/dev/null
    fi

    lowercase_component_name=$(echo "$component_name" | tr 'A-Z' 'a-z')
	image_name="valawai/${lowercase_component_name}:latest"
    if docker images -q $image_name >/dev/null; then

		image_timestamp=$(docker inspect -f '{{ .Created }}' $image_name) 
	    latest_commit_timestamp=$(docker_git shortlog -1 --since=\"$image_timestamp\")
    	popd >/dev/null

        if [ $(echo "$latest_commit_timestamp" | wc -l) -gt 1 ] ; then
            echo "Docker image $image_name is older than last commit. Rebuilding."
            build_image=true
        else
            echo "Docker image $image_name is up to date. Skipping build."
            build_image=false
        fi
    else
        echo "Docker image $image_name does not exist. Building image."
        build_image=true
    fi


    if [[ "$build_image" == true ]]; then
        pushd "$component_name" >/dev/null
        ./buildDockerImages.sh -t latest || { echo "Error building $component_name"; exit 1; }
        popd >/dev/null
        echo "Built Docker image for $component_name"
    fi

done

echo "Finished processing all components."