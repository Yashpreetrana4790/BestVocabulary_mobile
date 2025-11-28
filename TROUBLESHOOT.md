# Troubleshooting Blank White Screen

## Quick Fixes:

1. **Stop the server** (Ctrl+C) and restart with cleared cache:
   ```bash
   npm start -- --clear
   ```

2. **Check Browser Console** (F12 → Console tab):
   - Look for any red error messages
   - Share the errors if you see any

3. **Try a different browser**:
   - Chrome
   - Firefox
   - Edge

4. **Check Network Tab** (F12 → Network):
   - Make sure `index.bundle` loads successfully
   - Status should be 200 (not 404 or errors)

5. **Try accessing directly**:
   - Open: `http://localhost:8081` (or whatever port Expo shows)
   - This should show Expo Dev Tools with QR code

## If Still Blank:

The app is currently set to the simplest possible version - just showing "Best Vocabulary App" text. If you still see blank:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Copy and share any errors you see
4. Go to Network tab
5. Refresh page
6. Check if `index.bundle` file loads (should show 200 status)

## Alternative: Test on Phone/Emulator

Instead of web, try:
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

