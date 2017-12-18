import busEventEmitter from './eventEmitter';

let requestId = 0;

// simulate success event
// setInterval(() => {
//   busEventEmitter.emit('success', {
//     requestId: ++requestId,
//     resultCode: 999,
//     resultMsg: "Some message"
//   });
// }, 2000);

// simulate error event
// setInterval(() => {
//   busEventEmitter.emit('error', {
//     requestId: ++requestId,
//     code: 876,
//     message: "Error processing request"
//   });
// }, 5000);

// TO-DO
// interface with bus/blockchain

module.exports = {
  createIdpRequest: function(user) {
    // TO-DO
    // do something with blockchain
    
    let requestIdToUse = ++requestId;

    // simulate task which uses 1.5 second to complete
    setTimeout(function() {
      busEventEmitter.emit('success', {
        requestId: requestIdToUse,
        resultCode: 999,
        resultMsg: "Some message for user: " + user.name + " " + user.lastname
      });
    }, 1500);
    
    return requestIdToUse;
  }
}