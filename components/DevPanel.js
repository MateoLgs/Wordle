import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function DevPanel({
  onDevResetPoints,
  onDevRevealAnswer,
  onDevAutofillBoard,
  onDevForceLose,
  onDevRestart,
  onAutoWin6,
  onSimulateNetworkError,
  onDevResetWOTD, // <-- Add this prop!
  inline,
}) {
  const [visible, setVisible] = useState(false);

  // Helper to wrap any action to also close the panel
  const handleDevAction = (fn) => () => {
    fn && fn();
    setVisible(false);
  };

  return (
    <View style={styles.inlineContainer}>
      <TouchableOpacity
        style={styles.headerBtn}
        onPress={() => setVisible(v => !v)}
        accessibilityLabel="Open Dev Tools"
      >
        <Text style={styles.headerIcon}>⚙️</Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>DEV PANEL</Text>
          <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onDevResetPoints)}>
            <Text style={styles.devText}>Reset Points</Text>
          </TouchableOpacity>
          {onDevResetWOTD && (
            <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onDevResetWOTD)}>
              <Text style={styles.devText}>Reset Word of the Day</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onDevRevealAnswer)}>
            <Text style={styles.devText}>Reveal Answer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onDevAutofillBoard)}>
            <Text style={styles.devText}>Autofill Board (5 rows)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onAutoWin6)}>
            <Text style={styles.devText}>Auto Win in 6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onDevForceLose)}>
            <Text style={styles.devText}>Force Lose</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onDevRestart)}>
            <Text style={styles.devText}>Restart Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.devButton} onPress={handleDevAction(onSimulateNetworkError)}>
            <Text style={styles.devText}>Simulate Network Error</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inlineContainer: {
    marginHorizontal: 4,
    position: 'relative',
  },
  headerBtn: {
    padding: 6,
    borderRadius: 8,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9eef5',
  },
  headerIcon: { fontSize: 22 },
  panel: {
    position: 'absolute',
    top: 48, // just below the header bar (adjust if needed)
    right: 0,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    elevation: 7,
    minWidth: 180,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1000,
  },
  panelTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 6,
    color: '#6aa5d7',
    textAlign: 'center',
  },
  devButton: {
    marginVertical: 4,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f3f6fa',
    alignItems: 'center',
  },
  devText: {
    fontSize: 14,
    color: '#3577f2',
    fontWeight: '500',
  },
});
