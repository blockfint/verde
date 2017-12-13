const busEventEmitter = require('./eventEmitter');

requestEventEmitter.emit('eventName', null, {
  requestId: 1234,
  result_code: 999,
  result_msg: "Some message"
});

// IDP Code

//Wait for event
if event is IDPAuthenticationRequest {
  requestId = event.requestID
  rp = event.RP
  authenticate_result = authenticateForRP(rp)
  if authenticate_result is ok 
    request.addIdpResponse(requestID, {OK, ""})
  else
    request.addIdpResponse(requestID, {FAIL, "Failed: Too many tries"})
}

// JS
// Interface base instead of rigid message