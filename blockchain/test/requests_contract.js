/* global assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var Requests = artifacts.require('Requests');
var User = artifacts.require('User');
var Condition = artifacts.require('Condition');

contract('Requests', function(accounts) {
  let requests;
  let condition;

  before('set up requests', (done) => {
    Requests.deployed().then((instance) => {
      requests = instance;
    }).then(() => done());
  });

  before('set up condition', (done) => {
    Condition.deployed(1).then((instance) => {
      condition = instance;
    }).then(() => done());
  });

  it('should create two requests', async() => {
      let user = await User.new();
      let ownerAddress = accounts[2];
      user.newUser(ownerAddress, 'ssn', '130');
      await user.setConditionContractAddress(condition.address);
      let requestCount1 = await requests.getRequestCount();
      console.log('rcount1 ' + requestCount1);
      let request1 = await requests.createRequest(
        user.address, 'Release credit record', 1);
      let requestCount2 = await requests.getRequestCount();
      console.log('rcount1 ' + requestCount1 + ', type: ' + 
                 typeof(requestCount1));
      console.log('rcount2 ' + requestCount2);
      console.log('requestCount diff:' + 
                  parseInt(requestCount2 - requestCount1));
      assert.equal(1, requestCount2 - requestCount1, 'Count');
 
      let request2 = await requests.createRequest(user.address,
                     'Own 25 watches ?', 1);
      requestCount2 = await requests.getRequestCount();
      assert.equal(2, requestCount2 - requestCount1, 'Count');
      assert.notEqual(request2, request1, 
                      'request ID should not be the same');
  });
});
