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
      userName, requestText, idpCount).then(() => Promise.resolve(true))
      .catch(console.log.bind(console))
  }

  getRequestCount() {
    return this.registers.getRequestCount();
  }

  addIdpResponse(code, status) {
    return this.registers.addIdpResponse(code, status);
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
    var event = this.registers.Request()
    event.watch(callback);
  }
}
