#!/bin/bash

set -e

NPM_CHECK=$(which npm)
NODE_CHECK=$(which node)

if [ "$NPM_CHECK" == "" ] || [ "$NODE_CHECK" == "" ]; then
  echo 'Please install nodejs and npm'
  exit 1
fi

npm install -g ganache-cli
npm install -g truffle

curdir=`pwd`
cd $curdir/blockchain
npm install

cd $curdir/idp
npm install

cd $curdir/rp
npm install

echo 'All installation done'
