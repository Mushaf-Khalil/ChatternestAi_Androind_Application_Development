    // navigation/AppNavigator.js (Restored)
    import React from 'react';
    import { NavigationContainer } from '@react-navigation/native';
    // Ensure this path is correct
    import { useAuth } from '../contexts/AuthContext';
    import AuthStack from './AuthStack';
    import MainAppStack from './MainAppStack';
    // Loading indicator is handled by AuthProvider

    const AppNavigator = () => {
        // Get authentication state directly
        // AuthProvider handles the initial loading state
        const { currentUser } = useAuth();

        return (
            <NavigationContainer>
                {/* Conditionally render based on user login status */}
                {currentUser ? <MainAppStack /> : <AuthStack />}
            </NavigationContainer>
        );
    };

    export default AppNavigator;
    