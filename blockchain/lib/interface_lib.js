import web3 from 'web3';
import ethereum from '../index';

const RPC_HOST = 'localhost';
const RPC_PORT = '8545';
const CONTRACT_ADDR = process.env.CONTRACT_ADDR;
const IDP_ADDR = process.env.IDP_ADDR;

//contract instance
const requestContract = ethereum.initializeLib(RPC_HOST, RPC_PORT, CONTRACT_ADDR, IDP_ADDR);

/*
 * Create a request.
 * Parameters
 *  requestObject: object
 *    userId : string
 *    requestText : string
 *    idpRequestList: array of integer 
 * Returns
 *  requestID : string
*/

function createRequest({ userId, requestText}) {
  //should return request id
  return requestContract.createRequest(userId,requestText,0);
}

function addIdpResponse({ requestId, approve }) {
  requestContract.addIdpResponse(requestId, approve.toString(), 'Mock up message');
}

/* 
 * Parameters
 *   Function
 *     
 * Example
 *   watchRequestEvent(function(error, result)) {
 *     if (!error)
 *       console.log(result)
 *     else
 *       console.error(error);
 */

function watchRequestEvent(callback) {
  requestContract.watchRequestEvent(callback);
}

function watchIDPResponseEvent(callback) {
  //requestContract.IdpResponse(callback)
}

function watchAuthenticationEvent() {
  //requestContract.AuthenticationComplete(callback)
}

function getPendingRequest(userId,callback) {
  return requestContract.getPendingRequest(userId,callback);
}

export ethereumInterface = {
  createRequest,
  watchRequestEvent,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
  getPendingRequest,
  addIdpResponse
};

export rpInterface = {
  createRequest,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
};

export idpInterface = {
  watchRequestEvent,
  getPendingRequest,
  addIdpResponse
}

export default ethereumInterface;
