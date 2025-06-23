import React from 'react';
import Slide from './Slide';
import PresenterControls from './PresenterControls';

const PresenterView = ({ slide, onPrev, onNext }) => (
  <div>
    <h1 style={{ textAlign: 'center', marginTop: '1rem' }}>🎤 Presenter</h1>
    <Slide slide={slide} />
    <PresenterControls onPrev={onPrev} onNext={onNext} />
  </div>
);

export default PresenterView;