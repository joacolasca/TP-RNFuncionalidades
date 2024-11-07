import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadBackgroundImage = async () => {
            try {
                const savedImage = await AsyncStorage.getItem('backgroundImage');
                if (savedImage) setBackgroundImage(savedImage);
            } catch (error) {
                console.error('Error loading background image:', error);
            }
        };
        loadBackgroundImage();
    }, []);

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        return cameraStatus === 'granted' && libraryStatus === 'granted';
    };

    const selectImageFromGallery = async () => {
        try {
            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                alert('Se necesitan permisos para acceder a la galería');
                return;
            }

            setIsLoading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                await changeBackgroundImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            alert('Error al seleccionar la imagen');
        } finally {
            setIsLoading(false);
        }
    };

    const takePhoto = async () => {
        try {
            const hasPermission = await requestPermissions();
            if (!hasPermission) {
                alert('Se necesitan permisos para usar la cámara');
                return;
            }

            setIsLoading(true);
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                await changeBackgroundImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            alert('Error al tomar la foto');
        } finally {
            setIsLoading(false);
        }
    };

    const changeBackgroundImage = async (uri) => {
        try {
            if (!uri) throw new Error('URI de imagen inválido');
            setBackgroundImage(uri);
            await AsyncStorage.setItem('backgroundImage', uri);
        } catch (error) {
            console.error('Error saving image:', error);
            alert('Error al guardar la imagen');
        }
    };

    return (
        <BackgroundContext.Provider value={{
            backgroundImage,
            changeBackgroundImage,
            selectImageFromGallery,
            takePhoto,
            isLoading
        }}>
            {children}
        </BackgroundContext.Provider>
    );
};
