import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { BackgroundContext } from '@/hooks/BackgroundContext';
import { ThemedText } from '@/components/ThemedText';
import ImagePickerComponent from '@/components/ImagePickerComponent';
import BackgroundContainer from '@/components/BackgroundContainer';

export default function HomeScreen() {
  const { backgroundImage } = useContext(BackgroundContext);

  return (
    <BackgroundContainer>
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            Cambio de Imagen de Fondo
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Selecciona una imagen de la galería o toma una foto para cambiar el fondo
          </ThemedText>
          <ImagePickerComponent />
        </View>
      </View>
    </BackgroundContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  }
});
