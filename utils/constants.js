// utils/constants.js

// How many rows and columns in the Wordle board
export const NUM_ROWS = 6;
export const NUM_COLS = 5;

// Possible statuses for each letter/tile
export const STATUS = {
  UNKNOWN: 'unknown',   // No guess / default (transparent tile + border)
  CORRECT: 'correct',   // Green tile
  PRESENT: 'present',   // Yellow tile
  ABSENT: 'absent',     // Gray tile
};

// (Optional) If you want to fetch a “word of the day,” point to your API here.
// Example: export const WORD_API_URL = 'https://your-word-api.com/today';
export const WORD_API_URL = 'https://your-word-api.com/today';
