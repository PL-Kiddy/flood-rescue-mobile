# Flood Rescue Mobile App

React Native mobile application for flood rescue coordination and relief management system.

## Features

- **Home Screen (Map View)**: Real-time map with rescue request locations and interactive controls
- **SOS Form**: Emergency rescue form with 3-step process for sending urgent requests
- **Relief Form**: Structured form for requesting supplies and necessities

## Project Structure

```
flood-rescue-mobile/
├── App.js                 # Main app entry point with navigation setup
├── index.js              # React Native entry point
├── package.json          # Project dependencies
├── app.json              # Expo configuration
├── screens/
│   ├── HomeScreen.js     # Main home screen with map and action buttons
│   ├── ReliefForm.js     # Multi-section relief request form
│   └── SOSForm.js        # Step-by-step SOS emergency form
└── data/
    └── mockData.js       # Mock data for development
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Android Studio with Pixel 9 emulator (API 35)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Or manually in Expo Go
expo start --android
```

## Screens Overview

### 1. Home Screen
- Map view showing active rescue requests
- Quick action buttons (SOS, Relief Request)
- Emergency contact numbers
- Notification center
- Real-time location and zoom controls

### 2. SOS Form (Emergency)
- 3-step form process with progress indicator
- Step 1: Contact information
- Step 2: Location selection with map
- Step 3: Emergency description with photo upload
- Green submit button for urgent submission

### 3. Relief Form (Supply Request)
- Multi-section form with progress tracking
- Section 1: Contact information
- Section 2: Location with auto-location button
- Section 3: Relief item categories (checkboxes)
- Section 4: Photo upload
- Emergency hotline links at bottom

## Design System

- **Primary Color**: Orange (#F97316) for Relief, Red (#D32F2F) for SOS, Blue (#0F52BA) for navigation
- **Typography**: Inter font family
- **Icons**: Material Design Icons
- **Styling**: React Native with inline styles

## Mock Data

The app uses mock data stored in `data/mockData.js` including:
- User information
- Rescue requests
- Relief categories
- Emergency numbers

## Development

This is a development version using mock data. To connect to a backend:

1. Replace mock data fetch calls with API requests
2. Update form submission handlers to call your API
3. Implement real-time updates using WebSocket or similar

## Android Emulator Setup

```bash
# Start Pixel 9 emulator with API 35
$ANDROID_HOME/emulator/emulator -avd Pixel_9_API_35

# Verify connection
adb devices

# Run the app
npm run android
```

## Next Steps

- [ ] Implement backend API integration
- [ ] Add real maps integration (Google Maps)
- [ ] Implement user authentication
- [ ] Add push notifications
- [ ] Setup database for request management
- [ ] Implement real-time location tracking
- [ ] Add user profile management
- [ ] Implement request history and status tracking

## License

Proprietary - Flood Rescue Coordination System

## Support

For issues or questions, contact the development team.
