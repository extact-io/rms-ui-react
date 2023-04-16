#!/bin/bash
STEP="all"
case "$1" in
  "gen-openapi")
    STEP="$1"
    ;;
  "gen-client")
    STEP="$1"
    ;;
  "replace")
    STEP="$1"
    ;;
esac


RMS_HOME="/c/reps/msa-rms"
RMS_SERVER_HOME="${RMS_HOME}/msa-rms-apigateway"
GEN_API_HOME="/c/VSCode_workspaces/rms-generated-client-js"

cd $RMS_SERVER_HOME
./maven-all.sh gen-openapi
if [ $? -ne 0 ]; then
  echo "gen-openapi fail!!!"
  exit $?
fi

if [ "$STEP" = "gen-openapi" ]; then
  echo "### end ${STEP} ###"
  exit 0
fi

#cd $RMS_HOME
if [ -f ./target/generated-oas/openapi.yml ]; then
  if [ ! -d ./temp ]; then
    mkdir ./temp
  fi
  cp -f ./target/generated-oas/openapi.yml ./temp
  OAS_FILE_PATH="temp/openapi.yml"
fi

mvn -Pgen-js-client clean openapi-generator:generate -Dopenapi.file.path=$OAS_FILE_PATH
if [ $? -ne 0 ]; then
  echo "gen-client fail!!!"
  exit $?
fi

if [ "$STEP" = "gen-client" ]; then
  echo "### end ${STEP} ###"
  exit 0
fi

if [ ! -e $GEN_API_HOME ]; then
  echo "${GEN_API_HOME} not exist!!"
  exit 1;
fi
rm -rf ${GEN_API_HOME}/*
cp -rf ./target/generated-sources/openapi/. $GEN_API_HOME
cp -f $OAS_FILE_PATH $GEN_API_HOME
rm -rf ./temp
if [ "$STEP" = "replace" ]; then
  echo "### end ${STEP} ###"
  exit 0
fi

cd $GEN_API_HOME
npm install

echo "### end ${STEP} ###"
