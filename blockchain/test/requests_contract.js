var Requests = artifacts.require('./Requests.sol');

contract('Requests', function(accounts) {
  let requests;

  before('set up requests', (done) => {
    Requests.deployed().then((instance) => {
      requests = instance;
    }).then(() => done());
  });

  it('should create two requests', async() => {
      let requestCount1 = await requests.getRequestCount();
      let request1 = await requests.createRequest(
        '0x1234','Release credit record', 1);
      let requestCount2 = await requests.getRequestCount();
      console.log('rcount1 ' + requestCount1 + ', type: ' + typeof(requestCount1));
      console.log('rcount2 ' + requestCount2 + ', type: ' + typeof(requestCount2));
      console.log('requestCount diff:' + parseInt(requestCount2 - requestCount1));
      assert.equal(1, requestCount2 - requestCount1, 'Count');
 
      let request2 = await requests.createRequest('0x1235','Own car?', 1);
      requestCount2 = await requests.getRequestCount();
      assert.equal(2, requestCount2 - requestCount1, 'Count');
      assert.notEqual(request2, request1, 'request ID should not be the same');
  });
});
