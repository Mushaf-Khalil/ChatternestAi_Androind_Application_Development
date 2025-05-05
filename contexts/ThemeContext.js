   // contexts/ThemeContext.js
    import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
    import { Appearance } from 'react-native';
    // Adjust path if themes folder is elsewhere
    import { themes } from '../themes';

    const ThemeContext = createContext();

    export const ThemeProvider = ({ children }) => {
        const colorScheme = Appearance.getColorScheme();
        const [themeName, setThemeName] = useState(colorScheme === 'dark' ? 'dark' : 'light');

        const toggleTheme = () => {
            setThemeName(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        };

        useEffect(() => {
            const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
                console.log('Device color scheme changed:', newColorScheme);
                const newThemeName = newColorScheme === 'dark' ? 'dark' : 'light';
                // Update app theme only if it differs from current state
                // This prevents unnecessary updates if the user manually toggled the theme
                // and the device preference changes back to the original state.
                // Consider adding a setting to "follow system theme" vs manual override.
                // For now, we just update if the system changes.
                 setThemeName(newThemeName);

            });
            return () => subscription.remove();
        }, []); // Listen for changes continuously

        const currentTheme = useMemo(() => themes[themeName], [themeName]);

        const value = useMemo(() => ({
            theme: currentTheme,
            themeName: themeName,
            toggleTheme: toggleTheme,
        }), [currentTheme, themeName]); // toggleTheme is stable

        return (
            <ThemeContext.Provider value={value}>
                {children}
            </ThemeContext.Provider>
        );
    };

    // Custom hook
    export const useTheme = () => {
        const context = useContext(ThemeContext);
        if (context === undefined) {
            throw new Error('useTheme must be used within a ThemeProvider');
        }
        return context;
    };
