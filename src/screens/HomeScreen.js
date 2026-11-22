import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

// The very first screen the player sees: the game's title, their best
// score so far, and a button to start playing. `highScore` is loaded
// once in App.js and passed down here — this screen never talks to
// storage directly.
export default function HomeScreen({ highScore, onPlay }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🍔</Text>
        <Text style={styles.title}>Order Up!</Text>
        <Text style={styles.subtitle}>Build the burger. Beat the clock.</Text>

        <Text style={styles.highScoreText}>Best Score: {highScore}</Text>

        <Pressable style={styles.playButton} onPress={onPlay}>
          <Text style={styles.playButtonText}>PLAY</Text>
        </Pressable>

        <View style={styles.instructions}>
          <Text style={styles.instructionsText}>
            Tap ingredients to stack them, bottom to top, to match each
            customer's order. Tap the top of your stack to undo a mistake.
            Serve it before the timer runs out!
          </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDark,
    opacity: 0.7,
    marginTop: 4,
  },
  highScoreText: {
    marginTop: 24,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  playButton: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  playButtonText: {
    color: COLORS.textLight,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  instructions: {
    marginTop: 40,
    paddingHorizontal: 12,
  },
  instructionsText: {
    fontSize: 13,
    color: COLORS.textDark,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
