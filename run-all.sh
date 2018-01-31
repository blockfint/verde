#!/bin/bash
set -e
trap "kill 0" EXIT

if [ "$1" == "" ]; then
  IDP_COUNT=1
  echo "You can pass number of IDP as first argument, Default is 1"
else
  IDP_COUNT=$1
fi

tmpFile="/tmp/nationalId_demo.log"
echo 'Starting ganache ...'
echo "Log file for ganache is located at $tmpFile"

ganache-cli --unlock 0,1 > $tmpFile &
sleep 2 #wait for ganache to start

tmpArr=($(cat $tmpFile | sed '14q;d'))
RP_ADDR=${tmpArr[1]}

#=================================================================

echo "Deploying contracts ..."
cd $(dirname "${BASH_SOURCE[0]}")/blockchain
rm -f ./build/contracts/*.json
MIGRATE=$(truffle migrate)

TMP=($(echo "$MIGRATE" | grep "Requests:"))
REQUESTS_CONTRACT_ADDR=${TMP[1]}

#TMP=($(echo "$MIGRATE" | grep "Condition:"))
#CONDITION_CONTRACT_ADDR=${TMP[1]}
#TMP=($(echo "$MIGRATE" | grep "User:"))
#USER_CONTRACT_ADDR=${TMP[1]}

TMP=($(echo "$MIGRATE" | grep "UserDirectory:"))
DIRECTORY_CONTRACT_ADDR=${TMP[1]}

#=================================================================

echo "Building node apps ..."
npm run build

#=================================================================

echo "Strating IDP ..."
cd ../idp/
while [ $IDP_COUNT -gt 0 ]; do
  tmpArr=($(cat $tmpFile | sed "$(($IDP_COUNT + 5))q;d"))
  IDP_ADDR=${tmpArr[1]}
  IDP_COUNT=$(($IDP_COUNT - 1))
  
  #CONDITION_CONTRACT_ADDR=$CONDITION_CONTRACT_ADDR \
  #USER_CONTRACT_ADDR=$USER_CONTRACT_ADDR \
  SERVER_PORT=$(($IDP_COUNT + 8181)) \
  IDP_ADDR=$IDP_ADDR REQUESTS_CONTRACT_ADDR=$REQUESTS_CONTRACT_ADDR \
  DIRECTORY_CONTRACT_ADDR=$DIRECTORY_CONTRACT_ADDR \
  bash -c "npm start > /tmp/idp_$(($1 - $IDP_COUNT)).log &"
  echo "$IDP_COUNT more IDP to start"
done

#=================================================================

echo "Starting RP ..."
cd ../rp/
RP_ADDR=$IDP_ADDR REQUESTS_CONTRACT_ADDR=$REQUESTS_CONTRACT_ADDR \
DIRECTORY_CONTRACT_ADDR=$DIRECTORY_CONTRACT_ADDR \
bash -c 'npm start > /tmp/rp.log &'

#=================================================================

echo 'All started'
echo 'log file for IDP and RP is located at /tmp/idp_{Number}.log and /tmp/rp.log'
echo 'Please open web browser at http://localhost:8080 for RP'

if [ "$1" == "" ]; then
  echo "Please open web browser at http://localhost:8181 for IDP"
else
  echo "Please open web browser at http://localhost:{PORT}"
  echo "PORT for IDP is 8181-$(($1 + 8180))"
fi

wait