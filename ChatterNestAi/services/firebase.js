    // services/firebase.js (with Delete Chat Function)
    import { initializeApp, getApps, getApp } from 'firebase/app';
    import {
        getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot,
        serverTimestamp, doc, setDoc, getDoc, Timestamp, where,
        getDocs, writeBatch, deleteDoc // Ensure all needed functions are imported
    } from 'firebase/firestore';
    import {
        getAuth, initializeAuth, getReactNativePersistence,
        createUserWithEmailAndPassword, signInWithEmailAndPassword,
        signOut, onAuthStateChanged
    } from 'firebase/auth';
    import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
    import {
        FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID
    } from '@env';

    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID
    };
    if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
        console.error("Firebase Service: CRITICAL - Config missing!");
    }

    // --- Initialize Firebase App (Check if already initialized) ---
    let app;
    if (getApps().length === 0) {
        try { app = initializeApp(firebaseConfig); console.log("Firebase Service: New app initialized."); }
        catch (error) { console.error("!!! Firebase Initialization FAILED (initializeApp) !!!", error); app = null; }
    } else { app = getApp(); console.log("Firebase Service: App already initialized. Getting default app..."); }

    // --- Initialize Firestore and Auth ---
    let db = null;
    let auth = null;

    if (app) {
        try {
            db = getFirestore(app);
            console.log("Firebase Service: getFirestore SUCCESS.");

            try {
                 auth = getAuth(app);
                 console.log("Firebase Service: getAuth SUCCESS (already initialized).");
            } catch (error) {
                 console.warn("Firebase Service: getAuth failed (likely needs init), attempting initializeAuth...", error.message);
                 try {
                     auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });
                     console.log("Firebase Service: initializeAuth SUCCESS.");
                 } catch (initAuthError) {
                      console.error("!!! Firebase Service Initialization FAILED (initializeAuth) !!!", initAuthError);
                      auth = null;
                 }
            }

            if (db && auth) {
                 console.log("--- Firebase Services Initialized Successfully (Auth & Firestore) ---");
            } else {
                 console.error("--- Firebase Service Initialization FAILED (db or auth is null) ---");
            }

        } catch (error) {
            console.error("!!! Firebase Service Initialization FAILED (getFirestore/Auth block) !!!", error);
            db = null;
            auth = null;
        }
    } else {
         console.error("Firebase Service: Cannot initialize Firestore/Auth because app initialization failed.");
    }

    // --- Export the potentially null objects ---
    const exportedAuth = auth;
    const exportedDb = db;

    // --- Functions ---

    /**
     * Saves a chat message to Firestore.
     */
    const saveMessage = async (messageData, userId = null) => {
        if (!exportedDb) { console.error("saveMessage: Firestore (db) not initialized."); return null; }
        try {
            const messageToSave = { ...messageData, userId: userId, createdAt: serverTimestamp() };
            const docRef = await addDoc(collection(exportedDb, "chats"), messageToSave);
            // console.log("Message saved with ID: ", docRef.id); // Optional log
            return docRef.id;
        } catch (e) {
            console.error("Error saving message to Firestore: ", e);
            return null;
        }
    };

    /**
     * Subscribes to real-time updates for chat messages FOR A SPECIFIC USER.
     */
    const subscribeToMessages = (userId, callback) => {
        if (!exportedDb) { console.error("subscribeToMessages: Firestore (db) not initialized."); callback([]); return () => {}; }
        if (!userId) { callback([]); return () => {}; }

        // Query to get messages relevant to the user (sent by user, AI to user, or system)
        const q = query(
            collection(exportedDb, "chats"),
            where("userId", "in", [userId, "ChatterNestAI", "system"]),
            orderBy("createdAt", "asc"),
            limit(50) // Limit history length
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((docSnapshot) => {
                const data = docSnapshot.data();
                const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
                messages.push({ id: docSnapshot.id, ...data, createdAt: createdAt });
            });
            // console.log(`Received ${messages.length} messages for userId: ${userId}`); // Optional log
            callback(messages);
        }, (error) => {
            console.error(`subMsgErr (${userId}):`, error); // Keep error log
            // Check if it's the index error specifically
            if (error.code === 'failed-precondition') {
                 console.error("Firestore Index Missing: Please create the required composite index in your Firebase console. The error message usually provides a direct link.");
                 // Optionally, provide a more user-friendly message via the callback if needed
                 // callback([{ id: 'error-msg', sender: 'system', text: 'Error loading messages. Index missing.', createdAt: new Date() }]);
            } else {
                 callback([]); // Return empty list for other errors
            }
        });

        return unsubscribe;
    };

    /**
     * Registers a new user with email and password.
     */
    const signUp = (email, password) => {
        if (!exportedAuth) { return Promise.reject(new Error("signUp: Auth not initialized.")); }
        return createUserWithEmailAndPassword(exportedAuth, email, password);
    };

    /**
     * Logs in an existing user with email and password.
     */
    const logIn = (email, password) => {
        if (!exportedAuth) { return Promise.reject(new Error("logIn: Auth not initialized.")); }
        return signInWithEmailAndPassword(exportedAuth, email, password);
    };

    /**
     * Logs out the current user.
     */
    const logOut = () => {
        if (!exportedAuth) { return Promise.reject(new Error("logOut: Auth not initialized.")); }
        return signOut(exportedAuth);
    };

    /**
     * Attaches a listener for authentication state changes.
     */
    const onAuthStateChangedListener = (callback) => {
        if (!exportedAuth) { console.error("onAuthStateChangedListener: Auth not initialized."); callback(null); return () => {}; }
        return onAuthStateChanged(exportedAuth, callback);
    };

    /**
     * Creates a user profile document in Firestore if it doesn't already exist.
     */
    const createUserProfileDocument = async (userAuth, additionalData = {}) => {
        if (!exportedDb) { console.error("createUserProfile: DB not initialized."); return null; }
        if (!userAuth?.uid) return null;
        const ref = doc(exportedDb, "users", userAuth.uid);
        try {
            const snap = await getDoc(ref);
            if (!snap.exists()) {
                const {email} = userAuth;
                const dn = additionalData.displayName || (email?email.split('@')[0]:'User');
                const profileData = {
                    uid: userAuth.uid,
                    displayName: dn,
                    email,
                    createdAt: serverTimestamp(),
                    ...additionalData
                };
                // Only add photoURL if explicitly provided
                if (additionalData.hasOwnProperty('photoURL')) {
                    profileData.photoURL = additionalData.photoURL;
                } else {
                    profileData.photoURL = null; // Explicitly set to null if not provided
                }
                console.log(`Creating profile for UID: ${userAuth.uid}. photoURL: ${profileData.photoURL}`);
                await setDoc(ref, profileData);
            }
            return ref;
        } catch(e){
            console.error("createProfileErr:", e);
            return null;
        }
    };

    /**
     * Retrieves a user's profile data from Firestore.
     */
    const getUserProfile = async (userId) => {
        if (!exportedDb) { console.error("getUserProfile: DB not initialized."); return null; }
        if (!userId) return null;
        const ref = doc(exportedDb, "users", userId);
        try {
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const d=snap.data();
                const cd=d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date();
                return {id:snap.id,...d,createdAt:cd};
            } else {
                return null;
            }
        } catch(e){
            console.error("getProfileErr:", e);
            return null;
        }
    };

    /**
     * Updates specific fields in a user's profile document.
     */
    const updateUserProfile = async (userId, data) => {
        if (!exportedDb) { console.error("updateUserProfile: DB not initialized."); return false; }
        if (!userId) return false;
        const ref = doc(exportedDb, "users", userId);
        try {
            await setDoc(ref, data, {merge: true});
            return true;
        } catch(e){
            console.error("updateProfileErr:", e);
            return false;
        }
    };

    /**
     * Deletes all chat documents associated with a specific user ID.
     */
    const deleteUserChatHistory = async (userId) => {
        if (!exportedDb) { console.error("deleteUserChatHistory: Firestore (db) not initialized."); return false; }
        if (!userId) { console.error("deleteUserChatHistory: No userId provided."); return false; }

        console.log(`Attempting to delete chat history for userId: ${userId}`);
        // Query to find messages associated with the user
        const userChatQuery = query(collection(exportedDb, "chats"), where("userId", "==", userId));

        try {
            const querySnapshot = await getDocs(userChatQuery);
            if (querySnapshot.empty) {
                console.log(`No chat messages found for user ${userId}. Deletion not needed.`);
                return true; // Success (nothing to delete)
            }

            console.log(`Found ${querySnapshot.size} messages to delete for user ${userId}.`);

            // Use a WriteBatch for efficient deletion
            const batch = writeBatch(exportedDb);
            querySnapshot.forEach((docSnapshot) => {
                batch.delete(docSnapshot.ref);
            });

            console.log(`Committing batch delete for user ${userId}...`);
            await batch.commit();
            console.log(`Successfully deleted chat history for user ${userId}.`);
            return true;

        } catch (error) {
            console.error(`Error deleting chat history for user ${userId}:`, error);
            return false;
        }
    };

    // --- Exports ---
    export {
        exportedAuth as auth,
        exportedDb as db,
        // exportedStorage as storage, // Storage not used in this version
        saveMessage, subscribeToMessages, signUp, logIn, logOut,
        onAuthStateChangedListener, createUserProfileDocument, getUserProfile, updateUserProfile,
        deleteUserChatHistory // Export delete function
    };
    