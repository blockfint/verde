const Web3 = require('web3');

export default class {
  constructor (Requests, requestsAddress, provider, fromAddress) {
    this.web3 = new Web3(provider);
    this.fromAddress = fromAddress;
    this.provider = provider;

    Requests.setProvider(provider);
    Requests.defaults({
      from: fromAddress,
      gas: 3000000 
    });
    this.requests = Requests.at(requestsAddress);
  }
  /*
  * Create a request.
  * Parameters
  *   userAddress : string
  *   requestText : string
  * Returns
  *   requestID : string
  */
  createRequest(userAddress, requestText, idpCount) {
    return this.requests.createRequest(
      userAddress, requestText, idpCount).then((result) => {
        for(var i in result.logs) {
          if(result.logs[i].event === 'LogRequest')
            return Promise.resolve(result.logs[i].args.requestID);
        }
        return true;
      })
      .catch(console.log.bind(console));
  }

  getRequestCount() {
    return this.requests.getRequestCount();
  }

  addIdpResponse(rid, code, status) {
    return this.requests.addIdpResponse(rid, code, status)
      .then(() => {
        return Promise.resolve(true)
      })
      .catch(console.log.bind(console));
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
  watchRequestEvent(callback) {
    var event = this.requests.LogRequest();
    event.watch(callback);
  }

  watchIdpEvent(callback) {
    var event = this.requests.IdpResponse();
    event.watch(callback);
  }

  getPendingRequests(userAddress, callback) {
    this.requests.LogRequest({ userAddress: userAddress },{ fromBlock: 0 })
    .get(function(error,logs) {
      //console.log('TEST getPendingRequests >>>>',logs);
      //process logs before pass it to callback
      //eg. check idp count, filter only unfinish, un-expire, ...
      callback(error,logs);
    });
  }
}
