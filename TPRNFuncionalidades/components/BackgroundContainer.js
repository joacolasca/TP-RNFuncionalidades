import React, { useContext } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { BackgroundContext } from '../hooks/BackgroundContext';

const BackgroundContainer = ({ children }) => {
    const { backgroundImage } = useContext(BackgroundContext);

    return (
        <View style={styles.container}>
            {backgroundImage ? (
                <ImageBackground 
                    source={{ uri: backgroundImage }}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        {children}
                    </View>
                </ImageBackground>
            ) : (
                <View style={[styles.background, styles.defaultBackground]}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    defaultBackground: {
        backgroundColor: '#f0f0f0', // Color de fondo por defecto
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)' // Overlay semi-transparente
    }
});

export default BackgroundContainer;