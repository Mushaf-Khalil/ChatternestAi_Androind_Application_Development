// App.js (This should be your main entry point file in the root)
import React from 'react';
import { StatusBar } from 'expo-status-bar';
// Ensure paths are correct based on your folder structure
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Inner component to access theme context correctly
const AppContent = () => {
    const { theme } = useTheme();
    return (
        <>
            <StatusBar style={theme.statusBar} />
            {/* AppNavigator contains the NavigationContainer */}
            <AppNavigator />
        </>
    );
}

// Main export - the root of your app
export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
