// components/ImagePickerComponent.js
import React, { useContext } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BackgroundContext } from '../hooks/BackgroundContext';

const ImagePickerComponent = () => {
    const { changeBackgroundImage } = useContext(BackgroundContext);

    const selectImageFromGallery = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets) {
                const uri = response.assets[0].uri;
                changeBackgroundImage(uri);
            }
        });
    };

    const takePhoto = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.assets) {
                const uri = response.assets[0].uri;
                changeBackgroundImage(uri);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Button title="Seleccionar desde galería" onPress={selectImageFromGallery} />
            <Button title="Tomar foto" onPress={takePhoto} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default ImagePickerComponent;
