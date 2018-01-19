pragma solidity ^0.4.17;

import './response.sol';

contract ICondition {
  function Condition(uint _minimumResponseOKCount) public;
  function isComplete(Response _response) public view returns (bool complete);
}
