import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';
import { ThemedText } from './ThemedText';

const VideoPlayer = ({ videoUrl }) => {
    if (!videoUrl) {
        return (
            <View style={styles.container}>
                <ThemedText>Ingresa una URL de video para reproducir</ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                shouldPlay
                isLooping
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});

export default VideoPlayer; 