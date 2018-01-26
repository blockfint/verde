// import web3 from 'web3';
import ethereum from '../index';

const RPC_HOST = 'localhost';
const RPC_PORT = '8545';
const REQUESTS_CONTRACT_ADDR = process.env.REQUESTS_CONTRACT_ADDR;
const DIRECTORY_CONTRACT_ADDR = process.env.DIRECTORY_CONTRACT_ADDR;
const IDP_ADDR = process.env.IDP_ADDR;
const RP_ADDR = process.env.RP_ADDR;

var idpContract, rpContract, directoryContract;

if (!IDP_ADDR && !RP_ADDR) {
  throw 'Must specify RP_ADDR or IDP_ADDR';
}

//contract instance
if (IDP_ADDR)
  idpContract = ethereum(RPC_HOST, RPC_PORT, REQUESTS_CONTRACT_ADDR, IDP_ADDR);

if (RP_ADDR)
  rpContract = ethereum(RPC_HOST, RPC_PORT, REQUESTS_CONTRACT_ADDR, RP_ADDR);

if (DIRECTORY_CONTRACT_ADDR) {
  directoryContract = ethereum(RPC_HOST, RPC_PORT, false, IDP_ADDR, {
    directoryAddress: DIRECTORY_CONTRACT_ADDR
  });
}

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

function createRequest({ userAddress, requestText }) {
  //should return request id
  return rpContract.createRequest(userAddress, requestText, 0);
}

function addIdpResponse({ requestId, code }) {
  idpContract.addIdpResponse(requestId, code, 'Mock up message');
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
    if (error) return callback(error);
    //filter only for those event concern IDP_ADDR
    callback(null, eventObject.args);
  });
}

function watchIDPResponseEvent(callback) {
  rpContract.watchIdpResponse(function(error, eventObject) {
    if (error) return callback(error);
    //filter only for those event concern RP_ADDR
    callback(null, eventObject.args);
  });
}

function watchAuthenticationEvent(requestId, callback) {
  rpContract.watchAuthenticationEvent(requestId, function(error, eventObject) {
    if (error) return callback(error);
    //filter only for those event concern RP_ADDR
    callback(null, eventObject.args);
  });
}

async function getRequests(userId) {
  let userAddress = await findUserAddress('cid', userId);
  return idpContract.getRequests(userAddress);
}

function createUser(namespace, id) {
  return directoryContract.createUser(IDP_ADDR, namespace, id);
}

function findUserAddress(namespace, id) {
  return directoryContract.findUserAddress(namespace, id);
}

export const ethereumInterface = {
  createRequest,
  watchRequestEvent,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
  getRequests,
  addIdpResponse,
  createUser,
  findUserAddress
};

export const rpInterface = {
  createRequest,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
  findUserAddress
};

export const idpInterface = {
  watchRequestEvent,
  getRequests,
  addIdpResponse,
  createUser,
  findUserAddress
};

export default ethereumInterface;
