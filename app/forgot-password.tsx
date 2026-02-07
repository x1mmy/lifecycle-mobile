/**
 * Forgot Password — send reset link via email.
 */

import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Link } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { useTheme } from '../contexts/ThemeContext';
import { Fonts, FontSizes, Spacing, BorderRadius, MIN_TOUCH_TARGET } from '../constants/theme';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: Spacing['4xl'] },
        formContainer: { paddingHorizontal: Spacing['2xl'] },
        successIconWrap: { alignItems: 'center', marginBottom: Spacing.lg },
        title: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes['2xl'],
          color: colors.textPrimary,
          marginBottom: Spacing.sm,
        },
        subtitle: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textSecondary,
          marginBottom: Spacing['2xl'],
        },
        errorText: {
          fontFamily: Fonts.regular,
          color: colors.destructive,
          fontSize: FontSizes.sm,
          marginBottom: Spacing.md,
        },
        button: {
          backgroundColor: colors.primary,
          paddingVertical: Spacing.lg,
          borderRadius: BorderRadius.md,
          alignItems: 'center',
          minHeight: MIN_TOUCH_TARGET,
          justifyContent: 'center',
        },
        buttonDisabled: { backgroundColor: colors.textMuted },
        buttonText: {
          fontFamily: Fonts.medium,
          color: colors.white,
          fontSize: FontSizes.md,
        },
        backLink: {
          marginTop: Spacing.lg,
          alignItems: 'center',
          minHeight: MIN_TOUCH_TARGET,
          justifyContent: 'center',
        },
        backText: { fontFamily: Fonts.medium, color: colors.primary, fontSize: FontSizes.sm },
        successTitle: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes.xl,
          color: colors.textPrimary,
          marginBottom: Spacing.md,
        },
        successText: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textSecondary,
          marginBottom: Spacing['2xl'],
        },
      }),
    [colors]
  );

  const handleSendReset = async () => {
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined,
      });
      if (err) {
        setError(err.message);
      } else {
        setSent(true);
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.successIconWrap}>
              <Ionicons name="mail-open" size={64} color={colors.primary} />
            </View>
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successText}>
              We sent a password reset link to {email}. Use it to set a new password.
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.backLink}>
              <Text style={styles.backText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

