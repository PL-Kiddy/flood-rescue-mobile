# Setup Guide - Flood Rescue Mobile App

## Quick Start

### 1. Environment Setup

#### Windows Setup
```bash
# Install Node.js (if not already installed)
# Download from https://nodejs.org/ (v18+)

# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
node --version
npm --version
```

### 2. Android Emulator Setup

#### Option A: Using Android Studio
1. Open Android Studio
2. Go to **Device Manager** (on the right sidebar)
3. Create a new device:
   - Device: Pixel 9
   - System Image: Android 14 (API 35)
   - Name: `Pixel_9_API_35`
4. Click **Play** to start the emulator

#### Option B: Using Command Line
```bash
# Set environment variable (add to your system)
# Windows: Set ANDROID_HOME to your Android SDK location
# Example: C:\Users\YourName\AppData\Local\Android\Sdk

# Start the emulator
$ANDROID_HOME/emulator/emulator -avd Pixel_9_API_35

# Or if using default installation
emulator -avd Pixel_9_API_35
```

### 3. Project Setup

```bash
# Navigate to project directory
cd flood-rescue-mobile

# Install dependencies
npm install

# This will install:
# - React Native
# - Expo
# - React Navigation
# - Material Design Icons
# - And other dependencies
```

### 4. Running the App

#### Terminal 1: Start Expo Development Server
```bash
npm start
```

You should see output like:
```
> Starting development server...
Expo DevTools is running at http://localhost:19000
Android app is running at http://localhost:19001
```

#### Terminal 2: Run on Android Emulator
```bash
# Make sure emulator is running first
npm run android

# Or manually with Expo CLI
expo start --android
```

#### Alternative: Using Expo Go App
1. Start dev server: `npm start`
2. Install **Expo Go** from Google Play Store on your emulated device
3. Scan QR code from terminal with Expo Go
4. App will load and hot-reload

### 5. Verify Installation

After starting, you should see:
- ✅ **Home Screen**: Map view with action buttons
- ✅ **Red SOS Button**: Clickable to navigate to SOS form
- ✅ **Orange Relief Button**: Clickable to navigate to Relief form
- ✅ **Working Navigation**: Back buttons should work
- ✅ **Form Fields**: Input fields should be interactive

## Project Structure

```
flood-rescue-mobile/
├── App.js                          # Main app entry
├── index.js                        # React Native entry
├── package.json                    # Dependencies
├── app.json                        # Expo config
├── README.md                       # Project overview
│
├── screens/
│   ├── HomeScreen.js              # Map + action buttons
│   ├── ReliefForm.js              # Relief request form
│   └── SOSForm.js                 # SOS emergency form
│
├── data/
│   └── mockData.js                # Mock data
│
└── constants/
    └── theme.js                   # Design tokens
```

## Features Implemented

### Screen 1: Home Screen ✅
- Real-time map display
- Header with profile and notifications
- Interactive map controls (zoom +/-, location)
- Emergency SOS button
- Relief request button
- Emergency hotline quick access (113, 114, 115)
- Responsive bottom sheet

### Screen 2: Relief Form ✅
- Header with back button
- Progress indicator (5 steps)
- Section 1: Contact info (Name, Phone)
- Section 2: Location (Auto-location button, Map preview)
- Section 3: Relief items (Checkboxes for 5 categories)
- Section 4: Photo upload
- Submit button with emergency links
- Form validation (ready for implementation)

### Screen 3: SOS Form ✅
- Header with emergency indicator
- 3-step form with progress bar
- Step 1: Contact information
- Step 2: Location with map
- Step 3: Emergency description + photos
- Navigation buttons (Previous, Next, Submit)
- Green submit button for urgency

## Troubleshooting

### Issue: "Cannot find emulator"
```bash
# Ensure emulator path is set
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator

# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_9_API_35
```

### Issue: "Port 5037 already in use"
```bash
# Kill existing adb server
adb kill-server

# Restart adb
adb start-server
```

### Issue: "App doesn't load in emulator"
```bash
# Restart Expo server
npm start

# Kill and restart emulator
adb emu kill
emulator -avd Pixel_9_API_35
```

### Issue: "Node modules not installed"
```bash
# Clear and reinstall
rm -rf node_modules
npm install

# For Windows
rmdir /s node_modules
npm install
```

## Development Workflow

1. **Start Emulator**
   ```bash
   emulator -avd Pixel_9_API_35
   ```

2. **Start Dev Server**
   ```bash
   npm start
   ```

3. **Run on Android**
   ```bash
   npm run android
   ```

4. **Edit & Hot Reload**
   - Edit any `.js` file
   - Save and see changes instantly in emulator
   - Navigate between screens to test

5. **Stop Development**
   - Press `Ctrl + C` in terminal
   - Close emulator

## Next Steps After Setup

1. **Test Navigation**
   - Click SOS button → Should navigate to SOS form
   - Click Relief button → Should navigate to Relief form
   - Click back button → Should return to home

2. **Test Forms**
   - Fill in form fields
   - Try clicking buttons
   - Check form layout on different screen sizes

3. **Backend Integration** (Future)
   - Replace mock data with API calls
   - Implement authentication
   - Setup real map integration
   - Connect to backend server

## Environment Variables (Optional)

Create a `.env` file for configuration:
```
API_URL=http://your-api-url.com
MAPS_API_KEY=your-maps-api-key
NOTIFICATION_TOKEN=your-token
```

## Performance Tips

- Enable Fast Refresh in Expo Dev Tools
- Use `expo prebuild` for native builds
- Monitor bundle size with `expo-bundle-analyzer`
- Profile with React DevTools

## Build for Production (Future)

```bash
# Prebuild native files
expo prebuild

# Build APK
eas build --platform android

# Build and Submit
eas submit --platform android
```

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **React Navigation**: https://reactnavigation.org
- **Material Icons**: https://fonts.google.com/icons

## Common Commands

```bash
# Start development
npm start

# Run on Android
npm run android

# Run on iOS (if on Mac)
npm run ios

# Run on web
npm run web

# Clear cache
expo start --clear

# Reset to baseline
npm install
expo start --clear
```

---

**Last Updated**: February 2024
**App Version**: 1.0.0-beta
**Target**: React Native + Expo + Android API 35
