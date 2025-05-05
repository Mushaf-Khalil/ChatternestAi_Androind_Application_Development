 // components/FormButton.js
 import React from 'react';
 import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
 import { useTheme } from '../contexts/ThemeContext'; // Adjust path

 // Reusable Button component for forms with theme integration and loading state
 const FormButton = ({ buttonTitle, loading, disabled, style, textStyle, ...rest }) => {
     const { theme } = useTheme();
     const isDisabled = disabled || loading; // Button is disabled if explicitly disabled OR loading

     return (
         <TouchableOpacity
             style={[
                 styles.buttonContainer, // Base styles
                 { backgroundColor: isDisabled ? theme.placeholder : theme.primary }, // Grey out when disabled/loading
                 style // Allow custom styles to be passed
             ]}
             disabled={isDisabled} // Use combined disabled state
             {...rest} // Pass down onPress, etc.
         >
             {/* Show ActivityIndicator when loading */}
             {loading ? (
                 <ActivityIndicator size="small" color={theme.text} />
             ) : (
                 // Otherwise, show the button title
                 <Text style={[styles.buttonText, { color: theme.text }, textStyle]}>{buttonTitle}</Text>
             )}
         </TouchableOpacity>
     );
 };

 const styles = StyleSheet.create({
     buttonContainer: {
         marginTop: 10,
         width: '100%', // Default to full width
         height: 50, // Consistent height
         padding: 10,
         alignItems: 'center',
         justifyContent: 'center',
         borderRadius: 8, // Match input border radius
         flexDirection: 'row', // Align loader and text (though only one shows)
     },
     buttonText: {
         fontSize: 18,
         fontWeight: 'bold',
         textTransform: 'uppercase', // Optional: make text uppercase
     },
 });

 export default FormButton;