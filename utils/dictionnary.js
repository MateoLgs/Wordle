// src/utils/dictionary.js
import { ALL_WORD_BANKS } from '../wordBanks';

export function isValidWord(word, langCode) {
  const bank = ALL_WORD_BANKS[langCode] || [];
  return bank.some((entry) => entry.word === word);
}

export function getDefinition(word, langCode) {
  const bank = ALL_WORD_BANKS[langCode] || [];
  const entry = bank.find((e) => e.word === word);
  return entry ? entry.definition : null;
}

export function getSynonyms(word, langCode) {
  const bank = ALL_WORD_BANKS[langCode] || [];
  const entry = bank.find((e) => e.word === word);
  return entry ? entry.synonyms : [];
}
