const Web3 = require('web3')

export default class {
  constructor (Registers, registersAddress, provider, fromAddress) {
    this.web3 = new Web3(provider)
    this.fromAddress = fromAddress
    this.provider = provider

    Registers.setProvider(provider)
    Registers.defaults({
      from: fromAddress,
      gas: 400000
    })
    this.registers = Registers.at(registersAddress)
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
    return this.registers.createRequest(
      userName, requestText, idpCount).then((result) => {
        for(var i in result.logs) {
          if(result.logs[i].event === 'LogRequest')
            return Promise.resolve(result.logs[i].args.requestID);
        }
      })
      .catch(console.log.bind(console))
  }

  getRequestCount() {
    return this.registers.getRequestCount();
  }

  addIdpResponse(rid, code, status) {
    return this.registers.addIdpResponse(rid, code, status);
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
    var event = this.registers.LogRequest()
    event.watch(callback);
  }

  getPendingRequests(userAddress, callback) {
    this.registers.LogRequest({ userAddress: userAddress },{ fromBlock: 0 })
    .get(function(error,logs) {
      //console.log('TEST getPendingRequests >>>>',logs);
      //process logs before pass it to callback
      //eg. check idp count, filter only unfinish, un-expire, ...
      callback(error,logs);
    });
  }
}
