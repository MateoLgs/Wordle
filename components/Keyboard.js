import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  useColorScheme,
  Dimensions
} from 'react-native';
import { STATUS } from '../utils/constants';

const KEYS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['DEL', 'W', 'X', 'C', 'V', 'B', 'N', 'TRY'],
];

export default function Keyboard({ onKeyPress, letterStatuses = {}, boardWidth }) {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeKey, setActiveKey] = useState(null);

  // Use prop or screen width (default to 95% width)
  const deviceWidth = Dimensions.get('window').width;
  const usableWidth = boardWidth || deviceWidth * 0.95;
  const keyMargin = 3;
  const mainRowLen = Math.max(...KEYS.map(row => row.length));
  const keyWidth = (usableWidth - (mainRowLen + 1) * keyMargin * 2) / mainRowLen;

  return (
    <View style={[styles.container, { width: usableWidth, alignSelf: 'center' }]}>
      {KEYS.map((row, rIdx) => (
        <View key={rIdx} style={[styles.row, { width: usableWidth }]}>
          {row.map((key) => {
            let keyStatus = STATUS.UNKNOWN;
            const upper = key.toUpperCase();
            if (letterStatuses[upper]) {
              keyStatus = letterStatuses[upper];
            }

            const backgroundColor = {
              [STATUS.UNKNOWN]: '#d3d6da',
              [STATUS.ABSENT]: '#787c7e',
              [STATUS.PRESENT]: '#c9b458',
              [STATUS.CORRECT]: '#6aaa64',
            }[keyStatus];

            const isWide = key === 'TRY' || key === 'DEL';
            const scaleAnim = useRef(new Animated.Value(1)).current;

            const handlePressIn = () => {
              setActiveKey(key);
              Animated.spring(scaleAnim, {
                toValue: 1.2,
                speed: 20,
                bounciness: 10,
                useNativeDriver: true,
              }).start();
            };

            const handlePressOut = () => {
              Animated.spring(scaleAnim, {
                toValue: 1,
                speed: 20,
                bounciness: 10,
                useNativeDriver: true,
              }).start(() => {
                setActiveKey(null);
              });
            };

            const handlePress = () => {
              onKeyPress(key);
            };

            const textColor =
              keyStatus === STATUS.UNKNOWN && isDarkMode ? '#fff' : '#000';

            return (
              <TouchableWithoutFeedback
                key={key}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
              >
                <Animated.View
                  style={[
                    styles.key,
                    {
                      backgroundColor,
                      transform: [{ scale: scaleAnim }],
                      width: isWide ? keyWidth * 1.3 : keyWidth,
                      minWidth: isWide ? 54 : 32,
                      marginHorizontal: keyMargin,
                    },
                    isWide && styles.keyWide,
                    activeKey === key && { zIndex: 10 },
                  ]}
                >
                  <Text style={[styles.keyText, { color: textColor }]}>
                    {key}
                  </Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  key: {
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d6da',
  },
  keyWide: {},
  keyText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
