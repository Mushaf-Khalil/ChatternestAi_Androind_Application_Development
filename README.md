# ChatterNest AI

**ChatterNest AI** is a beautifully designed React Native (Expo) mobile AI chatbot powered by OpenAI. It supports Firebase authentication and Firestore to manage chat history per user. The app features profile customization and supports both light and dark modes for a seamless user experience.

---

## ✨ Key Features

- **AI Chat**: Engage in intelligent conversations with an AI assistant powered by OpenAI's GPT models.
- **User Authentication**: Secure user signup and login with Firebase Authentication (Email/Password).
- **Persistent Chat History**: Chat messages are saved and retrieved from Firestore, personalized per user.
- **Profile Management**: Users can view and edit their display name, age, and gender. Profile data is persistent.
- **Theming**: Automatically adapts to system light/dark mode preferences.
- **Markdown Rendering**: AI responses can render Markdown syntax including code blocks and lists.
- **Delete Chat History**: Users can delete their chat history with a single tap.

---

## 🚀 Technologies Used

### 📱 Frontend
- React Native (Expo SDK 52)
- React Navigation (Stack Navigator)
- React Hooks

### 🔙 Backend Services
- Firebase Authentication (Email/Password)
- Firebase Firestore (User and chat storage)
- OpenAI API (GPT-based assistant)

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
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
cp .env.example .env
```

Fill in your Firebase and OpenAI configuration keys:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_api_key
```

### 4. Configure Firebase

- Go to [Firebase Console](https://console.firebase.google.com)
- Create a new project
- Enable:
  - Authentication > Email/Password
  - Firestore Database (start in test mode or secure rules)
- Copy Firebase config into your `.env` file

### 5. Run the App

```bash
npx expo start -c
```

Then:
- Press `a` for Android (Expo Go required)
- Press `i` for iOS (macOS only)
- Press `w` to open in browser

---

## 🔐 Firebase Security Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📦 Building the APK (Standalone App)

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to EAS

```bash
eas login
```

### 3. Configure the Project

```bash
eas build:configure
```

Select **Android** when prompted.

### 4. Add Secrets

```bash
eas secret:create --scope project --name FIREBASE_API_KEY --value your_firebase_key
eas secret:create --scope project --name OPENAI_API_KEY --value your_openai_key
```

### 5. Create `eas.json`

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "FIREBASE_API_KEY": "${FIREBASE_API_KEY}",
        "OPENAI_API_KEY": "${OPENAI_API_KEY}"
      }
    }
  }
}
```

### 6. Build the APK

```bash
eas build -p android --profile preview
```

### 7. Download & Install

After the build completes, download the `.apk` and install it on your device.

---

## 🧠 Folder Structure

```
ChatterNestAI/
├── components/
│   ├── ChatBubble.js
│   ├── InputBox.js
│   └── ProfileCard.js
├── screens/
│   ├── HomeScreen.js
│   ├── ChatScreen.js
│   ├── ProfileScreen.js
│   └── LoginScreen.js
├── services/
│   ├── firebase.js
│   └── openai.js
├── themes/
│   └── colors.js
├── .env.example
├── App.js
├── app.json
└── README.md
```

---

### Made with ❤️ by developers who believe in the power of AI and mobile technology.  
## Turn your thoughts into intelligent conversations — anywhere, anytime.

> “The best way to predict the future is to create it.” – Alan Kay
