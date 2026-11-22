// All of the game's logic lives here as a single reducer function.
// Using useReducer (instead of several separate useState calls in
// GameScreen) keeps every state transition in one place and makes each
// one easy to reason about: given a state and an action, what's the
// new state? See docs/ for a full write-up of why this pattern fits a
// game like this one.

import { generateRecipe } from '../data/ingredients';
import {
  STARTING_LIVES,
  LEVEL_TIME_LIMITS,
  LEVEL_INGREDIENT_COUNTS,
  ORDERS_PER_LEVEL,
  BASE_ORDER_POINTS,
  POINTS_PER_SECOND_LEFT,
  STREAK_BONUS_PER_ORDER,
  MAX_STREAK_BONUS_MULTIPLIER,
} from '../constants/gameConfig';

// Looks up how hard orders should be at a given level. Levels past the
// end of the tuning arrays just keep reusing the hardest settings
// instead of crashing on an out-of-bounds array index.
function getDifficulty(level) {
  const index = Math.min(level, LEVEL_INGREDIENT_COUNTS.length - 1);
  return {
    fillingCount: LEVEL_INGREDIENT_COUNTS[index],
    timeLimit: LEVEL_TIME_LIMITS[index],
  };
}

// Builds a brand new order for the given level: a random recipe of the
// right difficulty, with a fresh countdown.
function createOrder(level) {
  const { fillingCount, timeLimit } = getDifficulty(level);
  return { recipe: generateRecipe(fillingCount), timeLeft: timeLimit, timeLimit };
}

// The shape of state the game starts in. `highScore` is passed in
// because it's loaded from device storage before the game begins (see
// App.js) — the reducer itself never touches AsyncStorage directly.
export function createInitialState(highScore = 0) {
  const order = createOrder(0);
  return {
    status: 'playing', // 'playing' | 'gameover'
    score: 0,
    highScore,
    lives: STARTING_LIVES,
    streak: 0, // consecutive correctly-served orders
    level: 0,
    ordersServedThisLevel: 0,
    plate: [], // ingredient ids stacked so far, bottom to top
    currentRecipe: order.recipe,
    timeLeft: order.timeLeft,
    timeLimit: order.timeLimit,
    lastEvent: null, // 'served' | 'wrong' | 'timeout' — read by the feedback toast
    lastPointsEarned: 0,
    eventId: 0, // bumped on every event so the UI can react even when
    // the same kind of event fires twice in a row (see FeedbackToast)
  };
}

// Order matters for a burger, so the player's plate has to match the
// recipe ingredient-for-ingredient, bottom to top — not just contain
// the same items.
function platesMatch(plate, recipe) {
  if (plate.length !== recipe.length) return false;
  return plate.every((ingredientId, index) => ingredientId === recipe[index]);
}

// Clears the plate and hands the player a new order, leveling up if
// they've served enough correct orders at the current level. Shared by
// the "served correctly" and "timed out" transitions below.
function advanceToNextOrder(state, { leveledUp }) {
  const nextLevel = leveledUp ? state.level + 1 : state.level;
  const order = createOrder(nextLevel);
  return {
    ...state,
    level: nextLevel,
    ordersServedThisLevel: leveledUp ? 0 : state.ordersServedThisLevel,
    plate: [],
    currentRecipe: order.recipe,
    timeLeft: order.timeLeft,
    timeLimit: order.timeLimit,
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    // Player tapped an ingredient in the tray — stack it on the plate.
    case 'ADD_INGREDIENT': {
      if (state.status !== 'playing') return state;
      // Don't let the plate grow taller than the order could ever need;
      // extra ingredients couldn't possibly be correct.
      if (state.plate.length >= state.currentRecipe.length) return state;
      return { ...state, plate: [...state.plate, action.ingredientId] };
    }

    // Player tapped the top of their stack to undo the last ingredient.
    case 'REMOVE_LAST': {
      if (state.status !== 'playing' || state.plate.length === 0) return state;
      return { ...state, plate: state.plate.slice(0, -1) };
    }

    // Player tapped "Serve!" — check the plate against the order.
    case 'SERVE': {
      if (state.status !== 'playing') return state;

      if (!platesMatch(state.plate, state.currentRecipe)) {
        const lives = state.lives - 1;
        const eventId = state.eventId + 1;
        if (lives <= 0) {
          return { ...state, lives: 0, status: 'gameover', streak: 0, lastEvent: 'wrong', eventId };
        }
        // Wrong burger: clear the plate but keep the same order so the
        // player can use their remaining time to try again.
        return { ...state, lives, plate: [], streak: 0, lastEvent: 'wrong', eventId };
      }

      // Correct! Bigger time bonus for serving quickly, bigger streak
      // bonus the longer the player's current hot streak is (capped so
      // one long run can't snowball the score forever).
      const streak = state.streak + 1;
      const streakBonus = Math.min(streak, MAX_STREAK_BONUS_MULTIPLIER) * STREAK_BONUS_PER_ORDER;
      const timeBonus = state.timeLeft * POINTS_PER_SECOND_LEFT;
      const earnedPoints = BASE_ORDER_POINTS + timeBonus + streakBonus;

      const ordersServedThisLevel = state.ordersServedThisLevel + 1;
      const leveledUp = ordersServedThisLevel >= ORDERS_PER_LEVEL;
      const advanced = advanceToNextOrder({ ...state, ordersServedThisLevel }, { leveledUp });

      return {
        ...advanced,
        score: state.score + earnedPoints,
        streak,
        lastEvent: 'served',
        lastPointsEarned: earnedPoints,
        eventId: state.eventId + 1,
      };
    }

    // The one-second countdown ticks. When an order's timer runs out,
    // the player loses a life and gets a new order.
    case 'TICK': {
      if (state.status !== 'playing') return state;

      if (state.timeLeft > 1) {
        return { ...state, timeLeft: state.timeLeft - 1 };
      }

      const lives = state.lives - 1;
      const eventId = state.eventId + 1;
      if (lives <= 0) {
        return { ...state, lives: 0, timeLeft: 0, status: 'gameover', streak: 0, lastEvent: 'timeout', eventId };
      }
      return {
        ...advanceToNextOrder({ ...state, streak: 0 }, { leveledUp: false }),
        lives,
        lastEvent: 'timeout',
        eventId,
      };
    }

    default:
      return state;
  }
}
