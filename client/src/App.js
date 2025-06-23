import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_WS_URL);

function App() {
  const [slide, setSlide] = useState(0);
  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState('viewer');

  // Écoute des changements de slide émis par les autres
  useEffect(() => {
    socket.on('slideChange', idx => {
      setSlide(idx);
    });
    return () => {
      socket.off('slideChange');
    };
  }, []);

  // Passe à la slide suivante et notifie les autres
  const nextSlide = () => {
    const newSlide = slide + 1;
    setSlide(newSlide);
    socket.emit('slideChange', newSlide);
  };

  // Passe à la slide suivante et notifie les autres
  const lastSlide = () => {
    const newSlide = slide - 1;
    setSlide(newSlide);
    socket.emit('slideChange', newSlide);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Diapositive n°{slide}</h1>
      <button onClick={lastSlide}>Precedente</button>
      <button onClick={nextSlide}>Suivante</button>
    </div>
  );
}

export default App;