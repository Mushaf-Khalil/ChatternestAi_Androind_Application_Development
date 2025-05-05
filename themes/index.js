
    // themes/index.js

    import { lightColors, darkColors } from './colors';

    // Combine the color palettes into a single themes object
    // This makes it easy to access the correct theme object by name ('light' or 'dark')
    export const themes = {
        light: lightColors,
        dark: darkColors,
    };
    