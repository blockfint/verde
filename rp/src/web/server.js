import path from 'path';
import http from 'http';

import bodyParser from 'body-parser';

import express from 'express';
// import morgan from 'morgan';

import io from 'socket.io';

import * as GreenBoxAPI from '../greenBoxApi';
import * as busInterface from '../greenBoxApi/busInterface';

process.on('unhandledRejection', function(reason, p) {
  console.error('Unhandled Rejection:', p, '\nreason:', reason.stack || reason);
});

const WEB_SERVER_PORT = process.env.SERVER_PORT || 8080;

const app = express();

app.use('/', express.static(path.join(__dirname, '../../web_files')));

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

// app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../web_files/index.html'));
});

app.post('/verifyIdentity', async (req, res) => {
  const requestId = await GreenBoxAPI.requestAuthen(req.body.selectedIdps, req.body.hideSourceRp);
  res.status(200).send({
    requestId,
  });
});

app.get('/idps', (req, res) => {
  res.status(200).send({
    idps: [
      {
        id: 1,
        name: 'IDP-1',
      },
      {
        id: 2,
        name: 'IDP-2',
      },
      {
        id: 3,
        name: 'IDP-3',
      },
    ],
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

busInterface.event.on('success', function(event) {
  if (socket) {
    socket.emit('success', { requestId: event.requestId });
  }
});

// TO BE REVISED
busInterface.event.on('deny', function(event) {
  if (socket) {
    socket.emit('deny', { requestId: event.requestId });
  }
});

busInterface.event.on('error', function(event) {
  if (socket) {
    socket.emit('fail', { requestId: event.requestId });
  }
});

server.listen(WEB_SERVER_PORT);

console.log(`RP Web Server is running. Listening to port ${WEB_SERVER_PORT}`);

console.log(`RP ID: ${process.env.RP_ID || 1}`);
