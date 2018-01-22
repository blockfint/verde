/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

import { default as Did } from '../lib/did';
var Requests = artifacts.require('Requests');
var Request = artifacts.require('Request');
var Condition = artifacts.require('Condition');
var User = artifacts.require('User');

contract('DID', function(accounts) {
  let did;

  before('set up requests', (done) => {
    Requests.deployed().then((instance) => {
      did = new Did(
          Requests,
          instance.address,
          web3.currentProvider,
          accounts[0]
      );
    }).then(() => done());
  });

  let condition;
  before('set up condition', (done) => {
    Condition.deployed(1).then((instance) => {
      condition = instance;
    }).then(() => done());
  });

  /*
  let user;
  before('set up user', (done) => {
    User.deployed().then((instance) => {
      user = instance;
      console.log('user instance:' + user);
      let condition = Condition.new(1);
      await user.newUser(accounts[2], 'ssn', '130');
      await user.setConditionContractAddress(condition.address);
      done();
    });
  });
  */

  let request;
  let requestContractInstance;
  it('should create a request', async () => {

    console.log("getUserCount: " + await did.getUserCount())

    console.log(await did.createUser(accounts[2], 'ssn', '130'));
    console.log("getUserCount: " + await did.getUserCount())

    console.log(await did.createUser(accounts[2], 'ssn', '130'));
    console.log("getUserCount: " + await did.getUserCount())

    let user = await User.new();
    let ownerAddress = accounts[2];
    user.newUser(ownerAddress, 'ssn', '130');
    await user.setConditionContractAddress(condition.address);
    let requestCount1 = await did.getRequestCount();
    var rtext = 'Release credit record';

    request = await did.createRequest(user.address, rtext, 1);
    console.log('request ID ' + request + ', type: ' + typeof(request));

    let requestCount2 = await did.getRequestCount();
    console.log('rcount1 ' + requestCount1 + ', type: ' + typeof(requestCount1));
    console.log('rcount2 ' + requestCount2 + ', type: ' + typeof(requestCount2));
    console.log('requestCount diff:' + parseInt(requestCount2 - requestCount1));
    assert.equal(1, requestCount2 - requestCount1, 'Count');

    requestContractInstance = Request.at(request);
    assert.equal(1, requestCount2 - requestCount1, 'Count');
    assert.equal(await requestContractInstance.requestText(), rtext, 
                'request text');
  });

  it('should response to the request', async () => {
    // use did 
    console.log('About to add IDP Response');
    // Here we get an error because request is a string but the smart contract
    // treat is as object
    // await did.addIdpResponse(request, 0, 'OK');
    // console.log("Added IDP Response");
    let result = await requestContractInstance.authenticationComplete();
    assert.equal(false, result, 'Should not complete yet.')

    // use request object directly. The responder would be accounts[1].
    /*
    await request.addIdpResponse(accounts[1], 0, 'OK');
    result = await request.authenticationComplete();
    assert.ok(result, 'Authen should complete.')
    */
  });
});
