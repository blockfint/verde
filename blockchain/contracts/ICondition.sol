pragma solidity ^0.4.17;

import './Response.sol';

contract ICondition {
  function Condition(uint _minimumResponseOKCount) public;
  function isComplete(Response _response) public view returns (bool complete);
  function minimumResponseOKCount() public view returns (int count);
}
