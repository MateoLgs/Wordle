// scoreUtils.js

/**
 * Scoring configuration constants.
 * Adjust these values to change how many points each factor is worth.
 */
const BASE_POINTS_PER_LETTER = 10;          // Base points per letter in the target word
const WIN_BONUS = 50;                       // Flat bonus for winning at all
const GUESS_PENALTY = 5;                    // Penalty per guess taken
const BONUS_PER_UNUSED_GUESS = 10;          // Bonus per unused guess (i.e. if maxAttempts=6 and used=4, unused=2 → 2 * this)
const TIME_BONUS_THRESHOLD = 60;            // In seconds: if timeTaken < this, award TIME_BONUS
const TIME_BONUS = 20;                      // Flat time bonus if under threshold
const STREAK_MULTIPLIER = 0.01;             // **1% extra points per current win streak (was 5%)**
const MAX_STREAK_FOR_BONUS = 20;            // **Cap streak multiplier at 20**
const HARD_MODE_MULTIPLIER = 1.2;           // 20% additional multiplier if in hard mode

/**
 * calculateScore
 *
 * Compute a point total given the parameters of a single completed game.
 *
 * @param {Object} params
 * @param {boolean} params.isWin               - True if the player guessed the word correctly.
 * @param {number} params.attemptsUsed         - How many guesses the player took (1-based count). If lost, use maxAttempts.
 * @param {number} params.maxAttempts          - Maximum guesses allowed (typically 6).
 * @param {number} params.wordLength           - Length of the target word (e.g., 5 for a 5-letter word).
 * @param {number} [params.timeTakenSeconds]   - (Optional) Total time in seconds spent on this game.
 * @param {number} [params.currentStreak]      - (Optional) Player’s current consecutive win streak heading into this game.
 * @param {boolean} [params.isHardMode=false]  - (Optional) Whether the game was played in “hard mode.”
 *
 * @returns {number} Final point total for this game (rounded to nearest integer).
 */
export function calculateScore({
  isWin,
  attemptsUsed,
  maxAttempts,
  wordLength,
  timeTakenSeconds = 0,
  currentStreak = 0,
  isHardMode = false
}) {
  let total = 0;

  // 1) Base points for word length
  const baseWordPoints = wordLength * BASE_POINTS_PER_LETTER;
  total += baseWordPoints;

  if (isWin) {
    // 2) Win bonus
    total += WIN_BONUS;

    // 3) Unused guesses bonus
    const unusedGuesses = Math.max(0, maxAttempts - attemptsUsed);
    total += unusedGuesses * BONUS_PER_UNUSED_GUESS;

    // 4) Time bonus (if under threshold)
    if (timeTakenSeconds > 0 && timeTakenSeconds <= TIME_BONUS_THRESHOLD) {
      total += TIME_BONUS;
    }

    // 5) Streak multiplier (capped)
    if (currentStreak && currentStreak > 0) {
      const effectiveStreak = Math.min(currentStreak, MAX_STREAK_FOR_BONUS); // Cap at 20
      total *= 1 + effectiveStreak * STREAK_MULTIPLIER;
    }

    // 6) Hard‐mode multiplier
    if (isHardMode) {
      total *= HARD_MODE_MULTIPLIER;
    }
  } else {
    //  Loss branch: penalize for failing and deduct points per guess.
    total -= attemptsUsed * GUESS_PENALTY;

    //  If you want to enforce a minimum of zero points:
    if (total < 0) {
      total = 0;
    }
  }

  // Round to nearest integer before returning
  return Math.round(total);
}

/**
 * Example usage:
 *
 * import { calculateScore } from "./scoreUtils";
 *
 * // Winning a 5-letter word in 4 tries, under 50 seconds, with a 3‐game streak, in hard mode:
 * const scoreWin = calculateScore({
 *   isWin: true,
 *   attemptsUsed: 4,
 *   maxAttempts: 6,
 *   wordLength: 5,
 *   timeTakenSeconds: 50,
 *   currentStreak: 3,
 *   isHardMode: true
 * });
 * console.log("Points earned (win):", scoreWin);
 *
 * // Losing a 6-letter word after using all 6 guesses:
 * const scoreLoss = calculateScore({
 *   isWin: false,
 *   attemptsUsed: 6,
 *   maxAttempts: 6,
 *   wordLength: 6
 * });
 * console.log("Points earned (loss):", scoreLoss);
 */
