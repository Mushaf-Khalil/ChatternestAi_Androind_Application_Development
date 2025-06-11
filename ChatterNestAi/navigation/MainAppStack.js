// // navigation/MainAppStack.js (MODIFIED)
// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import ChatScreen from '../screens/ChatScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import { useTheme } from '../contexts/ThemeContext';
// // logOut is no longer called from header, remove import if not needed elsewhere
// // import { logOut } from '../services/firebase';

// const Stack = createStackNavigator();

// const MainAppStack = () => {
//     const { theme } = useTheme();

//     // Logout logic is now moved to ProfileScreen button

//     return (
//         <Stack.Navigator
//             screenOptions={({ navigation }) => ({
//                 headerStyle: { backgroundColor: theme.primary },
//                 headerTintColor: theme.text, // Color for title and back arrow
//                 headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
//                 headerBackTitleVisible: false, // Keep back arrow, hide text
//                 // Default right header button (Profile icon) - applies to ChatScreen
//                 headerRight: () => (
//                     <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.headerButton}>
//                         <Ionicons name="person-circle-outline" size={28} color={theme.text} />
//                     </TouchableOpacity>
//                 ),
//             })}
//         >
//             <Stack.Screen
//                 name="ChatterNest AI"
//                 component={ChatScreen}
//                 // Options for ChatScreen (uses default headerRight)
//             />
//             <Stack.Screen
//                 name="Profile"
//                 component={ProfileScreen}
//                 options={{
//                     // --- MODIFIED Title ---
//                     title: 'Profile Settings', // Changed title
//                     // --- REMOVED headerRight for Profile screen ---
//                     // Logout button is now inside the screen component
//                     headerRight: null, // Explicitly remove default right button
//                     // You might want a custom back button text or behavior here if needed
//                     // headerBackTitle: 'Chat', // Example: Set text next to back arrow on iOS
//                 }}
//             />
//             {/* Add SettingsScreen if created */}
//         </Stack.Navigator>
//     );
// };

// const styles = StyleSheet.create({
//     headerButton: { marginRight: 15, padding: 5 },
// });

// export default MainAppStack;
// navigation/MainAppStack.js (MODIFIED)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Import View for grouping header buttons
import { TouchableOpacity, StyleSheet, Alert, View } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';
import ChatScreen from '../screens/ChatScreen'; // Ensure path is correct
import ProfileScreen from '../screens/ProfileScreen'; // Ensure path is correct
import { useTheme } from '../contexts/ThemeContext'; // Ensure path is correct

const Stack = createStackNavigator();

// --- New Helper Component for the Theme Toggle Button ---
const HeaderThemeToggleButton = () => {
  // We need themeName and toggleTheme from the context here
  const { theme, themeName, toggleTheme } = useTheme(); 
  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
      <Ionicons
        name={themeName === 'dark' ? 'sunny-outline' : 'moon-outline'}
        size={24} // Standard size for header icons
        color={theme.text} // Use the same color as other header text/icons
      />
    </TouchableOpacity>
  );
};

const MainAppStack = () => {
    const { theme } = useTheme(); // This theme is used for general header styling

    return (
        <Stack.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: theme.primary },
                headerTintColor: theme.text, // Color for title and back arrow
                headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
                headerBackTitleVisible: false,
                // --- MODIFIED headerRight to include both buttons ---
                headerRight: () => (
                    <View style={styles.headerRightContainer}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Profile')} 
                            style={styles.headerButton}
                        >
                            <Ionicons name="person-circle-outline" size={28} color={theme.text} />
                        </TouchableOpacity>
                        <HeaderThemeToggleButton /> 
                    </View>
                ),
            })}
        >
            <Stack.Screen
                name="ChatterNest AI"
                component={ChatScreen}
                // No specific options needed here for headerRight, it will use the default from screenOptions
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile Settings',
                    // Explicitly remove headerRight for Profile screen if you don't want these icons here
                    headerRight: null, 
                }}
            />
            {/* Add SettingsScreen if created */}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    // --- MODIFIED Styles for header buttons ---
    headerRightContainer: {
        flexDirection: 'row', // Arrange buttons horizontally
        alignItems: 'center',
        marginRight: 10,      // Overall margin from the right edge
    },
    headerButton: {
        paddingHorizontal: 8, // Add some padding around each icon for easier tapping
        // marginRight: 15 was on the single button, now handled by paddingHorizontal
        // and spacing between items if needed (though paddingHorizontal might be enough)
    },
});

export default MainAppStack;