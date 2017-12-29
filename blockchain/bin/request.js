#!/usr/bin/env node
import { default as yargs } from 'yargs'
import { default as initializeLib } from '../index'

const RPC_HOST = 'testrpc'
const RPC_PORT = '8545'
const USER_NAME = 'Alan'
const REQUEST_STRING = 'Pay for Blockfint ICO'
const IDP_COUNT = 1

var args = yargs
  .command('create', 'Create a request', (yargs) => {
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
    .option('name', {
      description: 'The name you want to request for authentication',
      alias: 'n',
      default: USER_NAME,
      type: 'string'
    })
    .option('rp', {
      description: 'The RP account address to create request',
      type: 'string'
    })
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
      alias: 'r',
      type: 'string'
    })
    .option('idp', {
      description: 'The IDP account address to response to the request',
      type: 'string'
    })
    .demand(['rid'])
  })
  .help()
  .usage('Usage: $0 [command] [options]')

let { argv } = args

if (argv._.length === 0) {
  args.showHelp()
}

let command = argv._[0]

if (command === 'create') {
  let { name, host, port, rp } = argv
  let requests = initializeLib(host, port)
  requests.create(name, REQUEST_STRING, IDP_COUNT) 
    .then(() => console.log('Created request for ' + name))
}

if (command === 'response') {
  let { host, port, rid, idp } = argv
  let requests = initializeLib(host, port)
  requests.addIdpResponse(rid, 0, 'Authentication success')
    .then(() => console.log('Response success for request ID ' + rid))
}
