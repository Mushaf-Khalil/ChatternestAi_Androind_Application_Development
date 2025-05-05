import React from 'react';
    import { TextInput, StyleSheet, View, Text } from 'react-native';
    import { useTheme } from '../contexts/ThemeContext'; // Adjust path

    // Reusable TextInput component for forms with theme integration
    const FormInput = ({ label, labelValue, placeholderText, error, containerStyle, ...rest }) => {
        const { theme } = useTheme();
        const hasError = error && error.length > 0;

        return (
            // Use View for container to apply styles and manage layout (like flex in password row)
            <View style={[styles.inputContainer, containerStyle]}>
                {/* Optional label */}
                {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
                <TextInput
                    value={labelValue}
                    style={[
                        styles.input,
                        {
                            color: theme.text,
                            borderColor: hasError ? theme.error : theme.primary, // Highlight border on error
                            backgroundColor: theme.inputBackground,
                        },
                    ]}
                    numberOfLines={1}
                    placeholder={placeholderText}
                    placeholderTextColor={theme.placeholder}
                    {...rest} // Pass down other props like onChangeText, secureTextEntry, etc.
                />
                {/* Display error message if provided */}
                {hasError && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
            </View>
        );
    };

    const styles = StyleSheet.create({
        inputContainer: {
            marginBottom: 15, // Space below the input/error
            width: '100%', // Ensure container takes full width by default
        },
        label: {
            fontSize: 14,
            marginBottom: 5,
            fontWeight: '600',
        },
        input: {
            paddingHorizontal: 15,
            paddingVertical: 12, // Adjust for comfortable height
            height: 50, // Standard height
            fontSize: 16,
            borderRadius: 8,
            borderWidth: 1.5, // Slightly thicker border
        },
        errorText: {
            fontSize: 12,
            marginTop: 3, // Space between input and error text
            marginLeft: 5, // Indent slightly
        },
    });

    export default FormInput;