import React, { useEffect, useReducer, useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { INGREDIENTS } from '../data/ingredients';
import { gameReducer, createInitialState } from '../state/gameReducer';
import { saveHighScore } from '../utils/storage';
import ScoreBar from '../components/ScoreBar';
import OrderCard from '../components/OrderCard';
import PlateStack from '../components/PlateStack';
import IngredientButton from '../components/IngredientButton';
import FeedbackToast from '../components/FeedbackToast';

// The main gameplay screen. It owns the game's state (via the reducer
// in src/state/gameReducer.js) and drives the one real-world side
// effect the game needs each second: the countdown timer.
export default function GameScreen({ initialHighScore, onGameOver }) {
  // The third argument to useReducer is a "lazy init" function: React
  // calls createInitialState(initialHighScore) exactly once, on the
  // first render, instead of us computing initial state on every render
  // just to throw it away.
  const [state, dispatch] = useReducer(gameReducer, initialHighScore, createInitialState);
  const hasReportedGameOver = useRef(false);

  // One dispatch per second while a round is in progress. Re-running
  // this effect whenever `status` changes means the interval is torn
  // down the instant the game ends, so no ticks are wasted afterward.
  useEffect(() => {
    if (state.status !== 'playing') return undefined;
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(interval);
  }, [state.status]);

  // The instant the game ends, persist a new high score (if the player
  // beat it) and hand control back to App.js. `hasReportedGameOver`
  // guards against calling onGameOver twice if this component
  // re-renders while still in the 'gameover' state.
  useEffect(() => {
    if (state.status !== 'gameover' || hasReportedGameOver.current) return;
    hasReportedGameOver.current = true;
    const finalHighScore = Math.max(state.score, state.highScore);
    saveHighScore(finalHighScore).finally(() => onGameOver(state.score, finalHighScore));
  }, [state.status]);

  const plateFull = state.plate.length >= state.currentRecipe.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScoreBar
          score={state.score}
          highScore={state.highScore}
          streak={state.streak}
          level={state.level}
          lives={state.lives}
        />

        <View style={styles.toastAnchor}>
          <FeedbackToast
            eventId={state.eventId}
            event={state.lastEvent}
            points={state.lastPointsEarned}
          />
        </View>

        <OrderCard recipe={state.currentRecipe} timeLeft={state.timeLeft} timeLimit={state.timeLimit} />

        <PlateStack plate={state.plate} onRemoveLast={() => dispatch({ type: 'REMOVE_LAST' })} />

        <Pressable
          style={[styles.serveButton, !plateFull && styles.serveButtonDisabled]}
          disabled={!plateFull}
          onPress={() => dispatch({ type: 'SERVE' })}
        >
          <Text style={styles.serveButtonText}>SERVE!</Text>
        </Pressable>

        <View style={styles.tray}>
          {INGREDIENTS.map((item) => (
            <IngredientButton
              key={item.id}
              ingredient={item}
              disabled={plateFull}
              onPress={(id) => dispatch({ type: 'ADD_INGREDIENT', ingredientId: id })}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  toastAnchor: {
    height: 24,
  },
  serveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  serveButtonDisabled: {
    opacity: 0.35,
  },
  serveButtonText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 12,
  },
});
