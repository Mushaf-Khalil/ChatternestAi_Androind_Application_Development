 // components/ChatInput.js
 import React, { useState } from 'react';
 import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Platform } from 'react-native';
 import { Ionicons } from '@expo/vector-icons'; // Ensure @expo/vector-icons is installed
 import { useTheme } from '../contexts/ThemeContext'; // Adjust path

 // Component for the text input field and send button
 const ChatInput = ({ onSend, disabled = false }) => {
     const [inputText, setInputText] = useState('');
     const { theme } = useTheme();

     // Function to handle sending the message
     const handleSend = () => {
         const trimmedText = inputText.trim();
         if (trimmedText.length > 0 && !disabled) {
             onSend(trimmedText); // Call the callback function passed via props
             setInputText(''); // Clear the input field
             // Keyboard.dismiss(); // Optionally dismiss keyboard (can be annoying sometimes)
         }
     };

     // Determine send button color based on state
     const sendButtonColor = inputText.trim().length > 0 && !disabled
         ? theme.primary // Active color
         : theme.placeholder; // Disabled color

     return (
         // Container view for the input and button
         <View style={[styles.container, { borderTopColor: theme.borderColor, backgroundColor: theme.background }]}>
             {/* Text input field */}
             <TextInput
                 style={[
                     styles.input,
                     {
                         backgroundColor: theme.inputBackground,
                         color: theme.text,
                         borderColor: theme.borderColor, // Use theme border color
                     },
                 ]}
                 value={inputText}
                 onChangeText={setInputText} // Update state on text change
                 placeholder="Type a message..."
                 placeholderTextColor={theme.placeholder} // Use theme placeholder color
                 editable={!disabled} // Disable input when processing (e.g., AI thinking)
                 multiline // Allow multiple lines
                 maxHeight={100} // Limit height increase
             />
             {/* Send button */}
             <TouchableOpacity
                 style={[styles.sendButton, { backgroundColor: sendButtonColor }]} // Dynamic background color
                 onPress={handleSend}
                 disabled={disabled || inputText.trim().length === 0} // Disable if processing or no text
             >
                 {/* Use Ionicons for the send icon */}
                 <Ionicons name="send" size={20} color={theme.text} />
             </TouchableOpacity>
         </View>
     );
 };

 const styles = StyleSheet.create({
     container: {
         flexDirection: 'row', // Align input and button horizontally
         alignItems: 'center', // Align items vertically in the center
         paddingHorizontal: 10,
         paddingVertical: Platform.OS === 'ios' ? 10 : 5, // Adjust padding for different platforms
         borderTopWidth: 1, // Add a top border for separation
     },
     input: {
         flex: 1, // Allow input to take available space
         // height: 40, // Height will grow with multiline
         borderRadius: 20, // Rounded corners
         paddingHorizontal: 15,
         paddingVertical: Platform.OS === 'ios' ? 10 : 8, // Vertical padding inside input
         marginRight: 10, // Space between input and button
         borderWidth: 1, // Add border to input
         fontSize: 16, // Readable font size
         lineHeight: 20, // Adjust line height for multiline
     },
     sendButton: {
         padding: 10,
         borderRadius: 25, // Make it circular
         justifyContent: 'center',
         alignItems: 'center',
         marginLeft: 5, // Add small margin if input margin is removed
         // transition: 'background-color 0.2s ease-in-out', // Smooth color transition (web/CSS only)
     },
 });

 export default ChatInput;
 