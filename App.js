import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';

import GameModeMenu from './screens/GameModeMenu';
import MainGame from './screens/MainGame';

export default function App() {
  const [settings, setSettings] = useState(null); // { mode, language }
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('transparent');
  }, []);

  return (
    <SafeAreaProvider>
      {!settings ? (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <StatusBar hidden={true} />
          <GameModeMenu onStart={setSettings} />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <StatusBar hidden={true} />
          <MainGame
            currentLanguage={settings.language}
            gameMode={settings.mode}
            onGoHome={() => setSettings(null)}
            theme={theme}
            setTheme={setTheme}
          />
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // <-- transparent!
  },
});
