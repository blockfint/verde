/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

import { default as Did } from '../lib/did';
var Requests = artifacts.require('./Requests.sol');
var Request = artifacts.require('./Request.sol');

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

  let request;
  let requestContractInstance;
  it('should create a request', async () => {
    let requestCount1 = await did.getRequestCount();
    let rtext = 'Release credit record';

    request = await did.createRequest('0x1234', rtext, 1);
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
    console.log("About to add IDP Response");
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
