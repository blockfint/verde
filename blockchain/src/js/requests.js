import web3 from 'web3';

var requestContract = //contract instance

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
  // cast userId to hex
  return requestContract.createRequest.sendTransaction(userId,requestText,0);
}

function addIdpResponse({ requestId, approve }) {
  requestContract.addIdpResponse.sendTransaction(requestId, approve.toString(), 'Mock up message');
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
  requestContract.Request(callback);
}

function watchIDPResponseEvent(callback) {
  requestContract.IdpResponse(callback)
}

function watchAuthenticationEvent() {
  requestContract.AuthenticationComplete(callback)
}

function getPendingRequest(userId,callback) {
  requestContract.Request({ UID: userId },{ fromBlock: 0 }).get(callback)
}

export ethereumInterface = {
  createRequest,
  watchRequestEvent,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
  getPendingRequest,
  addIdpResponse
}
export default ethereumInterface;
