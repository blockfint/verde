#!/usr/bin/env node
import { default as yargs } from 'yargs';
import { default as initializeLib } from '../index';

const RPC_HOST = 'localhost';
const RPC_PORT = '8545';
const REQUEST_STRING = 'Pay for Blockfint ICO';
const IDP_COUNT = 1;
const NAMESPACE = 'cid';

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
    .option('uda', {
      description: 'The user directory contract address',
      type: 'string'
    })
    .option('rp', {
      description: 'The RP account address to create request',
      type: 'string'
    })
    .option('id', {
      description: 'The user ID you want to request for authentication',
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
      description: 'The request contract address',
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
  .command('pendingRequest', 'Get pending request', (yargs) => {
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
    .option('uda', {
      description: 'The user directory contract address',
      type: 'string'
    })
    .option('rp', {
      description: 'The RP account address',
      type: 'string'
    })
    .option('id', {
      description: 'The user ID you want to request for authentication',
      type: 'string'
    })
    .demand(['ra', 'rp']);
  })
  .command('createUser', 'Create a user', (yargs) => {
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
      description: 'The RP account address to create user',
      type: 'string'
    })
    .option('uda', {
      description: 'The user directory contract address',
      type: 'string'
    })
    .option('id', {
      description: 'The citizen ID',
      type: 'string'
    })
    .demand(['id']);
  })
  .help()
  .usage('Usage: $0 [command] [options]');

let { argv } = args;

if (argv._.length === 0) {
  args.showHelp();
}

let command = argv._[0];

if (command === 'request') {
  // console.log('CREATE ARGV' + JSON.stringify(argv));
  let { id, host, port, rp, ra ,uda} = argv;
  let did = initializeLib(host, port, ra, rp, { 
    directoryAddress: uda
  });
  did.createUser(rp, NAMESPACE, id) 
    .then((userAddress) => {
      did.createRequest(userAddress, REQUEST_STRING, IDP_COUNT) 
        .then((result) => console.log('Created request for ' + id + ' at ' + result));
    });
}

if (command === 'response') {
  // console.log('RESPONSE ARGV' + JSON.stringify(argv));
  let { host, port, rid, idp, ra } = argv;
  let did = initializeLib(host, port, ra, idp);
  did.addIdpResponse(rid, 0, 'Authentication success')
    .then(() => console.log('Response success for request ID ' + rid));
}

if (command === 'createUser') {
  // console.log('CREATE USER ARGV' + JSON.stringify(argv));
  let { host, port, rp, ra, id, uda} = argv;
  let did = initializeLib(host, port, ra, rp, { 
    directoryAddress: uda
  });
  did.createUser(rp, NAMESPACE, id) 
    .then((result) => console.log('Created user id '+ id +' at ' + result));
}

if (command === 'pendingRequest') {
  // console.log('GET PENDING REQUEST ARGV' + JSON.stringify(argv));
  let { id, host, port, rp, ra ,uda} = argv;
  let did = initializeLib(host, port, ra, rp, { 
    directoryAddress: uda
  });
  did.createUser(rp, NAMESPACE, id) 
    .then((userAddress) => {
      did.getPendingRequests(userAddress) 
        .then((result) => console.log(result[1]));
    });
}
