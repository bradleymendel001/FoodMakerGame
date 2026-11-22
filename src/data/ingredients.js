import { shuffleArray } from '../utils/shuffle';

// The full pool of ingredients a player can tap to build a burger.
// Every ingredient has:
//   id     - a unique string used everywhere in game logic
//   name   - human-readable label shown under its icon
//   emoji  - stands in for artwork, so the game needs no image assets
//   isBun  - buns are special: every recipe starts and ends with one
export const INGREDIENTS = [
  { id: 'bun_bottom', name: 'Bottom Bun', emoji: '🍞', isBun: true },
  { id: 'patty', name: 'Patty', emoji: '🥩', isBun: false },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', isBun: false },
  { id: 'lettuce', name: 'Lettuce', emoji: '🥬', isBun: false },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', isBun: false },
  { id: 'onion', name: 'Onion', emoji: '🧅', isBun: false },
  { id: 'bacon', name: 'Bacon', emoji: '🥓', isBun: false },
  { id: 'egg', name: 'Fried Egg', emoji: '🍳', isBun: false },
  { id: 'pickle', name: 'Pickle', emoji: '🥒', isBun: false },
  { id: 'bun_top', name: 'Top Bun', emoji: '🍞', isBun: true },
];

// Quick lookup table (id -> ingredient) so components can find an
// ingredient's emoji/name without searching the array every time.
export const INGREDIENT_MAP = INGREDIENTS.reduce((map, ingredient) => {
  map[ingredient.id] = ingredient;
  return map;
}, {});

// Ingredients that can appear in the *middle* of a burger — everything
// except the two buns, which every recipe adds automatically.
const FILLING_INGREDIENTS = INGREDIENTS.filter((item) => !item.isBun);

// Builds one random recipe: `fillingCount` unique fillings, sandwiched
// between a bottom and top bun. This is the only place recipes get
// created, so all difficulty tuning flows through the caller-supplied
// `fillingCount` (see getDifficulty in src/state/gameReducer.js).
export function generateRecipe(fillingCount) {
  const fillings = shuffleArray(FILLING_INGREDIENTS)
    .slice(0, fillingCount)
    .map((item) => item.id);
  return ['bun_bottom', ...fillings, 'bun_top'];
}
