// components/EndgameModal.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AnimatedModal from './AnimatedModal';

export default function EndgameModal({
  visible,
  isDark,
  endMsg,
  gameMode,
  words,
  word,
  streakScore,
  bestScore,
  achievedScore,
  onRestart,
  onGoHome,
  onRequestClose,
}) {
  // Detect loss in timed/streak
  const isLoss =
    (gameMode === "timed" || gameMode === "streak") &&
    endMsg.toLowerCase().includes('lose');

  // Score label for this mode
  let mainScoreLabel = null;
  if (gameMode === "streak") {
    mainScoreLabel = (
      <>
        <Text style={[styles.streak, { color: isDark ? '#fff' : '#111' }]}>
          Points scored: {achievedScore}
        </Text>
        <Text style={[styles.streak, { color: '#ffaa44', fontWeight:'bold' }]}>
          Best ever: {bestScore}
        </Text>
      </>
    );
  } else if (gameMode === "timed") {
    mainScoreLabel = (
      <>
        <Text style={[styles.streak, { color: isDark ? '#fff' : '#111' }]}>
          Words found: {achievedScore}
        </Text>
        <Text style={[styles.streak, { color: '#ffaa44', fontWeight:'bold' }]}>
          Best ever: {bestScore}
        </Text>
      </>
    );
  } else {
    mainScoreLabel = (
      <Text style={[styles.streak, { color: isDark ? '#fff' : '#111' }]}>
        Words: {words}
      </Text>
    );
  }

  return (
    <AnimatedModal visible={visible} onRequestClose={onRequestClose} isDark={isDark}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#111' }]}>{endMsg}</Text>
      {mainScoreLabel}
      {isLoss && !!word && (
        <Text style={[styles.word, { color: isDark ? '#fff' : '#111' }]}>
          The word was: <Text style={{ fontWeight: 'bold' }}>{word}</Text>
        </Text>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <TouchableOpacity style={[styles.closeBtn, { marginRight: 10 }]} onPress={onRestart}>
          <Text style={styles.closeTxt}>
            {gameMode === "timed" ? "Restart" : "Next"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={onGoHome}>
          <Text style={styles.closeTxt}>Menu</Text>
        </TouchableOpacity>
      </View>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  title:     { fontSize:18, fontWeight:'bold', marginBottom:8, textAlign:'center' },
  streak:    { fontSize:16, fontWeight:'500', marginBottom:2, textAlign:'center' },
  word:      { fontSize:16, fontWeight:'400', marginBottom:2, textAlign:'center' },
  closeBtn:  { alignSelf:'center', backgroundColor:'#4a90e2', paddingVertical:8, paddingHorizontal:24, borderRadius:6, marginTop:8 },
  closeTxt:  { color:'#fff', fontWeight:'bold', fontSize:16 },
});
