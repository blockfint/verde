import path from 'path';
import http from 'http';

import bodyParser from 'body-parser';

import express from 'express';
// import morgan from 'morgan';

import * as GreenBoxAPI from '../../greenBoxApi';

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
server.listen(WEB_SERVER_PORT);

console.log(`RP Web Server is running. Listening to port ${WEB_SERVER_PORT}`);
