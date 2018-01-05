pragma solidity ^0.4.17;

contract Response {
  struct ResponseStruct {
    uint code;
    string message;
    uint index;
  }

  mapping(address => ResponseStruct) private responseStructs;
  address[] responses;

  function addResponse(address _responder, uint _code, string _message) 
      public returns(uint index) {
    responseStructs[_responder].code = _code;
    responseStructs[_responder].message = _message;
    responseStructs[_responder].index = responses.push(_responder) - 1;
    return responses.length - 1;
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
