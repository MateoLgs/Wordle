// /utils/gamePoints.js

/**
 * Get the unlock time (in seconds left) for synonyms,
 * as a percentage of the original timer.
 * @param {number} initialSeconds - The starting timer value (e.g. 180).
 * @returns {number} - The timeLeft value at which Synonyms unlock.
 */
export function getSynonymsUnlockAt(initialSeconds) {
  // Unlock after 65% of the timer has passed.
  // i.e. 35% remaining.
  return Math.floor(initialSeconds * 0.25);
}

/**
 * Get the unlock time (in seconds left) for definitions,
 * as a percentage of the original timer.
 * @param {number} initialSeconds - The starting timer value (e.g. 180).
 * @returns {number} - The timeLeft value at which Definitions unlock.
 */
export function getDefinitionUnlockAt(initialSeconds) {
  // Unlock after 80% of the timer has passed.
  // i.e. 20% remaining.
  return Math.floor(initialSeconds * 0.15);
}

/**
 * Compute penalty for using synonyms, based on rows left.
 * @param {number} rowVal - NUM_ROWS - guesses.length
 * @param {boolean} used - Already used this hint?
 * @returns {number} - Penalty points
 */
export function getSynPenalty(rowVal, used) {
  return used ? 0 : 4 * rowVal * rowVal;
}

/**
 * Compute penalty for using definition, based on rows left.
 * @param {number} rowVal - NUM_ROWS - guesses.length
 * @param {boolean} used - Already used this hint?
 * @returns {number} - Penalty points
 */
export function getDefPenalty(rowVal, used) {
  return used ? 0 : 2 * rowVal * rowVal;
}
