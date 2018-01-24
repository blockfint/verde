import { default as Did } from './lib/did';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

var requestJson,requestsJson,responseJson,userJson,conditionJson,directoryJson;
try {
  requestJson = require('./build/contracts/Request.json');
  responseJson = require('./build/contracts/Response.json');
  requestsJson = require('./build/contracts/Requests.json');
  userJson = require('./build/contracts/User.json');
  conditionJson = require('./build/contracts/Condition.json');
  directoryJson = require('./build/contracts/UserDirectory.json');
}
catch(error) {
  requestJson = require('./contracts/Request.json');
  responseJson = require('./contracts/Response.json');
  requestsJson = require('./contracts/Requests.json');
  userJson = require('./contracts/User.json');
  conditionJson = require('./contracts/Condition.json');
  directoryJson = require('./contracts/UserDirectory.json');
}

const Request = contract(requestJson);
const Response = contract(responseJson);
const Requests = contract(requestsJson);
const User = contract(userJson);
const Condition = contract(conditionJson);
const Directory = contract(directoryJson);

export default function (host, port, requestsAddress, fromAddress, additionalArgs) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`);
  return new Did (
      Requests,
      requestsAddress,
      provider,
      fromAddress,
      {
        Request,
        Response,
        User,
        Condition,
        Directory,
        ...additionalArgs
      }
  );
}
