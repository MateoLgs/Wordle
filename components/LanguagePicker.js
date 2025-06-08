// components/LanguagePicker.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'cz', label: 'Čeština' },
];

export default function LanguagePicker({ selectedLanguage, onChangeLanguage }) {
  return (
    <View style={styles.row}>
      {LANGUAGES.map((lang) => {
        const isSelected = lang.code === selectedLanguage;
        return (
          <TouchableOpacity
            key={lang.code}
            onPress={() => onChangeLanguage(lang.code)}
            style={[styles.button, isSelected && styles.selectedButton]}
          >
            <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
              {lang.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    width: '100%',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  selectedButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#444',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});
