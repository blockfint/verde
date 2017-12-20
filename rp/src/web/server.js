import path from 'path';
import http from 'http';

import bodyParser from 'body-parser';

import express from 'express';
// import morgan from 'morgan';

import io from 'socket.io';

import * as GreenBoxAPI from '../greenBoxApi';
import busEventEmitter from '../greenBoxApi/eventEmitter';

process.on('unhandledRejection', function(reason, p) {
  console.error('Unhandled Rejection:', p, '\nreason:', reason.stack || reason);
});

const WEB_SERVER_PORT = 8080;

const app = express();

app.use('/', express.static(path.join(__dirname, '../../web_files')));

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

// app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../web_files/index.html'));
});

app.get('/verifyIdentity', (req, res) => {
  const requestId = GreenBoxAPI.requestAuthen();
  res.status(200).send({
    requestId,
  });
});

const server = http.createServer(app);

/**
 * WebSocket
 */
const ws = io(server);
let socket;

ws.on('connection', function(_socket){
  socket = _socket;
});

busEventEmitter.on('success', function(event) {
  if (socket) {
    socket.emit('success', { requestId: event.requestId });
  }
});

busEventEmitter.on('error', function(event) {
  if (socket) {
    socket.emit('fail', { requestId: event.requestId });
  }
});

server.listen(WEB_SERVER_PORT);

console.log(`RP Web Server is running. Listening to port ${WEB_SERVER_PORT}`);
