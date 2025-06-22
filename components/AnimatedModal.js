// components/AnimatedModal.js

import React, { useRef, useEffect } from 'react';
import { Modal, View, Animated, StyleSheet } from 'react-native';

export default function AnimatedModal({ visible, children, onRequestClose, isDark }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const anims = visible
      ? [
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.spring(scale,   { toValue: 1, friction: 5, useNativeDriver: true }),
        ]
      : [
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 0.8, duration: 200, useNativeDriver: true }),
        ];
    Animated.parallel(anims).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} onRequestClose={onRequestClose} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[
          styles.container,
          {
            backgroundColor: isDark ? '#222' : '#fff',
            borderColor: isDark ? '#444' : '#ccc',
            borderWidth: 1,
            transform: [{ scale },],
            opacity,
          }
        ]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:   { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
  container: { width:'80%', borderRadius:10, padding:16 },
});
