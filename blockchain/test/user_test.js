/* global assert:true, artifacts:true, contract:true */
/* eslint-env mocha */

var User = artifacts.require('User');
var Condition = artifacts.require('Condition');

contract('User', function(accounts) {
  let user;
  let condition;

  before('set up user', done => {
    User.new().then(instance => {
      user = instance;
      console.log('user instance:' + user);
      done();
    });
  });

  let id = '1111';
  let namespace = 'nnn';
  let owner = accounts[0];
  it('should have all getters with correct value', async () => {
    await user.newUser(owner, namespace, id);
    condition = await Condition.new(1);
    assert.equal(id, await user.id(), 'id');
    assert.equal(namespace, await user.namespace(), 'namespace');
    assert.equal(owner, await user.owner(), 'owner');
    // console.log('instance 2:' + JSON.stringify(condition));
    await user.setConditionContractAddress(condition.address);
    let caddr = await user.conditionContract();
    console.log('caddr:' + caddr);
    assert.equal(condition.address, caddr, 'condition contract address');
    assert.equal(1, await condition.minimumResponseOKCount(), 
                 'ok count default');
    await condition.setMinimumResponseOKCount(3);
    assert.equal(3, await condition.minimumResponseOKCount(), 'ok count');
    // caddr = await user.conditionContract();
    // caddr.at()
    // use user object directly. The responder would be accounts[1].
  });
});
