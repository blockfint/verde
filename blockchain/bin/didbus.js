#!/usr/bin/env node
import { default as yargs } from 'yargs';
import { default as initializeLib } from '../index';

const RPC_HOST = 'localhost';
const RPC_PORT = '8545';
const USER_NAME = '0x3355';
const REQUEST_STRING = 'Pay for Blockfint ICO';
const IDP_COUNT = 1;

var args = yargs
  .command('request', 'Create a request', (yargs) => {
    return yargs.option('host', {
      description: 'HTTP host of Ethereum node',
      alias: 'h',
      default: RPC_HOST
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: RPC_PORT
    })
    .option('ra', {
      description: 'The requests contract address',
      type: 'string'
    })
    .option('rp', {
      description: 'The RP account address to create request',
      type: 'string'
    })
    .option('name', {
      description: 'The user name you want to request for authentication',
      alias: 'n',
      default: USER_NAME,
      type: 'string'
    })
    .demand(['ra', 'rp']);
  })
  .command('response', 'Response to the request', (yargs) => {
    return yargs.option('host', {
      description: 'HTTP host of Ethereum node',
      alias: 'h',
      default: RPC_HOST
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: RPC_PORT
    })
    .option('rid', {
      description: 'The request ID',
      type: 'string'
    })
    .option('ra', {
      description: 'The requests contract address',
      type: 'string'
    })
    .option('idp', {
      description: 'The IDP account address to response to the request',
      type: 'string'
    })
    .demand(['rid', 'ra', 'idp']);
  })
  .help()
  .usage('Usage: $0 [command] [options]');

let { argv } = args;

if (argv._.length === 0) {
  args.showHelp();
}

let command = argv._[0];

if (command === 'request') {
  console.log('CREATE ARGV' + JSON.stringify(argv));
  let { name, host, port, rp, ra } = argv;
  let requests = initializeLib(host, port, ra, rp);
  requests.createRequest(name, REQUEST_STRING, IDP_COUNT) 
    .then(() => console.log('Created request for ' + name));
  requests.watchRequestEvent(function(a,b) {
    console.log(a);
    console.log(b);
  });
}

if (command === 'response') {
  console.log('RESPONSE ARGV' + JSON.stringify(argv));
  let { host, port, rid, idp, ra } = argv;
  let requests = initializeLib(host, port, ra, idp);
  requests.addIdpResponse(rid, 0, 'Authentication success')
    .then(() => console.log('Response success for request ID ' + rid));
  requests.getPendingRequests(USER_NAME);
}
