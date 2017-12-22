import EventEmitter from 'events';
import crypto from 'crypto';
import ipc from 'node-ipc';

export const event = new EventEmitter();

ipc.config.id = 'rp';
ipc.config.retry = 1500;
ipc.config.silent = true;

function generateRequestId() {
  return crypto.randomBytes(20).toString('hex');
}

// TO-DO
// interface with bus/blockchain

function handleApprove(requestId) {
  event.emit('success', {
    requestId: requestId
  });
}

function handleDeny(requestId) {
  event.emit('error', {
    requestId: requestId
  });
}

export const createIdpRequest = (user, hideSourceRpId = false) => {
  // TO-DO
  // do something with blockchain
  
  let requestId = generateRequestId();

  ipc.of.bus.emit('createRequest',{
    userId: user.id,
    requestId: requestId,
    rpId: hideSourceRpId ? null : 1,
    // data: user,
  });
  
  return requestId;
};

ipc.connectToNet('bus',function() {
  console.log('Connecting to bus');
  ipc.of.bus.on('connect',() => console.log('connected to bus'));
  ipc.of.bus.on('error',() => console.error('error connecting to bus'));
  ipc.of.bus.on('approve',handleApprove);
  ipc.of.bus.on('deny',handleDeny);
});
