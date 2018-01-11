pragma solidity ^0.4.17;

import './response.sol';

// Simple Condition contract that the function isComplete is true when minimum
// response OK count is met. This is pretty much and condition only.
contract Condition {
  uint minimumResponseOKCount;

  function Condition(uint _minimumResponseOKCount) public {
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

contract Request {
  address public rpAddress;
  address public userAddress;
  string public rpCondition;
  string public requestText;
  bool public authenticationComplete;
  address[] public idpAddressList;    
  address[] public asServiceAddressList;    
  Response public idpResponse;
  // AsResponse[] asResponseList;
  string public requestStatus;
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
    rpAddress = _rpAddress;
    userAddress = _userAddress;
    rpCondition = _rpCondition;
    requestText = _requestText;
    idpAddressList = _idpAddressList;
    asServiceAddressList = _asServiceAddressList;
    // TODO: Put iniialization of condition in user contract.
    condition = new Condition(1);
    authenticationComplete = false;
    idpResponse = new Response();
  }

  function setRequestStatus(string _val) public {
    requestStatus = _val;
  }

  function addIdpResponse(address idp, uint code, bytes32 message) public {
    idpResponse.addResponse(idp, code, message);
    LogIdpResponse(idp, code, message); 
    if (condition.isComplete(idpResponse)) {
      authenticationComplete = true;
      LogConditionComplete(this, condition);
    }
  }

  function getIdpResponse() public view returns (Response res) {
    return idpResponse;
  }

  event LogIdpResponse(address idpAddress, uint code, bytes32 message);
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
