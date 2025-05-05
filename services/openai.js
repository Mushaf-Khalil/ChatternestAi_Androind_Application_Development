    // services/openai.js
    import { OPENAI_API_KEY } from '@env'; // Import API key from environment variables

    // --- Constants ---
    const API_URL = 'https://api.openai.com/v1/chat/completions'; // Standard Chat API endpoint
    const MODEL = "gpt-3.5-turbo"; // Or "gpt-4" or other compatible model

    /**
     * Sends a message and chat history to the OpenAI API and returns the AI's response.
     * @param {string} userMessage - The latest message from the user.
     * @param {Array<object>} chatHistory - Array of previous messages [{ sender: 'user'/'ai', text: '...' }].
     * @returns {Promise<string>} The AI's response text or an error message string.
     */
    const getOpenAIResponse = async (userMessage, chatHistory = []) => {
        // --- Input Validation ---
        if (!OPENAI_API_KEY) {
            console.error("OpenAI API Key is missing. Check .env file and babel setup.");
            return "Error: AI service is not configured correctly (Missing API Key).";
        }
        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
            console.error("getOpenAIResponse called with empty or invalid userMessage.");
            return "Error: Invalid input message provided.";
        }

        // --- Prepare API Payload ---
        const systemMessage = { role: "system", content: "You are ChatterNest AI, a helpful and friendly chatbot." };

        // --- THIS IS THE IMPORTANT PART ---
        // Format history AND filter out messages with invalid/null content
        const formattedHistory = chatHistory
            .filter(msg => // <-- Make sure this filter exists!
                // Keep only user/ai messages that have a non-empty string in the 'text' field
                (msg.sender === 'user' || msg.sender === 'ai') &&
                typeof msg.text === 'string' &&
                msg.text.trim().length > 0
            )
            .map(msg => ({ // <-- .map comes AFTER .filter
                role: msg.sender === 'user' ? 'user' : 'assistant', // Map sender to role
                content: msg.text // Now we know msg.text is a valid string here
            }));
        // --- End Important Part ---

        const messagesPayload = [
            systemMessage,
            ...formattedHistory, // Only includes messages with valid string content
            { role: "user", content: userMessage }
        ];

        console.log("Sending to OpenAI (Payload Sample):", JSON.stringify(messagesPayload.slice(-5), null, 2)); // Log sample

        // --- API Call ---
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: messagesPayload,
                })
            });

            const data = await response.json();

            // --- Handle Response ---
            if (!response.ok) {
                console.error('OpenAI API Error Response:', data);
                const errorMessage = data.error?.message || response.statusText || 'Unknown API Error';
                // Return error message string for ChatScreen to handle
                return `API Error (${response.status}): ${errorMessage}`;
            }

            if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
                const aiResponse = data.choices[0].message.content.trim();
                console.log("Received from OpenAI:", aiResponse.substring(0, 100) + '...');
                return aiResponse;
            } else {
                console.error("Invalid response structure from OpenAI:", data);
                return 'Error: Could not parse response from AI (Invalid structure).';
            }

        } catch (error) {
            console.error("Error calling OpenAI API (fetch failed):", error);
            // Return error message string
            return `Sorry, an error occurred communicating with the AI: ${error.message}`;
        }
    };

    // Export the function for use in other parts of the app
    export { getOpenAIResponse };
    