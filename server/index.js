const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Quand un client se connecte
io.on('connection', socket => {
  console.log('Client connecté :', socket.id);

  // Réception d'un changement de diapositive
  socket.on('slideChange', slideIndex => {
    // Réémettre à tous les autres clients
    socket.broadcast.emit('slideChange', slideIndex);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WS server écoute sur le port ${PORT}`));