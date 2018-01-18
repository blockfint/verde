/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var Request = artifacts.require('./Request.sol');
var Response = artifacts.require('./Response.sol');
var User = artifacts.require('./User.sol');
var Condition = artifacts.require('./Condition.sol');

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
  let ownerAddress = accounts[2];
  let user;
  let requestText = 'Request 123';
  let rpCondition = 'RP Condition';
  it('should have all getters with correct value', async () => {
    user = await User.new();
    user.newUser(ownerAddress, 'ssn', '130');
    let condition = await Condition.new();
    await user.setConditionContractAddress(condition.address);
    console.log('user condition contract address:' + 
                await user.conditionContract());
    await request.newRequest(rpAddress, user.address, rpCondition, requestText, 
                             [], []);
    let userAddress = user.address;
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

  let response;
  let idpMsg1 = 'OK: IDP1';
  let idpMsg2 = 'ERROR';
  let code;
  let msg;
  it('should have idp response', async () => {
    console.log('req: ' + request);
    await request.addIdpResponse(accounts[1], 0, idpMsg1);
    response = Response.at(await request.getIdpResponse());
    console.log('response2: ' + response);
    let result = await response.getResponseAtIndex(0);
    console.log('code:'+result[0]+',msg:'+result[1]);
    assert.equal(0, result[0], 'code');
    msg = web3.toAscii(result[1]).replace(/\u0000/g, '');
    // var str2 = web3.fromAscii(idpMsg1, 32);
    assert.equal(idpMsg1, msg, 'message');
    result = await request.authenticationComplete();
    assert.equal(true, result, 'authen should complete.')

    await request.addIdpResponse(accounts[1], 1, idpMsg2);
    assert.equal(1, await response.getResponseCodeAtIndex(1), 'response code');
  });

});
