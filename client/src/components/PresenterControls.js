import React from 'react';

const PresenterControls = ({ onPrev, onNext }) => (
  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
    <button onClick={onPrev} style={{ marginRight: '1rem' }}>
      Précédente
    </button>
    <button onClick={onNext}>Suivante</button>
  </div>
);

export default PresenterControls;