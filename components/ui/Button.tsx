/**
 * Button — primary/secondary/destructive/ghost, loading, min 44px height, press scale.
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Fonts, FontSizes, Spacing, BorderRadius, MIN_TOUCH_TARGET } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { AnimatedPressable } from './AnimatedPressable';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'menuitem' | 'none';
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel = title,
  accessibilityRole = 'button',
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const variantStyles: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.border, borderWidth: 1, borderColor: colors.border },
    destructive: { backgroundColor: colors.destructive },
    ghost: { backgroundColor: 'transparent' },
  };
  const variantTextStyles: Record<Variant, TextStyle> = {
    primary: { color: colors.white },
    secondary: { color: colors.textPrimary },
    destructive: { color: colors.white },
    ghost: { color: colors.primary },
  };
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      haptic
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      style={[
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.text, variantTextStyles[variant], textStyle]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
  },
});
