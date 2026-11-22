# Order Up! 🍔

A React Native / Expo cooking game. Customers order burgers; you tap ingredients to
stack them in the right order before the timer runs out. Serve correctly to score
points and level up, serve wrong (or too slow) and you lose one of three lives.

A full write-up of the design and architecture is in
[`docs/Order_Up_Design_Paper.docx`](docs/Order_Up_Design_Paper.docx).

## Running it

```bash
npm install
npx expo start
```

Then press `i` for the iOS Simulator, `a` for an Android emulator, or scan the QR
code with the Expo Go app on your phone.

## How to play

- Tap ingredients in the tray to stack them onto your plate, bottom to top, matching
  the customer's order shown at the top.
- Tap the top ingredient on your stack to undo it.
- Tap **Serve!** once your stack is the right size.
- Match the order exactly to score points and move on to the next customer. A wrong
  order or a timed-out order costs a life.

## Project structure

```
App.js                        — top-level screen switching + high score loading
src/screens/                  — Home, Game, GameOver screens
src/state/gameReducer.js      — all game rules, as one reducer
src/data/ingredients.js       — ingredient list + random recipe generator
src/constants/gameConfig.js   — every tunable number (lives, timers, scoring)
src/components/               — ScoreBar, OrderCard, PlateStack, IngredientButton, FeedbackToast
src/utils/                    — shuffle + AsyncStorage helpers
```

See the design paper for the reasoning behind each of these.
