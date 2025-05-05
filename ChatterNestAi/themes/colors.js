    // themes/colors.js

    export const lightColors = { // Keeping light theme pastel
        background: '#FAF3E0',        // Light Cream background
        text: '#4A4A4A',              // Dark Grey text
        primary: '#A7C7E7',           // Pastel Blue primary
        secondary: '#FFB347',         // Pastel Orange/Peach secondary
        userBubble: '#D6EAF8',        // Lighter Pastel Blue user bubble
        aiBubble: '#FDEBD0',          // Very light Peach AI bubble
        inputBackground: '#FFFFFF',   // White input
        placeholder: '#9E9E9E',       // Medium grey placeholder
        statusBar: 'dark',
        borderColor: '#E0E0E0',
        error: '#E57373',
        codeText: '#333333',          // Dark text for code
        codeBackground: '#E8E8E8',    // Light grey background for code
    };

    // --- Dark Mode Theme with Light Background & Black Text ---
    export const darkColors = {
        background: 'rgba(0, 0, 0, 0.45)',        // Light Indigo/Grey background (Different from light mode)
        text: '#000000',              // Black text (as requested)
        primary: '#9FA8DA',           // Muted Indigo primary
        secondary: '#FFCCBC',         // Light Coral/Peach secondary
        // --- Light bubble backgrounds for black text ---
        userBubble: '#C5CAE9',        // Lighter Indigo user bubble
        aiBubble: '#E8EAF6',          // Matching light background AI bubble (or choose another light color like #FFF9C4 - light yellow)
        inputBackground: '#FFFFFF',   // White input background
        placeholder: '#546E7A',       // Darker Blue-Grey placeholder
        statusBar: 'dark',            // Dark icons needed for light background
        borderColor: '#BDBDBD',       // Medium grey border
        error: '#D32F2F',             // Standard error red
        // --- Code blocks: Black text on light background ---
        codeText: '#000000',          // Black text for code
        codeBackground: '#CFD8DC',    // Light Blue-Grey background for code
    };
    