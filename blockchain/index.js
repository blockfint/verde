import { default as Did } from './lib/did';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

var requestJson;
try {
  requestJson = require('./build/contracts/Requests.json');
}
catch(error) {
  requestJson = require('./contracts/Requests.json');
}

const Requests = contract(requestJson);

export default function (host, port, requestsAddress, fromAddress) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`);
  return new Did (
      Requests,
      requestsAddress,
      provider,
      fromAddress
  );
}
