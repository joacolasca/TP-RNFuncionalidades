import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, ScrollView, Button, ActivityIndicator } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import BackgroundContainer from '@/components/BackgroundContainer';
import { showError, showSuccess, showWarning } from '@/utils/notifications';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import WebView from 'react-native-webview';
import { isYouTubeUrl, getYouTubeVideoId } from '@/utils/videoUtils';

export default function VideoScreen() {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [inputUrl, setInputUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
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
            // Validar si es una URL de YouTube
            if (isYouTubeUrl(url)) {
                return true;
            }
            
            // Validar si es una URL de video directa (mp4, etc)
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
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

    const renderVideo = () => {
        if (!videoUrl) {
            return (
                <ThemedText style={styles.placeholder}>
                    Ingresa una URL de video para reproducir
                </ThemedText>
            );
        }

        if (isYouTubeUrl(videoUrl)) {
            const videoId = getYouTubeVideoId(videoUrl);
            if (!videoId) {
                return (
                    <ThemedText style={styles.placeholder}>
                        URL de YouTube inválida
                    </ThemedText>
                );
            }
            return (
                <View style={styles.videoContainer}>
                    <WebView
                        style={styles.video}
                        source={{
                            html: `
                                <!DOCTYPE html>
                                <html>
                                    <head>
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <style>
                                            body { margin: 0; padding: 0; background-color: black; }
                                            .video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
                                            .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="video-container">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src="https://www.youtube.com/embed/${videoId}"
                                                frameborder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowfullscreen>
                                            </iframe>
                                        </div>
                                    </body>
                                </html>
                            `
                        }}
                        originWhitelist={['*']}
                        allowsInlineMediaPlayback={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsFullscreenVideo={true}
                        androidLayerType="hardware"
                        onShouldStartLoadWithRequest={() => true}
                        onLoadStart={() => setIsLoading(true)}
                        onLoadEnd={() => {
                            setIsLoading(false);
                            setHasError(false);
                        }}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('WebView error:', nativeEvent);
                            setHasError(true);
                            setIsLoading(false);
                        }}
                    />
                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <ThemedText style={styles.loadingText}>Cargando video...</ThemedText>
                        </View>
                    )}
                </View>
            );
        }

        return (
            <Video
                source={{ uri: videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={true}
                isLooping
                isMuted={false}
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
                onError={(error) => {
                    showError('Error al cargar el video', 'Error de reproducción');
                    setHasError(true);
                    setIsLoading(false);
                }}
            />
        );
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
                        placeholder="Ingresa la URL del video (YouTube o MP4)"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Button title="Guardar URL" onPress={handleSubmit} />
                    
                    <View style={styles.videoContainer}>
                        {renderVideo()}
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
        aspectRatio: 16/9,
        backgroundColor: '#000',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20,
    },
    video: {
        flex: 1,
        backgroundColor: '#000',
    },
    placeholder: {
        color: '#fff',
        textAlign: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
    },
    errorText: {
        color: '#fff',
        textAlign: 'center',
    }
}); 