// utils/wordUtils.js

// Remove accents for comparison
export function stripAccents(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Build a normalized set of all words in the local word bank
export function buildNormalizedWordSet(bank) {
  const set = new Set();
  bank.forEach(entry => {
    set.add(stripAccents(entry.word).toUpperCase());
    set.add(entry.word.toUpperCase());
  });
  return set;
}

// Evaluate guess: returns array of STATUS for each letter
export function evaluateGuess(guess, target) {
  // Both guess and target must be uppercase, no accents
  const result = Array(target.length).fill('absent');
  const used = Array(target.length).fill(false);

  // First pass: correct positions
  for (let i = 0; i < target.length; ++i) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  // Second pass: present (right letter, wrong place)
  for (let i = 0; i < target.length; ++i) {
    if (result[i] === 'correct') continue;
    for (let j = 0; j < target.length; ++j) {
      if (!used[j] && guess[i] === target[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

/**
 * Validate a word:
 * - Accept immediately if in local normalized word set
 * - Otherwise, for EN: use DictionaryAPI
 * - For FR/ES/CZ: use LanguageTool API for spellcheck
 * - If network error (simulated or real), call onNetworkError callback if provided
 *
 * @param {string} word
 * @param {Set} normalizedSet - Set of local words (uppercase, accent-stripped)
 * @param {string} lang - 'en', 'fr', 'es', or 'cz'
 * @param {boolean} simulateNetworkError
 * @param {function} onNetworkError
 * @returns {Promise<boolean>} true if valid, false otherwise
 */
export async function validateWord(word, normalizedSet, lang, simulateNetworkError = false, onNetworkError) {
  // Normalize input
  const stripped = stripAccents(word).toUpperCase();

  // Accept any word in the local set (fast path)
  if (normalizedSet.has(stripped) || normalizedSet.has(word.toUpperCase())) {
    return true;
  }

  // Simulate a network error (dev tool)
  if (simulateNetworkError) {
    if (onNetworkError) onNetworkError();
    return false;
  }

  // DictionaryAPI for English
  if (lang === 'en') {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      if (!res.ok) throw new Error("Network or word not found");
      const data = await res.json();
      return Array.isArray(data) && data.length > 0;
    } catch (err) {
      if (onNetworkError) onNetworkError();
      return false;
    }
  }

  // LanguageTool API for FR/ES/CZ
  if (['fr', 'es', 'cz'].includes(lang)) {
    try {
      const res = await fetch(
        `https://api.languagetool.org/v2/check?language=${lang}&text=${word}`
      );
      if (!res.ok) throw new Error("Network or word not found");
      const data = await res.json();
      // If no spelling mistakes, accept
      const hasSpellingMistake = data.matches.some(
        m => m.rule.issueType === "misspelling"
      );
      return !hasSpellingMistake;
    } catch (err) {
      if (onNetworkError) onNetworkError();
      return false;
    }
  }

  // Fallback: Not valid
  return false;
}
