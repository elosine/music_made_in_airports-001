//#ef LIBRARIES
var express = require('express');
var app = express();
var path = require('path');
var timesyncServer = require('timesync/server');
var httpServer = require('http').createServer(app);
io = require('socket.io').listen(httpServer);
const fs = require('fs');
//#endef END LIBRARIES

//#ef HTTP SERVER
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => console.log(`Listening on ${ PORT }`));
//#endef END HTTP SERVER

//#ef SERVE STATIC FILES THROUGH EXPRESS
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/pieces/mmia001/mmia001.html'));
});
//#endef END SERVER STATIC FILES

//#ef TIMESYNC SERVER
app.use('/timesync', timesyncServer.requestHandler);
//#endef END TIMESYNC SERVER

//#ef OSC.JS
var osc = require("osc");
var sclang = new osc.UDPPort({
  // Listen msgs from sclang
  localAddress: "127.0.0.1",
  localPort: 12321,
  // sclang
  remoteAddress: "127.0.0.1",
  remotePort: 57120,
  metadata: true
});
// Open the socket.
sclang.open();
//#endef OSC.JS

//#ef SOCKET IO
io.on('connection', function(socket) {
  socket.on('reverseChips', function(data) {
    sclang.send(data);
    console.log('reverseChips');
  });
  socket.on('swirl', function(data) {
    sclang.send(data);
    console.log('swirl');
  });
  socket.on('bloop', function(data) {
    sclang.send(data);
    console.log('bloop');
  });
  socket.on('beam', function(data) {
    sclang.send(data);
    console.log('beam');
  });
  socket.on('giant', function(data) {
    sclang.send(data);
    console.log('giant');
  });
  socket.on('chime', function(data) {
    sclang.send(data);
    console.log('chime');
  });
  socket.on('crunch', function(data) {
    sclang.send(data);
    console.log('crunch');
  });

}); // End Socket IO
//#endef >> END SOCKET IO
