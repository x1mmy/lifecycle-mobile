/**
 * Root index — redirect: onboarding (first run) → login → (tabs) when authenticated.
 * Branded loader: Lucide Package icon, LifeCycle branding, subtitle.
 */

import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Package } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { Fonts, FontSizes, Spacing } from '../constants/theme';

const ONBOARDING_DONE_KEY = 'onboarding_done';

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (loading) return;
    (async () => {
      const onboardingDone = await AsyncStorage.getItem(ONBOARDING_DONE_KEY);
      if (!onboardingDone) {
        router.replace('/onboarding');
        return;
      }
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    })();
  }, [user, loading]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Package size={64} color={colors.primary} strokeWidth={2} style={styles.logo} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        LifeCycle<Text style={[styles.titlePeriod, { color: colors.primary }]}>.</Text>
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track expiration dates, reduce waste</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes['4xl'],
    marginBottom: Spacing.xs,
  },
  titlePeriod: {},
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    marginBottom: Spacing['2xl'],
  },
  spinner: {
    marginTop: Spacing.lg,
  },
});
