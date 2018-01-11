var Requests = artifacts.require('./Requests.sol');
var Request = artifacts.require('./Request.sol');

module.exports = function(deployer) {
  deployer.deploy(Requests);
  deployer.deploy(Request);
};
