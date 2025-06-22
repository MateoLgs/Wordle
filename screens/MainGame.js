import React, { useState, useEffect, useCallback } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDailyWordForBank, getTodayKey } from '../utils/gameHelpers';

import {
  mergeLetterStatuses,
  getSynonymsLocal,
  getDefinitionLocal
} from '../utils/gameLogic';
import { useGameTimer } from '../hooks/useGameTimer';
import { getLocalSynonyms, getLocalDefinition } from '../utils/hintUtils';

import Board from '../components/Board'
import Keyboard from '../components/Keyboard'
import GameHeader from '../components/GameHeader'
import EndgameModal from '../components/EndgameModal'
import HintModal from '../components/HintModal'
import {
  evaluateGuess,
  stripAccents,
  buildNormalizedWordSet,
  validateWord
} from '../utils/wordUtils'
import { NUM_ROWS, STATUS } from '../utils/constants'
import { ALL_WORD_BANKS } from '../assets/wordBanks'
import ConfettiCannon from 'react-native-confetti-cannon'

// Points/penalties logic from utils
import {
  getSynonymsUnlockAt,
  getDefinitionUnlockAt,
  getSynPenalty,
  getDefPenalty,
} from '../utils/gamePoints'

// NEW: Import dev helpers hook
import { useDevHelpers } from '../hooks/useDevHelpers'

const POINTS_KEY = '@totalPoints'

export default function MainGame({ currentLanguage, gameMode, onGoHome, theme = 'system', setTheme }) {
  const systemColorScheme = useColorScheme();
  const activeTheme = theme === 'system' ? systemColorScheme : theme;
  const isDark = activeTheme === 'dark';

  const INITIAL_SECONDS = 180; // <-- Adjust here for timed mode length

  // Unlock thresholds based on initial timer duration
  const synonymsUnlockAt = getSynonymsUnlockAt(INITIAL_SECONDS);
  const definitionUnlockAt = getDefinitionUnlockAt(INITIAL_SECONDS);

  const [bank, setBank]                   = useState([])
  const [normalizedSet, setNormalizedSet] = useState(new Set())
  const [target, setTarget]               = useState('')
  const [guesses, setGuesses]             = useState([])
  const [current, setCurrent]             = useState('')
  const [statuses, setStatuses]           = useState({})
  const [shake, setShake]                 = useState(0)
  const [gameOver, setGameOver]           = useState(false)
  const [penalties, setPenalties]         = useState(0)
  const [synonymsUsed, setSynonymsUsed]   = useState(false)
  const [definitionUsed, setDefinitionUsed] = useState(false)

  const [synonymsList, setSynonymsList]   = useState([])
  const [definitionText, setDefinitionText] = useState('')
  const [showSynModal, setShowSynModal]   = useState(false)
  const [showDefModal, setShowDefModal]   = useState(false)

  const [showEndModal, setShowEndModal]   = useState(false)
  const [endMsg, setEndMsg]               = useState('')
  const [lastScore, setLastScore]         = useState(null)
  const [reveal, setReveal]               = useState(false)
  const [confetti, setConfetti]           = useState(false)
  const [validating, setValidating]       = useState(false)
  const [totalPoints, setTotalPoints]     = useState(0)
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);
  const [networkErrorDetected, setNetworkErrorDetected] = useState(false);

  const [wotdLoaded, setWotdLoaded]       = useState(false);
  const [wotdCompleted, setWotdCompleted] = useState(false);

  const [freshWin, setFreshWin]           = useState(false);
  const [wordCount, setWordCount]         = useState(1);

  // DevPanel open/close state
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Timer
  const onTimeout = useCallback(() => {
    setEndMsg(`⏰ Time's up!\nWords found: ${totalPoints}`);
    setGameOver(true);
    setShowEndModal(true);
    setTotalPoints(0); // RESET POINTS ON TIMEOUT!
    AsyncStorage.setItem(POINTS_KEY, '0');
  }, [totalPoints]);
  const [timeLeft] = useGameTimer({
    mode: gameMode,
    isActive: !gameOver,
    initialSeconds: INITIAL_SECONDS,
    onTimeout,
  });

  const { width } = Dimensions.get('window')
  const containerWidth = width * 0.95;
  const tileSize   = target.length ? containerWidth / target.length : 48;

  // Load persisted points on mount
  useEffect(() => {
    AsyncStorage.getItem(POINTS_KEY).then(v => {
      if (v != null) setTotalPoints(parseInt(v,10))
    })
  }, [])
  const resetPoints = async () => {
    setTotalPoints(0)
    await AsyncStorage.setItem(POINTS_KEY, '0')
    setShowDevPanel(false)
  }

  useEffect(() => {
    setWotdLoaded(false);
    setWotdCompleted(false);

    const b = ALL_WORD_BANKS[currentLanguage] || [];
    setBank(b);
    setNormalizedSet(buildNormalizedWordSet(b));

    if (gameMode !== "wordofday") {
      if (b.length) setTarget(b[Math.floor(Math.random()*b.length)].word.toUpperCase());
      setGuesses([]); setCurrent(''); setStatuses({});
      setShowEndModal(false);
      setLastScore(null); setReveal(false);
      setPenalties(0); setSynonymsUsed(false); setDefinitionUsed(false);
      setConfetti(false); setNetworkErrorDetected(false);
      setFreshWin(false);
      setWotdLoaded(true);
      return;
    }

    // --- Word of the Day (OFFLINE DETERMINISTIC) ---
    const todayKey = getTodayKey(currentLanguage);
    AsyncStorage.getItem(todayKey).then(async stored => {
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setTarget(data.target);
          setGuesses(data.guesses || []);
          setStatuses(data.statuses || {});
          setGameOver(true);
          setShowEndModal(false);
          setEndMsg(data.win ? "🎉 You win!" : "😞 You lose");
          setWotdCompleted(true);
          setReveal(false);
          setCurrent('');
          setConfetti(false);
          setFreshWin(false); // No confetti/modal on revisit
        } catch (err) {
          await AsyncStorage.removeItem(todayKey);
          setWotdCompleted(false);
        }
        setWotdLoaded(true);
        return;
      }
      // Use deterministic word selection for WOTD
      const word = getDailyWordForBank(b);
      setTarget(word);
      setGuesses([]); setCurrent(''); setStatuses({});
      setGameOver(false); setShowEndModal(false);
      setLastScore(null); setReveal(false);
      setPenalties(0); setSynonymsUsed(false); setDefinitionUsed(false);
      setConfetti(false); setNetworkErrorDetected(false);
      setWotdCompleted(false);
      setFreshWin(false);
      setWotdLoaded(true);
    });
  }, [currentLanguage, gameMode]);

  useEffect(() => {
    if (!gameOver) return;
    if (!freshWin) return;
    const win = endMsg.startsWith('🎉');
    const timer = setTimeout(() => {
      if (win) setConfetti(true);
      setShowEndModal(true);
      setFreshWin(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [gameOver, endMsg, freshWin]);

  // Penalty calculations and hint unlock logic now use utility functions
  const rowVal = NUM_ROWS - guesses.length;
  const synPenalty = getSynPenalty(rowVal, synonymsUsed);
  const defPenalty = getDefPenalty(rowVal, definitionUsed);

  // -----
  // DEV HELPERS via HOOK:
  const devHelpers = useDevHelpers({
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
  });
  // -----

  const handleSynonymsPress = async () => {
    setShowSynModal(true);
    if (!synonymsUsed && gameMode !== "freeplay" && gameMode !== "wordofday") {
      setPenalties(p => p + synPenalty)
      setSynonymsUsed(true)
    }
    setSynonymsList(getLocalSynonyms(target, bank));
  };

  const handleDefinitionPress = async () => {
    setShowDefModal(true);
    if (!definitionUsed && gameMode !== "freeplay" && gameMode !== "wordofday") {
      setPenalties(p => p + defPenalty)
      setDefinitionUsed(true)
    }
    setDefinitionText(getLocalDefinition(target, bank));
  };


  const handleKeyPress = async key => {
    if ((gameMode === "timed" && (gameOver || timeLeft <= 0))) return;
    if (gameMode === "wordofday" && wotdCompleted) return;
    if (gameOver) return;
    if (key === 'DEL') {
      setCurrent(c => c.slice(0, -1))
      return
    }
    if (key === 'TRY') {
      if (validating) return
      if (current.length !== target.length) {
        setShake(t => t + 1)
        return
      }
      setValidating(true)
      const ok = await validateWord(
        current,
        normalizedSet,
        currentLanguage,
        simulateNetworkError,
        () => setNetworkErrorDetected(true)
      );
      if (!ok) {
        setShake(t => t + 1)
        setValidating(false)
        return
      }
      const gNorm = stripAccents(current).toUpperCase()
      const tNorm = stripAccents(target).toUpperCase()
      const sts   = evaluateGuess(gNorm, tNorm)
      const entry = { letters: current.split(''), statuses: sts }
      const newG  = [...guesses, entry]
      setGuesses(newG)
      setStatuses(s => mergeLetterStatuses(s, entry))
      setCurrent('')
      let isWin = sts.every(s => s === STATUS.CORRECT);

      // --- TIMED MODE WIN/LOSS HANDLING ---
      if (gameMode === "timed") {
        if (isWin) {
          setTimeout(() => {
            setTotalPoints(tp => {
              const pts = tp + 1;
              AsyncStorage.setItem(POINTS_KEY, String(pts));
              return pts;
            });
            setWordCount(wc => wc + 1);
            if (bank.length) setTarget(bank[Math.floor(Math.random() * bank.length)].word.toUpperCase());
            setGuesses([]); setCurrent(''); setStatuses({});
            setLastScore(null); setReveal(false);
            setPenalties(0); setSynonymsUsed(false); setDefinitionUsed(false);
            setConfetti(false); setNetworkErrorDetected(false);
            setFreshWin(false);
            setValidating(false);
          }, 1200);
          return;
        } else if (newG.length === NUM_ROWS) {
          setTimeout(() => {
            setEndMsg(`😞 You lose\nWords found: ${totalPoints}`);
            setGameOver(true);
            setShowEndModal(true);
            setTotalPoints(0);
            AsyncStorage.setItem(POINTS_KEY, "0");
          }, 1200);
          return;
        }
      }

      // --- Other modes: normal win/lose and popup ---
      if (isWin) {
        setLastScore(null)
        setEndMsg('🎉 You win!')
        setGameOver(true)
        setFreshWin(true)
      } else if (newG.length === NUM_ROWS) {
        setLastScore(null)
        setEndMsg('😞 You lose')
        setGameOver(true)
        setFreshWin(true)
      }
      if (gameMode === "wordofday" && (isWin || newG.length === NUM_ROWS)) {
        const todayKey = getTodayKey(currentLanguage);
        const toStore = {
          target,
          guesses: newG,
          statuses: mergeLetterStatuses(statuses, entry),
          win: isWin,
        };
        await AsyncStorage.setItem(todayKey, JSON.stringify(toStore));
        setWotdCompleted(true);
        setShowEndModal(false);
      }
      setValidating(false)
      return
    }
    if (/^[A-Z]$/.test(key) && current.length < target.length) {
      setCurrent(c => c + key)
    }
  }

  const handleRestart = () => {
    setWordCount(1);
    setTotalPoints(0); // Points reset only on full restart!
    AsyncStorage.setItem(POINTS_KEY, '0');
    setGameOver(false);
    setShowEndModal(false);
    if (bank.length) setTarget(bank[Math.floor(Math.random() * bank.length)].word.toUpperCase());
    setGuesses([]); setCurrent(''); setStatuses({})
    setLastScore(null); setReveal(false)
    setPenalties(0); setSynonymsUsed(false); setDefinitionUsed(false)
    setConfetti(false)
    setNetworkErrorDetected(false);
    setFreshWin(false);
  }

  const modeLabel = (
    gameMode === "freeplay" ? "Freeplay" :
    gameMode === "timed" ? "Timed" :
    gameMode === "wordofday" ? "Word of the Day" :
    gameMode === "endless" ? "Endless" : ""
  );

  if (gameMode === "wordofday" && !wotdLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#fff', alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: isDark ? "#fff" : "#222", fontSize: 22, marginTop: 120 }}>Loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#fff' }]}>
      <GameHeader
        onGoHome={onGoHome}
        modeLabel={modeLabel}
        theme={theme}
        setTheme={setTheme}
        onDevResetPoints={devHelpers.devResetPointsWrapped}
        onDevRevealAnswer={devHelpers.devRevealAnswer}
        onDevAutofillBoard={devHelpers.devAutofillBoard}
        onDevForceLose={devHelpers.devForceLose}
        onDevRestart={devHelpers.devRestart}
        onAutoWin6={devHelpers.devAutoWin6}
        onSimulateNetworkError={devHelpers.devSimulateNetworkError}
        onDevResetWOTD={devHelpers.devResetWOTD}
        showDevPanel={showDevPanel}
        setShowDevPanel={setShowDevPanel}
      />

      {gameMode === "timed" && (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{
            fontWeight: 'bold',
            color: timeLeft <= 10 ? 'red' : isDark ? '#fff' : '#222',
            fontSize: 22,
            letterSpacing: 2
          }}>
            {timeLeft}s  
          </Text>
        </View>
      )}

      {gameMode === "timed" && (
        <View style={styles.pointsFloatBox}>
          <Text style={styles.pointsFloatText}>
            {totalPoints} words
          </Text>
        </View>
      )}

      <View style={{ flex: 1, width: '100%' }}>
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Board
                guesses={guesses}
                currentGuess={current}
                shakeTrigger={shake}
                wordLength={target.length}
                tileSize={tileSize}
                isDarkMode={isDark}
              />
            </View>
            <View style={styles.buttonRow}>
              {/* Synonyms */}
              <TouchableOpacity
                style={[
                  styles.hintBtn,
                  (
                    (gameMode === "freeplay" && guesses.length < 4) ||
                    (gameMode === "wordofday" && guesses.length < 4) ||
                    (gameMode === "timed" && timeLeft > synonymsUnlockAt)
                  ) ? styles.hintBtnDisabled : undefined
                ]}
                onPress={handleSynonymsPress}
                disabled={
                  (gameMode === "freeplay" && guesses.length < 4) ||
                  (gameMode === "wordofday" && guesses.length < 4) ||
                  (gameMode === "timed" && timeLeft > synonymsUnlockAt)
                }
                activeOpacity={
                  ((gameMode === "freeplay" && guesses.length < 4) ||
                  (gameMode === "wordofday" && guesses.length < 4) ||
                  (gameMode === "timed" && timeLeft > synonymsUnlockAt)) ? 1 : 0.7
                }
              >
                <Text
                  style={[
                    styles.hintText,
                    (
                      (gameMode === "freeplay" && guesses.length < 4) ||
                      (gameMode === "wordofday" && guesses.length < 4) ||
                      (gameMode === "timed" && timeLeft > synonymsUnlockAt)
                    ) ? styles.hintTextDisabled : undefined
                  ]}
                >
                  Synonyms
                </Text>
                {gameMode === "timed" && timeLeft > synonymsUnlockAt && (
                  <Text style={styles.unlocksText}>
                    unlocks in {Math.max(0, Math.ceil(timeLeft - synonymsUnlockAt))}s
                  </Text>
                )}
                {((gameMode === "freeplay" || gameMode === "wordofday") && guesses.length < 4) && (
                  <Text style={styles.unlocksText}>
                    unlocks in {4 - guesses.length} {4 - guesses.length === 1 ? "try" : "tries"}
                  </Text>
                )}
              </TouchableOpacity>
              {/* Definition */}
              <TouchableOpacity
                style={[
                  styles.hintBtn,
                  (
                    (gameMode === "freeplay" && guesses.length < 5) ||
                    (gameMode === "wordofday" && guesses.length < 5) ||
                    (gameMode === "timed" && timeLeft > definitionUnlockAt)
                  ) ? styles.hintBtnDisabled : undefined
                ]}
                onPress={handleDefinitionPress}
                disabled={
                  (gameMode === "freeplay" && guesses.length < 5) ||
                  (gameMode === "wordofday" && guesses.length < 5) ||
                  (gameMode === "timed" && timeLeft > definitionUnlockAt)
                }
                activeOpacity={
                  ((gameMode === "freeplay" && guesses.length < 5) ||
                  (gameMode === "wordofday" && guesses.length < 5) ||
                  (gameMode === "timed" && timeLeft > definitionUnlockAt)) ? 1 : 0.7
                }
              >
                <Text
                  style={[
                    styles.hintText,
                    (
                      (gameMode === "freeplay" && guesses.length < 5) ||
                      (gameMode === "wordofday" && guesses.length < 5) ||
                      (gameMode === "timed" && timeLeft > definitionUnlockAt)
                    ) ? styles.hintTextDisabled : undefined
                  ]}
                >
                  Definition
                </Text>
                {gameMode === "timed" && timeLeft > definitionUnlockAt && (
                  <Text style={styles.unlocksText}>
                    unlocks in {Math.max(0, Math.ceil(timeLeft - definitionUnlockAt))}s
                  </Text>
                )}
                {((gameMode === "freeplay" || gameMode === "wordofday") && guesses.length < 5) && (
                  <Text style={styles.unlocksText}>
                    unlocks in {5 - guesses.length} {5 - guesses.length === 1 ? "try" : "tries"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.keyboardContainer}>
          <Keyboard
            onKeyPress={handleKeyPress}
            letterStatuses={statuses}
            wordLength={target.length}
            boardWidth={containerWidth}
          />
        </View>
      </View>
      <EndgameModal
        visible={showEndModal}
        isDark={isDark}
        endMsg={endMsg}
        gameMode={gameMode}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        onRequestClose={() => setShowEndModal(false)}
      />
      <HintModal
        visible={showSynModal}
        isDark={isDark}
        title="Synonyms"
        contentList={synonymsList}
        onClose={() => setShowSynModal(false)}
      />
      <HintModal
        visible={showDefModal}
        isDark={isDark}
        title="Definition"
        contentList={[definitionText]}
        onClose={() => setShowDefModal(false)}
      />

      {confetti && <ConfettiCannon count={150} origin={{ x: width/2, y: 0 }} fadeOut />}
      {(simulateNetworkError || networkErrorDetected) && (
        <Animated.View style={[styles.floatingNetworkError, { opacity: 1 }]}>
          <Text style={styles.networkErrorText}>
            Network Error : Online Dictionary inaccessible!
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:    { flex:1 },
  pointsFloatBox: {
    alignSelf: 'center',
    marginBottom: 4,
    marginTop: 2,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(76,130,200,0.93)',
    borderWidth: 1.2,
    borderColor: '#fff',
  },
  pointsFloatText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.1,
    color: '#fff'
  },
  buttonRow:    { flexDirection:'row', justifyContent:'space-evenly', width:'100%', marginTop:8, marginBottom:10 },
  hintBtn: {
    width: 138,
    minHeight: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    marginHorizontal: 8,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1.2,
    borderColor: '#4a90e2',
    paddingVertical: 2,
  },
  hintBtnDisabled: {
    backgroundColor: '#ededed',
    borderColor: '#bbb',
    opacity: 0.95,
  },
  hintText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  hintTextDisabled: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 14,
  },
  unlocksText: {
    fontSize: 10,
    color: '#888',
    marginTop: 1,
    textAlign: 'center',
    fontWeight: '400',
  },
  floatingNetworkError: {
    position: 'absolute',
    top: 54,
    alignSelf: 'center',
    backgroundColor: '#ffe2e2',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ff9494',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 8,
    zIndex: 9999,
  },
  networkErrorText: {
    color: '#c22',
    fontWeight: 'bold',
    fontSize: 13.5,
    textAlign: 'center',
    marginRight: 12,
  },
  dismissText: {
    fontSize: 18,
    color: '#a22',
    fontWeight: 'bold',
    padding: 2,
  },
  keyboardContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    marginBottom: '5%',
  },
});
