// const busInterface = require('./busInterface');
import busInterface from './busInterface';

// const busEventEmitter = require('./eventEmitter');
import busEventEmitter from './eventEmitter';

// const userDirectoryInterface = require('./userDirectoryInterface');
import * as userDirectoryInterface from './userDirectoryInterface';

// Wait for all event.
busEventEmitter.on('success', function(event) {
  // Get requestId from event
  const requestId = event.requestId;
  const resultCode = event.resultCode;
  const resultMsg = event.resultMsg;

  console.log("Authentication success");
  console.log("request id: " + requestId + ", code: " + resultCode + ", msg: " + resultMsg);
});

busEventEmitter.on('error', function(error) {
  const requestId = error.requestId;
  const errorCode = error.code;
  const errorMsg = error.message;

  console.error("Error request id: " + requestId + ", code: " + 
      errorCode + ", msg: " + errorMsg);
});

const IDENTIFICATION_NUMBER = '1100023145268';

// Read the user directory
const user = userDirectoryInterface.getId(IDENTIFICATION_NUMBER);

export const requestAuthen = (hideSourceRpId) => {
  const requestId = busInterface.createIdpRequest(user, hideSourceRpId);
  console.log("Request sent with request ID: " + requestId);
  return requestId;
};

// requestAuthen();
// simulate request every 1 second
// setInterval(() => {
//   requestAuthen();
// }, 1000);
