pragma solidity ^0.4.17;

import './Icondition.sol';

contract User {
  address public owner;
  string public id;
  string public namespace;
  // This should be the address of condition contract during the request.
  ICondition public conditionContract;
  string public name;
  address[] public idpAddressList;    
  address[] public endorserList;
  uint public status;
  uint public state;

  // TODO: Add state so newUser can be used only once.
  function newUser(
    address _owner,
    string _namespace,
    string _id
    ) public {
      owner = _owner;
      namespace = _namespace;
      id = _id;
  }

  function setName(string _name) public {
    name = _name;
  }

  function setStatus(uint _status) public {
    status = _status;
  }

  function setConditionContractAddress(address _condition) public {
    conditionContract = ICondition(_condition);
  }
}
