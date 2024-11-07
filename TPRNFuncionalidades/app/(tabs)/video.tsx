import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import BackgroundContainer from '@/components/BackgroundContainer';
import { showError, showSuccess, showWarning } from '@/utils/notifications';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export default function VideoScreen() {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [inputUrl, setInputUrl] = useState<string>('');
    const handleError = useErrorHandler();

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
            showError('No se pudo cargar la URL del video guardada', 'Error de carga');
        }
    };

    const validateUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!inputUrl) {
            showWarning('Por favor ingresa una URL', 'Campo requerido');
            return;
        }

        if (!validateUrl(inputUrl)) {
            showWarning('Por favor ingresa una URL válida', 'URL inválida');
            return;
        }

        try {
            await AsyncStorage.setItem('favoriteVideoUrl', inputUrl);
            setVideoUrl(inputUrl);
            showSuccess('URL guardada correctamente');
        } catch (error) {
            handleError(error, 'Error al guardar la URL del video');
        }
    };

    const testError = () => {
        showError('Este es un error de prueba', 'Error de Test');
    };

    return (
        <BackgroundContainer>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <ThemedText style={styles.title}>Video Favorito</ThemedText>
                    <Button 
                        title="Probar Error" 
                        onPress={testError}
                        color="#ff4444"
                    />
                    <View style={{ height: 10 }} />
                    <TextInput
                        style={styles.input}
                        value={inputUrl}
                        onChangeText={setInputUrl}
                        placeholder="Ingresa la URL del video"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Button title="Guardar URL" onPress={handleSubmit} />
                    
                    <View style={styles.videoContainer}>
                        {videoUrl ? (
                            <Video
                                source={{ uri: videoUrl }}
                                style={styles.video}
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                                shouldPlay={false}
                                isLooping
                                isMuted={false}
                                onError={(error) => {
                                    showError('Error al cargar el video', 'Error de reproducción');
                                }}
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
        marginBottom: 10,
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
        marginTop: 20,
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