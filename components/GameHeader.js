import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import DevPanel from './DevPanel';

export default function GameHeader({
  onGoHome,
  modeLabel,
  theme,
  setTheme,
  onDevResetPoints,
  onDevRevealAnswer,
  onDevAutofillBoard,
  onDevForceLose,
  onDevRestart,
  onAutoWin6,
  onSimulateNetworkError,
  onDevResetWOTD, // <-- Add here
}) {
  const systemColorScheme = useColorScheme();
  const isDark = (theme === 'system' ? systemColorScheme : theme) === 'dark';

  return (
    <View style={[styles.headerBar, { backgroundColor: isDark ? '#000' : '#f7faff' }]}>
      {/* Home */}
      <TouchableOpacity style={styles.headerBtn} onPress={onGoHome}>
        <Text style={styles.headerIcon}>🏠</Text>
      </TouchableOpacity>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Mode pill */}
      <View style={styles.modePill}>
        <Text style={styles.modePillText}>{modeLabel}</Text>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* DevPanel button */}
      {__DEV__ && (
        <DevPanel
          onDevResetPoints={onDevResetPoints}
          onDevRevealAnswer={onDevRevealAnswer}
          onDevAutofillBoard={onDevAutofillBoard}
          onDevForceLose={onDevForceLose}
          onDevRestart={onDevRestart}
          onAutoWin6={onAutoWin6}
          onSimulateNetworkError={onSimulateNetworkError}
          onDevResetWOTD={onDevResetWOTD} // <-- Pass here!
          inline
        />
      )}

      {/* Theme toggle */}
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
    paddingHorizontal: 10,
    height: 54,
    marginTop: 0,
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
    color: '#fff',
  },
});
