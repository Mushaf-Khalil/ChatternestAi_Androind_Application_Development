    // components/MessageBubble.js
    import React from 'react';
    import { View, Text, StyleSheet, Platform } from 'react-native';
    import { useTheme } from '../contexts/ThemeContext';
    import Markdown from 'react-native-markdown-display';

    const MessageBubble = ({ message }) => {
        const { theme } = useTheme();
        const isUser = message.sender === 'user';
        const isSystem = message.sender === 'system';
        const isAI = message.sender === 'ai';

        const bubbleStyle = isUser ? styles.userBubble : (isSystem ? styles.systemBubble : styles.aiBubble);
        const textStyle = isUser ? styles.userText : (isSystem ? styles.systemText : styles.aiText);
        const alignment = isUser ? styles.userContainer : (isSystem ? styles.systemContainer : styles.aiContainer);

        const themedBubbleStyle = {
            backgroundColor: isUser ? theme.userBubble : (isSystem ? theme.inputBackground : theme.aiBubble),
        };

        // Use the specific dark background hex code from themes/colors.js to check mode
        const isDarkMode = theme.background === '#0D1117';

        // Define styles specifically for the Markdown component
        const markdownStyle = {
             body: { color: theme.text, fontSize: 16 },
             heading1: { color: theme.primary, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
             code_inline: {
                 backgroundColor: theme.codeBackground,
                 // Force bright text for inline code in dark mode too
                 color: isDarkMode ? '#FFFFFF' : theme.codeText,
                 paddingVertical: 1, paddingHorizontal: 4, borderRadius: 4,
                 fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
             },
             // Style for ```code blocks``` by targeting 'pre' and 'code' tags
             pre: {
                 backgroundColor: isDarkMode ? '#111827' : theme.codeBackground, // Keep dark background for dark mode
                 color: isDarkMode ? '#FFFFFF' : theme.codeText,             // Force bright white text for dark mode
                 padding: 12,
                 borderRadius: 4,
                 borderWidth: 1,
                 borderColor: theme.borderColor,
                 marginVertical: 10,
             },
             // Ensure the 'code' tag itself inside the block also gets the bright color
             code: {
                 color: isDarkMode ? '#FFFFFF' : theme.codeText, // Force bright white text for dark mode
                 fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
                 // Background color is inherited from 'pre'
             },
             list_item: { marginBottom: 10, marginVertical: 5 },
             bullet_list_icon: { color: theme.primary, marginRight: 10 },
             ordered_list_icon: { color: theme.primary, marginRight: 10, fontWeight: 'bold' },
             link: { color: theme.primary, textDecorationLine: 'underline' },
             paragraph: { marginTop: 5, marginBottom: 10, }
         };
        const themedTextStyle = { // For non-AI messages
            color: isSystem ? theme.placeholder : theme.text,
        };

        let formattedTime = '';
        if (message.createdAt instanceof Date) {
             formattedTime = message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        }

        return (
            <View style={[styles.container, alignment]}>
                <View style={[styles.bubble, bubbleStyle, themedBubbleStyle]}>
                    {isAI ? (
                        <Markdown style={markdownStyle}>
                            {message.text || ''}
                        </Markdown>
                    ) : (
                        <Text style={[textStyle, themedTextStyle]}>
                            {message.text || ''}
                        </Text>
                    )}
                    {!isSystem && formattedTime && (
                         <Text style={[styles.timestamp, { color: theme.placeholder }]}>
                             {formattedTime}
                         </Text>
                    )}
                </View>
            </View>
        );
    };

    // --- StyleSheet ---
    const styles = StyleSheet.create({
        container: { marginVertical: 5, maxWidth: '85%', flexShrink: 1 }, userContainer: { alignSelf: 'flex-end', marginRight: 10 }, aiContainer: { alignSelf: 'flex-start', marginLeft: 10 }, systemContainer: { alignSelf: 'center', marginHorizontal: 20, maxWidth: '90%' }, bubble: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 18, flexDirection: 'column' }, userBubble: { borderBottomRightRadius: 5 }, aiBubble: { borderBottomLeftRadius: 5 }, systemBubble: { borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 }, userText: { fontSize: 16 }, aiText: { fontSize: 16 }, systemText: { fontSize: 13, fontStyle: 'italic', textAlign: 'center' }, timestamp: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4, marginLeft: 8 },
    });

    export default MessageBubble;
    