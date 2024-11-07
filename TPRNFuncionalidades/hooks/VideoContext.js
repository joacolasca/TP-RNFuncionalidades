import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        const loadVideoUrl = async () => {
            try {
                const savedUrl = await AsyncStorage.getItem('favoriteVideoUrl');
                if (savedUrl) setVideoUrl(savedUrl);
            } catch (error) {
                console.error('Error loading video URL:', error);
            }
        };
        loadVideoUrl();
    }, []);

    const saveVideoUrl = async (url) => {
        try {
            await AsyncStorage.setItem('favoriteVideoUrl', url);
            setVideoUrl(url);
        } catch (error) {
            console.error('Error saving video URL:', error);
        }
    };

    return (
        <VideoContext.Provider value={{ videoUrl, saveVideoUrl }}>
            {children}
        </VideoContext.Provider>
    );
};