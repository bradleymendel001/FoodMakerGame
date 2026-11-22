import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import { getHighScore } from './src/utils/storage';

// This app only ever has three screens, so instead of pulling in a full
// navigation library we just track "which screen is showing" as one
// piece of state and render accordingly. (See docs/ for why that
// trade-off makes sense at this size, and what we'd reach for instead
// if the app grew.)
export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'game' | 'gameover'
  const [highScore, setHighScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);

  // The high score is the one piece of data that needs to survive
  // between app launches, so it's loaded once here, at the top, and
  // passed down to whichever screen needs it.
  useEffect(() => {
    getHighScore().then(setHighScore);
  }, []);

  function handleGameOver(finalScore, updatedHighScore) {
    setLastScore(finalScore);
    setHighScore(updatedHighScore);
    setScreen('gameover');
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {screen === 'home' && <HomeScreen highScore={highScore} onPlay={() => setScreen('game')} />}
      {screen === 'game' && (
        <GameScreen initialHighScore={highScore} onGameOver={handleGameOver} />
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          score={lastScore}
          highScore={highScore}
          onPlayAgain={() => setScreen('game')}
          onHome={() => setScreen('home')}
        />
      )}
    </SafeAreaProvider>
  );
}
