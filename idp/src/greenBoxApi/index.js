import busInterface from './busInterface';

var cacheDB = {};

function handleRequest({ userId, requestId, rpId, data }) {
  console.log(
    'Received new request for userId:',
    userId,
    'with requestId:',
    requestId,
    'from rpId:',
    rpId,
    'with data:',
    data
  );
  //fetch real time?
}

function handleDB(_db) {
  cacheDB = Object.assign(_db);
  //console.log(db);
}

//===== listen to Bus =====
busInterface.listen(handleRequest, handleDB);

export const approve = busInterface.approve;
export const deny = busInterface.deny;

export function getList(userId) {
  return cacheDB[userId];
}

const exp = {
  approve: approve,
  deny: deny,
  getList: getList,
};
export default exp;
