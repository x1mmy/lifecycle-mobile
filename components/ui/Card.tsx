/**
 * Card — white, border, shadow, optional onPress with scale feedback.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AnimatedPressable } from './AnimatedPressable';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'menuitem' | 'none';
}

export function Card({ children, onPress, style, accessibilityLabel, accessibilityRole }: CardProps) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
          ...Shadows.sm,
        },
      }),
    [colors]
  );
  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        style={[styles.card, style]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole ?? 'button'}
      >
        {children}
      </AnimatedPressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}
