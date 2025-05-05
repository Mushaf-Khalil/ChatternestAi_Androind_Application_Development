 // components/LoadingIndicator.js
 import React from 'react';
 import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
 import { useTheme } from '../contexts/ThemeContext'; // Adjust path

 // Simple reusable loading indicator component
 const LoadingIndicator = ({ size = 'small', text }) => {
     const { theme } = useTheme();
     return (
         <View style={styles.container}>
             <ActivityIndicator size={size} color={theme.primary} />
             {/* Optional text below the indicator */}
             {text && <Text style={[styles.text, { color: theme.text }]}>{text}</Text>}
         </View>
     );
 };

 const styles = StyleSheet.create({
     container: {
         padding: 15, // Add padding around the indicator
         alignItems: 'center', // Center horizontally
         justifyContent: 'center', // Center vertically if container has height
     },
     text: {
         marginTop: 8, // Space between indicator and text
         fontSize: 14,
         // color: '#666', // Default color, overridden by theme
     }
 });

 export default LoadingIndicator;