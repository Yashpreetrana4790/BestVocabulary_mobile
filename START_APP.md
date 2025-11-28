# How to Start and View the Mobile App

## Option 1: See QR Code (Recommended for Mobile Testing)

1. Open a **new terminal** in the project folder:
   ```bash
   cd C:\Users\DigiMantra1\Desktop\BV\Bestvocabulary_Mobile
   ```

2. Run this command:
   ```bash
   npm start
   ```
   OR
   ```bash
   npx expo start
   ```

3. Wait for the QR code to appear in the terminal

4. **To view in browser** (while server is running):
   - Press `w` key in the terminal
   - OR go to: `http://localhost:8081`

## Option 2: Open Directly in Browser

Run this command:
```bash
npm start -- --web
```

This will automatically open your default browser with the app.

## Option 3: View QR Code in Browser

1. Start the server: `npm start`
2. Open browser and go to: `http://localhost:8081`
3. You'll see the Expo Dev Tools with QR code

## Troubleshooting

If you don't see output:
- Make sure you're in the correct folder: `Bestvocabulary_Mobile`
- Check if port 8081 is already in use
- Try: `npm start -- --clear` to clear cache

## View App in Different Ways:

- **Web Browser**: Press `w` or go to `http://localhost:8081`
- **Android Emulator**: Press `a` (requires Android Studio)
- **iOS Simulator**: Press `i` (macOS only, requires Xcode)
- **Physical Device**: Scan QR code with Expo Go app

