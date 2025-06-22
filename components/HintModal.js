// components/HintModal.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AnimatedModal from './AnimatedModal';

export default function HintModal({ visible, isDark, title, contentList, onClose }) {
  return (
    <AnimatedModal visible={visible} onRequestClose={onClose} isDark={isDark}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#111' }]}>{title}</Text>
      <View style={styles.content}>
        {(!contentList || contentList.length === 0)
          ? <Text style={[styles.text, { color: isDark ? '#eee' : '#111' }]}>No {title.toLowerCase()} found.</Text>
          : contentList.map((s, i) => (
              <Text key={i} style={[styles.text, { color: isDark ? '#eee' : '#111' }]}>• {s}</Text>
            ))
        }
      </View>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeTxt}>Close</Text>
      </TouchableOpacity>
    </AnimatedModal>
  );
}

const styles = StyleSheet.create({
  title:     { fontSize:18, fontWeight:'bold', marginBottom:12, textAlign:'center' },
  content:   { marginBottom:12 },
  text:      { fontSize:16, marginBottom:8 },
  closeBtn:  { alignSelf:'center', backgroundColor:'#4a90e2', paddingVertical:8, paddingHorizontal:24, borderRadius:6, marginTop:8 },
  closeTxt:  { color:'#fff', fontWeight:'bold', fontSize:16 },
});
