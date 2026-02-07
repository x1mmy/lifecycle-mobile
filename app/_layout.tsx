/**
 * Root Layout — fonts, auth redirect, providers.
 */

import { useCallback, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { ToastProvider } from '../components/ui/Toast';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Fonts } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (loading) return;

    const inTabs = segments[0] === '(tabs)';
    const onAuthScreen = segments[0] === 'login' || segments[0] === 'forgot-password';

    if (!user && inTabs) {
      router.replace('/login');
      return;
    }
    if (user && onAuthScreen) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: Fonts.medium },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset Password' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [Fonts.regular]: require('../assets/fonts/Satoshi-Regular.ttf'),
    [Fonts.medium]: require('../assets/fonts/Satoshi-Medium.ttf'),
    [Fonts.bold]: require('../assets/fonts/Satoshi-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <ErrorBoundary>
        <ThemeProvider>
          <StatusBarWrapper />
          <AuthProvider>
            <ToastProvider>
              <RootLayoutNav />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
}

function StatusBarWrapper() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}
