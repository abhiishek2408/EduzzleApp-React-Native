import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [retryCount, setRetryCount] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const resetRetries = () => {
    setRetryCount({ easy: 0, medium: 0, hard: 0 });
  };

  return (
    <GameContext.Provider value={{ score, setScore, retryCount, setRetryCount, resetRetries }}>
      {children}
    </GameContext.Provider>
  );
};


