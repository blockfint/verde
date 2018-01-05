pragma solidity ^0.4.17;

import './response.sol';

// Simple Condition contract that the function isComplete is true when minimum
// response OK count is met. This is pretty much and condition only.
contract Condition {
  uint minimumResponseOKCount;

  function Condition(uint _minimumResponseOKCount) public {
    minimumResponseOKCount = _minimumResponseOKCount;
  }

  function isComplete(Response _response) public 
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

contract Request {

  address userAddress;
  string rpCondition;
  string requestText;
  bool authenticationComplete;
  address[] idpAddressList;    
  address[] asServiceAddressList;    
  Response idpResponse;
  // AsResponse[] asResponseList;
  string requestStatus;
  uint timeStamp;
  // This should be the address of condition contract during the request.
  // The reason is that user may change the condition contract later so we
  // should store this in the blockchain. 
  Condition condition;

  function Request(
    address _rpAddress,
    address _userAddress,
    string _rpCondition,
    string _requestText,
    address[] _idpAddressList,
    address[] _asServiceAddressList   
    ) public {
    userAddress = _userAddress;
    rpCondition = _rpCondition;
    requestText = _requestText;
    idpAddressList = _idpAddressList;
    asServiceAddressList = _asServiceAddressList;
    // TODO: Put iniialization of condition in user contract.
    condition = new Condition(1);
    authenticationComplete = false;
  }

  function addIdpResponse(address idp, uint code, string message) public {
    idpResponse.addResponse(idp, code, message);
    LogIdpResponse(idp, code, message); 
    if (condition.isComplete(idpResponse)) {
      authenticationComplete = true;
      LogConditionComplete(this, condition);
    }
  }

  event LogIdpResponse(address idpAddress, uint code, string message);
  event LogConditionComplete(Request requestContract,
                             Condition conditionContract);
}

/*
Contract ICondition {
  function isComplete(address _requestContract) returns (bool complete) {
  }
}

Contract IUsers {
}

Contract IUser {
  function setConditionContract(address _conditionContract) {
  }
}


*/

// smart contract class
// Use interface base instead of class. Use event notification to signify state
// changed. The JS API would be decoupled from BC.
