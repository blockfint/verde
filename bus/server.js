const ipc = require('node-ipc');
ipc.config.id = 'bus';
ipc.config.retry = 1500;
ipc.config.silent = true;

var db = {};

function updateDB({ requestId, userId, approve}) {
  let tmp = db[userId];
  for(var i in tmp) {
    if(tmp[i].requestId = requestId) {
      tmp.success = true;
      tmp.approve = approve;
    }
  }
}

function handleRequest({ userId, requestId, data }) {
  if(!(db[userId])) db[userId] = []; 

  db[userId].push({
    requestId: requestId,
    ...data
  }); 

  ipc.server.broadcast('dbChanged',db);
  ipc.server.broadcast('newRequest',{ 
    userId: userId,
    requestId: requestId,
    data: data 
  });
}

function approve(data) {
  updateDB({
    approve: true,
    ...data
  });
  ipc.server.broadcast('dbChanged',db);
  ipc.server.broadcast('approve',data.requestId);
}

function deny(data) {
  updateDB({
    approve: false,
    ...data
  });
  ipc.server.broadcast('dbChanged',db);
  ipc.server.broadcast('deny',data.requestId);
}


ipc.serveNet(function() {
  ipc.server.on('createRequest',handleRequest);
  ipc.server.on('approve',approve);
  ipc.server.on('deny',deny);
  ipc.server.on('connect',function() {
    console.log('Someone connected');
  })
  console.log('Bus is ready');
});
 
ipc.server.start();

