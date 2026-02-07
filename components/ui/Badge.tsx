/**
 * Badge — colored pill (success/warning/destructive/default).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { colors } = useTheme();
  const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
    success: { bg: colors.successLight, text: colors.primaryDark },
    warning: { bg: colors.warningLight, text: colors.warning },
    destructive: { bg: colors.destructiveLight, text: colors.destructive },
    default: { bg: colors.borderLight, text: colors.textSecondary },
  };
  const { bg, text } = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
  },
});
