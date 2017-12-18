const busInterface = require('./busInterface');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(bodyParser.json({ limit: '2mb' }));

var db = {};

app.get('/getList/:userId', function(req,res) {
  res.send(db[req.params.userId]);
})

app.post('/approve/', function(req,res) {
  busInterface.approve(req.body) //==================
  res.send('Success\n');
});

app.post('/deny/', function(req,res) {
  busInterface.deny(req.body) //==================
  res.send('Success\n');
});

const server = http.createServer(app);
server.listen(8181);

function handleRequest({ userId, requestId, data }) {
   //console.log('Received new request for userId:',userId,'with requestId:',requestId,'with data:',data);
  //fetch real time?
  console.log('===>',userId, requestId, data)
}

function handleDB(_db) {
  db = Object.assign(_db);
  //console.log(dbString);
}

//===== listen to Bus =====
busInterface.listen(handleRequest,handleDB);

