import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import { BackgroundContext } from '../../hooks/BackgroundContext';
import ImagePickerComponent from '../../components/ImagePickerComponent';

const ExploreScreen = () => {
    const { backgroundImage } = useContext(BackgroundContext);

    return (
        <ImageBackground
            source={backgroundImage ? { uri: backgroundImage } : null}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.text}>Bienvenido a la Aplicación</Text>
                <ImagePickerComponent />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 20,
    },
});

export default ExploreScreen;