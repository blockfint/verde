const Web3 = require('web3');

export default class {
  constructor (Requests, requestsAddress, provider, fromAddress, Request = false, Response = false, User = false, Condition = false) {
    this.web3 = new Web3(provider);
    this.fromAddress = fromAddress;
    this.provider = provider;

    let defaultOptions = {
      from: fromAddress,
      gas: 3000000 
    };

    Requests.setProvider(provider);
    Requests.defaults(defaultOptions);
    this.requests = Requests.at(requestsAddress);

    if(Request) {
      Request.setProvider(provider);
      Request.defaults(defaultOptions);
      this.request = Request;
    }

    if(Response) {
      Response.setProvider(provider);
      Response.defaults(defaultOptions);
      this.response = Response;
    }
    
    if(User) {
      User.setProvider(provider);
      User.defaults(defaultOptions);
      this.user = User;
    }

    if(Condition) {
      Condition.setProvider(provider);
      Condition.defaults(defaultOptions);
      this.condition = Condition;
    }

  }

  setUserDirectory(UserDirectory, userDirectoryAddress, provider) {
    UserDirectory.setProvider(provider);
    UserDirectory.defaults({
      from: this.fromAddress,
      gas: 3000000 
    });
    this.userDirectory = UserDirectory.at(userDirectoryAddress);
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

  /*
  * Create a user.
  * Parameters
  *   ownerAddress : string
  *   namespace    : string
  *   namespace    : string
  * Returns
  *   userContractAddress : string
  */
  createUser(ownerAddress, namespace, id) {
    return this.userDirectory.findUserByNamespaceAndId(namespace, id)
      .then((result) => {
        if(this.web3.toDecimal(result) == 0) {
          return this.newUser(ownerAddress, namespace, id)
            .then((result) => {
              return Promise.resolve(result);
            })  ;
        } else {
          return Promise.resolve(result);
        }
    })
    .catch(console.log.bind(console));
  }

  newUser(ownerAddress, namespace, id) {
    return this.userDirectory.newUser(
      ownerAddress, namespace, id).then((result) => {
         for(var i in result.logs) {
          if(result.logs[i].event === 'LogNewUser')
            return Promise.resolve(result.logs[i].args.userContract);
        }
        return true;
      })
      .catch(console.log.bind(console));
  }

  getUserCount() {
    return this.userDirectory.userCount()
      .then((result) => {
        return Promise.resolve(result);
      })
      .catch(console.log.bind(console));
  }

  addIdpResponse(rid, code, status) {
    return this.requests.addIdpResponse(rid, code, status)
      .then(() => {
        return Promise.resolve(true);
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

  watchAuthenticationEvent(requestId, callback) {
    var event = this.request.at(requestId).LogConditionComplete();
    event.watch(callback);
  }

  async getPendingRequests(userAddress) {
    try {
      let count = await this.requests.getRequestCount();
      let pendingList = [];
      for(let i = 0 ; i < count ; i++) {
        let requestContract = await this.requests.getRequest(i);
        //TODO check pending
        let tmpRequest = this.request.at(requestContract);
        let responseContract = await tmpRequest.getIdpResponse();
        let tmpResponse = this.response.at(responseContract);
        if(!(await tmpResponse.didIRespond())) {
          if(await tmpRequest.userAddress() == userAddress) {
            pendingList.push({
              requestID: requestContract,
              userAddress: await tmpRequest.userAddress(),
              rpAddress: await tmpRequest.rpAddress(),
              requestText: await tmpRequest.requestText()
            });
          }
        }
      }
      return [null,pendingList];
    }
    catch(error) { 
      console.error('Cannot get pending',error);
      return [error,null];
    }
  }
}
