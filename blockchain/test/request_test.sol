pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/request.sol";
import "../contracts/response.sol";

contract TestRequest {

  // address constant public rpAddress = 0xE0f5206BBD039e7b0592d8918820024e2a7437b9;
  address public rpAddress = 0xA34;
  address public userAddress = 0x567;
  address public idpAddress1 = 0x789;
  address public idpAddress2 = 0x78A;
  address public idpAddress3 = 0x78B;
  bytes32 idpMsg1 = "IDP1";
  bytes32 idpMsg2 = "IDP2";

  function testNewRequest() public {
    address[] memory empty;
    uint resCode;
    bytes32 resMsg;

    Request req = new Request(rpAddress, userAddress, "rp condition", 
                              "req text", empty, empty) ;

    Assert.equal(rpAddress, req.rpAddress(), "rp address");
    Assert.equal(userAddress, req.userAddress(), "user address");
    /* This do not work due to string and public getter function 
    req.setRequestStatus("SSS");
    Assert.equal("SSS", req.requestStatus(), "req status");
    */
    req.addIdpResponse(idpAddress1, 1, idpMsg1);
    Response res = req.getIdpResponse();
    (resCode, resMsg) = res.getResponse(idpAddress1);
    Assert.equal(1 , resCode, "res code");
    Assert.equal(idpMsg1 , resMsg, "res msg");

    req.addIdpResponse(idpAddress2, 2, idpMsg2);
    res = req.getIdpResponse();
    (resCode, resMsg) = res.getResponse(idpAddress2);
    Assert.equal(2 , resCode, "res code");
    Assert.equal(idpMsg2 , resMsg, "res msg");

    Assert.equal(false, req.authenticationComplete(), "authen complete");
  } 

  function testAuthenComplete() public {
    address[] memory empty;
    uint resCode;
    bytes32 resMsg;

    Request req = new Request(rpAddress, userAddress, "rp condition", 
                              "req text", empty, empty) ;

    req.addIdpResponse(idpAddress1, 1, idpMsg1);
    Response res = req.getIdpResponse();
    (resCode, resMsg) = res.getResponse(idpAddress1);
    Assert.equal(1 , resCode, "res code");
    Assert.equal(idpMsg1 , resMsg, "res msg");
    Assert.equal(false, req.authenticationComplete(), "authen complete");

    req.addIdpResponse(idpAddress2, 0, idpMsg2);
    res = req.getIdpResponse();
    (resCode, resMsg) = res.getResponseAtIndex(1);
    Assert.equal(0 , resCode, "res code");
    Assert.equal(idpMsg2 , resMsg, "res msg");
    Assert.equal(true, req.authenticationComplete(), "authen complete");
  } 
}
