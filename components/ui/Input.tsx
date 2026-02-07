/**
 * Input — label, error, focus ring (green), optional icons.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { marginBottom: Spacing.md },
        label: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textPrimary,
          marginBottom: Spacing.xs,
        },
        inputWrap: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        inputWrapFocused: { borderColor: colors.primary, borderWidth: 2 },
        inputWrapError: { borderColor: colors.destructive },
        input: {
          flex: 1,
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.lg,
        },
        inputWithLeft: { paddingLeft: 0 },
        inputWithRight: { paddingRight: 0 },
        leftIcon: { paddingLeft: Spacing.lg },
        rightIcon: { paddingRight: Spacing.lg },
        errorText: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.xs,
          color: colors.destructive,
          marginTop: Spacing.xs,
        },
      }),
    [colors]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          error ? styles.inputWrapError : null,
        ]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeft, rightIcon && styles.inputWithRight, inputStyle]}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
