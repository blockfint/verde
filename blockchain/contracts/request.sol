pragma solidity ^0.4.17;

import './response.sol';

contract Request {

  address userAddress;
  string rpCondition;
  string requestText;
  bool authenticationComplete;
  address[] idpAddressList;    
  address[] asServiceAddressList;    
  // AsResponse[] asResponseList;
  string requestStatus;
  uint timeStamp;

  event LogIdpResponse(address idpAddress, string code, string message);

  function Request(
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
  }

  function addIdpResponse (string code, string message) public {
    LogIdpResponse(msg.sender, code, message); 
  }
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


Contract Condition {
  unit minimumResponseOKCount;

  function Condition(unit _minimumResponseOKCount) {
    minimumResponseOKCount = _minimumResponseOKCount;
  }

  function isComplete(address _requestContract) returns (bool complete) {
    responseOKCount = 0
    responseCount = _requestContract.getResponseCount()
    for (responseIndex = 0; responseIndex < respCount; responseIndex++) {
      reponse = _requestContract.getResponse([responseCount])
      if (response.result == OK) {
        responseOKCount++;
        if (responseOKCount >= minimumResponseOK) {
          return true;
        }
      }
    }
    return false;
  }
}
*/

// smart contract class
// Use interface base instead of class. Use event notification to signify state
// changed. The JS API would be decoupled from BC.
