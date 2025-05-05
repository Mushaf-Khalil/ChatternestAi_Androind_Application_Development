
    // screens/SignupScreen.js
    import React, { useState as useStateSignup } from 'react'; // Alias useState to avoid conflict if needed
    import { View as ViewSignup, Text as TextSignup, StyleSheet as StyleSheetSignup, TouchableOpacity as TouchableOpacitySignup, Alert as AlertSignup, ScrollView as ScrollViewSignup, KeyboardAvoidingView as KeyboardAvoidingViewSignup, Platform as PlatformSignup } from 'react-native';
    import FormInputSignup from '../components/FormInput'; // Adjust path, reuse component
    import FormButtonSignup from '../components/FormButton'; // Adjust path, reuse component
    import { signUp } from '../services/firebase'; // Adjust path
    import { useTheme as useThemeSignup } from '../contexts/ThemeContext'; // Adjust path
    import { Ionicons as IoniconsSignup } from '@expo/vector-icons'; // For icons

    // Signup screen component
    const SignupScreen = ({ navigation }) => {
        const [email, setEmail] = useStateSignup('');
        const [password, setPassword] = useStateSignup('');
        const [confirmPassword, setConfirmPassword] = useStateSignup('');
        const [loading, setLoading] = useStateSignup(false);
        const [showPassword, setShowPassword] = useStateSignup(false);
        const [showConfirmPassword, setShowConfirmPassword] = useStateSignup(false);
        // State for validation errors
        const [emailError, setEmailError] = useStateSignup('');
        const [passwordError, setPasswordError] = useStateSignup('');
        const [confirmPasswordError, setConfirmPasswordError] = useStateSignup('');
        const { theme } = useThemeSignup();

        // --- Validation Functions ---
        const validateEmail = (text) => {
            setEmail(text);
            const emailRegex = /\S+@\S+\.\S+/;
            if (text.length > 0 && !emailRegex.test(text)) {
                setEmailError('Please enter a valid email address.');
            } else {
                setEmailError('');
            }
        };

        const validatePassword = (text) => {
            setPassword(text);
            let error = '';
            if (text.length > 0 && text.length < 6) {
                error = 'Password must be at least 6 characters.';
            }
            setPasswordError(error);
            // Re-validate confirm password whenever password changes
            validateConfirmPassword(confirmPassword, text);
        };

        const validateConfirmPassword = (text, currentPassword = password) => {
            setConfirmPassword(text);
            if (text.length > 0 && text !== currentPassword) {
                setConfirmPasswordError('Passwords do not match.');
            } else {
                setConfirmPasswordError('');
            }
        };

        // --- Handle Signup ---
        const handleSignup = async () => {
            // Clear previous errors and perform final validation check
            setEmailError('');
            setPasswordError('');
            setConfirmPasswordError('');
            let hasError = false;
            if (!email) { setEmailError('Email is required.'); hasError = true; }
            if (!password) { setPasswordError('Password is required.'); hasError = true; }
            if (!confirmPassword) { setConfirmPasswordError('Please confirm your password.'); hasError = true; }

            // Check existing validation states
            if (emailError || passwordError || confirmPasswordError || hasError) {
                return; // Don't proceed if validation errors exist
            }

            setLoading(true); // Start loading indicator
            try {
                console.log("Attempting signup for:", email);
                // Call Firebase signup function
                const { user } = await signUp(email.trim(), password);
                console.log("Signup Successful, user created:", user.uid);
                // Profile document creation is handled automatically by AuthContext/onAuthStateChanged listener
                // Navigation to MainAppStack is also handled by AuthContext
            } catch (error) {
                console.error("Signup Error:", error);
                // Provide specific error messages
                let errorMessage = "An unknown error occurred. Please try again.";
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = "This email address is already registered. Please log in.";
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = "Invalid email format.";
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = "Password is too weak. Please choose a stronger password.";
                }
                AlertSignup.alert("Signup Failed", errorMessage);
                setLoading(false); // Stop loading on error
            }
            // No need to setLoading(false) on success, component might unmount
        };

        return (
             <KeyboardAvoidingViewSignup
                behavior={PlatformSignup.OS === "ios" ? "padding" : "height"}
                style={[stylesSignup.keyboardView, { backgroundColor: theme.background }]}
            >
                {/* ScrollView to handle keyboard and layout */}
                <ScrollViewSignup contentContainerStyle={stylesSignup.container}>
                    {/* Screen Title */}
                    <TextSignup style={[stylesSignup.title, { color: theme.text }]}>Create Account</TextSignup>
                    <TextSignup style={[stylesSignup.subtitle, { color: theme.placeholder }]}>Join ChatterNest AI today!</TextSignup>

                    {/* Email Input */}
                    <FormInputSignup
                        label="Email"
                        labelValue={email}
                        onChangeText={validateEmail}
                        placeholderText="you@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        disabled={loading}
                        error={emailError}
                    />

                    {/* Password Input */}
                     <ViewSignup style={stylesSignup.passwordContainer}>
                        <FormInputSignup
                            label="Password"
                            labelValue={password}
                            onChangeText={validatePassword}
                            placeholderText="Minimum 6 characters"
                            secureTextEntry={!showPassword}
                            disabled={loading}
                            containerStyle={{ flex: 1 }}
                            error={passwordError}
                        />
                        <TouchableOpacitySignup
                            style={stylesSignup.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <IoniconsSignup name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color={theme.placeholder} />
                        </TouchableOpacitySignup>
                    </ViewSignup>

                    {/* Confirm Password Input */}
                    <ViewSignup style={stylesSignup.passwordContainer}>
                        <FormInputSignup
                            label="Confirm Password"
                            labelValue={confirmPassword}
                            onChangeText={validateConfirmPassword}
                            placeholderText="Re-enter password"
                            secureTextEntry={!showConfirmPassword}
                            disabled={loading}
                             containerStyle={{ flex: 1 }}
                            error={confirmPasswordError}
                        />
                         <TouchableOpacitySignup
                            style={stylesSignup.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <IoniconsSignup name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color={theme.placeholder} />
                        </TouchableOpacitySignup>
                    </ViewSignup>

                    {/* Signup Button */}
                    <FormButtonSignup
                        buttonTitle="Sign Up"
                        onPress={handleSignup}
                        loading={loading}
                        disabled={loading || !!emailError || !!passwordError || !!confirmPasswordError}
                    />

                    {/* Navigation to Login Screen */}
                    <TouchableOpacitySignup
                        style={stylesSignup.navButton}
                        onPress={() => !loading && navigation.navigate('Login')} // Navigate back to Login screen
                        disabled={loading}
                    >
                        <TextSignup style={[stylesSignup.navButtonText, { color: theme.primary }]}>
                            Already have an account? <TextSignup style={stylesSignup.boldText}>Log In</TextSignup>
                        </TextSignup>
                    </TouchableOpacitySignup>
                </ScrollViewSignup>
            </KeyboardAvoidingViewSignup>
        );
    };

    // Use similar styles as LoginScreen, adjusted as needed
    const stylesSignup = StyleSheetSignup.create({
        keyboardView: {
            flex: 1,
        },
        container: {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 25,
        },
        title: {
            fontSize: 32,
            marginBottom: 10,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            marginBottom: 30, // Slightly less space than login
            textAlign: 'center',
        },
         passwordContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
        },
         eyeIcon: {
            position: 'absolute',
            right: 15,
            top: 42, // Adjust based on label/input height
            zIndex: 10,
        },
        navButton: {
            marginTop: 25,
        },
        navButtonText: {
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center',
        },
        boldText: {
            fontWeight: 'bold',
        },
    });

    export default SignupScreen;