const busInterface = require('./busInterface');

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

function getList(userId) {
  return db[userId];
}

//===== listen to Bus =====
busInterface.listen(handleRequest,handleDB);

module.exports = {
  ...busInterface,
  getList: getList
}
