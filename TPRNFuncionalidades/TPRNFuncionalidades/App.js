import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { BackgroundProvider } from '../hooks/BackgroundContext';
import ExploreScreen from '../app/(tabs)/explore';

export default function App() {
  return (
    <BackgroundProvider>
      <View style={styles.container}>
        <ExploreScreen />
        <StatusBar style="auto" />
      </View>
    </BackgroundProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});