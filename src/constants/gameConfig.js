// Tunable numbers that control how the game plays and gets harder.
// Keeping them in one file makes it possible to rebalance the game
// without hunting through component or reducer code.

export const STARTING_LIVES = 3;

// Every order the player must complete counts down from a time limit.
// As the player levels up, orders get shorter and demand more
// ingredients. Both arrays are indexed by "level" (0-based) — index 0
// is the easiest, first order the player ever sees.
export const LEVEL_TIME_LIMITS = [15, 13, 11, 9, 8, 7]; // seconds per order
export const LEVEL_INGREDIENT_COUNTS = [2, 2, 3, 3, 4, 5]; // "filling" ingredients, not counting the two buns

// How many correct orders in a row it takes to advance one level.
export const ORDERS_PER_LEVEL = 3;

// Scoring
export const BASE_ORDER_POINTS = 100;
export const POINTS_PER_SECOND_LEFT = 5; // rewards serving quickly
export const STREAK_BONUS_PER_ORDER = 10; // extra points per combo streak
export const MAX_STREAK_BONUS_MULTIPLIER = 5; // caps how far the streak bonus can grow

// The plate never needs to hold more than the hardest recipe could
// require, plus its two buns. Used to reserve a stable amount of
// vertical space for the stack regardless of the current order.
export const MAX_STACK_SIZE = Math.max(...LEVEL_INGREDIENT_COUNTS) + 2;
