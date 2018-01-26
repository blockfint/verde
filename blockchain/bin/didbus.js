#!/usr/bin/env node
import { default as yargs } from 'yargs';
import { default as initializeLib } from '../index';
import { default as Web3 } from 'web3';

const RPC_HOST = 'localhost';
const RPC_PORT = '8545';
const REQUEST_STRING = 'Pay for Blockfint ICO';
const IDP_COUNT = 1;
const NAMESPACE = 'cid';

const path = require('path');
var fs = require('fs');
let addresssFilePath = path.join(__dirname, '../contract_addresses.json');
var addressObj;

fs.readFile(addresssFilePath, 'utf8', function(err, data) {
  if (!err) {
    addressObj = JSON.parse(data);
    startDIDBus();
  }
});

function startDIDBus() {
  let provider = new Web3.providers.HttpProvider(
    `http:\/\/${RPC_HOST}:${RPC_PORT}`
  );
  let web3 = new Web3(provider);

  let REQUESTS_CONTRACT_ADDR = addressObj.Requests;
  let DIRECTORY_CONTRACT_ADDR = addressObj.UserDirectory;
  let IDP_ADDR = web3.eth.accounts[0];
  let RP_ADDR = web3.eth.accounts[1];

  var args = yargs
    .command('request', 'Create a request', yargs => {
      return yargs
        .option('host', {
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
          type: 'string',
          default: REQUESTS_CONTRACT_ADDR
        })
        .option('uda', {
          description: 'The user directory contract address',
          type: 'string',
          default: DIRECTORY_CONTRACT_ADDR
        })
        .option('rp', {
          description: 'The RP account index to create request',
          type: 'string',
          default: RP_ADDR
        })
        .option('idp', {
          description: 'The IDP account address to create user',
          type: 'string',
          default: IDP_ADDR
        })
        .option('userid', {
          description: 'The user ID you want to request for authentication',
          type: 'string'
        })
        .demand(['userid']);
    })
    .command('response', 'Response to the request', yargs => {
      return yargs
        .option('host', {
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
          description: 'The request index',
          type: 'string'
        })
        .option('ra', {
          description: 'The requests contract address',
          type: 'string',
          default: addressObj.Requests
        })
        .option('uda', {
          description: 'The user directory contract address',
          type: 'string',
          default: addressObj.UserDirectory
        })
        .option('idp', {
          description: 'The IDP account address to response to the request',
          type: 'string',
          default: IDP_ADDR
        })
        .option('userid', {
          description: 'The user ID you want to response',
          type: 'string'
        })
        .demand(['rid', 'userid']);
    })
    .command('pendingRequest', 'Get pending request', yargs => {
      return yargs
        .option('host', {
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
          type: 'string',
          default: addressObj.Requests
        })
        .option('uda', {
          description: 'The user directory contract address',
          type: 'string',
          default: addressObj.UserDirectory
        })
        .option('rp', {
          description: 'The RP account index to create request',
          type: 'string',
          default: RP_ADDR
        })
        .option('idp', {
          description: 'The IDP account address to create user',
          type: 'string',
          default: IDP_ADDR
        })
        .option('userid', {
          description: 'The user ID you want to request for authentication',
          type: 'string'
        })
        .demand(['userid']);
    })
    .command('createUser', 'Create a user', yargs => {
      return yargs
        .option('host', {
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
          type: 'string',
          default: addressObj.Requests
        })
        .option('uda', {
          description: 'The user directory contract address',
          type: 'string',
          default: addressObj.UserDirectory
        })
        .option('idp', {
          description: 'The IDP account address to create user',
          type: 'string',
          default: IDP_ADDR
        })
        .option('userid', {
          description: 'The citizen ID',
          type: 'string'
        })
        .demand(['userid']);
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
    let { host, port, ra, uda, rp, idp, userid } = argv;
    let did = initializeLib(host, port, ra, rp, {
      directoryAddress: uda
    });
    did.createUser(idp, NAMESPACE, userid).then(userAddress => {
      did
        .createRequest(userAddress, REQUEST_STRING, IDP_COUNT)
        .then(result =>
          console.log('Created request for ' + userid + ' at ' + result)
        );
    });
  }

  if (command === 'pendingRequest') {
    // console.log('GET PENDING REQUEST ARGV' + JSON.stringify(argv));
    let { host, port, ra, uda, idp, userid } = argv;
    let did = initializeLib(host, port, ra, idp, {
      directoryAddress: uda
    });
    did.createUser(idp, NAMESPACE, userid).then(userAddress => {
      did
        .getRequests(userAddress)
        .then(result => console.log(result[1]['pending']));
    });
  }

  if (command === 'response') {
    // console.log('RESPONSE ARGV' + JSON.stringify(argv));
    let { host, port, ra, uda, idp, userid, rid } = argv;
    let did = initializeLib(host, port, ra, idp, {
      directoryAddress: uda
    });
    did.createUser(idp, NAMESPACE, userid).then(userAddress => {
      did.getRequests(userAddress).then(pendingRequest => {
        if (pendingRequest[1]['pending'][rid] != undefined) {
          let requestAddress = pendingRequest[1]['pending'][rid].requestID;
          did
            .addIdpResponse(requestAddress, 0, 'Authentication success')
            .then(() =>
              console.log('Response success for request ID ' + requestAddress)
            );
        }
      });
    });
  }

  if (command === 'createUser') {
    // console.log('CREATE USER ARGV' + JSON.stringify(argv));
    let { host, port, ra, uda, idp, userid } = argv;
    let did = initializeLib(host, port, ra, idp, {
      directoryAddress: uda
    });
    did
      .createUser(idp, NAMESPACE, userid)
      .then(result =>
        console.log('Created user id ' + userid + ' at ' + result)
      );
  }
}
