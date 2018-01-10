import { default as Did } from './lib/did';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

var requestJson,requestsJson,responseJson;
try {
  requestJson = require('./build/contracts/Request.json');
  responseJson = require('./build/contracts/Response.json');
  requestsJson = require('./build/contracts/Requests.json');
}
catch(error) {
  requestJson = require('./contracts/Request.json');
  responseJson = require('./contracts/Response.json');
  requestsJson = require('./contracts/Requests.json');
}

const Request = contract(requestJson);
const Response = contract(responseJson);
const Requests = contract(requestsJson);

export default function (host, port, requestsAddress, fromAddress) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`);
  return new Did (
      Requests,
      requestsAddress,
      provider,
      fromAddress,
      Request,
      Response
  );
}
