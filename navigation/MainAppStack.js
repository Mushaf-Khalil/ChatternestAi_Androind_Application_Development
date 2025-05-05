// navigation/MainAppStack.js (MODIFIED)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../contexts/ThemeContext';
// logOut is no longer called from header, remove import if not needed elsewhere
// import { logOut } from '../services/firebase';

const Stack = createStackNavigator();

const MainAppStack = () => {
    const { theme } = useTheme();

    // Logout logic is now moved to ProfileScreen button

    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: theme.primary },
                headerTintColor: theme.text, // Color for title and back arrow
                headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
                headerBackTitleVisible: false, // Keep back arrow, hide text
                // Default right header button (Profile icon) - applies to ChatScreen
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.headerButton}>
                        <Ionicons name="person-circle-outline" size={28} color={theme.text} />
                    </TouchableOpacity>
                ),
            })}
        >
            <Stack.Screen
                name="ChatterNest AI"
                component={ChatScreen}
                // Options for ChatScreen (uses default headerRight)
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    // --- MODIFIED Title ---
                    title: 'Profile Settings', // Changed title
                    // --- REMOVED headerRight for Profile screen ---
                    // Logout button is now inside the screen component
                    headerRight: null, // Explicitly remove default right button
                    // You might want a custom back button text or behavior here if needed
                    // headerBackTitle: 'Chat', // Example: Set text next to back arrow on iOS
                }}
            />
            {/* Add SettingsScreen if created */}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    headerButton: { marginRight: 15, padding: 5 },
});

export default MainAppStack;
