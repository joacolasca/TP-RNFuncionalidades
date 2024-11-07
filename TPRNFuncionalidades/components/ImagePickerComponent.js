// components/ImagePickerComponent.js
import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BackgroundContext } from '../hooks/BackgroundContext';

const ImagePickerComponent = () => {
    const { selectImageFromGallery, takePhoto, isLoading } = useContext(BackgroundContext);

    return (
        <View style={styles.container}>
            <Button 
                title="Seleccionar desde galería" 
                onPress={selectImageFromGallery}
                disabled={isLoading}
            />
            <Button 
                title="Tomar foto" 
                onPress={takePhoto}
                disabled={isLoading}
            />
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
