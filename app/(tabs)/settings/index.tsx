/**
 * Settings menu — Account, Business Profile, Notifications, Categories, Sign Out.
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useProfile } from '../../../lib/hooks/useProfile';
import { router } from 'expo-router';
import { Fonts, FontSizes, Spacing } from '../../../constants/theme';

export default function SettingsIndexScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
        section: {
          marginBottom: Spacing.xl,
          backgroundColor: colors.card,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        },
        sectionTitle: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
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
          borderTopColor: colors.borderLight,
        },
        rowLeft: { flexDirection: 'row', alignItems: 'center' },
        rowIcon: { marginRight: Spacing.md },
        label: { fontFamily: Fonts.regular, fontSize: FontSizes.md, color: colors.textPrimary },
        value: { fontFamily: Fonts.regular, fontSize: FontSizes.md, color: colors.textSecondary },
        chevron: { fontFamily: Fonts.regular, fontSize: FontSizes.xl, color: colors.textMuted },
        signOut: {
          marginTop: Spacing.xl,
          padding: Spacing.lg,
          backgroundColor: colors.destructiveLight,
          borderRadius: 8,
          alignItems: 'center',
        },
        signOutText: { fontFamily: Fonts.medium, fontSize: FontSizes.md, color: colors.destructive },
        bottomPad: { height: Spacing['2xl'] },
      }),
    [colors]
  );

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
          onPress={() => router.push('/(tabs)/settings/appearance')}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="color-palette-outline" size={22} color={colors.textSecondary} style={styles.rowIcon} />
            <Text style={styles.label}>Appearance</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/profile')}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="person-outline" size={22} color={colors.textSecondary} style={styles.rowIcon} />
            <Text style={styles.label}>Business Profile</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/notifications')}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} style={styles.rowIcon} />
            <Text style={styles.label}>Notifications</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/categories')}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="folder-outline" size={22} color={colors.textSecondary} style={styles.rowIcon} />
            <Text style={styles.label}>Categories</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push('/(tabs)/settings/feedback')}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.textSecondary} style={styles.rowIcon} />
            <Text style={styles.label}>Feedback</Text>
          </View>
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

