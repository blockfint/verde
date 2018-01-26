import * as busInterface from './busInterface';
//import * as userDirectoryInterface from './userDirectoryInterface';

// Wait for all event.
busInterface.event.on('success', function(event) {
  // Get requestId from event
  const requestId = event.requestId;
  const resultCode = event.resultCode;
  const resultMsg = event.resultMsg;

  console.log("Authentication success");
  console.log("request id: " + requestId + ", code: " + resultCode + ", msg: " + resultMsg);
});

busInterface.event.on('error', function(error) {
  const requestId = error.requestId;
  const errorCode = error.code;
  const errorMsg = error.message;

  console.error("Error request id: " + requestId + ", code: " + 
      errorCode + ", msg: " + errorMsg);
});

const user = {
  id: '1100023145268',
  namespace: 'cid'
}

export const requestAuthen = async (idps, hideSourceRpId) => {
  const requestId = await busInterface.createIdpRequest(user, idps, hideSourceRpId);
  console.log("Request sent with request ID: " + requestId);
  return requestId;
};
