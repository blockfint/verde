import { idpInterface } from '../../../blockchain/build/lib/interface_lib';

export function approve(data) {
  idpInterface.addIdpResponse({
    approve: true,
    ...data
  });
}

export function deny(data) {
  idpInterface.addIdpResponse({
    approve: false,
    ...data
  });
}

export function listen(handleRequest) {
  idpInterface.watchRequestEvent(function(error,eventObject) {
    if(error) throw error;
    var { userAddress, requestID, rpAddress, requestText } = eventObject.args;
    handleRequest({
      userId: userAddress,
      requestId: requestID,
      rpId: rpAddress,
      data: requestText
    });
  });
}

export async function getPendingList(userId) {

  return new Promise(function(resolve,reject) {
    idpInterface.getPendingRequests(userId,function(error, pendingList) {
      if(error) return reject(error);
      for(var i in pendingList) {
        let { userAddress, requestID, rpAddress, requestText } = pendingList[i].args;
        pendingList[i] = {
          userId: userAddress,
          requestId: requestID,
          rpId: rpAddress,
          data: requestText
        }
      }
      resolve(pendingList);
    });
  });

}

const busInterface = {
  approve,
  deny,
  listen,
  getPendingList
};

export default busInterface; 

//========================================================================================
/*
const ipc = require('node-ipc');
ipc.config.id = 'idp';
ipc.config.retry = 1500;
ipc.config.silent = true;

var selfId;

export function setSelfId(_selfId) {
  selfId = _selfId;
}

export function approve(data) {
  if(ipc.of.bus) {
    ipc.of.bus.emit('approve',data)
  }
  else {
    console.error('Please connect first');
  }
}

export function deny(data) {
  if(ipc.of.bus) {
    ipc.of.bus.emit('deny',data)
  }
  else {
    console.error('Please connect first');
  }
}

function selfFilter(handleRequest,requestData) {
  if(requestData.idpRequestList.indexOf(selfId) !== -1) handleRequest(requestData);
}

export function listen(handleRequest,handleDB) {
  ipc.connectToNet('bus',function() {
    //console.log(ipc.of.bus.socket);
    //if(ipc.of.bus.socket.id) {
      //console.log('connected to bus');
      ipc.of.bus.on('connect',() => {console.log('Connected to bus')});
      ipc.of.bus.on('error',() => {console.log('Cannot connect to bus')});
      ipc.of.bus.on('newRequest',function(requestData) {
        selfFilter(handleRequest,requestData);
      });
      ipc.of.bus.on('dbChanged',handleDB);
    //}
    //else console.error('Cannot connect');
  });
}

const busInterface = {
  approve: approve,
  deny: deny,
  listen: listen
};
export default busInterface;*/ 
