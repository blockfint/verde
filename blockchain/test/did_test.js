/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

import { default as Did } from '../lib/did';
var Requests = artifacts.require('Requests');
var Request = artifacts.require('Request');
var Response = artifacts.require('Response');
var Condition = artifacts.require('Condition');
var User = artifacts.require('User');
var UserDirectory = artifacts.require('UserDirectory');

contract('DID', function(accounts) {
  let did;
  let userDirectoryAddress;

  before('deploy user directory', done => {
    UserDirectory.deployed()
      .then(instance => {
        userDirectoryAddress = instance.address;
      })
      .then(() => done());
  });

  before('set up requests', done => {
    Requests.deployed()
      .then(instance => {
        did = new Did(
          Requests,
          instance.address,
          web3.currentProvider,
          accounts[0],
          {
            Request,
            Response,
            User,
            Condition,
            UserDirectory,
            directoryAddress: userDirectoryAddress
          }
        );
      })
      .then(() => done());
  });

  /*
  let condition;
  before('set up condition', (done) => {
    Condition.deployed(1).then((instance) => {
      condition = instance;
    }).then(() => done());
  });
  
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

  let user1_id = '1111';
  let user1_namespace = 'cid';
  let user1_owner = accounts[0];

  let user2_id = '2222';
  let user2_namespace = 'cid';
  let user2_owner = accounts[0];

  it('should create a user', async () => {
    // Before create user
    assert.equal(
      (await did.getUserCount()).toString(),
      0,
      'User count should be 0'
    );

    // Create user 1
    let user1_Address_1 = await did.createUser(
      user1_owner,
      user1_namespace,
      user1_id
    );
    assert.equal(
      (await did.getUserCount()).toString(),
      1,
      'User count should be 1'
    );

    // Create exist user ==> should got same Contract address
    let user1_Address_2 = await did.createUser(
      user1_owner,
      user1_namespace,
      user1_id
    );
    assert.equal(
      user1_Address_1,
      user1_Address_2,
      'Should same User contract address'
    );

    // Check user count again
    assert.equal(
      (await did.getUserCount()).toString(),
      1,
      'User count should be 1'
    );

    // Create user 2 ==> user count should be 2
    let user2_Address = await did.createUser(
      user2_owner,
      user2_namespace,
      user2_id
    );
    assert.notEqual(user2_Address, '', 'Contract address should not empty');
    assert.equal(
      (await did.getUserCount()).toString(),
      2,
      'User count should be 2'
    );
  });

  let request;
  let requestContractInstance;
  it('should create a request', async () => {
    /*
    let user = await User.new();
    let ownerAddress = accounts[2];
    user.newUser(ownerAddress, 'ssn', '130');
    await user.setConditionContractAddress(condition.address);
    */

    // use createUser in DID
    let ownerAddress = accounts[2];
    let userAddress = await did.createUser(ownerAddress, 'ssn', '130');
    let user = await User.at(userAddress);

    let requestCount1 = await did.getRequestCount();
    var rtext = 'Release credit record';

    request = await did.createRequest(user.address, rtext, 1);
    console.log('request ID ' + request + ', type: ' + typeof request);

    let requestCount2 = await did.getRequestCount();
    console.log('rcount1 ' + requestCount1 + ', type: ' + typeof requestCount1);
    console.log('rcount2 ' + requestCount2 + ', type: ' + typeof requestCount2);
    console.log('requestCount diff:' + parseInt(requestCount2 - requestCount1));
    assert.equal(1, requestCount2 - requestCount1, 'Count');

    requestContractInstance = Request.at(request);
    assert.equal(1, requestCount2 - requestCount1, 'Count');
    assert.equal(
      await requestContractInstance.requestText(),
      rtext,
      'request text'
    );
  });

  it('should response to the request', async () => {
    let ownerAddress = accounts[2];
    let userAddress = await did.createUser(ownerAddress, 'cid', '11111');
    await did.setMinimumResponse(userAddress, 3);

    var rtext = 'Release credit record';
    let requestID = await did.createRequest(userAddress, rtext);
    console.log('request ID 1 ' + requestID + ', type: ' + typeof requestID);
    // let request = await Request.at(requestID);

    var rtext_2 = 'Pay for Blockfint ICO';
    let requestID_2 = await did.createRequest(userAddress, rtext_2);
    console.log(
      'request ID 2 ' + requestID_2 + ', type: ' + typeof requestID_2
    );

    let requestResult = await did.getRequestsByUserAddress(userAddress);
    assert.equal(
      2,
      requestResult[1]['pending'].length,
      'should have 2 pending request'
    );

    await did.addIdpResponse(requestID, 0, 'OK');
    await did.addIdpResponse(requestID, 0, 'OK');
    await did.addIdpResponse(requestID, 0, 'OK');

    requestResult = await did.getRequestsByUserAddress(userAddress);
    assert.equal(
      1,
      requestResult[1]['pending'].length,
      'should have 1 pending request'
    );

    assert.equal(
      1,
      requestResult[1]['approved'].length,
      'should have 1 approved request'
    );

    await did.addIdpResponse(requestID_2, 0, 'OK');
    await did.addIdpResponse(requestID_2, 1, 'Not OK');
    await did.addIdpResponse(requestID_2, 1, 'Not OK');

    requestResult = await did.getRequestsByUserAddress(userAddress);
    assert.equal(
      0,
      requestResult[1]['pending'].length,
      'should have 0 pending request'
    );

    assert.equal(
      1,
      requestResult[1]['approved'].length,
      'should have 1 approved request'
    );

    assert.equal(
      1,
      requestResult[1]['denied'].length,
      'should have 1 denied request'
    );

    // use did
    // console.log('About to add IDP Response');
    // Here we get an error because request is a string but the smart contract
    // treat is as object
    // await did.addIdpResponse(request, 0, 'OK');
    // console.log("Added IDP Response");
    // let result = await requestContractInstance.authenticationComplete();
    // assert.equal(false, result, 'Should not complete yet.');

    // use request object directly. The responder would be accounts[1].
    /*
    await request.addIdpResponse(accounts[1], 0, 'OK');
    result = await request.authenticationComplete();
    assert.ok(result, 'Authen should complete.')
    */
  });
});
