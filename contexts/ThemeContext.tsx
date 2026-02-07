/**
 * ThemeContext — Light / Dark / Automatic (system) theme.
 * Preference is stored in AsyncStorage and applied app-wide.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, Fonts, FontSizes, Spacing, BorderRadius, Shadows, type ColorPalette } from '../constants/theme';

const THEME_STORAGE_KEY = '@lifecycle/theme_preference';

export type ThemePreference = 'light' | 'dark' | 'automatic';

const ThemeContext = createContext<{
  colors: ColorPalette;
  isDark: boolean;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('automatic');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((value) => {
      if (value === 'light' || value === 'dark' || value === 'automatic') {
        setThemePreferenceState(value);
      }
    });
  }, []);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
  }, []);

  const resolvedDark =
    themePreference === 'automatic'
      ? systemScheme === 'dark'
      : themePreference === 'dark';
  const colors = resolvedDark ? DarkColors : LightColors;
  const isDark = resolvedDark;

  const value = React.useMemo(
    () => ({ colors, isDark, themePreference, setThemePreference }),
    [colors, isDark, themePreference, setThemePreference]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      colors: LightColors,
      isDark: false,
      themePreference: 'automatic' as ThemePreference,
      setThemePreference: () => {},
    };
  }
  return ctx;
}

export { LightColors, DarkColors, Fonts, FontSizes, Spacing, BorderRadius, Shadows };
export type { ColorPalette } from '../constants/theme';
