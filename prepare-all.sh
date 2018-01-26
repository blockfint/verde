#!/bin/bash

set -e

NPM_CHECK=$(which npm)
NODE_CHECK=$(which node)

if [ "$NPM_CHECK" == "" || "$NODE_CHECK" == "" ]; then
  echo 'Please install nodejs and npm'
  exit 1
fi

npm install -g ganache-cli
npm install -g truffle

cd $(dirname "${BASH_SOURCE[0]}")/blockchain
npm install

cd $(dirname "${BASH_SOURCE[0]}")/idp
npm install

cd $(dirname "${BASH_SOURCE[0]}")/rp
npm install