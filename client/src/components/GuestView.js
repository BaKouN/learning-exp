import React from 'react';
import Slide from './Slide';

const GuestView = ({ slide, name }) => (
  <div>
    <h1 style={{ textAlign: 'center', marginTop: '1rem' }}>👤 {name}</h1>
    <Slide slide={slide} />
    <p style={{ textAlign: 'center' }}>(Attendez que le presenter change de diapo…)</p>
  </div>
);

export default GuestView;