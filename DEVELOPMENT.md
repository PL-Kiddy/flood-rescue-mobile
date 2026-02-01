# Development Notes

## Project Overview

This is the mobile client for the **Flood Rescue Coordination and Relief Management System**. Currently implemented are the three main screens for the Citizen role using React Native and Expo.

## Current Implementation Status

### ✅ Completed
- **HomeScreen.js** - Map view with emergency quick actions
- **ReliefForm.js** - Relief supply request form
- **SOSForm.js** - Emergency SOS form
- **mockData.js** - Sample data for development
- **Navigation setup** - Screen-to-screen routing
- **UI Design** - Based on provided HTML mockups
- **Responsive Layout** - Works on Pixel 9 API 35

### 📋 TODO (Next Phase)
- Backend API integration
- User authentication & login
- Real Google Maps integration
- Push notifications
- Image upload functionality
- Real-time request status updates
- Request history & tracking
- User profile management
- Multi-language support

## Architecture

### Component Structure
```
App (Root)
├── Navigation Container
└── Stack Navigator
    ├── HomeScreen
    ├── ReliefForm
    └── SOSForm
```

### Data Flow
```
User Action → Screen Component → setFormData → State Update → UI Re-render
```

## Screen Details

### HomeScreen (Home.js)
**Purpose**: Main entry point showing current situation and quick actions
**Key Components**:
- Header with notification badge
- Map view (currently static image)
- Map controls (zoom, location)
- Action buttons (SOS, Relief)
- Emergency contacts
- Warning banner

**Navigation**:
- Tap SOS → Navigate to SOSForm
- Tap Relief → Navigate to ReliefForm
- Tap Emergency numbers → (Future: dial)

**State Management**:
- No state currently (stateless component)
- (Future: Add status updates, notifications)

### ReliefForm (ReliefForm.js)
**Purpose**: Multi-section form for requesting supplies
**Sections**:
1. Contact Information (Name, Phone)
2. Location (Address, Auto-locate, Map)
3. Relief Items (5 checkbox categories)
4. Description & Additional Notes
5. Photo Upload

**Key Features**:
- Progress bar (20% per step visual)
- Checkbox toggle for relief items
- Auto-location button
- Map preview with overlay
- Bottom action bar with emergency links

**State Management** (formData):
```javascript
{
  name: string,
  phone: string,
  address: string,
  selectedItems: array[int],
  description: string,
  images: array[...]
}
```

**Validation** (Ready to implement):
- Phone number format
- At least one relief item selected
- Location provided
- Description length

### SOSForm (SOSForm.js)
**Purpose**: Quick emergency form with step-by-step guidance
**Features**:
- 3-step form process
- Progress indicator showing 1/3, 2/3, 3/3
- Each step has its own UI

**Steps**:
1. **Step 1**: Contact info (Name, Phone - large inputs)
2. **Step 2**: Location (Auto-locate, Address, Map)
3. **Step 3**: Emergency description (Textarea, Photo upload)

**Navigation**:
- Back button (disabled on step 1)
- Next button (steps 1-2)
- Submit button (step 3 - green)

**State Management** (formData):
```javascript
{
  name: string,
  phone: string,
  address: string,
  location: { lat: number, lng: number },
  description: string,
  images: array[...]
}
```

**Color Scheme**:
- Progress bar: Blue (#4277a9)
- Submit button: Green (#28A745)
- Headers: Red (#d32f2f)

## Styling Approach

**Current Method**: Inline StyleSheet with React Native
```javascript
const styles = {
  container: { flex: 1, backgroundColor: '#fff' },
  // ... more styles
}
```

**Why This Approach**:
- No external dependencies needed
- Works well with Expo
- Easy to maintain and modify
- Good performance
- Familiar to most developers

**Future Improvements**:
- Consider Tailwind CSS (via NativeWind)
- Create reusable component library
- Use CSS-in-JS library for animations

## Mock Data Structure

### Mock User
```javascript
{
  id: 'user_001',
  name: 'Nguyễn Văn A',
  phone: '0912345678',
  avatar: 'url...'
}
```

### Mock Rescue Requests
```javascript
{
  id: 'req_001',
  type: 'SOS' | 'Relief',
  title: string,
  severity: 'Critical' | 'High' | 'Medium' | 'Low',
  location: { lat: number, lng: number },
  address: string,
  status: 'New' | 'In Progress' | 'Completed',
  createdAt: ISO 8601 timestamp
}
```

## Key Libraries & Their Usage

| Library | Usage | Version |
|---------|-------|---------|
| react-native | Core framework | 0.74.0 |
| expo | Build system & tools | 51.0.0 |
| @react-navigation/native | Screen navigation | 6.1.6 |
| @react-navigation/native-stack | Stack navigator | 6.9.11 |
| @expo/vector-icons | Material icons | 13.0.0 |
| react-native-screens | Performance optimization | 3.26.0 |
| react-native-safe-area-context | Safe area handling | 4.7.2 |

## Code Examples

### Accessing Navigation
```javascript
function MyScreen({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('SOSForm')}>
      <Text>Go to SOS</Text>
    </TouchableOpacity>
  );
}
```

### Using Form State
```javascript
const [formData, setFormData] = useState({
  name: '',
  phone: '',
});

// Update specific field
setFormData({ ...formData, name: 'New Name' });
```

### Using Icons
```javascript
import { MaterialIcons } from '@expo/vector-icons';

<MaterialIcons name="location_on" size={24} color="#f97316" />
```

### SafeAreaView for Notches
```javascript
import { SafeAreaView } from 'react-native';

<SafeAreaView style={{ flex: 1 }}>
  {/* Content respects notch */}
</SafeAreaView>
```

## Testing Checklist

- [ ] Navigation between screens works
- [ ] Forms accept input correctly
- [ ] Checkboxes toggle on/off
- [ ] Back buttons work
- [ ] Submit buttons accessible
- [ ] Layout looks good on Pixel 9 (1440x3120)
- [ ] No console errors or warnings
- [ ] Images load correctly
- [ ] Text is readable and properly aligned
- [ ] Buttons respond to presses

## Performance Considerations

- ✅ Using `ScrollView` for long forms
- ✅ Static image for map (no real API calls)
- ✅ No animations that might cause jank
- ✅ Efficient state management
- ✅ No unnecessary re-renders (state isolated per screen)

## Known Issues

- Map is static (not interactive - future enhancement)
- Photo upload is UI-only (no backend)
- Geolocation not implemented (future)
- Forms don't persist data (future: implement storage)
- No error handling (future: add try-catch)

## Future Enhancements

### Phase 2: Backend Integration
1. Setup API client
2. Implement authentication
3. Connect forms to backend
4. Add request history

### Phase 3: Advanced Features
1. Real-time map with actual positions
2. Push notifications
3. Image upload to cloud
4. Request tracking
5. User profiles

### Phase 4: Additional Roles
1. Rescue Team screens
2. Coordinator dashboard
3. Manager analytics
4. Admin panel

## Deployment

### Development
```bash
npm start                 # Starts Expo dev server
npm run android          # Runs on emulator
```

### Building
```bash
eas build --platform android   # Build APK/AAB
eas submit --platform android  # Submit to Play Store
```

## Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev/docs/getting-started
- **React Navigation**: https://reactnavigation.org/docs/getting-started
- **Material Design**: https://material.io
- **Vietnamese UX**: Consider RTL and local languages

## Code Style Guidelines

### Naming Conventions
```javascript
// Components (PascalCase)
function HomeScreen() { }

// Functions (camelCase)
function handleSubmit() { }

// Constants (UPPER_SNAKE_CASE)
const API_BASE_URL = 'https://api.example.com'

// State variables (camelCase)
const [formData, setFormData] = useState({})
```

### File Organization
```
screens/
├── HomeScreen.js         # Main screen
├── ReliefForm.js         # Form components
└── SOSForm.js

data/
├── mockData.js           # Mock/static data
└── api.js                # (Future) API calls

constants/
├── theme.js              # Design system
└── config.js             # (Future) Config values

components/              # (Future) Reusable components
├── Button.js
├── Input.js
└── Card.js
```

## Contact & Support

For questions about the codebase:
- Check the inline comments
- Review the SETUP.md for environment issues
- See README.md for project overview

---

**Last Updated**: February 2024  
**Version**: 1.0.0-beta  
**Status**: Active Development
