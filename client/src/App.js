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

  useEffect(() => {
    if ((isPresenter || joined) && !socket) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on('initialSlide', idx => setSlide(idx));
      newSocket.on('slideChange', idx => setSlide(idx));
      newSocket.on('userJoined', guestName => {
        console.log(`🟢 ${guestName} vient de se connecter`);
      });

      return () => newSocket.disconnect();
    }
  }, [isPresenter, joined, socket]);

  const handleNext = () => {
    const next = slide + 1;
    setSlide(next);
    socket.emit('slideChange', next);
  };

  const handlePrev = () => {
    const prev = Math.max(slide - 1, 0);
    setSlide(prev);
    socket.emit('slideChange', prev);
  };

  const handleJoin = e => {
    e.preventDefault();
    if (!name.trim()) return;
    setJoined(true);
    socket.emit('join', name);
  };

  if (isPresenter) return <PresenterView slide={slide} onPrev={handlePrev} onNext={handleNext} />;
  if (!joined) return <JoinForm name={name} setName={setName} handleJoin={handleJoin} />;
  return <GuestView slide={slide} name={name} />;
}

export default App;