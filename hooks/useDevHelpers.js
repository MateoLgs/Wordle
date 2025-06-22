// /hooks/useDevHelpers.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { stripAccents, evaluateGuess } from '../utils/wordUtils';
import { mergeLetterStatuses } from '../utils/gameLogic';
import { NUM_ROWS, STATUS } from '../utils/constants';
import { ALL_WORD_BANKS } from '../assets/wordBanks';

export function useDevHelpers({
  bank,
  target, setTarget,
  setGuesses, setStatuses, setCurrent,
  setGameOver, setEndMsg, setLastScore, setShowEndModal,
  setFreshWin, setShowDevPanel,
  setReveal,
  setConfetti, setNetworkErrorDetected,
  setWotdCompleted, setWotdLoaded,
  setPenalties, setSynonymsUsed, setDefinitionUsed,
  setValidating,
  currentLanguage, gameMode,
  handleRestart, resetPoints
}) {
  // Autofill all but last row with wrong guesses
  const devAutofillBoard = () => {
    if (!bank.length) return;
    const fillerWords = bank
      .map(w => w.word.toUpperCase())
      .filter(w => w !== target)
      .slice(0, NUM_ROWS - 1);
    const entries = fillerWords.map(word => {
      const gNorm = stripAccents(word).toUpperCase();
      const tNorm = stripAccents(target).toUpperCase();
      const sts = evaluateGuess(gNorm, tNorm);
      return { letters: word.split(''), statuses: sts };
    });
    const allStatuses = entries.reduce((acc, e) => mergeLetterStatuses(acc, e), {});
    setGuesses(entries);
    setStatuses(allStatuses);
    setCurrent('');
    setGameOver(false);
    setEndMsg('');
    setLastScore(null);
    setShowEndModal(false);
    setFreshWin(false);
    setShowDevPanel(false);
  };

  // Auto Win in 6
  const devAutoWin6 = () => {
    if (!bank.length) return;
    const fillerWords = bank
      .map(w => w.word.toUpperCase())
      .filter(w => w !== target)
      .slice(0, NUM_ROWS - 1);
    const entries = fillerWords.map(word => {
      const gNorm = stripAccents(word).toUpperCase();
      const tNorm = stripAccents(target).toUpperCase();
      const sts = evaluateGuess(gNorm, tNorm);
      return { letters: word.split(''), statuses: sts };
    });
    const winEntry = {
      letters: target.split(''),
      statuses: Array(target.length).fill(STATUS.CORRECT)
    };
    const finalGuesses = [...entries, winEntry];
    const allStatuses = finalGuesses.reduce((acc, e) => mergeLetterStatuses(acc, e), {});
    setGuesses(finalGuesses);
    setStatuses(allStatuses);
    setCurrent('');
    setGameOver(true);
    setEndMsg('🎉 Auto Win');
    setLastScore(0);
    setShowEndModal(true);
    setFreshWin(false);
    setShowDevPanel(false);
  };

  // Auto Lose
  const devForceLose = () => {
    if (!bank.length) return;
    const wrongs = bank
      .map(w => w.word.toUpperCase())
      .filter(w => w !== target)
      .slice(0, NUM_ROWS);
    const entries = wrongs.map(word => {
      const gNorm = stripAccents(word).toUpperCase();
      const tNorm = stripAccents(target).toUpperCase();
      const sts = evaluateGuess(gNorm, tNorm);
      return { letters: word.split(''), statuses: sts }
    }).slice(0, NUM_ROWS);
    const allStatuses = entries.reduce((acc, e) => mergeLetterStatuses(acc, e), {});
    setGuesses(entries);
    setStatuses(allStatuses);
    setCurrent('');
    setGameOver(true);
    setEndMsg('😞 Auto Lose');
    setLastScore(0);
    setShowEndModal(true);
    setFreshWin(false);
    setShowDevPanel(false);
  };

  // Reveal the answer in an alert
  const devRevealAnswer = () => {
    setReveal(true);
    if (typeof window !== "undefined") {
      // Web (dev)
      window.alert(target);
    } else {
      // Native
      Alert.alert('Answer', target);
    }
    setShowDevPanel(false);
  };

  // Full game restart (hard reset)
  const devRestart = () => {
    handleRestart();
    setShowDevPanel(false);
  };

  // Toggle simulated network error
  const devSimulateNetworkError = () => {
    setNetworkErrorDetected(x => !x);
    setShowDevPanel(false);
  };

  // Reset word of the day progress
  const devResetWOTD = async () => {
    if (gameMode !== "wordofday") return;
    const todayKey = (() => {
      const today = new Date();
      const y = today.getFullYear();
      const m = (today.getMonth() + 1).toString().padStart(2, "0");
      const d = today.getDate().toString().padStart(2, "0");
      return `@wotd-${currentLanguage}-${y}-${m}-${d}`;
    })();
    await AsyncStorage.removeItem(todayKey);
    setWotdCompleted(false);
    setShowEndModal(false);
    setGameOver(false);
    setFreshWin(false);
    const b = ALL_WORD_BANKS[currentLanguage] || [];
    const word = b.length
      ? b[Math.floor(Math.random() * b.length)].word.toUpperCase()
      : '';
    setTarget(word);
    setGuesses([]);
    setCurrent('');
    setStatuses({});
    setLastScore(null);
    setReveal(false);
    setPenalties(0);
    setSynonymsUsed(false);
    setDefinitionUsed(false);
    setConfetti(false);
    setNetworkErrorDetected(false);
    setWotdCompleted(false);
    setWotdLoaded(true);
    setShowDevPanel(false);
  };

  // Reset points helper
  const devResetPointsWrapped = async () => {
    await resetPoints();
    setShowDevPanel(false);
  };

  return {
    devAutofillBoard,
    devAutoWin6,
    devForceLose,
    devRevealAnswer,
    devRestart,
    devSimulateNetworkError,
    devResetWOTD,
    devResetPointsWrapped,
  };
}
