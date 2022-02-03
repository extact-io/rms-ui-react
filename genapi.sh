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


RMS_HOME="/c/reps/rms"
RMS_SERVER_HOME="${RMS_HOME}/rms-service-server"

cd $RMS_SERVER_HOME
./startup.sh generateOas
if [ $? -ne 0 ]; then
  echo "generateOas fail!!!"
  exit $?
fi

if [ "$STEP" = "gen-openapi" ]; then
  echo "### end ${STEP} ###"
  exit 0
fi

cd $RMS_HOME
mvn -PgenJsClient clean openapi-generator:generate

if [ "$STEP" = "gen-client" ]; then
  echo "### end ${STEP} ###"
  exit 0
fi

GEN_API_HOME="/c/VSCode_workspaces/genapi"
if [ ! -e $GEN_API_HOME ]; then
  echo "${GEN_API_HOME} not exist!!"
  exit 1;
fi
rm -rf ${GEN_API_HOME}/*
cp -rf ./target/generated-sources/openapi/. $GEN_API_HOME
if [ "$STEP" = "replace" ]; then
  echo "### end ${STEP} ###"
  exit 0
fi

cd $GEN_API_HOME
npm install

echo "### end ${STEP} ###"
