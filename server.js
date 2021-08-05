
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
    transports: ["polling"]
});
app.use(express.static(__dirname + "/public"));

io.on("error", e => console.log(e));
io.on('connection', (socket) => {
	
  let myRoom;
	
  socket.on('register-server', (roomId) => {
    const roomClients = io.sockets.adapter.rooms.get(roomId) || { size: 0 }
    const numberOfClients = roomClients.size

    // These events are emitted only to the sender socket.
    if (numberOfClients == 0) {
      console.log(`Creating room ${roomId} and emitting register-ok socket event`)
      socket.join(roomId)
	  myRoom = roomId
      socket.emit('register-ok', roomId)
    } else {
      console.log(`room ${roomId} already exists`)
      socket.emit('register-invalid');
    }
  })

  socket.on('register-client', (roomId) => {
    const roomClients = io.sockets.adapter.rooms.get(roomId) || { size: 0 }
    const numberOfClients = roomClients.size

    // These events are emitted only to the sender socket.
    if (numberOfClients == 0) {
      console.log(`room ${roomId} does't exist yet`)
      socket.emit('register-invalid');
    } else if (numberOfClients == 1) {
      console.log(`Joining room ${roomId} and emitting register-ok socket event`)
      socket.join(roomId)
	  myRoom = roomId
      socket.emit('register-ok', roomId)
    } else {
      console.log(`Can't join room ${roomId}, emitting register-invalid socket event`)
      socket.emit('register-invalid')
	}
  })

  // These events are emitted to all the sockets connected to the same room except the sender.
  socket.on('offer', (event) => {
    console.log(`Broadcasting offer event to peers in room ${myRoom}`)
    socket.broadcast.to(myRoom).emit('offer', event)
  })
  socket.on('answer', (event) => {
    console.log(`Broadcasting answer event to peers in room ${myRoom}`)
    socket.broadcast.to(myRoom).emit('answer', event)
  })
  socket.on('candidate', (event) => {
    console.log(`Broadcasting candidate event to peers in room ${myRoom}`)
    socket.broadcast.to(myRoom).emit('candidate', event)
  })
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
