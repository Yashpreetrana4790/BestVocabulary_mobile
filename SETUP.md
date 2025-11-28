# BestVocabulary Mobile App - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd Bestvocabulary_Mobile
npm install
```

### 2. Configure Backend URL

Edit `.env` file and set your backend API URL:

```
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Important for Physical Devices:**
- On Android/iOS devices, `localhost` won't work
- Use your computer's local IP address instead
- Example: `EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api/v1`
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

### 3. Start Development Server

```bash
npm start
```

### 4. Run on Device/Emulator

- **Android Emulator**: Press `a` in the terminal or run `npm run android`
- **iOS Simulator** (macOS only): Press `i` in the terminal or run `npm run ios`
- **Physical Device**: 
  - Install "Expo Go" app from App Store/Play Store
  - Scan the QR code shown in terminal
  - Make sure device and computer are on same WiFi network

## Project Structure

```
Bestvocabulary_Mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── WordCard.js      # Word display card
│   ├── config/              # Configuration files
│   │   └── api.js           # API endpoints configuration
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.js    # Home/Dashboard screen
│   │   ├── DictionaryScreen.js      # Word list screen
│   │   ├── WordDetailScreen.js      # Word detail view
│   │   ├── CategoriesScreen.js      # Categories list
│   │   └── CategoryDetailScreen.js  # Category words view
│   └── services/            # API service layer
│       ├── api.js           # Base API service
│       ├── wordService.js   # Word-related API calls
│       ├── categoryService.js       # Category API calls
│       ├── phrasalVerbService.js    # Phrasal verbs API
│       └── idiomService.js          # Idioms API
├── App.js                   # Main app with navigation
├── app.json                 # Expo configuration
└── package.json             # Dependencies

```

## Features

### ✅ Implemented

- **Home Screen**: Word of the day, quick navigation
- **Dictionary**: Browse and search words
- **Word Details**: Full word information, meanings, examples, synonyms/antonyms
- **Categories**: Browse word categories
- **Category Details**: View words in a category
- **Search**: Real-time word search
- **Navigation**: Tab navigation with stack navigation for details

### 🔄 To Be Enhanced

- **Pronunciation Audio**: Currently placeholder, can integrate TTS or audio files
- **Bookmarks/Favorites**: Save words for later
- **Offline Mode**: Cache words for offline access
- **Filters**: Advanced filtering like web platform
- **Phrasal Verbs & Idioms**: Dedicated screens
- **Dark Mode**: Full dark theme support

## API Integration

The app uses the same backend as the web platform:
- **Backend**: `bestvocabulary_backend`
- **API Base URL**: Configured in `.env`
- **Endpoints**: 
  - `/api/v1/words` - Words CRUD
  - `/api/v1/categories` - Categories
  - `/api/v1/phrase` - Phrasal verbs
  - `/api/v1/idioms` - Idioms

## Troubleshooting

### Backend Connection Issues

1. **Check Backend is Running**
   ```bash
   # In bestvocabulary_backend folder
   npm start
   ```

2. **Verify API URL**
   - Check `.env` file
   - For physical devices, use local IP, not localhost

3. **CORS Issues**
   - Ensure backend CORS allows your device IP
   - Check `ALLOWED_ORIGINS` in backend `.env`

### Build Issues

1. **Clear Cache**
   ```bash
   npm start -- --clear
   ```

2. **Reinstall Dependencies**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check Node Version**
   - Requires Node.js v20.19.4 or higher (warnings are OK, but recommended)

### Expo Go Issues

1. **QR Code Not Scanning**
   - Use Tunnel connection: `npm start -- --tunnel`
   - Or manually enter URL in Expo Go

2. **App Not Loading**
   - Check internet connection
   - Restart Expo dev server
   - Clear Expo Go cache

## Development Tips

1. **Hot Reload**: Changes automatically reload (if enabled)

2. **Debugging**: 
   - Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
   - Use React Native Debugger or Chrome DevTools

3. **Testing on Physical Device**:
   - Ensure same WiFi network
   - Firewall may block connection
   - Use tunnel mode if needed

## Next Steps

1. **Enhance UI/UX**: Add animations, better loading states
2. **Add Features**: Bookmarks, favorites, filters
3. **Performance**: Optimize images, implement pagination
4. **Testing**: Add unit tests and integration tests
5. **Production Build**: Configure EAS Build for app store deployment

## Production Deployment

### Android

1. Configure `app.json` with proper package name
2. Build APK/AAB:
   ```bash
   eas build --platform android
   ```
3. Or use `expo build:android` (legacy)

### iOS

1. Configure `app.json` with proper bundle identifier
2. Build IPA:
   ```bash
   eas build --platform ios
   ```
3. Requires Apple Developer account

For detailed deployment instructions, see [Expo Documentation](https://docs.expo.dev/build/introduction/).

