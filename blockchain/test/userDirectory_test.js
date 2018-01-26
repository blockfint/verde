/* global web3:true, assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var UserDirectory = artifacts.require('UserDirectory');
var User = artifacts.require('User');

contract('UserDirectory', function(accounts) {
  let userDir;

  before('set up user directory', done => {
    UserDirectory.new().then(instance => {
      userDir = instance;
      done();
    });
  });

  let user1_id = '1111';
  let user1_namespace = 'aaaa';
  let user1_owner = accounts[0];

  let user2_id = '2222';
  let user2_namespace = 'aaaa';
  let user2_owner = accounts[1];

  it('should have all getters with correct value', async () => {
    // create new user1
    await userDir.newUser(user1_owner, user1_namespace, user1_id);
    var user1_cadd = await userDir.findUserByNamespaceAndId(
      user1_namespace,
      user1_id
    );

    // create new user2
    await userDir.newUser(user2_owner, user2_namespace, user2_id);
    var user2_cadd = await userDir.findUserByNamespaceAndId(
      user2_namespace,
      user2_id
    );

    // test wrong user ID
    var wrong_ContractAddr = await userDir.findUserByNamespaceAndId(
      'aaaa',
      '3333'
    );
    assert.equal(web3.toDecimal(wrong_ContractAddr), 0, 'Should be get 0.');

    // Should have correct value
    var new_user1 = User.at(user1_cadd);
    assert.equal(user1_id, await new_user1.id(), 'id');
    assert.equal(user1_namespace, await new_user1.namespace(), 'namespace');
    assert.equal(user1_owner, await new_user1.owner(), 'owner');

    var new_user2 = User.at(user2_cadd);
    assert.equal(user2_id, await new_user2.id(), 'id');
    assert.equal(user2_namespace, await new_user2.namespace(), 'namespace');
    assert.equal(user2_owner, await new_user2.owner(), 'owner');

    // check get user count
    assert.equal(
      2,
      new web3.BigNumber(await userDir.userCount()).toString(),
      'User count'
    );
  });
});
