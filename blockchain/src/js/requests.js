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

function createRequest(requestObject) {
  return requestContract.createRequest()
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
  requestContract.newRequest(callback)
}

function watchIDPResponseEvent() {
  requestContract.idpResponse(callback)
}

function watchAuthenticationEvent() {
  requestContract.authenticate(callback)
}

function getPendingRequest(userId,callback) {
  requestContract.newRequest({ UID: userId },{ fromBlock: 0 }).get(callback)
}

export ethereumInterface = {
  createRequest,
  watchRequestEvent,
  watchIDPResponseEvent,
  watchAuthenticationEvent,
  getPendingRequest
}
export default ethereumInterface;
