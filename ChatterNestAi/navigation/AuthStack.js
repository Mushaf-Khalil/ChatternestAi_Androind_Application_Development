// navigation/AuthStack.js (Handles Login/Signup Screens)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen'; // Adjust path
import SignupScreen from '../screens/SignupScreen'; // Adjust path
// Theme context isn't needed here since headers are hidden

const Stack = createStackNavigator();

// Navigator for the authentication flow (when user is not logged in)
const AuthStack = () => {
    return (
        // Stack.Navigator manages the screens in this stack
        <Stack.Navigator
            // Hide the header for the authentication flow screens
            screenOptions={{ headerShown: false }}
        >
            {/* Define the screens within the Auth stack */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
};

export default AuthStack;
