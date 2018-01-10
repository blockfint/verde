import { default as Did } from './lib/did';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

var requestJson;
try {
  requestsJson = require('./build/contracts/Requests.json');
  requestJson = require('./build/contracts/Request.json');
}
catch(error) {
  requestJson = require('./contracts/Requests.json');
}

const Requests = contract(requestsJson);
const Request = contract(requestJson);

export default function (host, port, requestsAddress, fromAddress) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`);
  return new Did (
      Requests,
      requestsAddress,
      provider,
      fromAddress
  );
}
