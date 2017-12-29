var Requests = artifacts.require("./Requests.sol");

module.exports = function(deployer) {
  deployer.deploy(Requests);
};
