const ipc = require('node-ipc');
ipc.config.id = 'idp';
ipc.config.retry = 1500;
ipc.config.silent = true;

function approve(data) {
  if(ipc.of.bus) {
    ipc.of.bus.emit('approve',data)
  }
  else {
    console.error('Please connect first');
  }
}

function deny(data) {
  if(ipc.of.bus) {
    ipc.of.bus.emit('deny',data)
  }
  else {
    console.error('Please connect first');
  }
}

/*function getList(userId) {
  if(ipc.of.bus) {
    ipc.of.bus.emit('getList',userId);
  }
  else {
    console.error('Please connect first');
  }
}*/

module.exports = {
  approve: approve,
  deny: deny,

  listen: function(handleRequest,handleDB) {
    ipc.connectToNet('bus',function() {
      //console.log(ipc.of.bus.socket);
      //if(ipc.of.bus.socket.id) {
        //console.log('connected to bus');
        ipc.of.bus.on('connect',() => {console.log('Connected to bus')});
        ipc.of.bus.on('error',() => {console.log('Cannot connect to bus')});
        ipc.of.bus.on('newRequest',handleRequest);
        ipc.of.bus.on('dbChanged',handleDB);
      //}
      //else console.error('Cannot connect');
    });
  }
}
