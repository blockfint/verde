const Web3 = require('web3');

export default class {
  constructor(
    Requests = false,
    requestsAddress,
    provider,
    fromAddress,
    addtionalArgs
  ) {
    this.web3 = new Web3(provider);
    this.fromAddress = fromAddress;
    this.provider = provider;

    let defaultOptions = {
      from: fromAddress,
      gas: 3000000
    };

    if (Requests && requestsAddress) {
      Requests.setProvider(provider);
      Requests.defaults(defaultOptions);
      this.requests = Requests.at(requestsAddress);
    }

    let {
      Request,
      Response,
      User,
      Condition,
      UserDirectory,
      directoryAddress
    } = addtionalArgs;

    if (Request) {
      Request.setProvider(provider);
      Request.defaults(defaultOptions);
      this.request = Request;
    }

    if (Response) {
      Response.setProvider(provider);
      Response.defaults(defaultOptions);
      this.response = Response;
    }

    if (User) {
      User.setProvider(provider);
      User.defaults(defaultOptions);
      this.user = User;
    }

    if (Condition) {
      Condition.setProvider(provider);
      Condition.defaults(defaultOptions);
      this.condition = Condition;
    }

    if (UserDirectory && directoryAddress) {
      UserDirectory.setProvider(provider);
      UserDirectory.defaults(defaultOptions);
      this.userDirectory = UserDirectory.at(directoryAddress);
    }
  }

  /*setUserDirectory(UserDirectory, userDirectoryAddress, provider) {
    UserDirectory.setProvider(provider);
    UserDirectory.defaults({
      from: this.fromAddress,
      gas: 3000000 
    });
    this.userDirectory = UserDirectory.at(userDirectoryAddress);
  }*/

  /*
  * Create a request.
  * Parameters
  *   userAddress : string
  *   requestText : string
  * Returns
  *   requestID : string
  */
  createRequest(userAddress, requestText) {
    return this.requests
      .createRequest(userAddress, requestText)
      .then(result => {
        for (var i in result.logs) {
          if (result.logs[i].event === 'LogRequest')
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
  *   id           : string
  * Returns
  *   userContractAddress : string
  */
  createUser(ownerAddress, namespace, id) {
    return this.userDirectory
      .findUserByNamespaceAndId(namespace, id)
      .then(result => {
        if (this.web3.toDecimal(result) == 0) {
          return this.newUser(ownerAddress, namespace, id).then(result => {
            return Promise.resolve(result);
          });
        } else {
          return Promise.resolve(result);
        }
      })
      .catch(console.log.bind(console));
  }

  newUser(ownerAddress, namespace, id) {
    return this.userDirectory
      .newUser(ownerAddress, namespace, id)
      .then(result => {
        for (var i in result.logs) {
          if (result.logs[i].event === 'LogNewUser')
            return Promise.resolve(result.logs[i].args.userContract);
        }
        return true;
      })
      .catch(console.log.bind(console));
  }

  getUserCount() {
    return this.userDirectory
      .userCount()
      .then(result => {
        return Promise.resolve(result);
      })
      .catch(console.log.bind(console));
  }

  async setMinimumResponse(userAddress, idpCount) {
    let user = this.user.at(userAddress);
    let conditionAddr = await user.conditionContract();
    let condition = this.condition.at(conditionAddr);
    await condition.setMinimumResponseOKCount(idpCount);
  }

  async getMinimumResponse(userAddress) {
    let user = this.user.at(userAddress);
    let conditionAddr = await user.conditionContract();
    let condition = this.condition.at(conditionAddr);
    return await condition.minimumResponseOKCount();
  }

  findUserAddress(namespace = 'cid', id) {
    return this.userDirectory
      .findUserByNamespaceAndId(namespace, id)
      .then(result => {
        return Promise.resolve(result);
      })
      .catch(console.log.bind(console));
  }

  addIdpResponse(rid, code, status) {
    return this.requests
      .addIdpResponse(rid, code, status)
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
    // eslint-disable-next-line babel/new-cap
    var event = this.requests.LogRequest();
    event.watch(callback);
  }

  watchIdpResponse(callback) {
    // eslint-disable-next-line babel/new-cap
    var event = this.requests.IdpResponse();
    event.watch(callback);
  }

  watchAuthenticationEvent(requestId, callback) {
    // eslint-disable-next-line babel/new-cap
    var event = this.request.at(requestId).LogConditionComplete();
    event.watch(callback);
  }

  async getRequestsByUserAddress(userAddress) {
    try {
      let count = await this.requests.getRequestCount();
      let pendingList = [],
        approvedList = [],
        deniedList = [];
      for (let i = 0; i < count; i++) {
        let requestID = await this.requests.getRequest(i);
        let tmpRequest = this.request.at(requestID);
        let responseID = await tmpRequest.getIdpResponse();
        let tmpResponse = this.response.at(responseID);
        if ((await tmpRequest.userAddress()) == userAddress) {
          let targetRequest = {
            requestID: requestID,
            userAddress: await tmpRequest.userAddress(),
            rpAddress: await tmpRequest.rpAddress(),
            requestText: await tmpRequest.requestText()
          };
          if (
            (await tmpResponse.getResponseCount()) <
            (await this.getMinimumResponse(userAddress))
          ) {
            pendingList.push(targetRequest);
          } else {
            if (await tmpRequest.authenticationComplete()) {
              approvedList.push(targetRequest);
            } else {
              deniedList.push(targetRequest);
            }
          }
        }
      }
      return [
        null,
        {
          pending: pendingList,
          approved: approvedList,
          denied: deniedList
        }
      ];
    } catch (error) {
      console.error('Cannot get pending', error);
      return [error, null];
    }
  }

  async getRequests(userAddress) {
    try {
      let count = await this.requests.getRequestCount();
      let pendingList = [],
        approvedList = [],
        deniedList = [];
      for (let i = 0; i < count; i++) {
        let requestContract = await this.requests.getRequest(i);
        let tmpRequest = this.request.at(requestContract);
        let responseContract = await tmpRequest.getIdpResponse();
        let tmpResponse = this.response.at(responseContract);
        if ((await tmpRequest.userAddress()) == userAddress) {
          let targetRequest = {
            requestID: requestContract,
            userAddress: await tmpRequest.userAddress(),
            rpAddress: await tmpRequest.rpAddress(),
            requestText: await tmpRequest.requestText()
          };
          let [isAnswered, myRespond] = await tmpResponse.didIRespond();
          if (isAnswered) {
            if (parseInt(Number(myRespond)) === 0)
              approvedList.push(targetRequest);
            else deniedList.push(targetRequest);
          } else {
            pendingList.push(targetRequest);
          }
        }
      }
      return [
        null,
        {
          pending: pendingList,
          approved: approvedList,
          denied: deniedList
        }
      ];
    } catch (error) {
      console.error('Cannot get pending', error);
      return [error, null];
    }
  }
}
