import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const GAME_MODES = [
  { key: 'freeplay', label: 'Freeplay', description: 'Unlimited classic games.', emoji: '🆓' },
  { key: 'timed', label: 'Timed', description: '2 minutes, not one more.', emoji: '⏱️' },
  { key: 'wordofday', label: 'Word of the Day', description: 'One word, once per day.', emoji: '📅' },
  { key: 'streak', label: 'Until You Lose', description: 'Streak: play until you fail!', emoji: '🔥' },
];

const LANGUAGES = [
  { code: 'en', label: 'EN', emoji: '🇬🇧' },
  { code: 'fr', label: 'FR', emoji: '🇫🇷' },
  { code: 'es', label: 'ES', emoji: '🇪🇸' },
  { code: 'cz', label: 'CZ', emoji: '🇨🇿' },
];

export default function GameModeMenu({ onStart }) {
  const [modeIndex, setModeIndex] = useState(0);
  const [langIndex, setLangIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const mode = GAME_MODES[modeIndex];
  const { code: language, label: langLabel, emoji: langFlag } = LANGUAGES[langIndex];

  // Arrow handlers
  const prevMode = () => setModeIndex((modeIndex - 1 + GAME_MODES.length) % GAME_MODES.length);
  const nextMode = () => setModeIndex((modeIndex + 1) % GAME_MODES.length);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Game Mode</Text>
        <View style={styles.modePicker}>
          <TouchableOpacity style={styles.arrowBtn} onPress={prevMode}>
            <Text style={styles.arrow}>{'‹'}</Text>
          </TouchableOpacity>
          <View style={styles.modeDetails}>
            <Text style={styles.modeEmoji}>{mode.emoji}</Text>
            <Text style={styles.modeLabel}>{mode.label}</Text>
            <Text style={styles.modeDesc}>{mode.description}</Text>
          </View>
          <TouchableOpacity style={styles.arrowBtn} onPress={nextMode}>
            <Text style={styles.arrow}>{'›'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.languageBtn}
          onPress={() => setLangIndex((langIndex + 1) % LANGUAGES.length)}
        >
          <Text style={styles.languageEmoji}>{langFlag}</Text>
          <Text style={styles.languageLabel}>{langLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.startBtn, { marginBottom: insets.bottom + 8 }]}
          onPress={() => onStart({ mode: mode.key, language })}
        >
          <Text style={styles.startBtnText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 32 },

  modePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 34,
    width: width - 40,
    justifyContent: 'center',
  },
  arrowBtn: {
    width: 48, height: 68, alignItems: 'center', justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#232338',
    marginHorizontal: 6,
    shadowColor: '#000', shadowOpacity: 0.13, shadowRadius: 3, elevation: 2,
  },
  arrow: { fontSize: 34, color: '#53b4ff', fontWeight: 'bold', marginTop: -2 },
  modeDetails: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    flex: 1,
  },
  modeEmoji: { fontSize: 38, marginBottom: 2 },
  modeLabel: { fontSize: 25, color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  modeDesc: { fontSize: 16, color: '#bbb', marginBottom: 0, textAlign: 'center', maxWidth: 220 },

  languageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#53b4ff',
  },
  languageEmoji: { fontSize: 22, marginRight: 7 },
  languageLabel: { color: '#fff', fontSize: 18, fontWeight: '600' },
  startBtn: {
    backgroundColor: '#53b4ff',
    borderRadius: 18,
    paddingHorizontal: 44,
    paddingVertical: 14,
    marginTop: 10,
    shadowColor: '#53b4ff',
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 3,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});
