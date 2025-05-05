    // screens/ProfileScreen.js (Updated Layout & Fields)
    import React, { useState, useEffect, useCallback } from 'react';
    import {
        View, Text, StyleSheet, Alert, TextInput, ScrollView, RefreshControl,
        TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform // Added KeyboardAvoidingView
    } from 'react-native';
    import { useAuth } from '../contexts/AuthContext'; // Hook to get user info and refresh function
    import { useTheme } from '../contexts/ThemeContext'; // Hook to get theme colors
    // Import logOut and ensure deleteUserChatHistory is imported
    import { updateUserProfile, getUserProfile, deleteUserChatHistory, logOut } from '../services/firebase';
    import FormButton from '../components/FormButton'; // Reusable button component
    import LoadingIndicator from '../components/LoadingIndicator'; // Reusable loading component
    import { Ionicons } from '@expo/vector-icons'; // Icons

    // Default placeholder image if user has no photoURL set
    const PLACEHOLDER_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; // Replace with your actual placeholder image URL

    const ProfileScreen = ({ navigation }) => {
        // Get user state, profile, loading status, and refresh function from Auth context
        const { currentUser, userProfile, isLoading: authLoading, refreshUserProfile } = useAuth();
        // Get theme colors
        const { theme } = useTheme();

        // State for editable fields
        const [displayName, setDisplayName] = useState('');
        const [age, setAge] = useState(''); // Added state for age
        const [gender, setGender] = useState(''); // Added state for gender

        // Edit mode state (can manage fields individually or together)
        const [isEditingProfile, setIsEditingProfile] = useState(false); // Combined edit state

        // Loading states
        const [isUpdating, setIsUpdating] = useState(false); // For saving profile
        const [isDeletingChat, setIsDeletingChat] = useState(false);
        const [isLoggingOut, setIsLoggingOut] = useState(false); // Added for logout button

        // Local profile copy and refresh state
        const [currentProfile, setCurrentProfile] = useState(userProfile);
        const [isRefreshing, setIsRefreshing] = useState(false);

        // Function to fetch profile data manually (used for pull-to-refresh)
        const fetchProfileData = useCallback(async () => {
            if (!currentUser?.uid) return;
            setIsRefreshing(true);
            try {
                const profile = await getUserProfile(currentUser.uid);
                if (profile) {
                    setCurrentProfile(profile);
                    // Set state from fetched profile
                    setDisplayName(profile.displayName || '');
                    setAge(profile.age?.toString() || ''); // Convert age to string for TextInput
                    setGender(profile.gender || '');
                } else {
                    // Handle missing profile
                    setCurrentProfile({ email: currentUser.email, createdAt: null, displayName: '', photoURL: null, age: null, gender: null });
                    setDisplayName(''); setAge(''); setGender('');
                }
            } catch (error) { console.error("Fetch profile error:", error); Alert.alert("Error", "Could not refresh profile data."); }
            finally { setIsRefreshing(false); }
        }, [currentUser]); // Dependency: currentUser

        // Effect to update local state when userProfile from context changes
        useEffect(() => {
            if (userProfile) {
                setCurrentProfile(userProfile);
                setDisplayName(userProfile.displayName || '');
                setAge(userProfile.age?.toString() || '');
                setGender(userProfile.gender || '');
            } else if (currentUser && !authLoading && !userProfile) {
                // If context profile is missing after initial load, fetch manually
                fetchProfileData();
            }
        }, [userProfile, currentUser, authLoading, fetchProfileData]); // Dependencies

        // --- Combined Handler for saving profile updates ---
        const handleUpdateProfile = async () => {
            const trimmedName = displayName.trim();
            const parsedAge = age ? parseInt(age, 10) : null; // Convert age string back to number or null

            // Basic validation
            if (!currentUser) return;
            if (!trimmedName) { Alert.alert("Validation Error", "Display name cannot be empty."); return; }
            if (age && (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 150)) { Alert.alert("Validation Error", "Please enter a valid age."); return; }
            // Add gender validation if using a picker/specific options

            setIsUpdating(true);
            const dataToUpdate = {
                displayName: trimmedName,
                age: parsedAge, // Save as number or null
                gender: gender.trim() || null // Save trimmed gender or null
            };

            try {
                const success = await updateUserProfile(currentUser.uid, dataToUpdate);
                if (success) {
                    Alert.alert("Success", "Profile updated successfully!");
                    setIsEditingProfile(false); // Exit edit mode
                    await refreshUserProfile(); // Refresh context
                } else {
                    Alert.alert("Error", "Failed to update profile. Please try again.");
                }
            } catch (error) {
                console.error("Profile Update Error:", error);
                Alert.alert("Update Error", "An error occurred while updating your profile.");
            } finally {
                setIsUpdating(false);
            }
        };

        // Handler for canceling profile edit
        const cancelEditProfile = () => {
            setIsEditingProfile(false);
            // Reset fields to last known profile values
            setDisplayName(currentProfile?.displayName || '');
            setAge(currentProfile?.age?.toString() || '');
            setGender(currentProfile?.gender || '');
        };

        // Handler for deleting chat history
        const handleDeleteChat = () => {
            if (!currentUser?.uid) return; // Guard clause
            Alert.alert( "Delete Chat History", "Are you sure...?", [ { text: "Cancel", style: "cancel" }, { text: "Delete All", style: "destructive", onPress: async () => { setIsDeletingChat(true); try { const success = await deleteUserChatHistory(currentUser.uid); if (success) { Alert.alert("Success", "Chat history deleted."); } else { Alert.alert("Error", "Could not delete chat history."); } } catch (error) { console.error("Error deleting chat:", error); Alert.alert("Error", "An unexpected error occurred."); } finally { setIsDeletingChat(false); } }, }, ] );
         };

        // Handler for Logout Button
        const handleLogout = async () => {
             Alert.alert(
                "Confirm Logout",
                "Are you sure you want to log out?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Logout",
                        onPress: async () => {
                            setIsLoggingOut(true); // Show loading
                            try {
                                await logOut();
                                console.log("User logged out via ProfileScreen button.");
                                // Navigation back to AuthStack is handled automatically by AuthContext
                            } catch (error) {
                                console.error("Logout failed:", error);
                                Alert.alert("Logout Error", "Could not log out. Please try again.");
                                setIsLoggingOut(false); // Reset loading on error
                            }
                            // No need to setIsLoggingOut(false) on success as component unmounts
                        },
                        style: "destructive"
                    }
                ]
            );
        };

        // --- Render Loading/User Not Found States ---
        if (authLoading || (!currentProfile && !currentUser)) { return <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}><LoadingIndicator size="large" /></View>; }
        if (!currentUser) { return <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}><Text style={{ color: theme.text }}>User not found.</Text></View>; }

        // Determine image URI - log it to check
        const imageUri = currentProfile?.photoURL || PLACEHOLDER_IMAGE;
        // console.log("ProfileScreen: Rendering Image with URI:", imageUri); // Add this log if needed

        // --- Render Main Profile Screen ---
        return (
            // Wrap ScrollView in KeyboardAvoidingView if inputs might be covered
             <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }} // KAV needs flex: 1
                // Adjust offset if needed, especially if header is present
                // keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            >
                <ScrollView
                    style={[styles.scrollContainer, { backgroundColor: theme.background }]}
                    contentContainerStyle={styles.container}
                    refreshControl={ <RefreshControl refreshing={isRefreshing} onRefresh={fetchProfileData} tintColor={theme.primary} colors={[theme.primary]} /> }
                    keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap outside input
                >
                    {/* Profile Header */}
                    <View style={styles.header}>
                         <Image source={{ uri: imageUri }} style={styles.avatar} onError={(e) => console.log("Image load error:", e.nativeEvent.error)} />
                         <Text style={[styles.email, { color: theme.text }]}>{currentUser.email}</Text>
                         <Text style={[styles.joinedDate, { color: theme.placeholder }]}>Joined: {currentProfile?.createdAt instanceof Date ? currentProfile.createdAt.toLocaleDateString() : '...'}</Text>
                    </View>

                    {/* Combined Edit Button */}
                    {!isEditingProfile && (
                         <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditingProfile(true)}>
                             <Ionicons name="create-outline" size={20} color={theme.primary} style={{marginRight: 5}}/>
                             <Text style={[styles.editProfileButtonText, { color: theme.primary }]}>Edit Profile</Text>
                         </TouchableOpacity>
                    )}

                    {/* Display Name Section */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Display Name</Text>
                        {isEditingProfile ? (
                            <TextInput style={[styles.input, { color: theme.text, borderColor: theme.primary, backgroundColor: theme.inputBackground }]} value={displayName} onChangeText={setDisplayName} placeholder="Enter display name" autoCapitalize="words" maxLength={30} />
                        ) : (
                            <Text style={[styles.info, { color: theme.text }]}>{currentProfile?.displayName || '(Not Set)'}</Text>
                        )}
                    </View>

                    {/* ADDED: Age Section */}
                     <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Age</Text>
                        {isEditingProfile ? (
                            <TextInput style={[styles.input, { color: theme.text, borderColor: theme.primary, backgroundColor: theme.inputBackground }]} value={age} onChangeText={setAge} placeholder="Enter your age" keyboardType="numeric" maxLength={3} />
                        ) : (
                            <Text style={[styles.info, { color: theme.text }]}>{currentProfile?.age || '(Not Set)'}</Text>
                        )}
                    </View>

                    {/* ADDED: Gender Section */}
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: theme.text }]}>Gender</Text>
                        {isEditingProfile ? (
                            // Using TextInput for now, recommend replacing with Picker/Radio buttons later
                            <TextInput style={[styles.input, { color: theme.text, borderColor: theme.primary, backgroundColor: theme.inputBackground }]} value={gender} onChangeText={setGender} placeholder="e.g., Male, Female, Other" autoCapitalize="words" maxLength={30} />
                        ) : (
                            <Text style={[styles.info, { color: theme.text }]}>{currentProfile?.gender || '(Not Set)'}</Text>
                        )}
                    </View>

                    {/* Save/Cancel Buttons (only in edit mode) */}
                    {isEditingProfile && (
                         <View style={styles.editActionsContainer}>
                             <FormButton
                                 buttonTitle="Save Changes"
                                 onPress={handleUpdateProfile}
                                 loading={isUpdating}
                                 disabled={isUpdating}
                                 style={styles.saveButton}
                             />
                             <TouchableOpacity onPress={cancelEditProfile} style={styles.cancelButton}>
                                  <Text style={[styles.cancelButtonText, {color: theme.error}]}>Cancel</Text>
                             </TouchableOpacity>
                         </View>
                    )}


                    {/* Account Actions Section */}
                    <View style={[styles.section, styles.actionsSection]}>
                        <Text style={[styles.label, { color: theme.text }]}>Account Actions</Text>
                        {/* Delete Chat Button */}
                        <TouchableOpacity style={[styles.actionButton, { borderColor: theme.error }]} onPress={handleDeleteChat} disabled={isDeletingChat} >
                            {isDeletingChat ? <ActivityIndicator size="small" color={theme.error} style={{ marginRight: 8 }} /> : <Ionicons name="trash-bin-outline" size={20} color={theme.error} style={{ marginRight: 8 }}/>}
                            <Text style={[styles.actionButtonText, { color: theme.error }]}>{isDeletingChat ? "Deleting..." : "Delete Chat History"}</Text>
                        </TouchableOpacity>
                        {/* MOVED: Logout Button */}
                         <TouchableOpacity style={[styles.actionButton, { borderColor: theme.primary, marginTop: 15 }]} onPress={handleLogout} disabled={isLoggingOut} >
                             {isLoggingOut ? <ActivityIndicator size="small" color={theme.primary} style={{ marginRight: 8 }} /> : <Ionicons name="log-out-outline" size={20} color={theme.primary} style={{ marginRight: 8 }}/>}
                             <Text style={[styles.actionButtonText, { color: theme.primary }]}>{isLoggingOut ? "Logging out..." : "Logout"}</Text>
                         </TouchableOpacity>
                    </View>

                    {/* ADDED: Footer Text */}
                    <Text style={[styles.footerText, { color: theme.placeholder }]}>
                        Made with <Text style={{color: theme.error}}>♥</Text> for the world
                    </Text>

                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    // --- Styles ---
    const styles = StyleSheet.create({
        loadingContainer:{flex:1,justifyContent:'center',alignItems:'center'},
        scrollContainer:{flex:1},
        container:{flexGrow:1,padding:20, paddingBottom: 40}, // Ensure padding at bottom for footer
        header:{alignItems:'center',marginBottom:20}, // Reduced margin
        avatar:{width:100,height:100,borderRadius:50,marginBottom:10,backgroundColor:'#E0E0E0',borderWidth:2,borderColor:'#FFF'},
        email:{fontSize:18,fontWeight:'600',marginTop:10,marginBottom:5},
        joinedDate:{fontSize:14,color:'#888'},
        section:{marginBottom:20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee'}, // Add separators
        label:{fontSize:16,fontWeight:'bold',marginBottom:8},
        info:{fontSize:16,lineHeight:22, color: '#333'}, // Default color
        editProfileButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', paddingVertical: 5, paddingHorizontal: 10, marginBottom: 15, borderWidth: 1, borderRadius: 5 },
        editProfileButtonText: { fontSize: 14, fontWeight: '600'},
        editContainer:{marginTop:5}, // Container for input in edit mode
        input:{paddingHorizontal:15,paddingVertical:12,marginBottom:0,height:50,fontSize:16,borderRadius:8,borderWidth:1.5}, // Removed bottom margin from input
        editActionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingBottom: 10 }, // Container for Save/Cancel
        saveButton:{width:'auto',flexGrow:0,paddingHorizontal:30}, // Removed margin
        cancelButton:{paddingVertical:10,paddingHorizontal:20},
        cancelButtonText:{fontSize:16,fontWeight:'600'},
        actionsSection: { borderBottomWidth: 0 }, // Remove border from last section
        actionButton: { // Style for Delete and Logout buttons
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderWidth: 1.5,
            borderRadius: 8,
            // marginTop: 10, // Spacing handled by container/order
        },
        actionButtonText: { // Style for the delete/logout button text
            fontSize: 16,
            fontWeight: '600',
        },
        footerText: { // Style for footer
            marginTop: 30,
            textAlign: 'center',
            fontSize: 12,
        }
    });

    export default ProfileScreen;
    