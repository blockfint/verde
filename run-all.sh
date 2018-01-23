#!/bin/bash

set -e

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
MIGRATE=$(truffle migrate)
TMP=($(echo "$MIGRATE" | grep "Requests:"))
CONTRACT_ADDR=${TMP[1]}

TMP=($(echo "$MIGRATE" | grep "Condition:"))
CONDITION_ADDR=${TMP[1]}

TMP=($(echo "$MIGRATE" | grep "User:"))
USER_ADDR=${TMP[1]}
npm run build

cd ../idp/
IDP_ADDR=$IDP_ADDR CONTRACT_ADDR=$CONTRACT_ADDR bash -c 'npm start > /tmp/idp.log &'

cd ../rp/
RP_ADDR=$IDP_ADDR CONDITION_ADDR=$CONDITION_ADDR USER_ADDR=$USER_ADDR CONTRACT_ADDR=$CONTRACT_ADDR bash -c 'npm start > /tmp/rp.log &'

echo 'Started'
echo 'log file for IDP and RP is located at /tmp/idp.log and /tmp/rp.log'
echo 'Please open web browser at http://localhost:8080 for RP'
echo 'Please open web browser at http://localhost:8181 for IDP'
