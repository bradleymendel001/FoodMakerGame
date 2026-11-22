// Fisher-Yates shuffle. We deliberately don't use the common
// `array.sort(() => Math.random() - 0.5)` trick because it's
// statistically biased — some orderings end up more likely than
// others. This algorithm gives every ordering an equal chance, which
// matters here because a biased shuffle would make certain ingredient
// combinations show up in recipes more often than others.
export function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
