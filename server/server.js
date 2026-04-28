const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://live-messaging-app-5c5q.onrender.com", //live-messaging-app-one.vercel.app
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Join a specific chat room
  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User ${socket.id} joined room: ${data}`);
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
    // Broadcast message to everyone in the same room
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});