// wordUtils.js

import { STATUS } from './constants';

/**
 * Strip accents/diacritics from a string (for accent-insensitive matching)
 * Example: "éèçàü" → "eecaü"
 */
export function stripAccents(str) {
  if (typeof str !== 'string') return str;
  // Handles most Latin accents, keeps casing
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Build a Set of normalized (accent-insensitive, UPPERCASE) words from a word bank.
 * This lets you check for word validity in O(1) time, even for large banks.
 * @param {Array} wordBank - Array of objects with a .word property
 * @returns {Set<string>}
 */
export function buildNormalizedWordSet(wordBank) {
  return new Set(
    wordBank.map(e => stripAccents(e.word).toUpperCase())
  );
}

/**
 * Returns a fallback target word if none loaded.
 */
export function getTargetWord() {
  return 'REACT';
}

/**
 * Compare a guess to the target and return an array of STATUS values per letter.
 * Used for coloring tiles.
 * @param {string} guess
 * @param {string} target
 * @returns {Array<string>} (STATUS array)
 */
export function evaluateGuess(guess, target) {
  const length = Math.max(guess.length, target.length);
  const result = Array(length).fill(STATUS.ABSENT);
  const targetLetters = target.split('');

  // First pass: mark exact matches (green)
  for (let i = 0; i < length; i++) {
    if (guess[i] === target[i]) {
      result[i] = STATUS.CORRECT;
      targetLetters[i] = null; // Consume this letter
    }
  }

  // Second pass: mark present but wrong spot (yellow)
  for (let i = 0; i < length; i++) {
    if (result[i] === STATUS.CORRECT) continue;
    const idx = targetLetters.indexOf(guess[i]);
    if (idx !== -1) {
      result[i] = STATUS.PRESENT;
      targetLetters[idx] = null; // Consume
    }
  }

  return result;
}

/**
 * Basic guess validation (for UI entry) — extend as needed.
 * (e.g., you may want to enforce length or valid alphabet)
 */
export function isValidGuess(guess, length = 5) {
  return typeof guess === 'string' && guess.length === length;
}


export async function validateWord(guess, normalizedSet, lang) {
  // Use normalizedSet for accent-insensitive, fast local check
  const norm = stripAccents(guess).toUpperCase();
  if (normalizedSet && normalizedSet.has(norm)) return true;

  // DictionaryAPI for English
  if (lang === 'en') {
    try {
      const r = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${norm.toLowerCase()}`
      );
      return r.ok;
    } catch {
      return false;
    }
  }

  // LanguageTool for FR/ES/CZ
  if (['fr', 'es', 'cz'].includes(lang)) {
    const lt = lang === 'cz' ? 'cs' : lang;
    const body = `text=${encodeURIComponent(guess)}&language=${lt}`;
    try {
      const r = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!r.ok) return false;
      const { matches } = await r.json();
      return !matches.some(m => m.rule.issueType === 'misspelling');
    } catch {
      return false;
    }
  }

  return false;
}
