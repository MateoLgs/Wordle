// utils/gameLogic.js

import { stripAccents } from './wordUtils';

// --- Merge letter statuses for the keyboard coloring ---
export function mergeLetterStatuses(oldS, entry) {
  const m = { ...oldS }
  entry.letters.forEach((ltr, i) => {
    const st   = entry.statuses[i]
    const prev = m[ltr] || undefined
    if (prev === 'correct') return
    if (prev === 'present' && st === 'absent') return
    if (
      st === 'correct' ||
      (st === 'present' && prev == null) ||
      (st === 'absent' && prev == null)
    ) {
      m[ltr] = st
    } else if (prev === 'present' && st === 'correct') {
      m[ltr] = 'correct'
    } else if (
      prev === 'absent' &&
      (st === 'present' || st === 'correct')
    ) {
      m[ltr] = st
    }
  })
  return m
}

// --- Get synonyms locally (never fetch online) ---
export function getSynonymsLocal(target, bank) {
  const key = stripAccents(target).toUpperCase()
  const entry = bank.find(x => stripAccents(x.word).toUpperCase() === key)
  return entry?.synonyms
    .filter(s => stripAccents(s).toUpperCase() !== key) || []
}

// --- Get definition locally (never fetch online) ---
export function getDefinitionLocal(target, bank) {
  const key = stripAccents(target).toUpperCase()
  const entry = bank.find(x => stripAccents(x.word).toUpperCase() === key)
  // Remove the word itself from the definition
  return entry?.definition?.replace(new RegExp(key, 'gi'), '') || ''
}
