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
  let accounts = web3.eth.accounts;

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
          type: 'string'
        })
        .option('user', {
          description: 'The account index to create request',
          type: 'string'
        })
        .option('userid', {
          description: 'The citizen ID',
          type: 'string'
        })
        .demand(['rp', 'user', 'userid']);
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
          description: 'The IDP account index to response request',
          type: 'string'
        })
        .option('user', {
          description: 'The account index to response request',
          type: 'string'
        })
        .option('userid', {
          description: 'The citizen ID',
          type: 'string'
        })
        .demand(['rid', 'idp', 'user', 'userid']);
    })
    .command('getRequest', 'Get request', yargs => {
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
          description: 'The RP account index',
          type: 'string'
        })
        .option('user', {
          description: 'The account index',
          type: 'string'
        })
        .option('userid', {
          description: 'The citizen ID',
          type: 'string'
        })
        .demand(['rp', 'user', 'userid']);
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
        .option('rp', {
          description: 'The RP account index to create user',
          type: 'string'
        })
        .option('user', {
          description: 'The account index to create user',
          type: 'string'
        })
        .option('userid', {
          description: 'The citizen ID',
          type: 'string'
        })
        .option('idpCount', {
          description: 'The number of minimum response OK',
          type: 'string'
        })
        .demand(['rp', 'user', 'userid']);
    })
    .help()
    .usage('Usage: $0 [command] [options]');

  let { argv } = args;

  if (argv._.length === 0) {
    args.showHelp();
  }

  let command = argv._[0];

  if (command === 'createUser') {
    // console.log('CREATE USER ARGV' + JSON.stringify(argv));
    let { host, port, ra, uda, rp, user, userid, idpCount } = argv;
    let rpAccount = accounts[rp];
    let userAccount = accounts[user];
    let did = initializeLib(host, port, ra, rpAccount, {
      directoryAddress: uda
    });
    did.createUser(userAccount, NAMESPACE, userid).then(userAddress => {
      console.log('Created user id ' + userid + ' at ' + userAddress);
      did.setMinimumResponse(userAddress, idpCount);
    });
  }

  if (command === 'request') {
    // console.log('CREATE ARGV' + JSON.stringify(argv));
    let { host, port, ra, uda, rp, user, userid } = argv;
    let rpAccount = accounts[rp];
    let userAccount = accounts[user];
    let did = initializeLib(host, port, ra, rpAccount, {
      directoryAddress: uda
    });
    did.createUser(userAccount, NAMESPACE, userid).then(userAddress => {
      did
        .createRequest(userAddress, REQUEST_STRING, IDP_COUNT)
        .then(result =>
          console.log('Created request for ' + userid + ' at ' + result)
        );
    });
  }

  if (command === 'getRequest') {
    // console.log('GET PENDING REQUEST ARGV' + JSON.stringify(argv));
    let { host, port, ra, uda, idp, user, userid } = argv;
    let idpAccount = accounts[idp];
    let userAccount = accounts[user];
    let did = initializeLib(host, port, ra, idpAccount, {
      directoryAddress: uda
    });
    did.createUser(userAccount, NAMESPACE, userid).then(userAddress => {
      did
        .getRequestsByUserAddress(userAddress)
        .then(result => console.log(result[1]));
    });
  }

  if (command === 'response') {
    // console.log('RESPONSE ARGV' + JSON.stringify(argv));
    let { host, port, ra, uda, idp, user, userid, rid } = argv;
    let idpAccount = accounts[idp];
    let userAccount = accounts[user];
    let did = initializeLib(host, port, ra, idpAccount, {
      directoryAddress: uda
    });
    did.createUser(userAccount, NAMESPACE, userid).then(userAddress => {
      did.getRequestsByUserAddress(userAddress).then(pendingRequest => {
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
}
