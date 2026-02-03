import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    colorScheme: ColorScheme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    colorScheme: 'dark', // Default fallback
    setTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

const THEME_STORAGE_KEY = 'MED_BRAIN_THEME_PREFERENCE';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const deviceColorScheme = useDeviceColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load persisted theme preference
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                    setThemeState(savedTheme);
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    // Calculate effective color scheme
    const colorScheme: ColorScheme =
        theme === 'system'
            ? (deviceColorScheme === 'dark' ? 'dark' : 'light')
            : theme;

    if (!isLoaded) {
        return null; // Or a splash screen/loading indicator if strictly needed, but typically null is fine for context init locally
    }

    return (
        <ThemeContext.Provider value={{ theme, colorScheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
