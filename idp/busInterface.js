const busEventEmitter = require('./eventEmitter');

// interface with bus/blockchain

requestEventEmitter.emit('eventName', null, {
  requestId: 1234,
  result_code: 999,
  result_msg: "Some message"
});