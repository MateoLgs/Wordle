// /utils/hintUtils.js

/**
 * Get local synonyms for a target word, given a bank.
 * @param {string} target
 * @param {Array<{word:string,synonyms?:string[]}>} bank
 * @returns {string[]} array of synonyms (never includes the answer word)
 */
export function getLocalSynonyms(target, bank) {
  const entry = bank.find(w => w.word.toUpperCase() === target.toUpperCase());
  if (!entry || !entry.synonyms) return [];
  return entry.synonyms.filter(
    syn => syn.trim().toUpperCase() !== target.toUpperCase()
  );
}

/**
 * Get local definition for a target word, given a bank.
 * @param {string} target
 * @param {Array<{word:string,definition?:string}>} bank
 * @returns {string} definition (never includes the answer word)
 */
export function getLocalDefinition(target, bank) {
  const entry = bank.find(w => w.word.toUpperCase() === target.toUpperCase());
  if (!entry || !entry.definition) return '';
  // Optionally: Strip the answer from the definition.
  const def = entry.definition;
  return def.replace(new RegExp(target, "gi"), '_____');
}
