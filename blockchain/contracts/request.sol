pragma solidity ^0.4.17;

import './icondition.sol';
import './user.sol';

contract Request {
  address public rpAddress;
  address public userAddress;
  User user;
  string public rpCondition;
  string public requestText;
  bool public authenticationComplete;
  address[] public idpAddressList;    
  address[] public asServiceAddressList;    
  Response public idpResponse;
  // AsResponse[] asResponseList;
  string public requestStatus;
  uint timeStamp;
  // This address of the condition contract used during the request.
  // User may change the condition contract for each request so we
  // should store this in the blockchain to record the condition contract used
  // for each request. 
  ICondition condition;

  // TODO: Add state so newRequest can be used only once.
  function newRequest(
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
    user = User(userAddress);
    condition = user.conditionContract();
    require(address(condition) != address(0));
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
                             ICondition conditionContract);
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
