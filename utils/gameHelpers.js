// /utils/gameHelpers.js

/**
 * Deterministically pick the word of the day for a bank and current date.
 * @param {Array<{word:string}>} bank
 * @returns {string} Uppercase answer word
 */
export function getDailyWordForBank(bank) {
  if (!bank.length) return '';
  const now = new Date();
  const start = new Date(2020, 0, 1);
  const daysSince = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const index = daysSince % bank.length;
  return bank[index].word.toUpperCase();
}

/**
 * Generate the AsyncStorage key for WOTD progress.
 * @param {string} lang
 * @returns {string} Storage key
 */
export function getTodayKey(lang) {
  const today = new Date();
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, "0");
  const d = today.getDate().toString().padStart(2, "0");
  return `@wotd-${lang}-${y}-${m}-${d}`;
}
