const Web3 = require('web3');
var UserDirectory = artifacts.require('UserDirectory');

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

    // Deploy User Directory
    UserDirectory.setProvider(this.provider);
    UserDirectory.defaults({
      from: this.fromAddress,
      gas: 3000000 
    });

    UserDirectory.deployed().then((instance) => {
      this.userDirectory = instance;
    });
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
        if(web3.toDecimal(result) == 0) {
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
    var event = this.requests0.LogRequest();
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
