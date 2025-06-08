import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { STATUS, NUM_ROWS } from '../utils/constants';

function AnimatedCell({ letter, status, delay, cellSize, marginHorizontal, isDarkMode }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const tileTextColor = isDarkMode ? '#fff' : '#000';

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotateFront = flipAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: ['0deg', '90deg'],
  });

  const rotateBack = flipAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: ['270deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
  });

  const backColor =
    status == null
      ? (isDarkMode ? '#181A20' : '#fff')
      : ({
          [STATUS.CORRECT]: '#6aaa64',
          [STATUS.PRESENT]: '#c9b458',
          [STATUS.ABSENT]: '#787c7e',
        }[status] || '#999');

  const frontBG = isDarkMode ? '#181A20' : '#ffffff';

  return (
    <View style={[styles.cellContainer, { width: cellSize, height: cellSize, marginHorizontal }]}>
      {/* Front (before flip): */}
      <Animated.View
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor: frontBG,
            borderColor: '#999',
            transform: [{ rotateY: rotateFront }],
            opacity: frontOpacity,
          },
        ]}
      >
        <Text style={[styles.letter, { color: tileTextColor, fontSize: cellSize * 0.6 }]}>
          {letter}
        </Text>
      </Animated.View>

      {/* Back (after flip): */}
      <Animated.View
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor: backColor,
            borderColor: backColor,
            position: 'absolute',
            transform: [{ rotateY: rotateBack }],
            opacity: backOpacity,
          },
        ]}
      >
        <Text style={[styles.letter, { color: tileTextColor, fontSize: cellSize * 0.6 }]}>
          {letter}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function Board({ guesses, currentGuess, shakeTrigger, wordLength, isDarkMode }) {
  const tileTextColor = isDarkMode ? '#fff' : '#000';

  const screenWidth = Dimensions.get('window').width;
  const horizontalMargin = 3;
  const maxBoardPadding = 20;
  const maxCellSize = 60;
  const availableWidth = screenWidth - maxBoardPadding * 2;
  const cellSize = Math.min(maxCellSize, Math.floor(availableWidth / wordLength));

  const flashAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const scaleAnimsRef = useRef([]);
  if (scaleAnimsRef.current.length !== wordLength) {
    scaleAnimsRef.current = Array(wordLength)
      .fill(null)
      .map((_, i) => scaleAnimsRef.current[i] || new Animated.Value(1));
  }
  const scaleAnims = scaleAnimsRef.current;

  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (currentGuess.length > prevLengthRef.current) {
      const newIndex = currentGuess.length - 1;
      if (scaleAnims[newIndex]) {
        scaleAnims[newIndex].setValue(1.2);
        Animated.sequence([
          Animated.delay(20),
          Animated.spring(scaleAnims[newIndex], {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnims[newIndex], {
            toValue: 1,
            duration: 20,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
    prevLengthRef.current = currentGuess.length;
  }, [currentGuess, scaleAnims]);

  useEffect(() => {
    if (currentGuess.length === 0) {
      scaleAnims.forEach((anim) => anim.setValue(1));
    }
  }, [currentGuess, guesses, scaleAnims]);

  useEffect(() => {
    if (shakeTrigger > 0) {
      flashAnim.setValue(0);
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.delay(150),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();

      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -2, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [shakeTrigger, flashAnim, shakeAnim]);

  const rowStyle = {
    backgroundColor: flashAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', 'rgba(255, 0, 0, 0.15)'],
    }),
  };

  return (
    <View style={styles.board}>
      {[...Array(NUM_ROWS)].map((_, rowIndex) => {
        const rowGuess = guesses[rowIndex];
        const isCurrent = rowIndex === guesses.length;

        const letters = isCurrent
          ? currentGuess.padEnd(wordLength).split('')
          : rowGuess
          ? rowGuess.letters
          : Array(wordLength).fill('');

        const statuses = rowGuess ? rowGuess.statuses : Array(wordLength).fill(null);

        const isLatestRevealedRow = rowGuess && (rowIndex === guesses.length - 1);

        const rowContent = (
          <Animated.View
            style={[
              styles.row,
              isCurrent && { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            {letters.map((letter, colIndex) => {
              if (isCurrent) {
                const isTypedLetter = letter.trim() !== '';

                const cellStyle = [
                  styles.cell,
                  isTypedLetter && styles.typedCell,
                  { transform: [{ scale: scaleAnims[colIndex] }] },
                ];

                return (
                  <Animated.View
                    key={colIndex}
                    style={[cellStyle, { width: cellSize, height: cellSize, marginHorizontal: horizontalMargin }]}
                  >
                    <Text
                      style={[
                        styles.letter,
                        { color: tileTextColor, fontSize: cellSize * 0.6 },
                      ]}
                    >
                      {letter}
                    </Text>
                  </Animated.View>
                );
              }

              return rowGuess ? (
                <AnimatedCell
                  key={colIndex}
                  letter={letter}
                  status={statuses[colIndex]}
                  delay={isLatestRevealedRow ? colIndex * 160 : 0}
                  cellSize={cellSize}
                  marginHorizontal={horizontalMargin}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <View
                  key={colIndex}
                  style={[styles.cell, { width: cellSize, height: cellSize, marginHorizontal: horizontalMargin }]}
                >
                  <Text style={[styles.letter, { color: tileTextColor, fontSize: cellSize * 0.6 }]}>
                    {letter}
                  </Text>
                </View>
              );
            })}
          </Animated.View>
        );

        return isCurrent ? (
          <Animated.View key={rowIndex} style={[rowStyle]}>
            {rowContent}
          </Animated.View>
        ) : (
          <View key={rowIndex}>{rowContent}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  cellContainer: {
    perspective: 1000,
  },
  cell: {
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  typedCell: {
    borderColor: '#555',
  },
  letter: {
    fontWeight: 'bold',
  },
});
