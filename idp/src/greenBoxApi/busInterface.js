import { idpInterface } from '../../../blockchain/build/lib/interface_lib';

export function approve(data) {
  //check if requestId is for userId
  idpInterface.addIdpResponse({
    code: 0,
    ...data
  });
}

export function deny(data) {
  //check if requestId is for userId
  idpInterface.addIdpResponse({
    code: 1,
    ...data
  });
}

export async function getPendingList(userId) {

  let [error, pendingList] = await idpInterface.getPendingRequests(userId);
  if(error) throw error;
  for(var i in pendingList) {
    let { userAddress, requestID, rpAddress, requestText } = pendingList[i];
    //rename key
    pendingList[i] = {
      userAddress: userAddress,
      requestId: requestID,
      rpAddress: rpAddress,
      data: requestText
    }
  }
  return pendingList;

}

export function listen(handleRequest) {
  idpInterface.watchRequestEvent(function(error,eventObject) {
    if(error) throw error;
    var { userAddress, requestID, rpAddress, requestText } = eventObject;
    handleRequest({
      userAddress: userAddress,
      requestId: requestID,
      rpAddress: rpAddress,
      data: requestText
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

//HARD CODED USER
idpInterface.createUser('cid','1100023145268');
