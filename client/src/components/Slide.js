import React, { useMemo } from 'react';

const Slide = ({ slide }) => {
  const bgColor = useMemo(() => {
    // Génère une couleur aléatoire hexadécimale
    return '#' + Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
  }, [slide]);

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: '#fff',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '4rem',
        transition: 'background-color 0.5s',
      }}
    >
      Diapositive n°{slide}
    </div>
  );
};

export default Slide;