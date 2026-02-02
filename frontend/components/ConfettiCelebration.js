import React from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ConfettiCelebration({ show, onAnimationEnd }) {
  if (!show) return null;
  return (
    <ConfettiCannon
      count={120}
      origin={{x: -10, y: 0}}
      fadeOut={true}
      autoStart={true}
      explosionSpeed={350}
      fallSpeed={3000}
      onAnimationEnd={onAnimationEnd}
    />
  );
}
