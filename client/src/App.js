import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import JoinForm from './components/JoinForm';
import PresenterView from './components/PresenterView';
import GuestView from './components/GuestView';

const SOCKET_URL = process.env.REACT_APP_WS_URL;

function App() {
  const isPresenter = window.location.pathname === '/presenter';
  const [slide, setSlide] = useState(0);
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialise la connexion WebSocket une seule fois
  useEffect(() => {
    if ((isPresenter || joined) && !socket) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('[client] ✅ connecté, socket.id =', newSocket.id);
      });
      newSocket.on('slideChange', idx => {
        console.log('[client] ⬇️ reçu slideChange →', idx);
        setSlide(idx);
      });

      return () => newSocket.disconnect();
    }
  }, [isPresenter, joined, socket]);

  // Envoie l'événement "join" quand la socket est prête
  useEffect(() => {
    if (socket && joined) {
      socket.emit('join', name);
    }
  }, [socket, joined, name]);

  const handleNext = () => {
    const next = slide + 1;
    console.log('[client] ⬆️ emit slideChange →', next);
    setSlide(next);
    socket.emit('slideChange', next);
  };

  const handlePrev = () => {
    const prev = Math.max(slide - 1, 0);
    console.log('[client] ⬆️ emit slideChange →', prev);
    setSlide(prev);
    socket.emit('slideChange', prev);
  };

  const handleJoin = e => {
    e.preventDefault();
    if (!name.trim()) return;
    setJoined(true);
  };

  if (isPresenter) return <PresenterView slide={slide} onPrev={handlePrev} onNext={handleNext} />;
  if (!joined) return <JoinForm name={name} setName={setName} handleJoin={handleJoin} />;
  return <GuestView slide={slide} name={name} />;
}

export default App;