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
    // export const darkColors = {
    //     background: 'rgba(0, 0, 0, 0.45)',        // Light Indigo/Grey background (Different from light mode)
    //     text: '#000000',              // Black text (as requested)
    //     primary: '#9FA8DA',           // Muted Indigo primary
    //     secondary: '#FFCCBC',         // Light Coral/Peach secondary
    //     // --- Light bubble backgrounds for black text ---
    //     userBubble: '#C5CAE9',        // Lighter Indigo user bubble
    //     aiBubble: '#E8EAF6',          // Matching light background AI bubble (or choose another light color like #FFF9C4 - light yellow)
    //     inputBackground: '#FFFFFF',   // White input background
    //     placeholder: '#546E7A',       // Darker Blue-Grey placeholder
    //     statusBar: 'dark',            // Dark icons needed for light background
    //     borderColor: '#BDBDBD',       // Medium grey border
    //     error: '#D32F2F',             // Standard error red
    //     // --- Code blocks: Black text on light background ---
    //     codeText: '#000000',          // Black text for code
    //     codeBackground: '#CFD8DC',    // Light Blue-Grey background for code
    // };
    
    export const darkColors = {
  // --- Core Dark Theme ---
  background: '#0D0D0D',      // A deep, near-black for the main background
  text: '#FFFFFF',              // Pure white for high-contrast text
  primary: '#1E90FF',          // A vibrant, accessible blue for primary actions and highlights
  secondary: '#00509D',        // A deeper, rich blue for secondary elements or accents

  // --- Dark bubble backgrounds for white text ---
  userBubble: '#003f88',        // A distinct dark blue for user message bubbles
  aiBubble: '#102a43',          // A darker, more muted blue for AI messages, distinct from user and background
  
  inputBackground: '#1A1A1A',  // A very dark grey for input fields, slightly lighter than the main background
  placeholder: '#829ab1',        // A muted, light blue-grey for placeholder text (good contrast on dark input)
  
  statusBar: 'light',           // Ensures status bar icons (time, battery) are light-colored
  borderColor: '#486581',       // A mid-range blue-grey for subtle borders and dividers
  error: '#D32F2F',              // Standard error red, works well on dark backgrounds

  // --- Code blocks: White text on a black background ---
  codeText: '#FFFFFF',          // White text for code for maximum readability
  codeBackground: '#000000',    // Pure black for code blocks, creating a clear "inset" effect
};