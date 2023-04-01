#!/bin/bash

# This shell script is for those who want to to generate a Model / Controller / Service files containing
# all the respective files. So you don't have to create everything one by one. 

ENTITY_NAME=$1

# Creating the main entity inside api folder
cd ../src/api/ && mkdir -p ${ENTITY_NAME}

cd ${ENTITY_NAME}

# Creating the main MCS folders and its files
mkdir -p controller
touch controller/${ENTITY_NAME}.controller.ts

mkdir -p model
touch model/${ENTITY_NAME}.model.ts

mkdir -p service
touch service/${ENTITY_NAME}.service.ts

# Going back again in root folder
cd ..