// Color Theme Configuration
export const colors = {
  // Primary colors
  primary: '#0F52BA',
  primaryDark: '#0A3D8F',
  
  // Status colors
  sos: '#D32F2F',
  warning: '#F57C00',
  success: '#2E7D32',
  info: '#2196F3',
  
  // Relief theme
  relief: '#F97316',
  reliefDark: '#EA580C',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Background
  background: '#f0f2f5',
  backgroundLight: '#fdf8f6',
  backgroundDark: '#1c1e22',
  
  // Text
  text: '#131416',
  textSecondary: '#666666',
  textTertiary: '#999999',
};

// Typography
export const typography = {
  // Font families
  fontFamily: 'Inter',
  
  // Font weights
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  fontWeightBlack: '900',
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Shadow
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
