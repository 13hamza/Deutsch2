# Deutsch2 🇩🇪 🇬🇧

[![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-000000.svg?style=flat-square&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-v0.86-61DAFB.svg?style=flat-square&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Deutsch2** is a modern, intuitive, and feature-rich German-to-English language learning and translation mobile application built with React Native and Expo (SDK 57).

Designed for learners, travelers, and students, Deutsch2 seamlessly translates German words and sentences, speaks natural audio pronunciations, extracts printed text from photos using OCR camera scanning, and organizes saved vocabulary into flashcards for effective review.

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

- 🔄 **Bidirectional Translation (German ⇄ English)**:
  - Translate single words, full sentences, and common phrases.
  - Multi-tier translation pipeline: Primary Google Translate API / MyMemory API with an expansive offline dictionary fallback.
  - Quick-suggestion chips for common everyday German phrases.

- 📷 **OCR Image Text Extraction**:
  - Scan printed German text from signs, menus, books, or documents using device camera or gallery photos (`expo-image-picker` & OCR engine).

- 🔊 **Text-to-Speech (TTS) Pronunciation**:
  - Listen to authentic German pronunciation and English translations using `expo-speech`.
  - **Interactive Word Breakdown**: Tap individual word pills inside translated sentences to hear just that word pronounced!

- 📚 **Date-Grouped Translation History**:
  - Automatically saves translated phrases locally using `@react-native-async-storage/async-storage`.
  - Grouped by date ("Today", "Yesterday", relative time) with instant live search and single/bulk deletion.

- 🎴 **Flashcard Vocabulary Review**:
  - Filter saved items into single **Words** or full **Sentences**.
  - Expandable flashcards with word count metrics, pronunciation triggers, and quick copy actions.

- 📋 **Clipboard Copy & Feedback**:
  - Quick copy action on all translation cards, history items, and review cards.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (v0.86) with [Expo](https://expo.dev/) (SDK 57)
- **Routing & Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based tab navigation)
- **Language**: TypeScript (`.ts` / `.tsx`)
- **Speech Engine**: [`expo-speech`](https://docs.expo.dev/versions/latest/sdk/speech/)
- **Camera & Gallery**: [`expo-image-picker`](https://docs.expo.dev/versions/latest/sdk/image-picker/)
- **Storage**: [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/)
- **Icons & UI**: `@expo/vector-icons` (Ionicons) & React Native StyleSheet
- **OCR Engine**: OCR.space API (Engine 2 for German umlauts `ä, ö, ü, ß`)

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### 1. Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go) app installed on your physical device (iOS/Android), or an Android Emulator / iOS Simulator.

---

### 2. Clone the Repository

```bash
git clone https://github.com/13hamza/Deutsch2.git
cd Deutsch2
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Start the Development Server

```bash
npm start
```
*Or run `npx expo start`.*

---

### 5. Open the App

Once the development server starts, you will see a QR code and interactive options in your terminal:

- **Physical Device (Android/iOS)**: Scan the QR code using the **Expo Go** app (Android) or native **Camera app** (iOS).
- **Android Emulator**: Press `a` in terminal (or run `npm run android`).
- **iOS Simulator**: Press `i` in terminal (or run `npm run ios`).
- **Web Browser**: Press `w` in terminal (or run `npm run web`).

---

## 📂 Project Architecture

```text
Deutsch2/
├── assets/                  # App icons, splash screens, and visual assets
├── src/
│   └── app/
│       ├── (tabs)/          # Main tab screens (Expo Router)
│       │   ├── _layout.tsx  # Bottom tab navigation bar configuration
│       │   ├── index.tsx    # Translator main screen (German ⇄ English & OCR)
│       │   ├── history.tsx  # Date-grouped translation history screen
│       │   └── review.tsx   # Vocabulary & sentence flashcard review screen
│       ├── components/      # Reusable UI components (TypeScript)
│       │   ├── GermanInput.tsx      # Multiline input with scan & suggestion chips
│       │   ├── TranslationCard.tsx  # Result card with interactive word pills & TTS
│       │   ├── HistoryItem.tsx      # History row component with copy & delete
│       │   ├── Word.tsx             # Word flashcard review card
│       │   └── Sentence.tsx         # Sentence flashcard review card
│       ├── services/        # Business logic & API services
│       │   ├── translator.ts # Multi-tier translation pipeline & offline dictionary
│       │   ├── speech.ts     # Text-To-Speech (TTS) helper module
│       │   └── ocr.ts        # Camera/Gallery image picker & OCR API integration
│       ├── storage/         # Local persistence layer
│       │   └── historyStorage.ts # AsyncStorage CRUD operations
│       ├── types/           # Centralized TypeScript definitions
│       │   └── index.ts      # Interfaces for history, translation, and OCR
│       └── utils/           # Helper utilities
│           └── dateUtils.ts  # Date formatting, grouping, and relative time helpers
├── app.json                 # Expo project configuration
├── package.json             # NPM dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm start` - Starts the Expo development server.
- `npm run android` - Runs the app on a connected Android device/emulator.
- `npm run ios` - Runs the app on the iOS simulator.
- `npm run web` - Runs the app in a web browser.
- `npm run lint` - Runs ESLint to check code formatting and errors.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
