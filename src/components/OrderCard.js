import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { INGREDIENT_MAP } from '../data/ingredients';
import { COLORS } from '../constants/colors';

// Shows what the current customer ordered (their recipe, bottom to
// top, left to right) plus a shrinking progress bar for how much time
// is left to serve it.
export default function OrderCard({ recipe, timeLeft, timeLimit }) {
  const urgent = timeLeft <= 3;
  const progress = timeLimit > 0 ? timeLeft / timeLimit : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order:</Text>
      <View style={styles.row}>
        {recipe.map((ingredientId, index) => (
          <Text key={`${ingredientId}-${index}`} style={styles.emoji}>
            {INGREDIENT_MAP[ingredientId].emoji}
          </Text>
        ))}
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%`, backgroundColor: urgent ? COLORS.danger : COLORS.secondary },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 12,
    color: COLORS.textDark,
    opacity: 0.6,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emoji: {
    fontSize: 26,
    marginRight: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.background,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
