import busEventEmitter from './eventEmitter';
import ipc from 'node-ipc';
ipc.config.id = 'rp';
ipc.config.retry = 1500;
ipc.config.silent = true;

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

function handleApprove(requestId) {
  busEventEmitter.emit('success', {
    requestId: requestId
  });
}

function handleDeny(requestId) {
  busEventEmitter.emit('error', {
    requestId: requestId
  });
}

module.exports = {
  createIdpRequest: function(user) {
    // TO-DO
    // do something with blockchain
    
    let requestIdToUse = ++requestId;

    /*busEveneEmitter.emit('success', {
      requestId: requestIdToUse,
      resultCode: 999,
      resultMsg: "Some message for user: " + user.name + " " + user.lastname
    });*/
    ipc.of.bus.emit('createRequest',{
      userId: user.id,
      requestId: requestIdToUse,
      data: user
    });
    
    return requestIdToUse;
  }
};

ipc.connectToNet('bus',function() {
  console.log('Connect to bus');
  ipc.of.bus.on('connect',() => console.log('connected to bus'));
  ipc.of.bus.on('error',() => console.error('error connecting to bus'));
  ipc.of.bus.on('approve',handleApprove);
  ipc.of.bus.on('deny',handleDeny);
});
