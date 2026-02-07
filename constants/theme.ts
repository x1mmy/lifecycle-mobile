/** Light theme palette (default) */
export const LightColors = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: 'rgba(5, 150, 105, 0.12)',
  background: '#F9FAFB',
  card: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  destructive: '#DC2626',
  destructiveLight: '#FEE2E2',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  success: '#10B981',
  successLight: '#D1FAE5',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

/** Dark theme palette */
export const DarkColors = {
  primary: '#34D399',
  primaryDark: '#10B981',
  primaryLight: 'rgba(52, 211, 153, 0.2)',
  background: '#111827',
  card: '#1F2937',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#374151',
  borderLight: '#1F2937',
  destructive: '#F87171',
  destructiveLight: '#7F1D1D',
  warning: '#FBBF24',
  warningLight: '#78350F',
  success: '#34D399',
  successLight: '#064E3B',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

/** Theme color palette type (use useTheme().colors in components for dark mode). */
export type ColorPalette = typeof LightColors;

/** @deprecated Use useTheme().colors instead for dark mode support */
export const Colors = LightColors;

export const Fonts = {
  regular: 'Satoshi-Regular',
  medium: 'Satoshi-Medium',
  bold: 'Satoshi-Bold',
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const MIN_TOUCH_TARGET = 44;
