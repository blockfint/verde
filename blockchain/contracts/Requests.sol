pragma solidity ^0.4.17;

contract Requests {

  uint requestIndex = 0;
  function createRequest(
    address _userAddress,
    string _requestText,
    uint _idpCount
    ) public returns (address requestID) {
        
    address request_contract_address = address(requestIndex);
    requestIndex += 1;
    Request(msg.sender, _userAddress, _requestText, _idpCount, 
            request_contract_address);
    return request_contract_address;
  }


  event Request(address rpAddress, address userAddress, string requestText,
    uint idpCount,
    address requestID);
  event AuthenticationComplete(address requestID, string code, string message);
  event AuthenticationFail(address requestID, string code, string message);
  event IdpResponse(address requestID, address idpAddress, 
                    string code, string message);
                    
  function getRequestCount() public view returns (uint count) {
    return requestIndex;
  }

  function addIdpResponse(address requestID, string code, string message) 
    public {
        
    IdpResponse(requestID, msg.sender, code, message);
  }

}

contract Response {
  struct ResponseStruct {
    uint code;
    string msg;
    uint index;
  }

  mapping(address => ResponseStruct) private responseStructs;
  address[] responderIndex;

  function addResponse(address _responder, uint _code, string _msg) 
      public returns(uint index) {
    responseStructs[_responder].code = _code;
    responseStructs[_responder].msg = _msg;
    responseStructs[_responder].index = responderIndex.push(_responder) - 1;
    return responderIndex.length - 1;
  }
}


