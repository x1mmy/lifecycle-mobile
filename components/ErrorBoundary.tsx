/**
 * Error boundary — catch render errors and show fallback.
 */

import React, { Component, ErrorInfo, ReactNode, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Fonts, FontSizes, Spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: Spacing.xl,
          backgroundColor: colors.background,
        },
        title: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes.lg,
          color: colors.textPrimary,
          marginBottom: Spacing.md,
          textAlign: 'center',
        },
        message: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: Spacing.xl,
        },
        button: {
          backgroundColor: colors.primary,
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.lg,
          borderRadius: 8,
        },
        buttonText: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.md,
          color: colors.white,
        },
      }),
    [colors]
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message} numberOfLines={5}>
        {error.message}
      </Text>
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <ErrorFallback error={this.state.error} onReset={this.reset} />
      );
    }
    return this.props.children;
  }
}
