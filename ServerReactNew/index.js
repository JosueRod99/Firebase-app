const express = require("express");
const app = express();
const port = 8000;
const server = require("http").createServer(app);


const io = require('socket.io')(server);


io.on("connection", socket => {

  console.log("a user connected :D");

  socket.on('chat', msg => {
    
    socket.emit('chat_response', msg);
  
  });

});


server.listen(port, () => console.log("server running on port " + port));
