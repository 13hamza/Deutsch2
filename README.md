# Deutsch2 🇩🇪 🇬🇧

**Deutsch2** is an intuitive, feature-rich German-to-English language learning and translation mobile application built with React Native and Expo (SDK 57). It empowers users to translate German words and sentences, listen to accurate speech pronunciations, track translation history, and review vocabulary organized by words and full sentences.

---

## 📱 Download APK

You can download and install the pre-built Android APK directly on your device:

📥 **[Download Deutsch2 APK (Build #56befda5)](https://expo.dev/accounts/ameerhamza3242/projects/Deutsch2/builds/56befda5-ff9e-45f9-9f12-ffd333c20bf7)**

### Installation Instructions for Android:
1. Tap the link above to download the `.apk` file to your Android device.
2. Open the downloaded file.
3. If prompted, allow your browser or file manager to **"Install apps from unknown sources"**.
4. Tap **Install** and open **Deutsch2**.

---

## ✨ Features

- **Instant German to English Translation**:
  - Translates single words, full sentences, and common phrases.
  - Multi-tier translation pipeline: Primary online translation (MyMemory API / Google Translate API) with local fallback dictionary support.
- **Text-to-Speech (TTS) Pronunciation**:
  - Listen to German pronunciation and English translations using `expo-speech`.
- **History Tracking**:
  - Automatically saves translated phrases locally using `@react-native-async-storage/async-storage`.
  - Date-grouped history view with instant search and item deletion.
- **Vocabulary & Sentence Review**:
  - Filter saved items into single **Words** or full **Sentences** for flashcard-style learning and review.
- **Offline Fallback**:
  - Includes a built-in offline dictionary for essential German words and phrases when internet connectivity is limited.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.86) with [Expo](https://expo.dev/) (SDK 57)
- **Routing & Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based tab routing)
- **Speech Engine**: [`expo-speech`](https://docs.expo.dev/versions/latest/sdk/speech/)
- **Storage**: [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/)
- **Icons & UI**: `@expo/vector-icons` & React Native StyleSheet
- **Language**: TypeScript / JavaScript

---

## 🚀 Getting Started (How to Run After Cloning)

Follow these steps to set up and run the project locally on your machine.

### 1. Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go) app installed on your physical device (iOS/Android), or an Android Emulator / iOS Simulator setup on your computer.

---

### 2. Clone the Repository

Clone this project to your local computer and navigate into the project directory:

```bash
git clone https://github.com/13hamza/Deutsch2.git
cd Deutsch2
```

---

### 3. Install Dependencies

Install all required NPM packages:

```bash
npm install
```

---

### 4. Start the Project

Launch the Expo development server:

```bash
npm start
```
*Alternatively, you can run `npx expo start`.*

---

### 5. Open the App

Once the development server starts, you will see a QR code and interactive options in your terminal:

- **Physical Device (Android/iOS)**: Scan the QR code using the **Expo Go** app (Android) or the native **Camera app** (iOS).
- **Android Emulator**: Press `a` in the terminal (or run `npm run android`).
- **iOS Simulator**: Press `i` in the terminal (or run `npm run ios`).
- **Web Browser**: Press `w` in the terminal (or run `npm run web`).

---

## 📂 Project Structure

```text
Deutsch2/
├── assets/                  # App icons, splash screens, and visual assets
├── src/
│   └── app/
│       ├── (tabs)/          # Main tab screens (Translator, History, Review)
│       │   ├── index.tsx    # Translator main screen
│       │   ├── history.tsx  # Translation history screen
│       │   └── review.tsx   # Vocabulary & sentence review screen
│       ├── components/      # Reusable UI components (GermanInput, Word, Sentence, etc.)
│       ├── services/        # Translation & Text-to-Speech service modules
│       ├── storage/         # AsyncStorage persistence logic
│       └── utils/           # Helper functions & formatters
├── app.json                 # Expo configuration
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm start` - Starts the Expo development server.
- `npm run android` - Starts the app on a connected Android device/emulator.
- `npm run ios` - Starts the app on the iOS simulator.
- `npm run web` - Runs the app in a web browser.
- `npm run lint` - Runs ESLint to check code formatting and errors.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](file:///e:/pretended%20tobe%20learning/Andoird/Deutsch2/LICENSE) file for details.
