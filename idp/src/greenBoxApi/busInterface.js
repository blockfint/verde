import ethereumInterface from './ethereumInterface';

var selfId;
var blockId = 0;

export function setSelfId(_selfId) {
  selfId = _selfId;
}

function selfFilter(handleRequest,requestData) {
  if(requestData.idpRequestList.indexOf(selfId) !== -1) handleRequest(requestData);
}

export function approve(data) {
  ethereumInterface.addIdpResponse({
    idpId: selfId,
    approve: true,
    ...data
  });
}

export function deny(data) {
  ethereumInterface.addIdpResponse({
    idpId: selfId,
    approve: false,
    ...data
  });
}

export function listen(handleRequest) {

  ethereumInterface.watchRequestEvent(function(error, requestData) {
    if(!error) selfFilter(handleRequest,requestData)
  }); 

}

export async function getPendingList(userId) {

  return Promise(function(resolve,reject) {
    /*all event filter by userId and pending*/
    ethereumInterface.getPendingRequest(userId,function(error, pendingList) {
      var list = []
      if(error) return reject(error);
      resolve(pendingList.filter(requestData => 
        requestData.idpRequestList.indexOf(selfId) !== -1)
      );
    }
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
