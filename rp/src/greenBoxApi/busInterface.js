import EventEmitter from 'events';
import { rpInterface } from '../../../blockchain/build/lib/interface_lib';

export const event = new EventEmitter();

//const RP_ID = process.env.RP_ID || 1;

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

export const createIdpRequest = async (user, idps, hideSourceRpId = false) => {
  // TO-DO
  // do something with blockchain
  
  let requestId = await rpInterface.createRequest({
    userId: user.id,
    requestText: 'Mockup request details'
  }); 

  /*ipc.of.bus.emit('createRequest',{
    userId: user.id,
    requestId: requestId,
    rpId: hideSourceRpId ? null : RP_ID,
    // data: user,
  });*/
  
  return requestId;
};

rpInterface.watchIDPResponseEvent(function(error, argsObject) {
  if(error) console.error('error:',error);
  //check whether approve or denied
  if(argsObject.code === 'true') handleApprove(argsObject.requestID);
  else handleDeny(argsObject.requestID);
});
