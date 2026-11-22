import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// A single tappable ingredient in the tray at the bottom of the game
// screen. `disabled` greys it out (and blocks taps) once the plate is
// already as tall as the current order needs.
export default function IngredientButton({ ingredient, onPress, disabled }) {
  return (
    <Pressable
      onPress={() => onPress(ingredient.id)}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Add ${ingredient.name}`}
    >
      <Text style={styles.emoji}>{ingredient.emoji}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {ingredient.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Percentage width (5 buttons per row) plus `gap` on the parent tray
  // means this grid reflows correctly on any phone screen instead of
  // overflowing on narrower devices, the way a fixed pixel width would.
  button: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: COLORS.background,
    transform: [{ scale: 0.95 }],
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    fontSize: 9,
    color: COLORS.textDark,
    marginTop: 2,
  },
});
