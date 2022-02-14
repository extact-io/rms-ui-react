#!/bin/bash -x
if [ -e /home/ec2-user/rmsServiceClient ]; then
  echo "[rmsServiceClient]DELETE MODULES"
  rm -rf /home/ec2-user/rmsServiceClient
fi
exit $?
