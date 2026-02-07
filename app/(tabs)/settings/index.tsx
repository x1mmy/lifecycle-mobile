/**
 * Settings menu — Account, Business Profile, Notifications, Categories, Sign Out.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useProfile } from '../../../lib/hooks/useProfile';
import { router } from 'expo-router';
import { Colors, Fonts, FontSizes, Spacing } from '../../../constants/theme';

export default function SettingsIndexScreen() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile(user?.id);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email ?? '—'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/profile')}
        >
          <Text style={styles.label}>Business Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/notifications')}
        >
          <Text style={styles.label}>Notifications</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/categories')}
        >
          <Text style={styles.label}>Categories</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  value: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  chevron: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xl,
    color: Colors.textMuted,
  },
  signOut: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.destructiveLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.destructive,
  },
  bottomPad: {
    height: Spacing['2xl'],
  },
});
