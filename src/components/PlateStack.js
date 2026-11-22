import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { INGREDIENT_MAP } from '../data/ingredients';
import { COLORS } from '../constants/colors';
import { MAX_STACK_SIZE } from '../constants/gameConfig';

const SLOT_HEIGHT = 34;

// Renders the player's in-progress burger as a vertical stack, with the
// bottom ingredient at the bottom of the screen — just like a real
// burger. `flexDirection: 'column-reverse'` is what makes this work: it
// lets us keep pushing new ingredients onto the *end* of the `plate`
// array (simple, stack-like data — see ADD_INGREDIENT in the reducer)
// while still having each new one visually land on *top*.
export default function PlateStack({ plate, onRemoveLast }) {
  return (
    <View style={[styles.container, { height: SLOT_HEIGHT * MAX_STACK_SIZE }]}>
      <View style={styles.stack}>
        {plate.length === 0 && (
          <Text style={styles.emptyText}>Tap ingredients below to start building!</Text>
        )}
        {plate.map((ingredientId, index) => {
          const ingredient = INGREDIENT_MAP[ingredientId];
          const isTop = index === plate.length - 1;
          return (
            <Pressable
              key={`${ingredientId}-${index}`}
              onPress={isTop ? onRemoveLast : undefined}
              style={[styles.slot, isTop && styles.topSlot]}
              accessibilityRole={isTop ? 'button' : undefined}
              accessibilityLabel={isTop ? `Remove ${ingredient.name}` : ingredient.name}
            >
              <Text style={styles.slotText}>
                {ingredient.emoji} {ingredient.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stack: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textDark,
    opacity: 0.5,
    fontStyle: 'italic',
    paddingBottom: 12,
  },
  slot: {
    height: SLOT_HEIGHT,
    minWidth: 160,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The topmost ingredient is the one tapping-to-undo would remove, so
  // it gets a highlighted border as a visual hint that it's tappable.
  topSlot: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  slotText: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
});
