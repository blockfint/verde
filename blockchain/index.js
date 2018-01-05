import { default as RequestLib } from './lib/requests_lib'
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

var requestJson;
try {
  requestJson = require('./build/contracts/Requests.json');
}
catch(error) {
  requestJson = require('./contracts/Requests.json');
}

const Requests = contract(requestJson)

export default function (host, port, registersAddress, fromAddress) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`)
  return new RequestLib (
      Requests,
      registersAddress,
      provider,
      fromAddress
  )
}
