import EventEmitter from 'events';
import { rpInterface } from '../../../blockchain/build/lib/interface_lib';

export const event = new EventEmitter();

//const RP_ID = process.env.RP_ID || 1;

// TO-DO
// interface with bus/blockchain

function handleApprove(requestId) {
  console.log('approve');
  /*event.emit('success', {
    requestId: requestId
  });*/
}

function handleDeny(requestId) {
  console.log('deny');
  /*event.emit('error', {
    requestId: requestId
  });*/
}

function handleAuthenFail(requestId) {
  event.emit('error', {
    requestId: requestId
  });
}

function handleAuthenSuccess(requestId) {
  event.emit('success', {
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

  rpInterface.watchAuthenticationEvent(requestId,function(error, argsObject) {
    if(error) console.error('error:',error);
    //TODO check whether approve or denied
    //if(argsObject.code === 'true') handleApprove(argsObject);
    //else handleDeny(argsObject);
    handleAuthenSuccess(argsObject.requestContract)
  });
  
  return requestId;
};

rpInterface.watchIDPResponseEvent(function(error, argsObject) {
  if(error) console.error('error:',error);
  //check whether approve or denied
  if(Number(argsObject.code) == 0) handleApprove(argsObject);
  else handleDeny(argsObject);
});
