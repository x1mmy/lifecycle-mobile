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
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, MIN_TOUCH_TARGET } from '../../constants/theme';
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
}

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.border, borderWidth: 1, borderColor: Colors.border },
  destructive: { backgroundColor: Colors.destructive },
  ghost: { backgroundColor: 'transparent' },
};

const variantTextStyles: Record<Variant, TextStyle> = {
  primary: { color: Colors.white },
  secondary: { color: Colors.textPrimary },
  destructive: { color: Colors.white },
  ghost: { color: Colors.primary },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      haptic
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
          color={variant === 'secondary' || variant === 'ghost' ? Colors.primary : Colors.white}
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
