const Web3 = require('web3');

export default class {
  constructor (Requests, requestsAddress, provider, fromAddress, request = false, response = false) {
    this.web3 = new Web3(provider);
    this.fromAddress = fromAddress;
    this.provider = provider;

    Requests.setProvider(provider);
    Requests.defaults({
      from: fromAddress,
      gas: 2000000 
    });
    this.requests = Requests.at(requestsAddress);

    request.setProvider(provider);
    request.defaults({
      from: fromAddress,
      gas: 2000000 
    });
    this.request = request;

    response.setProvider(provider);
    response.defaults({
      from: fromAddress,
      gas: 2000000 
    });
    this.response = response;
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

  watchAuthenticationEvent(callback) {
    //LogConditionComplete is not in contract that we directly interact
    //var event = this.requests.LogConditionComplete();
    //event.watch(callback);
  }

  async getPendingRequests(userAddress) {
    try {
      let count = await this.requests.getRequestCount();
      let pendingList = [];
      for(let i = 0 ; i < count ; i++) {
        let requestContract = await this.requests.getRequest(i);
        //TODO check pending
        let tmp = this.request.at(requestContract);
        pendingList.push({
          requestID: requestContract,
          userAddress: await tmp.userAddress(),
          rpAddress: await tmp.rpAddress(),
          requestText: await tmp.requestText()
        });
      }
      return [null,pendingList];
    }
    catch(error) { 
      console.error('Cannot get pending',error);
      return [error,null];
    }
  }
}
