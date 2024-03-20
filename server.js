const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = {}

io.on('connection', (socket) => {
  console.log('A user connected');

  //socket.emit('chat-message', 'Hello World');
  socket.on('new-user', name=>{
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)

  })

  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', { message : message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
