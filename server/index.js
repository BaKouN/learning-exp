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

let currentSlide = 0;

io.on('connection', socket => {
  console.log('Client connecté :', socket.id);

  // Nouveau client : on lui envoie l'état actuel
  socket.emit('initialSlide', currentSlide);

  // Quand un guest envoie son nom
  socket.on('join', name => {
    console.log(`🔖 ${name} a rejoint la présentation. (${socket.id})`);
    // optionnel : informer le presenter
    io.emit('userJoined', name);
  });

  // Quand le presenter change de diapo
  socket.on('slideChange', slideIndex => {
    currentSlide = slideIndex;
    socket.broadcast.emit('slideChange', slideIndex);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WS server écoute sur le port ${PORT}`));