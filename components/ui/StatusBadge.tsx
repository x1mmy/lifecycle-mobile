/**
 * StatusBadge — product expiry status using status constants.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import { getProductStatus, getStatusLabel, daysUntil, StatusColors } from '../../constants/status';
import type { ProductStatus } from '../../constants/status';

interface StatusBadgeProps {
  expiryDate: string;
}

export function StatusBadge({ expiryDate }: StatusBadgeProps) {
  const status = getProductStatus(expiryDate);
  const days = daysUntil(expiryDate);
  const label = getStatusLabel(status, days);
  const colors = StatusColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.text }]} numberOfLines={1}>
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
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
  },
});
