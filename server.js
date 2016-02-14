'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var favicon = require('serve-favicon');



var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


if(!process.env.NODE_ENV === 'production') require('dotenv').load();

app.use(favicon(process.cwd() + '/client/public/favicon.ico'));
app.use('/', express.static(process.cwd() + '/client/public'));

io.on('connection', function(socket){
  socket.on('add', function(name){
    io.emit('add', name);
  });
  socket.on('remove', function(name){
    io.emit('remove', name);
  })
})

routes(app);

var port = process.env.PORT || 8080;
server.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
