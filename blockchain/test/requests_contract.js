var Requests = artifacts.require("./Requests.sol");

contract('Requests', function(accounts) {
  let requests
  it("should create a request", function() {
    return Requests.deployed().then(function(instance) {
      requests = instance;
      return requests.createRequest("0x1234","Release credit record", 1)
    }).then(function(rval) {
      console.log("rval " + rval);
      return requests.getRequestCount.call();
    }).then(function(requestCount) {
      assert.equal(requestCount, 1, "Count");
    });
  });
});
