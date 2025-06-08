// components/Row.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Tile from './Tile';
import { STATUS } from '../utils/constants';

export default function Row({ letters = ['', '', '', '', ''], statuses = [] }) {
  return (
    <View style={styles.row}>
      {letters.map((ltr, idx) => (
        <Tile
          key={idx}
          letter={ltr.toUpperCase()}
          status={statuses[idx] || STATUS.UNKNOWN}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 2, // small spacing between rows
  },
});
