// src/components/MainMenu.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'cz', label: 'Čeština' },
];

export default function MainMenu({ onSelectLanguage }) {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <Text style={styles.title}>Choose a Language</Text>
      {LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={styles.button}
          onPress={() => onSelectLanguage(lang.code)}
        >
          <Text style={styles.buttonText}>{lang.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    width: '80%',
    paddingVertical: 16,
    marginVertical: 8,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
