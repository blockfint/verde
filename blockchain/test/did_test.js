/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

import { default as Did } from '../lib/did'
var Requests = artifacts.require('./Requests.sol');

contract('Did', function(accounts) {
  let did

  before('set up requests', (done) => {
    Requests.deployed().then((instance) => {
      did = new Did(
          Requests,
          instance.address,
          web3.currentProvider,
          accounts[0]
      )
    }).then(() => done())
  })

  it('should create a request', async () => {
    let requestCount1 = await did.getRequestCount();

    const rval = await did.createRequest(
      '0x1234','Release credit record', 1);
    console.log('request ID ' + rval + ', type: ' + typeof(rval));

    let requestCount2 = await did.getRequestCount();
    console.log('rcount1 ' + requestCount1 + ', type: ' + typeof(requestCount1));
    console.log('rcount2 ' + requestCount2 + ', type: ' + typeof(requestCount2));
    console.log('requestCount diff:' + parseInt(requestCount2 - requestCount1));
    assert.equal(1, requestCount2 - requestCount1, 'Count');
  });
});
