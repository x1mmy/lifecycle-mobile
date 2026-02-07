/**
 * EmptyState — centered icon + title + description + optional CTA.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts, FontSizes, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = '📦',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: Spacing['2xl'],
        },
        icon: { fontSize: 48, marginBottom: Spacing.lg },
        title: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.lg,
          color: colors.textPrimary,
          textAlign: 'center',
          marginBottom: Spacing.sm,
        },
        description: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: Spacing.xl,
        },
        button: { minWidth: 160 },
      }),
    [colors]
  );
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}
