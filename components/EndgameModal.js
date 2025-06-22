// components/EndgameModal.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AnimatedModal from './AnimatedModal';

export default function EndgameModal({
  visible,
  isDark,
  endMsg,
  gameMode,
  onRestart,
  onGoHome,
  onRequestClose,
}) {
  return (
    <AnimatedModal visible={visible} onRequestClose={onRequestClose} isDark={isDark}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#111' }]}>{endMsg}</Text>
      {gameMode === "freeplay" || gameMode === "wordofday" || gameMode === "timed" ? (
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
      ) : (
        <TouchableOpacity style={styles.closeBtn} onPress={onRestart}>
          <Text style={styles.closeTxt}>Restart</Text>
        </TouchableOpacity>
      )}
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  title:     { fontSize:18, fontWeight:'bold', marginBottom:12, textAlign:'center' },
  closeBtn:  { alignSelf:'center', backgroundColor:'#4a90e2', paddingVertical:8, paddingHorizontal:24, borderRadius:6, marginTop:8 },
  closeTxt:  { color:'#fff', fontWeight:'bold', fontSize:16 },
});
