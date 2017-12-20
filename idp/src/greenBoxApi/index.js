import busInterface from './busInterface';

var db = {};

function handleRequest({ userId, requestId, data }) {
   //console.log('Received new request for userId:',userId,'with requestId:',requestId,'with data:',data);
  //fetch real time?
  console.log('===>',userId, requestId, data)
}

function handleDB(_db) {
  db = Object.assign(_db);
  //console.log(db);
}

//===== listen to Bus =====
busInterface.listen(handleRequest,handleDB);

export const approve = busInterface.approve;
export const deny = busInterface.deny;

export function getList(userId) {
  return db[userId];
}

