import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

import bodyParser from 'body-parser';

import express from 'express';
// import morgan from 'morgan';

import router from './router';

process.on('unhandledRejection', function(reason, p) {
  console.error('Unhandled Rejection:', p, '\nreason:', reason.stack || reason);
});

const env = process.env.NODE_ENV || 'development';

const WEB_SERVER_PORT = 8080;

const app = express();

app.use('/', express.static(path.join(__dirname, '../../web_files')));

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

// app.use(morgan('combined'));

app.use(router);

let server;

try {
  server = https.createServer(
    {
      key: fs.readFileSync('./ssl/privateKey.pem', 'utf8'),
      cert: fs.readFileSync('./ssl/cert.pem', 'utf8'),
    },
    app
  );
  server.listen(WEB_SERVER_PORT);
} catch (error) {
  console.warn('Cannot create HTTPS server. Fallback to HTTP');
  server = http.createServer(app);
  server.listen(WEB_SERVER_PORT);
}

console.log(`Web Server is running. Listening to port ${WEB_SERVER_PORT}`);
