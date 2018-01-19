/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var UserDirectory = artifacts.require('UserDirectory');
var User = artifacts.require('User');

contract('UserDirectory', function(accounts) {
  let userDirectory;
  let user1;
  let user2;

  before('set up user1', (done) => {
    User.new().then((instance) => {
      user1 = instance;
      done();
    });
  });

  before('set up user2', (done) => {
    User.new().then((instance) => {
      user2 = instance;
      done();
    });
  });

  before('set up user directory', (done) => {
    UserDirectory.new().then((instance) => {
      userDirectory = instance;
      done();
    });
  });

  let user1_id = '1111';
  let user1_namespace = 'aaaa';
  let user1_owner = accounts[0];

  let user2_id = '2222';
  let user2_namespace = 'bbbb';
  let user2_owner = accounts[1];

  it('should have all getters with correct value', async () => {
    // create new user1
    await user1.newUser(user1_owner, user1_namespace, user1_id);
    await userDirectory.newUser(user1_id, user1.address);

    // create new user2
    await user2.newUser(user2_owner, user2_namespace, user2_id);
    await userDirectory.newUser(user2_id, user2.address);

    // get Contract address from UserDirectory
    var user1_ContractAddr = await userDirectory.findUserByID(user1_id);
    assert.equal(user1_ContractAddr, user1.address, 'User 1 contract address will be the same.');

    var user2_ContractAddr = await userDirectory.findUserByID(user2_id);
    assert.equal(user2_ContractAddr, user2.address, 'User 2 contract address will be the same.');

    // test wrong User ID
    var wrong_ContractAddr = await userDirectory.findUserByID('3333');
    assert.equal(web3.toDecimal(wrong_ContractAddr), 0, 'Should be get 0.');

    // Should have correct value
    var new_user1 = User.at(user1_ContractAddr);
    assert.equal(user1_id, await new_user1.id(), 'id');
    assert.equal(user1_namespace, await new_user1.namespace(), 'namespace');
    assert.equal(user1_owner, await new_user1.owner(), 'owner');

    var new_user2 = User.at(user2_ContractAddr);
    assert.equal(user2_id, await new_user2.id(), 'id');
    assert.equal(user2_namespace, await new_user2.namespace(), 'namespace');
    assert.equal(user2_owner, await new_user2.owner(), 'owner');

    // check get user count 
    assert.equal(2, new web3.BigNumber(await userDirectory.userCount()).toString(), 'User count');

  });

});
