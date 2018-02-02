import path from 'path';
import http from 'http';
import io from 'socket.io';

import bodyParser from 'body-parser';

import express from 'express';
// import morgan from 'morgan';

import GreenBoxAPI from '../greenBoxApi';

process.on('unhandledRejection', function(reason, p) {
  console.error('Unhandled Rejection:', p, '\nreason:', reason.stack || reason);
});

const WEB_SERVER_PORT = process.env.SERVER_PORT || 8181;

const app = express();

app.use('/', express.static(path.join(__dirname, '../../web_files')));

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

// app.use(morgan('combined'));

app.get('/home/:userId', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web_files/index.html'));
});

app.get('/getRequestList/:userId',async function(req,res) {
  try {
    res.send(await GreenBoxAPI.getRequestList(req.params.userId));
  }
  catch(error) {
    console.error(error);
    res.status(500).end();
  }
});

app.post('/approve/', function(req,res) {
  GreenBoxAPI.approve(req.body)
  res.send('Success\n');
});

app.post('/deny/', function(req,res) {
  GreenBoxAPI.deny(req.body)
  res.send('Success\n');
});

app.post('/createUser/', async function(req,res) {
  let result = await GreenBoxAPI.createUser(req.body.id);
  res.send(result);
});

const server = http.createServer(app);

const ws = io(server);
let socket;

ws.on('connection', function(_socket){
  socket = _socket;
});

GreenBoxAPI.listen(function(data) {
  if(socket) socket.emit('fetch');
});

server.listen(WEB_SERVER_PORT);

console.log(`IDP Web Server is running. Listening to port ${WEB_SERVER_PORT}`);
