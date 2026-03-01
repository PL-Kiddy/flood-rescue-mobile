// Color Theme Configuration - Bảng màu thống nhất
export const colors = {
  // Primary
  primary: '#0F52BA',
  primaryDark: '#0A3D8F',
  primaryLight: 'rgba(15, 82, 186, 0.08)',

  // Chức năng
  sos: '#C62828',
  sosLight: 'rgba(198, 40, 40, 0.12)',
  relief: '#E65100',
  reliefLight: 'rgba(230, 81, 0, 0.08)',
  success: '#2E7D32',
  successLight: 'rgba(46, 125, 50, 0.12)',
  warning: '#F57C00',
  info: '#1565C0',

  // Neutral
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray50: '#FAFAFA',
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
  background: '#F5F5F5',
  backgroundLight: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceDark: '#1E2125',

  // Text
  text: '#1A1A1A',
  textSecondary: '#616161',
  textTertiary: '#9E9E9E',
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
