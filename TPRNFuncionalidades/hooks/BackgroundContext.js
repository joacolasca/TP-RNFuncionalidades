import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
    const [backgroundImage, setBackgroundImage] = useState(null);

    useEffect(() => {
        const loadBackgroundImage = async () => {
            const savedImage = await AsyncStorage.getItem('backgroundImage');
            if (savedImage) setBackgroundImage(savedImage);
        };
        loadBackgroundImage();
    }, []);

    const changeBackgroundImage = async (uri) => {
        setBackgroundImage(uri);
        await AsyncStorage.setItem('backgroundImage', uri);
    };

    return (
        <BackgroundContext.Provider value={{ backgroundImage, changeBackgroundImage }}>
            {children}
        </BackgroundContext.Provider>
    );
}
