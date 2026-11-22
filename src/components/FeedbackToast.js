import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const MESSAGES = {
  served: (points) => `Nice! +${points}`,
  wrong: () => 'Not quite — try again!',
  timeout: () => "Time's up!",
};

const TONE_COLORS = {
  served: COLORS.secondary,
  wrong: COLORS.danger,
  timeout: COLORS.danger,
};

// A short message that fades in, holds, then fades out whenever the
// game reports an event (an order served, a wrong order, or a timeout).
// `eventId` is the animation trigger rather than `event` itself, because
// it increments on every single event — that guarantees this effect
// re-fires even when the same kind of event (e.g. two wrong orders in a
// row) happens back to back, which a plain `event` string wouldn't do
// since React skips effects whose dependencies didn't change.
export default function FeedbackToast({ eventId, event, points }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!event) return;

    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(700),
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (!event) return null;

  const text = MESSAGES[event] ? MESSAGES[event](points) : '';

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <Text style={[styles.text, { color: TONE_COLORS[event] || COLORS.textDark }]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
  },
});
