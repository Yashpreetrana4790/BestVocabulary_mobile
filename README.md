# BestVocabulary Mobile App

A React Native mobile application for BestVocabulary, built with Expo. This app provides the same features as the web platform, allowing users to browse words, view definitions, explore categories, and learn vocabulary on iOS and Android devices.

## Features

- **Dictionary**: Browse and search words with detailed definitions
- **Word Details**: View comprehensive word information including meanings, pronunciation, examples, synonyms, and antonyms
- **Categories**: Explore words organized by categories
- **Word of the Day**: Discover new words daily
- **Search**: Quick search functionality for words
- **Offline Support**: Basic offline functionality (future enhancement)

## Tech Stack

- **React Native** with **Expo**
- **React Navigation** for navigation
- **Expo Vector Icons** for icons
- **Expo AV** for audio playback

## Setup Instructions

### Prerequisites

- Node.js (v20.19.4 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)
- For iOS: macOS with Xcode
- For Android: Android Studio and Android SDK

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure the backend API URL in `.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
```

For production, update it to your deployed backend URL:
```
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api/v1
```

### Running the App

#### Development Mode

Start the Expo development server:
```bash
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Scan QR code with Expo Go app on your physical device

#### Android

```bash
npm run android
```

#### iOS (macOS only)

```bash
npm run ios
```

#### Web

```bash
npm run web
```

## Project Structure

```
Bestvocabulary_Mobile/
├── src/
│   ├── components/       # Reusable components
│   │   └── WordCard.js
│   ├── config/          # Configuration files
│   │   └── api.js
│   ├── screens/         # Screen components
│   │   ├── HomeScreen.js
│   │   ├── DictionaryScreen.js
│   │   ├── WordDetailScreen.js
│   │   ├── CategoriesScreen.js
│   │   └── CategoryDetailScreen.js
│   └── services/        # API services
│       ├── api.js
│       ├── wordService.js
│       ├── categoryService.js
│       ├── phrasalVerbService.js
│       └── idiomService.js
├── App.js              # Main app component with navigation
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## API Integration

The app connects to the same backend API as the web platform (`bestvocabulary_backend`). Make sure the backend is running and accessible at the URL specified in `.env`.

### Available Services

- **wordService**: Fetch words, word details, random words
- **categoryService**: Fetch categories, category details, homophones, homonyms, confused words
- **phrasalVerbService**: Fetch phrasal verbs
- **idiomService**: Fetch idioms

## Building for Production

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

Note: You'll need to configure EAS (Expo Application Services) for production builds.

## Development Notes

- The app uses React Navigation for navigation with bottom tabs and stack navigation
- API calls are handled through a centralized service layer
- Components are designed to match the web platform's functionality
- The app supports both light and dark themes (system-based)

## Troubleshooting

1. **Backend Connection Issues**: 
   - Ensure the backend is running
   - Check the API URL in `.env`
   - For physical devices, use your local network IP instead of localhost

2. **Installation Issues**:
   - Clear cache: `npm start -- --clear`
   - Delete `node_modules` and reinstall

3. **Build Issues**:
   - Update Expo CLI: `npm install -g expo-cli@latest`
   - Check Node.js version compatibility

## License

Same as the main BestVocabulary project.

