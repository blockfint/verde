#!/bin/bash

set -e

trap "kill 0" EXIT

tmpFile="/tmp/nationalId_demo.log"
echo "Log file for ganache is located at $tmpFile"
echo 'Starting...'

ganache-cli --unlock 0,1 > $tmpFile &
sleep 2 #wait for ganache to start

tmpArr=($(cat $tmpFile | sed '5q;d'))
IDP_ADDR=${tmpArr[1]}

tmpArr=($(cat $tmpFile | sed '6q;d'))
RP_ADDR=${tmpArr[1]}

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

npm run build

cd ../idp/

#CONDITION_CONTRACT_ADDR=$CONDITION_CONTRACT_ADDR USER_CONTRACT_ADDR=$USER_CONTRACT_ADDR \
IDP_ADDR=$IDP_ADDR REQUESTS_CONTRACT_ADDR=$REQUESTS_CONTRACT_ADDR \
DIRECTORY_CONTRACT_ADDR=$DIRECTORY_CONTRACT_ADDR bash -c 'npm start > /tmp/idp.log &'

cd ../rp/
RP_ADDR=$IDP_ADDR REQUESTS_CONTRACT_ADDR=$REQUESTS_CONTRACT_ADDR \
DIRECTORY_CONTRACT_ADDR=$DIRECTORY_CONTRACT_ADDR bash -c 'npm start > /tmp/rp.log &'

echo 'Started'
echo 'log file for IDP and RP is located at /tmp/idp.log and /tmp/rp.log'
echo 'Please open web browser at http://localhost:8080 for RP'
echo 'Please open web browser at http://localhost:8181 for IDP'

wait