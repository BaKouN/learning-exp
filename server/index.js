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

  socket.on('slideChange', slideIndex => {
    console.log(`[server] ⬆️ reçu slideChange de ${socket.id} → ${slideIndex}`);
    currentSlide = slideIndex;
    socket.broadcast.emit('slideChange', slideIndex);
    console.log(`[server] 📡 broadcast slideChange → ${slideIndex}`);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WS server écoute sur le port ${PORT}`));