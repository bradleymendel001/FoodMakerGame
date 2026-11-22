import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { STARTING_LIVES } from '../constants/gameConfig';

// The strip across the top of the game screen: score, best score,
// level, streak, and remaining lives (drawn as hearts).
export default function ScoreBar({ score, highScore, streak, level, lives }) {
  return (
    <View style={styles.container}>
      <Stat label="SCORE" value={score} />
      <Stat label="BEST" value={highScore} />
      <Stat label="LEVEL" value={level + 1} />
      <Stat label="STREAK" value={streak > 1 ? `🔥${streak}` : streak} />
      <Stat
        label="LIVES"
        value={'❤️'.repeat(lives) + '🤍'.repeat(Math.max(STARTING_LIVES - lives, 0))}
      />
    </View>
  );
}

// One labeled number in the bar. Pulled out into its own component so
// the five stats above stay visually identical without repeating the
// same two <Text> tags five times.
function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  stat: {
    alignItems: 'center',
    minWidth: 48,
  },
  label: {
    fontSize: 10,
    color: COLORS.textDark,
    opacity: 0.6,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
});
