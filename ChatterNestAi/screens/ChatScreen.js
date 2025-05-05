    // screens/ChatScreen.js
    import React, { useState, useEffect, useRef, useCallback } from 'react';
    import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert, Text } from 'react-native';
    import MessageBubble from '../components/MessageBubble';
    import ChatInput from '../components/ChatInput';
    import LoadingIndicator from '../components/LoadingIndicator';
    import { saveMessage, subscribeToMessages } from '../services/firebase';
    import { getOpenAIResponse } from '../services/openai';
    import { useTheme } from '../contexts/ThemeContext';
    import { useAuth } from '../contexts/AuthContext';
    import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

    const ChatScreen = () => {
        const [messages, setMessages] = useState([]);
        const [isLoadingHistory, setIsLoadingHistory] = useState(true);
        const [isAiThinking, setIsAiThinking] = useState(false);
        const flatListRef = useRef(null);
        const { theme } = useTheme();
        const { currentUser } = useAuth();

        // Effect for message subscription
        useEffect(() => {
            let unsubscribe = () => {};
            if (currentUser?.uid) {
                setIsLoadingHistory(true);
                setMessages([]);
                unsubscribe = subscribeToMessages(currentUser.uid, (loadedMessages) => {
                    setMessages(Array.isArray(loadedMessages) ? loadedMessages : []);
                    setIsLoadingHistory(false);
                });
            } else {
                setMessages([]);
                setIsLoadingHistory(false);
                unsubscribe = () => {};
            }
            return () => { unsubscribe(); };
        }, [currentUser]);

        // Effect to scroll to bottom
        useEffect(() => {
            const timer = setTimeout(() => scrollToBottom(), 150);
            return () => clearTimeout(timer);
        }, [messages]);

        const scrollToBottom = (animated = true) => { if (flatListRef.current && messages?.length > 0) try { flatListRef.current.scrollToEnd({ animated }); } catch (e) { console.warn("Scroll error", e); } };

        // Handler for sending messages
        const handleSend = useCallback(async (inputText) => {
            if (!currentUser) { Alert.alert("Not Logged In", "Please log in first."); return; }
            const userId = currentUser.uid;
            const userMessage = { text: inputText, sender: 'user', userId: userId };
            const optimisticMessage = { ...userMessage, id: `temp-${Date.now()}`, createdAt: new Date() };

            setMessages(prev => Array.isArray(prev) ? [...prev, optimisticMessage] : [optimisticMessage]);
            setIsAiThinking(true);
            scrollToBottom(true);

            try {
                saveMessage(userMessage, userId);
                const currentMessages = Array.isArray(messages) ? messages : [];
                const history = currentMessages.slice(-8)
                    .filter(msg => (msg.sender === 'user' || msg.sender === 'ai') && typeof msg.text === 'string' && msg.text.trim().length > 0)
                    .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
                const aiResponseText = await getOpenAIResponse(inputText, history);

                // console.log("------- Raw AI Response Text -------\n", aiResponseText, "\n------------------------------------"); // Keep if needed for debugging

                if (aiResponseText.startsWith("Error:") || aiResponseText.startsWith("API Error")) {
                     console.error("OpenAI Service Error (handled in ChatScreen):", aiResponseText);
                     Alert.alert("AI Error", aiResponseText);
                } else {
                     const aiMessage = { text: aiResponseText, sender: 'ai', userId: userId };
                     saveMessage(aiMessage, userId);
                }
            } catch (error) {
                console.error("Error in handleSend catch block:", error);
                Alert.alert("Error", `An unexpected error occurred: ${error.message}`);
            } finally {
                setIsAiThinking(false);
            }
        }, [messages, currentUser]);

        const messagesToRender = Array.isArray(messages) ? messages : [];

        // --- Render Logic ---
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                style={[styles.container, { backgroundColor: theme.background }]}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 70}
            >
                {isLoadingHistory && currentUser && (
                     <View style={styles.loadingContainer}><LoadingIndicator size="large" text="Loading messages..." /></View>
                )}

                {/* --- MODIFIED Empty State View --- */}
                {!isLoadingHistory && currentUser && messagesToRender.length === 0 && (
                    <View style={styles.emptyContainer}>
                        {/* Add an icon or logo if desired */}
                        <Ionicons name="chatbubbles-outline" size={60} color={theme.placeholder} style={{ marginBottom: 20 }}/>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            Welcome to ChatterNest.AI 
                        </Text>
                        <Text style={[styles.emptyText, { color: theme.placeholder }]}>
                            This is your personal AI assistant. Ask anything, get information, or just chat.
                        </Text>
                        <Text style={[styles.emptyPrompt, { color: theme.primary }]}>
                            What's on your mind?
                        </Text>
                    </View>
                )}
                {/* --- End Modified Empty State View --- */}

                 {!currentUser && !isLoadingHistory && (
                     <View style={styles.emptyContainer}><Text style={[styles.emptyText, { color: theme.placeholder }]}>Please log in to see your chat.</Text></View>
                 )}

                {/* Render list only if user is logged in AND there are messages */}
                {currentUser && messagesToRender.length > 0 && (
                    <FlatList
                        ref={flatListRef} data={messagesToRender} renderItem={({ item }) => <MessageBubble message={item} />} keyExtractor={(item) => item.id}
                        style={styles.messageList} contentContainerStyle={styles.messageListContent}
                        initialNumToRender={15} maxToRenderPerBatch={10} windowSize={10}
                        onLayout={() => scrollToBottom(false)}
                    />
                )}

                {isAiThinking && <LoadingIndicator size="small" text="AI thinking..." />}
                <ChatInput onSend={handleSend} disabled={isAiThinking || !currentUser} />
            </KeyboardAvoidingView>
        );
    };

    // --- Styles --- (Added styles for empty state)
    const styles = StyleSheet.create({
        container:{flex:1},
        loadingContainer:{flex:1,justifyContent:'center',alignItems:'center'},
        emptyContainer:{ // Style the empty container
            flex:1, // Take up available space
            justifyContent:'center',
            alignItems:'center',
            padding: 30, // Add more padding
        },
        emptyTitle: { // Style for the welcome title
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 15,
        },
        emptyText:{ // Style for descriptive text
            fontSize: 16,
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 22, // Improve readability
        },
        emptyPrompt: { // Style for the final prompt
            fontSize: 17,
            fontWeight: '600',
            textAlign: 'center',
        },
        messageList:{flex:1},
        messageListContent:{paddingVertical:10, paddingBottom: 20}
     });

    export default ChatScreen;
    