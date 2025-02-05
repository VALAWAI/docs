#!/bin/bash

# Get the MOV code and build container
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/MOV.git
pushd MOV>/dev/null
./buildDockerImages.sh -t latest
popd >/dev/null

# Get the C0 patient treatment ui code and build container
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/C0_patient_treatment_ui.git
pushd C0_patient_treatment_ui>/dev/null
./buildDockerImages.sh -t latest
popd >/dev/null

# Get the C1 nit protocol manager code and build container
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/C1_nit_protocol_manager.git
pushd C1_nit_protocol_manager>/dev/null
./buildDockerImages.sh -t latest
popd >/dev/null

# Get the C2 treatment autonomy valuator code and build container
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/C2_treatment_autonomy_valuator.git
pushd C2_treatment_autonomy_valuator>/dev/null
./buildDockerImages.sh -t latest
popd >/dev/null

# Get the C2 treatment beneficence valuator code and build container
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/C2_treatment_beneficence_valuator.git
pushd C2_treatment_beneficence_valuator>/dev/null
./buildDockerImages.sh -t latest
popd >/dev/null

# Get the C2 treatment justice valuator code and build container
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/C2_treatment_justice_valuator.git
pushd C2_treatment_justice_valuator>/dev/null
./buildDockerImages.sh -t latest
popd >/dev/null

# Get the C2 treatment nonmaleficence valuator code and build container
docker run -ti --rm -v ${HOME}:/root -v $(pwd):/git alpine/git clone https://github.com/VALAWAI/C2_treatment_nonmaleficence_valuator.git
pushd C2_treatment_nonmaleficence_valuator>/dev/null
./buildDockerImages.sh -t latest
popd >/dev/null
