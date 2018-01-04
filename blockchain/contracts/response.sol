pragma solidity ^0.4.17;

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
