pragma solidity ^0.4.17;

contract Response {
  struct ResponseStruct {
    uint code;
    string message;
    uint index;
    bool isAnswered;
  }

  mapping(address => ResponseStruct) private responseStructs;
  address[] responses;
  address private requestOwner;

  function Response() public {
    requestOwner = msg.sender;
  }

  function addResponse(address _responder, uint _code, string _message) 
      public returns(uint index) {
    if(msg.sender == requestOwner) {
      responseStructs[_responder].code = _code;
      responseStructs[_responder].message = _message;
      responseStructs[_responder].index = responses.push(_responder) - 1;
      responseStructs[_responder].isAnswered = true;
      return responses.length - 1;
    }
  }

  function didIRespond() public view returns (bool) {
    return responseStructs[msg.sender].isAnswered;
  }

  function getResponseCount() public view returns(uint count) {
    return responses.length;
  }

  function getResponseAtIndex(uint index) 
      public view returns(uint code, string message) {
    return (responseStructs[responses[index]].code,
            responseStructs[responses[index]].message);
  }

  function getResponseCodeAtIndex(uint index) 
      public view returns(uint code) {
    return (responseStructs[responses[index]].code);
  }

  function getResponse(address _responder) public view
      returns(uint code, string message) {
    return (responseStructs[_responder].code,
            responseStructs[_responder].message);
  }
}
