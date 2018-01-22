var Requests = artifacts.require('./Requests.sol');
var Request = artifacts.require('./Request.sol');
var Condition = artifacts.require('./Condition.sol');
var User = artifacts.require('./User.sol');
var UserDirectory = artifacts.require('UserDirectory');

module.exports = function(deployer) {
  deployer.deploy(Requests);
  deployer.deploy(Request);
  deployer.deploy(Condition);
  deployer.deploy(User);
  deployer.deploy(UserDirectory);
};
