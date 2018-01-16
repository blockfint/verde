/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var Request = artifacts.require('./Request.sol');

contract('Request', function(accounts) {
  let request;

  before('set up request', (done) => {
    Request.new().then((instance) => {
      request = instance;
      console.log('request instance:' + request);
      done();
    });
  });

  let rpAddress = accounts[0];
  let userAddress = accounts[2];
  let requestText = 'Request 123';
  let rpCondition = 'RP Condition';
  it('should have all getters with correct value', async () => {
    await request.newRequest(rpAddress, userAddress, rpCondition, requestText, 
                             [], []);
    console.log('request instance 2:' + request);
    console.log('rp address', await request.rpAddress());
    console.log('user address', await request.userAddress());
    assert.equal(rpAddress, await request.rpAddress(), 'RP address');
    assert.equal(userAddress, await request.userAddress(), 'User address');
    assert.equal(requestText, await request.requestText());
    assert.equal(rpCondition, await request.rpCondition());
    assert.equal(false, await request.authenticationComplete(), 
                 'Should not complete yet.');

    // use request object directly. The responder would be accounts[1].
  });

  let res;
  it('should have idp response', async () => {
    res = await request.addIdpResponse(accounts[1], 0, 'OK: IDP1');
    console.log('res1: ' + JSON.stringify(res));
    res = await request.getIdpResponse();
    console.log('res2: ' + JSON.stringify(res));
    let result = await request.authenticationComplete();
    assert.equal(true, result, 'authen should complete.')
  });

});
