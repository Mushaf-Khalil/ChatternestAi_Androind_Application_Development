# ChatterNest AI

**ChatterNest AI** is a beautifully designed React Native (Expo) mobile AI chatbot powered by OpenAI. It supports Firebase authentication and Firestore to manage chat history per user. The app features profile customization and supports both light and dark modes for a seamless user experience.

---

## ✨ Key Features

- 🤖 **AI Chat**  
  Engage in intelligent conversations with an AI assistant powered by OpenAI's GPT models.

- 🔐 **User Authentication**  
  Secure user signup and login with Firebase Authentication (Email/Password).

- 💬 **Persistent Chat History**  
  Chat messages are saved and retrieved from Firestore, personalized per user.

- 👤 **Profile Management**  
  Users can view and edit their display name, age, and gender. Profile data is persistent.

- 🌗 **Theming**  
  Automatically adapts to system light/dark mode preferences.

- 📝 **Markdown Rendering**  
  AI responses can render Markdown syntax including code blocks and lists.

- 🗑️ **Delete Chat History**  
  Users can delete their chat history with a single tap.

---

## 🚀 Technologies Used

### 📱 Frontend
- React Native (with [Expo SDK 52](https://docs.expo.dev/versions/latest/))
- React Navigation (Stack Navigator)
- React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`)

### 🔙 Backend Services
- **Firebase Authentication** (Email/Password)
- **Firebase Firestore** (User and chat storage)
- **OpenAI API** (GPT-based assistant)

### 🎨 UI/UX
- Theme Context for dark/light mode
- Custom components styled with React Native StyleSheet
- App icons & splash screens (configured via `app.json`)

### 🛠 Build Services
- Expo Application Services (EAS Build)
- Secure environment variable handling with `eas secrets`

---

## 🧑‍💻 Setup for Local Development

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ChatterNestAI
