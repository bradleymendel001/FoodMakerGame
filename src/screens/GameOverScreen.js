import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

// Shown once the player runs out of lives. Reports the round's score,
// flags a new best, and offers to play again or go back home.
export default function GameOverScreen({ score, highScore, onPlayAgain, onHome }) {
  const isNewHighScore = score > 0 && score === highScore;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🧑‍🍳</Text>
        <Text style={styles.title}>Kitchen's Closed!</Text>

        {isNewHighScore && <Text style={styles.newBest}>🎉 New Best Score!</Text>}

        <Text style={styles.scoreLabel}>Your Score</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.highScore}>Best: {highScore}</Text>

        <Pressable style={styles.primaryButton} onPress={onPlayAgain}>
          <Text style={styles.primaryButtonText}>PLAY AGAIN</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onHome}>
          <Text style={styles.secondaryButtonText}>HOME</Text>
        </Pressable>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 8,
  },
  newBest: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gold,
  },
  scoreLabel: {
    marginTop: 24,
    fontSize: 12,
    color: COLORS.textDark,
    opacity: 0.6,
  },
  score: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
  },
  highScore: {
    fontSize: 14,
    color: COLORS.textDark,
    opacity: 0.6,
    marginTop: 4,
  },
  primaryButton: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  primaryButtonText: {
    color: COLORS.textLight,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 16,
    padding: 8,
  },
  secondaryButtonText: {
    color: COLORS.textDark,
    opacity: 0.6,
    fontWeight: '600',
  },
});
