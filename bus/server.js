const ipc = require('node-ipc');
ipc.config.id = 'bus';
ipc.config.retry = 1500;
ipc.config.silent = true;

var db = {};

function updateDB({ requestId, userId, approve }) {
  const requests = db[userId];
  const request = requests.find(req => req.requestId === requestId);
  if (request) {
    if (!request.processed) {
      request.processed = true;
      request.approved = approve;
      return true;
    }
    return false;
  }
  return false;
}

function handleRequest({ requestId, userId, ...data }) {
  if (!db[userId]) db[userId] = [];

  db[userId].push({
    userId: userId,
    requestId: requestId,
    ...data,
  });

  ipc.server.broadcast('dbChanged', db);
  ipc.server.broadcast('newRequest', {
    userId: userId,
    requestId: requestId,
    ...data,
  });
}

function approve(data) {
  var changed = updateDB({
    approve: true,
    ...data,
  });
  if (changed) {
    ipc.server.broadcast('dbChanged', db);
    ipc.server.broadcast('approve', data.requestId);
  }
}

function deny(data) {
  var changed = updateDB({
    approve: false,
    ...data,
  });
  if (changed) {
    ipc.server.broadcast('dbChanged', db);
    ipc.server.broadcast('deny', data.requestId);
  }
}

ipc.serveNet(function() {
  ipc.server.on('createRequest', handleRequest);
  ipc.server.on('approve', approve);
  ipc.server.on('deny', deny);
  ipc.server.on('connect', function() {
    //console.log('Someone connected');
    ipc.server.broadcast('dbChanged', db);
  });
  console.log('Bus is ready');
});

ipc.server.start();
