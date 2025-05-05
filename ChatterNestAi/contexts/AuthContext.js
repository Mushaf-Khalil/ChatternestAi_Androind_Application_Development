    // contexts/AuthContext.js (Restored - No Debug Logs)
    import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
    import { onAuthStateChangedListener, createUserProfileDocument, getUserProfile } from '../services/firebase';
    import { ActivityIndicator, View, StyleSheet } from 'react-native';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
        const [currentUser, setCurrentUser] = useState(null);
        const [userProfile, setUserProfile] = useState(null);
        const [isLoading, setIsLoading] = useState(true); // Start loading

        // Function to fetch/refresh profile
        const fetchAndSetProfile = useCallback(async (userAuth) => {
            if (!userAuth?.uid) { setUserProfile(null); return; }
            try {
                // console.log(`AuthProvider: fetchAndSetProfile for UID: ${userAuth.uid}`); // Debug log removed
                await createUserProfileDocument(userAuth); // Ensure profile doc exists
                const profile = await getUserProfile(userAuth.uid);
                setUserProfile(profile);
                // console.log("AuthProvider: Profile fetched/refreshed:", profile ? profile.displayName : null); // Debug log removed
            } catch (error) {
                console.error("AuthProvider: Error fetching user profile:", error);
                setUserProfile(null);
            }
        }, []);

        // Effect for initial auth state change and listener setup
        useEffect(() => {
            // Ensure listener function exists
            if (typeof onAuthStateChangedListener !== 'function') {
                 console.error("onAuthStateChangedListener is not available. Firebase might not be initialized correctly.");
                 setIsLoading(false);
                 return;
            }
            // console.log("AuthProvider: Setting up Firebase Auth listener..."); // Debug log removed
            const unsubscribe = onAuthStateChangedListener(async (userAuth) => {
                // console.log("AuthProvider: onAuthStateChangedListener fired! User:", userAuth ? userAuth.uid : null); // Debug log removed
                setCurrentUser(userAuth); // Set Firebase user object
                if (userAuth) {
                    await fetchAndSetProfile(userAuth); // Fetch profile
                } else {
                    setUserProfile(null); // Clear profile on logout
                }
                // console.log("AuthProvider: Setting isLoading to false."); // Debug log removed
                setIsLoading(false); // Done loading after check
            });
            // Cleanup listener on unmount
            return () => {
                // console.log("AuthProvider: Cleaning up Firebase Auth listener."); // Debug log removed
                unsubscribe();
            };
        }, [fetchAndSetProfile]); // Dependency

        // Function to manually refresh profile
        const refreshUserProfile = useCallback(async () => {
            if (currentUser) {
                // console.log("Manual profile refresh triggered."); // Debug log removed
                // setIsLoading(true); // Optionally show loading - might cause flicker
                await fetchAndSetProfile(currentUser);
                // setIsLoading(false);
            } else {
                // console.log("Cannot refresh profile, no user logged in."); // Debug log removed
            }
        }, [currentUser, fetchAndSetProfile]);

        // Memoize context value
        const value = useMemo(() => ({
            currentUser,
            userProfile,
            isLoading,
            refreshUserProfile // Expose refresh function
        }), [currentUser, userProfile, isLoading, refreshUserProfile]);

        // Show loading indicator ONLY during the very initial check
        if (isLoading && !currentUser && !userProfile) {
             // console.log("AuthProvider: Rendering loading indicator (isLoading is true)"); // Debug log removed
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200EE" />
                </View>
            );
        }

        // console.log("AuthProvider: Rendering children (isLoading is false)"); // Debug log removed
        return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        );
    };

    // Custom hook
    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (context === undefined) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    };

    const styles = StyleSheet.create({
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }
    });
    