/**
 * Appearance — Theme: Light, Dark, Automatic (follow system).
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, type ThemePreference } from '../../../contexts/ThemeContext';
import { Fonts, FontSizes, Spacing } from '../../../constants/theme';

const OPTIONS: { value: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
  { value: 'automatic', label: 'Automatic (system)', icon: 'phone-portrait-outline' },
];

export default function AppearanceScreen() {
  const { colors, themePreference, setThemePreference } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
        sectionTitle: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          marginBottom: Spacing.md,
        },
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.lg,
          backgroundColor: colors.card,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: Spacing.sm,
        },
        optionActive: {
          borderColor: colors.primary,
          borderWidth: 2,
          backgroundColor: colors.primaryLight,
        },
        optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
        optionIcon: { marginRight: Spacing.md },
        optionLabel: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
        },
        check: {
          marginLeft: Spacing.sm,
        },
      }),
    [colors]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Choose how the app looks</Text>
      {OPTIONS.map((opt) => {
        const isActive = themePreference === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, isActive && styles.optionActive]}
            onPress={() => setThemePreference(opt.value)}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <Ionicons
                name={opt.icon}
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
                style={styles.optionIcon}
              />
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </View>
            {isActive && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary}
                style={styles.check}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
