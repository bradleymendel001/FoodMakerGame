// Thin wrapper around AsyncStorage for the one piece of data this game
// persists between launches: the player's best score. Wrapping it here
// means the rest of the app doesn't need to import AsyncStorage or know
// what key it's stored under, and errors from the storage layer (a real
// system boundary — the device could refuse to read/write for all kinds
// of reasons) are handled in exactly one place instead of scattered
// through the UI code.
import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@order_up/high_score';

export async function getHighScore() {
  try {
    const stored = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    // Storage being unavailable shouldn't crash the app over a
    // non-essential feature — just start from zero.
    console.warn('Could not load high score:', error);
    return 0;
  }
}

export async function saveHighScore(score) {
  try {
    await AsyncStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch (error) {
    console.warn('Could not save high score:', error);
  }
}
