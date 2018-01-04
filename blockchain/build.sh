#!/bin/bash
set -e

./node_modules/.bin/babel index.js -d ./build/ --source-maps inline
./node_modules/.bin/babel lib -d ./build/lib --source-maps inline
echo 'compiling contracts'
truffle compile
echo 'OK'
