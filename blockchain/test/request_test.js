/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var Request = artifacts.require('./Request.sol');

contract('Request', function(accounts) {
  let request;

  before('set up request', (done) => {
    Request.new(accounts[0], accounts[2], 'rp condition', 'Request123').then((instance) => {
      request = instance;
      console.log('request instance:' + JSON.stringify(request));
      done();
    });
  });

  it('should have all getters with correct value', async () => {
    console.log('request instance 2:' + request);
    console.log('rp address', await request.rpAddress());
    console.log('user address', await request.userAddress());
    // assert.equal(await request.requestText(), 'Request123', 'requestText()')
    // use did 
    // Here we get an error because request is a string but the smart contract
    // treat is as object
    // await did.addIdpResponse(request, 0, 'OK');
    // console.log("Added IDP Response");
    let result = await request.authenticationComplete();
    assert.equal(false, result, 'Should not complete yet.')

    // use request object directly. The responder would be accounts[1].
  });

  let res;
  it('should have idp response', async () => {
    await request.newRequest(accounts[0], accounts[2], 'rp condition', 'Request123', [], []);
    res = await request.addIdpResponse(accounts[1], 0, 'OK: IDP1');
    console.log('res1: ' + JSON.stringify(res));
    res = await request.getIdpResponse();
    console.log('res2: ' + JSON.stringify(res));
    let result = await request.authenticationComplete();
    assert.equal(true, result, 'authen should complete.')
  });

});
