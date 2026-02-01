# Quick Reference Guide

## Running the App - 3 Easy Steps

### Step 1: Start Emulator
```bash
emulator -avd Pixel_9_API_35
# Wait for it to fully load (shows Android home screen)
```

### Step 2: Install & Start Dev Server
```bash
cd flood-rescue-mobile
npm install              # First time only
npm start               # Starts Expo server
```

### Step 3: Run on Android
```bash
npm run android
# Or manually: expo start --android
```

That's it! The app will open in your Pixel 9 emulator.

---

## Navigation Map

```
Home Screen
├─ Tap SOS Button → SOS Form (3 steps)
│  └─ Step 1: Name & Phone
│  └─ Step 2: Location
│  └─ Step 3: Description
│  └─ Submit → Back to Home
│
└─ Tap Relief Button → Relief Form (5 sections)
   └─ Section 1: Name & Phone
   └─ Section 2: Location
   └─ Section 3: Relief Items
   └─ Section 4: Description
   └─ Section 5: Photos
   └─ Submit → Back to Home
```

---

## File Locations

| File | Purpose |
|------|---------|
| `App.js` | App root & navigation setup |
| `screens/HomeScreen.js` | Home screen with map |
| `screens/ReliefForm.js` | Relief request form |
| `screens/SOSForm.js` | Emergency form |
| `data/mockData.js` | Sample data |
| `constants/theme.js` | Design tokens |

---

## Making Changes

### Change a Form Label
```javascript
// File: screens/ReliefForm.js
// Find this line:
<Text style={styles.label}>Họ và tên</Text>

// Change to:
<Text style={styles.label}>Full Name</Text>
```

### Change a Color
```javascript
// File: constants/theme.js
export const colors = {
  primary: '#0F52BA',  // Change this
  // ...
}
```

### Add a New Input Field
```javascript
// In your form component:
<TextInput
  style={styles.textInput}
  placeholder="Enter something"
  value={formData.field}
  onChangeText={(text) => setFormData({ ...formData, field: text })}
/>
```

---

## Keyboard Shortcuts (Emulator)

| Shortcut | Action |
|----------|--------|
| `Ctrl+M` | Open Dev Menu |
| `R R` | Reload app |
| `Ctrl+Shift+Z` | Open DevTools |
| `Home` | Go to home screen |
| `Back` | Go back |

---

## Common Errors & Fixes

### Error: "Cannot find emulator"
**Fix**: 
```bash
export ANDROID_HOME=~/Android/Sdk
emulator -list-avds
```

### Error: "Port 5037 in use"
**Fix**:
```bash
adb kill-server
```

### Error: "Module not found"
**Fix**:
```bash
npm install
```

### Error: "App won't reload"
**Fix**:
1. Press `Ctrl+M` on emulator
2. Select "Reload"
3. Or: `npm start --clear`

---

## Screen Dimensions (Pixel 9)

- **Resolution**: 1440 x 3120 pixels
- **Aspect Ratio**: 20:9
- **DPI**: 486 ppi
- **Safe Area**: Account for notch/status bar

---

## Design Colors Used

| Element | Color | Hex |
|---------|-------|-----|
| SOS Button | Red | #D32F2F |
| Relief Button | Orange | #F57C00 |
| Navigation | Blue | #0F52BA |
| Success/Submit | Green | #28A745 |
| Border | Light Gray | #DDDDDD |
| Background | Off-White | #F5F5F5 |

---

## Form State Structure

### Relief Form
```javascript
{
  name: "User's name",
  phone: "0912345678",
  address: "Full address",
  selectedItems: [1, 3, 5],      // Relief category IDs
  description: "Additional notes",
  images: []                       // Will hold image data
}
```

### SOS Form
```javascript
{
  name: "User's name",
  phone: "0912345678",
  address: "Full address",
  location: { lat: 21.0285, lng: 105.8542 },
  description: "Emergency description",
  images: []
}
```

---

## Testing Checklist

- [ ] App starts without errors
- [ ] Can navigate Home → SOS Form
- [ ] Can navigate Home → Relief Form
- [ ] Can go back from forms
- [ ] Form fields accept input
- [ ] Buttons respond to taps
- [ ] No red error boxes on screen
- [ ] Text is readable
- [ ] Images load

---

## Hot Reload Usage

1. **Automatic**: Save a file with `Ctrl+S`
2. **Manual**: Press `R` twice in terminal
3. **Full Reload**: Close and re-open app

Changes apply instantly without restarting!

---

## Debugging

### View Console Logs
```bash
# Terminal where you ran "npm start" shows logs
# Or use: 
expo start --localhost
# Then check: http://localhost:19000/
```

### Use React DevTools
```bash
npm install --save-dev @react-native-async-storage/async-storage
# Then press Ctrl+Shift+Z on Android to open DevTools
```

---

## Directory Structure
```
flood-rescue-mobile/
├── App.js                 ← App entry
├── package.json          ← Dependencies
├── app.json              ← Expo config
├── index.js              ← React Native entry
├── screens/              ← UI screens
│   ├── HomeScreen.js
│   ├── ReliefForm.js
│   └── SOSForm.js
├── data/                 ← Mock data
│   └── mockData.js
├── constants/            ← Configuration
│   └── theme.js
├── README.md             ← Overview
├── SETUP.md              ← Setup guide
└── DEVELOPMENT.md        ← Dev notes
```

---

## Important Commands

```bash
# Start development
npm start

# Run on Android
npm run android

# Install dependencies
npm install

# Clear cache and rebuild
npm start --clear

# Check for errors
npm run lint              # (If configured)

# View all available commands
npm run                   # Lists all scripts
```

---

## UI Components Reference

### Header
- Icon + Title
- Notification badge
- User profile avatar

### Form Input
- Icon on left
- Placeholder text
- Focus styles (border + shadow)

### Button Styles
- **Primary**: Orange (#F97316) - Relief button
- **Danger**: Red (#D32F2F) - SOS button
- **Success**: Green (#28A745) - Submit
- **Secondary**: Gray border - Navigation

### Layout Patterns
- SafeAreaView for notches
- ScrollView for long forms
- TouchableOpacity for buttons
- Flexbox for spacing

---

## Performance Tips

1. Use `numColumns={2}` for grids
2. Add `scrollEnabled={false}` to nested scrolls
3. Use `const` for static data
4. Wrap heavy computations in `useMemo`
5. Use `useCallback` for event handlers

---

## Next Steps

1. ✅ **Setup Complete** - App is running
2. 📝 **Test All Screens** - Navigate through forms
3. 🔌 **Connect Backend** - Replace mock data with API
4. 🔐 **Add Authentication** - Login/signup flows
5. 📍 **Add Real Maps** - Integrate Google Maps API
6. 📤 **Implement Upload** - Photo/data submission

---

## Support Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **React Navigation**: https://reactnavigation.org/
- **Material Icons**: https://fonts.google.com/icons

---

**Last Updated**: February 2024  
**Quick Ref v1.0**
