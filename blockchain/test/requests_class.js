/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

import { default as RequestsLib } from '../lib/requests_lib'
var Requests = artifacts.require('./Requests.sol');

contract('RequestsLib', function(accounts) {
  let requestsLib

  before('set up requests', (done) => {
    Requests.deployed().then((instance) => {
      requestsLib = new RequestsLib(
          Requests,
          instance.address,
          web3.currentProvider,
          accounts[0]
      )
    }).then(() => done())
  })

  it('should create a request', async () => {
    let requestCount1 = await requestsLib.getRequestCount();

    const rval = await requestsLib.createRequest(
      '0x1234','Release credit record', 1);
    console.log('request ID ' + rval + ', type: ' + typeof(rval));

    let requestCount2 = await requestsLib.getRequestCount();
    console.log('rcount1 ' + requestCount1 + ', type: ' + typeof(requestCount1));
    console.log('rcount2 ' + requestCount2 + ', type: ' + typeof(requestCount2));
    console.log('requestCount diff:' + parseInt(requestCount2 - requestCount1));
    assert.equal(1, requestCount2 - requestCount1, 'Count');
  });
});
