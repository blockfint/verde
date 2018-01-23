pragma solidity ^0.4.17;

import "./Request.sol";

contract Requests {

  uint requestIndex = 0;
  Request[] requestContracts;

  event LogNewRequest(address rpAddress, address requestContract, uint index);
  event LogRequest(address rpAddress, address userAddress, string requestText,
    uint idpCount, address requestID);

  function createRequest(
    address _userAddress,
    // The _requestText is temporary. It will be moved to stay out of the
    // request later.
    string _requestText,
    uint _idpCount
    ) public returns (Request requestID) {
        
    address[] memory idpAddressList;
    address[] memory asServiceAddressList;
    string memory rpCondition;
    Request requestContract;
    requestContract = new Request();
    requestContract.newRequest(msg.sender, _userAddress, rpCondition,
                               _requestText, idpAddressList,
                               asServiceAddressList);
    requestIndex = requestContracts.push(requestContract) - 1;
    // Create request event.
    LogRequest(msg.sender, _userAddress, _requestText, _idpCount, 
               requestContract);
    // Create new request event.
    LogNewRequest(msg.sender, requestContract, requestIndex); 
    return requestContract;
  }

  function getRequestCount() public view returns (uint count) {
    return requestContracts.length;
  }

  function getRequest(uint index) public view returns (Request request) {
    return requestContracts[index];
  }

  function addIdpResponse(address requestID, uint code, bytes32 message) public {
    // TODO: Check if the sender is the valid IDP.
    Request requestContract = Request(requestID);
    requestContract.addIdpResponse(msg.sender, code, message);
    IdpResponse(requestContract, msg.sender, code, message);
  }

  event AuthenticationComplete(address requestID, string code, string message);
  event AuthenticationFail(address requestID, string code, string message);
  event IdpResponse(address requestID, address idpAddress, 
                    uint code, bytes32 message);
}
