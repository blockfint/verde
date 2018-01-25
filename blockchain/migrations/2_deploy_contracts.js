/* global artifacts:true */

var Requests = artifacts.require('./Requests.sol');
var Request = artifacts.require('./Request.sol');
var Condition = artifacts.require('./Condition.sol');
var User = artifacts.require('./User.sol');
var UserDirectory = artifacts.require('UserDirectory');

var fs = require('fs');
var objJSON = {};

module.exports = function(deployer) {
  deployer.deploy(Requests).then(() => {
    objJSON[Requests.contractName] = Requests.address;
  });
  deployer.deploy(Request).then(() => {
    objJSON[Request.contractName] = Request.address;
  });
  deployer.deploy(Condition).then(() => {
    objJSON[Condition.contractName] = Condition.address;
  });
  deployer.deploy(User).then(() => {
    objJSON[User.contractName] = User.address;
  });
  deployer.deploy(UserDirectory).then(() => {
    objJSON[UserDirectory.contractName] = UserDirectory.address;
  });
  deployer.then(() => {
    fs.writeFile(
      'contract_addresses.json',
      JSON.stringify(objJSON, null, 2),
      err => {
        if (err) throw err;
      }
    );
  });
};
