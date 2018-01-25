pragma solidity ^0.4.17;

import './Response.sol';

// Simple Condition contract that the function isComplete is true when minimum
// response OK count is met. This is pretty much and condition only.
contract Condition {
  uint public minimumResponseOKCount = 1;

  function Condition(uint _minimumResponseOKCount) public {
    minimumResponseOKCount = _minimumResponseOKCount;
  }

  function setMinimumResponseOKCount(uint _minimumResponseOKCount) public {
    minimumResponseOKCount = _minimumResponseOKCount;
  }

  function isComplete(Response _response) public view
      returns (bool complete) {
    uint responseOKCount = 0;
    uint responseCount;
    uint responseIndex;
    uint responseCode;
    responseCount = _response.getResponseCount();
    for (responseIndex = 0; responseIndex < responseCount; responseIndex++) {
      responseCode = _response.getResponseCodeAtIndex(responseIndex);
      if (responseCode == 0) {
        responseOKCount++;
        if (responseOKCount >= minimumResponseOKCount) {
          return true;
        }
      }
    }
    return false;
  }
}
