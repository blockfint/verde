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

#====== In case script is run from other directory =======
cd `dirname $0`
scriptdir=$(pwd)
#=========================================================

cd "$scriptdir/blockchain"
npm install

cd "$scriptdir/idp"
npm install

cd "$scriptdir/rp"
npm install

echo 'All installation done'
