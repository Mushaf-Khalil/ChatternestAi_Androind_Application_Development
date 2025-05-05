    // screens/LoginScreen.js
    import React, { useState } from 'react';
    import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
    import FormInput from '../components/FormInput'; // Adjust path
    import FormButton from '../components/FormButton'; // Adjust path
    import { logIn } from '../services/firebase'; // Adjust path
    import { useTheme } from '../contexts/ThemeContext'; // Adjust path
    import { Ionicons } from '@expo/vector-icons'; // For icons

    // Login screen component
    const LoginScreen = ({ navigation }) => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [showPassword, setShowPassword] = useState(false); // State for password visibility
        const [emailError, setEmailError] = useState('');
        const [passwordError, setPasswordError] = useState('');
        const { theme } = useTheme();

        // Basic email validation
        const validateEmail = (text) => {
            setEmail(text);
            const emailRegex = /\S+@\S+\.\S+/;
            if (text.length > 0 && !emailRegex.test(text)) {
                setEmailError('Please enter a valid email address.');
            } else {
                setEmailError('');
            }
        };

        // Basic password validation (length)
        const validatePassword = (text) => {
            setPassword(text);
            if (text.length > 0 && text.length < 6) {
                setPasswordError('Password must be at least 6 characters.');
            } else {
                setPasswordError('');
            }
        };

        // Handle login attempt
        const handleLogin = async () => {
            // Clear previous errors
            setEmailError('');
            setPasswordError('');

            // Check for empty fields
            let hasError = false;
            if (!email) { setEmailError('Email is required.'); hasError = true; }
            if (!password) { setPasswordError('Password is required.'); hasError = true; }
            // Check existing validation states
            if (emailError || passwordError || hasError) {
                 // Don't proceed if there are validation errors or empty fields
                 return;
            }

            setLoading(true); // Show loading indicator on button
            try {
                console.log("Attempting login for:", email);
                await logIn(email.trim(), password); // Use trimmed email
                // Login successful: Navigation to MainAppStack happens automatically
                // via the AuthProvider's state change listener. No need to navigate here.
                console.log("Login Successful");
                // No need to setLoading(false) here, as the component might unmount
            } catch (error) {
                console.error("Login Error:", error);
                // Provide more specific feedback based on Firebase error codes
                let errorMessage = "An unknown error occurred. Please try again.";
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    errorMessage = "Invalid email or password. Please check your credentials.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "Invalid email format.";
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = "Too many login attempts. Please try again later.";
                }
                Alert.alert("Login Failed", errorMessage);
                setLoading(false); // Stop loading on error
            }
        };

        return (
            // Use KeyboardAvoidingView to prevent keyboard overlap
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.keyboardView, { backgroundColor: theme.background }]}
            >
                {/* Use ScrollView to allow scrolling if content overflows */}
                <ScrollView contentContainerStyle={styles.container}>
                    {/* App Title */}
                    <Text style={[styles.title, { color: theme.text }]}>Welcome Back!</Text>
                    <Text style={[styles.subtitle, { color: theme.placeholder }]}>Log in to ChatterNest AI</Text>

                    {/* Email Input */}
                    <FormInput
                        label="Email"
                        labelValue={email}
                        onChangeText={validateEmail} // Use validation function
                        placeholderText="you@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        disabled={loading}
                        error={emailError} // Pass error message
                    />

                    {/* Password Input */}
                    <View style={styles.passwordContainer}>
                        <FormInput
                            label="Password"
                            labelValue={password}
                            onChangeText={validatePassword} // Use validation function
                            placeholderText="••••••••"
                            secureTextEntry={!showPassword} // Toggle based on state
                            disabled={loading}
                            containerStyle={{ flex: 1 }} // Allow input to take space
                            error={passwordError} // Pass error message
                        />
                        {/* Password visibility toggle button */}
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color={theme.placeholder}
                            />
                        </TouchableOpacity>
                    </View>


                    {/* Login Button */}
                    <FormButton
                        buttonTitle="Log In"
                        onPress={handleLogin}
                        loading={loading} // Pass loading state
                        disabled={loading || !!emailError || !!passwordError} // Disable if loading or errors exist
                    />

                    {/* Navigation to Signup Screen */}
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => !loading && navigation.navigate('Signup')} // Navigate to Signup screen
                        disabled={loading}
                    >
                        <Text style={[styles.navButtonText, { color: theme.primary }]}>
                            Don't have an account? <Text style={styles.boldText}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    const styles = StyleSheet.create({
        keyboardView: {
            flex: 1, // Ensure it takes full screen height
        },
        container: {
            flexGrow: 1, // Allow content to grow and enable scrolling
            justifyContent: 'center', // Center content vertically
            alignItems: 'center', // Center content horizontally
            padding: 25, // Add padding around the content
        },
        title: {
            fontSize: 32, // Larger title
            marginBottom: 10,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            marginBottom: 40, // More space below subtitle
            textAlign: 'center',
        },
        passwordContainer: {
            flexDirection: 'row',
            alignItems: 'center', // Align icon vertically with input
            width: '100%',
            position: 'relative', // Needed for absolute positioning of icon if FormInput doesn't use containerStyle
        },
        eyeIcon: {
            position: 'absolute', // Position icon inside the input area
            right: 15,
            // Adjust vertical position (depends on label presence and input height/padding)
            // If FormInput has label, top might need adjustment. Assuming ~42px from top of FormInput container
            top: 42,
            zIndex: 10, // Ensure icon is clickable
        },
        navButton: {
            marginTop: 25, // More space above nav button
        },
        navButtonText: {
            fontSize: 16,
            fontWeight: '500', // Medium weight
            textAlign: 'center',
        },
        boldText: {
            fontWeight: 'bold', // Make "Sign Up" bold
        },
    });

    export default LoginScreen;