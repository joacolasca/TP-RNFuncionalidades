import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundContext } from '@/hooks/BackgroundContext';
import { ThemedText } from '@/components/ThemedText';
import ImagePickerComponent from '@/components/ImagePickerComponent';
import BackgroundContainer from '@/components/BackgroundContainer';
import { Collapsible } from '@/components/Collapsible';

export default function HomeScreen() {
  const { backgroundImage } = useContext(BackgroundContext);
  const [videoUrl, setVideoUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');

  useEffect(() => {
    loadVideoUrl();
  }, []);

  const loadVideoUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('favoriteVideoUrl');
      if (savedUrl) {
        setVideoUrl(savedUrl);
        setInputUrl(savedUrl);
      }
    } catch (error) {
      console.error('Error loading video URL:', error);
    }
  };

  const handleSubmit = async () => {
    if (inputUrl) {
      try {
        await AsyncStorage.setItem('favoriteVideoUrl', inputUrl);
        setVideoUrl(inputUrl);
      } catch (error) {
        console.error('Error saving video URL:', error);
      }
    }
  };

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

          <View style={styles.separator} />

          <Collapsible title="Video Favorito">
            <TextInput
              style={styles.input}
              value={inputUrl}
              onChangeText={setInputUrl}
              onSubmitEditing={handleSubmit}
              placeholder="Ingresa la URL del video"
              placeholderTextColor="#999"
            />
            <View style={styles.videoContainer}>
              {videoUrl ? (
                <Video
                  source={{ uri: videoUrl }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                  shouldPlay
                  isLooping
                />
              ) : (
                <ThemedText style={styles.placeholder}>
                  Ingresa una URL de video para reproducir
                </ThemedText>
              )}
            </View>
          </Collapsible>
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
  },
  separator: {
    height: 30,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#fff',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    color: '#fff',
    textAlign: 'center',
  }
});
