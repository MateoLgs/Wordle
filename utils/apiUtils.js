import { WORD_API_URL } from './constants';

// Fetch the “word of the day” from your remote endpoint (falling back to 'REACT' on error)
export async function fetchDailyWord() {
  try {
    const resp = await fetch(WORD_API_URL);
    if (!resp.ok) throw new Error('Network response was not ok');
    const data = await resp.json();
    // Expect API to return something like { word: 'APPLE' }
    return data.word.toUpperCase();
  } catch (err) {
    console.error('Error fetching daily word:', err);
    return 'REACT';
  }
}

/**
 * Fetch the first dictionary definition for `word` using dictionaryapi.dev.
 * Returns a string (the first available definition) or fallback.
 */
export async function fetchDefinition(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return 'No definition found.';
    }

    const meanings = data[0].meanings;
    if (!meanings || meanings.length === 0) return 'No definition found.';

    const definitions = meanings
      .map((m) => m.definitions?.[0]?.definition)
      .filter(Boolean);

    const rawDef = definitions.find((d) => d) || 'No definition found.';

    // Replace all instances of the word (case-insensitive) with ***
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const masked = rawDef.replace(regex, '***');

    return masked;
  } catch (err) {
    return 'No definition found.';
  }
}
    

/**
 * Fetch synonyms for `word` using dictionaryapi.dev.
 * Falls back to Datamuse if none found.
 * Always returns an array.
 */
export async function fetchSynonyms(word) {
  const allSynonyms = new Set();

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    data.forEach(entry => {
      entry.meanings?.forEach(meaning => {
        meaning.definitions?.forEach(def => {
          def.synonyms?.forEach(s => allSynonyms.add(s));
        });
        meaning.synonyms?.forEach(s => allSynonyms.add(s));
      });
      entry.synonyms?.forEach(s => allSynonyms.add(s));
    });
  } catch (err) {
    console.warn('Primary synonym fetch failed:', err.message);
  }

  let results = Array.from(allSynonyms).filter(
    (s) => !s.toLowerCase().includes(word.toLowerCase())
  );

  // Fallback: if no synonyms found, try Datamuse
  if (results.length === 0) {
    try {
      const fallback = await fetch(`https://api.datamuse.com/words?rel_syn=${word.toLowerCase()}`);
      const fallbackData = await fallback.json();

      results = fallbackData
        .map(item => item.word)
        .filter(w => !w.toLowerCase().includes(word.toLowerCase()));
    } catch (err) {
      console.warn('Fallback synonym fetch failed:', err.message);
    }
  }

  return results;
}
