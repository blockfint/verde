/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

import { default as RequestsLib } from '../lib/requests_lib'
var Requests = artifacts.require("./Requests.sol");

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

  let requestCount
  it("should create a request", function() {
    requestCount = requestsLib.getRequestCount();
    return requestsLib.createRequest("0x1234","Release credit record", 1)
    }).then(function(rval) {
      // console.log("rval " + rval);
      return requestsLib.getRequestCount();
    }).then(function(requestCount) {
      console.log("requestCount:" + requestCount);
      assert.equal(requestCount, 1, "Count");
    });
  });
});
