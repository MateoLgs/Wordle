import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { STATUS } from '../utils/constants';

export default function Tile({ letter = '', status = STATUS.UNKNOWN }) {
  const isDarkMode = useColorScheme() === 'dark';

  const bgColor = {
    [STATUS.UNKNOWN]: 'transparent',
    [STATUS.CORRECT]: '#6aaa64',
    [STATUS.PRESENT]: '#c9b458',
    [STATUS.ABSENT]: '#787c7e',
  }[status];

  const borderColor = status === STATUS.UNKNOWN ? (isDarkMode ? '#555' : '#d3d6da') : bgColor;

  // For unknown tiles, text color depends on theme
  const textColor =
    status === STATUS.UNKNOWN ? (isDarkMode ? '#fff' : '#000') : '#fff';

  return (
    <View style={[styles.tile, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.letter, { color: textColor }]}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 50,
    height: 50,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 4,
  },
  letter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
