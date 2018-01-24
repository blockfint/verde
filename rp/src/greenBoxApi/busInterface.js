import EventEmitter from 'events';
import { rpInterface } from '../../../blockchain/build/lib/interface_lib';

export const event = new EventEmitter();

//const RP_ID = process.env.RP_ID || 1;

// TO-DO
// interface with bus/blockchain

function handleApprove(argsObject) {
  //console.log('approve',argsObject);
  event.emit('approve', argsObject);
}

function handleDeny(argsObject) {
  //console.log('deny',argsObject);
  event.emit('deny', argsObject);
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
  let userAddress = await rpInterface.findUserAddress(user.namespace,user.id);
  let requestId = await rpInterface.createRequest({
    userAddress: userAddress,
    requestText: 'Mockup request details'
  }); 

  if(!requestId) {
    console.error("Cannot create request");
    return;
  }
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
  argsObject.requestId = argsObject.requestID;
  delete argsObject.requestID;

  //check whether approve or denied
  if(Number(argsObject.code) == 0) handleApprove(argsObject);
  else handleDeny(argsObject);
});
