/**
 * Badge — colored pill (success/warning/destructive/default).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';

type BadgeVariant = 'success' | 'warning' | 'destructive' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: Colors.successLight, text: Colors.primaryDark },
  warning: { bg: Colors.warningLight, text: Colors.warning },
  destructive: { bg: Colors.destructiveLight, text: Colors.destructive },
  default: { bg: Colors.borderLight, text: Colors.textSecondary },
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
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
