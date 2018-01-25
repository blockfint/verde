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

export async function getRequestList(userId) {

  let [error, requestList] = await idpInterface.getRequests(userId);
  if(error) throw error;
  for(var key in requestList) {
    let list = requestList[key];
    for(var i in list) {
      let { userAddress, requestID, rpAddress, requestText } = list[i];
      //rename key
      list[i] = {
        userAddress: userAddress,
        requestId: requestID,
        rpAddress: rpAddress,
        data: requestText
      }
    }
  }
  return requestList;

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

export function createUser(id,namespace = 'cid') {
  return idpInterface.createUser(namespace,id);
}

const busInterface = {
  approve,
  deny,
  listen,
  getRequestList,
  createUser
};

export default busInterface; 

//HARD CODED USER
createUser('1100023145268');
