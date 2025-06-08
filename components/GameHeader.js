// components/GameHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

export default function GameHeader({
  onGoHome,
  onResetPoints,
  onReveal,
  reveal,
  target,
  showReset,
  showReveal,
  modeLabel,
  theme,
  setTheme
}) {
  const systemColorScheme = useColorScheme();
  const isDark = (theme === 'system' ? systemColorScheme : theme) === 'dark';

  return (
    <View style={[styles.headerBar, { backgroundColor: isDark ? '#000' : '#f7faff' }]}>
      <TouchableOpacity style={styles.headerBtn} onPress={onGoHome}>
        <Text style={styles.headerIcon}>🏠</Text>
      </TouchableOpacity>
      {showReset && (
        <TouchableOpacity style={styles.headerBtn} onPress={onResetPoints}>
          <Text style={styles.headerIcon}>🔄</Text>
        </TouchableOpacity>
      )}
      {showReveal && (
        <TouchableOpacity style={styles.headerBtn} onPress={onReveal}>
          <Text style={styles.headerText}>{reveal ? target : 'Answer'}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.modePill}>
        <Text style={styles.modePillText}>{modeLabel}</Text>
      </View>
      <TouchableOpacity
        style={styles.headerBtn}
        onPress={() =>
          setTheme(
            theme === 'system'
              ? (systemColorScheme === 'dark' ? 'light' : 'dark')
              : (theme === 'dark' ? 'light' : 'dark')
          )
        }
      >
        <Text style={styles.headerIcon}>{isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 54,
    marginTop: 30,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  headerBtn: {
    padding: 6,
    borderRadius: 8,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    backgroundColor: '#e9eef5',
  },
  headerIcon: { fontSize: 22 },
  headerText: { fontSize: 16, fontWeight: 'bold', color: '#3577f2' },
  modePill: {
    backgroundColor: '#53b4ff',
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 64,
    marginHorizontal: 4,
  },
  modePillText: {
    fontWeight: 'bold',
    fontSize: 13.5,
    letterSpacing: 1.1,
    color: '#fff'
  },
});
