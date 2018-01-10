const Web3 = require('web3');

export default class {
  constructor (Requests, requestsAddress, provider, fromAddress) {
    this.web3 = new Web3(provider);
    this.fromAddress = fromAddress;
    this.provider = provider;

    Requests.setProvider(provider);
    Requests.defaults({
      from: fromAddress,
      gas: 900000 
    });
    this.requests = Requests.at(requestsAddress);
  }
  /*
  * Create a request.
  * Parameters
  *   userName : string
  *   requestText : string
  * Returns
  *   requestID : string
  */
  createRequest(userName, requestText, idpCount) {
    return this.requests.createRequest(
      userName, requestText, idpCount).then((result) => {
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
    return this.requests.addIdpResponse(rid, code, status);
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

  watchAuthenticationEvent(callback) {
    var event = this.requests.LogConditionComplete();
    event.watch(callback);
  }

  getPendingRequests(userAddress, callback) {
    try {
      let count = this.requests.getRequestCount();
      let pendingList = [];
      for(let i = 0 ; i < count ; i++) {
        let requestContract = this.requests.getRequest(i);
        //check pending
        pendingList.push({
          requestID: requestContract,
          userAddress: requestContract.userAddress,
          rpAddress: requestContract.rpAddress,
          requestText: requestContract.requestText
        });
      }
      callback(null,pendingList);
    }
    catch(error) { callback(error) }
  }
}
