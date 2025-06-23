import React from 'react';

// Génère une couleur déterministe selon le numéro de slide
const getColor = slide => {
  const str = slide.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (
    '#' + (hash & 0xFFFFFF).toString(16).padStart(6, '0')
  );
};

const Slide = ({ slide }) => {
  const bgColor = getColor(slide);

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