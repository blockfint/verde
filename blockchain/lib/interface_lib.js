import web3 from 'web3';
import ethereum from '../index';

const RPC_HOST = 'localhost';
const RPC_PORT = '8545';
const CONTRACT_ADDR = process.env.CONTRACT_ADDR;
const IDP_ADDR = process.env.IDP_ADDR;
const RP_ADDR = process.env.RP_ADDR;

var idpContract, rpContract;

if(!IDP_ADDR && !RP_ADDR) {
  throw('Must specify RP_ADDR or IDP_ADDR');
}

//contract instance
if(IDP_ADDR)
  idpContract = ethereum(RPC_HOST, RPC_PORT, CONTRACT_ADDR, IDP_ADDR);

if(RP_ADDR)
  rpContract = ethereum(RPC_HOST, RPC_PORT, CONTRACT_ADDR, RP_ADDR);

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

function createRequest({ userId, requestText }) {
  //should return request id
  return rpContract.createRequest(userId,requestText,0);
}

function addIdpResponse({ requestId, approve }) {
  idpContract.addIdpResponse(requestId, approve.toString(), 'Mock up message');
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
  idpContract.watchRequestEvent(function(error, eventObject) {
    if(error) return callback(error);
    //filter only for those event concern IDP_ADDR
    callback(null, eventObject.args)
  });
}

function watchIDPResponseEvent(callback) {
  rpContract.watchIdpEvent(function(error, eventObject) {
    if(error) return callback(error);
    //filter only for those event concern RP_ADDR
    callback(null, eventObject.args)
  })
}

function watchAuthenticationEvent() {
  //rp.AuthenticationComplete(callback)
}

function getPendingRequests(userId,callback) {
  return idpContract.getPendingRequests(userId,callback);
}

export const ethereumInterface = {
  createRequest,
  watchRequestEvent,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
  getPendingRequests,
  addIdpResponse
};

export const rpInterface = {
  createRequest,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
};

export const idpInterface = {
  watchRequestEvent,
  getPendingRequests,
  addIdpResponse
}

export default ethereumInterface;
