import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import BackgroundContainer from '@/components/BackgroundContainer';

export default function VideoScreen() {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [inputUrl, setInputUrl] = useState<string>('');

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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <ThemedText style={styles.title}>Video Favorito</ThemedText>
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
                </View>
            </ScrollView>
        </BackgroundContainer>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 40,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
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