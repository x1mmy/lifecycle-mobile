/**
 * Login Screen — LifeCycle auth (login/signup).
 */

import { useState, useEffect, useMemo } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { router, Link } from 'expo-router';
import { Input } from '../components/ui/Input';
import { Fonts, FontSizes, Spacing, BorderRadius, MIN_TOUCH_TARGET } from '../constants/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, signUp, user } = useAuth();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: Spacing['2xl'],
          paddingVertical: Spacing['4xl'],
        },
        formContainer: { width: '100%' },
        title: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes['4xl'],
          textAlign: 'center',
          marginBottom: Spacing.sm,
          color: colors.textPrimary,
        },
        titlePeriod: { color: colors.primary },
        subtitle: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          textAlign: 'center',
          color: colors.textSecondary,
          marginBottom: Spacing['4xl'],
        },
        modeTitle: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes['2xl'],
          marginBottom: Spacing['2xl'],
          color: colors.textPrimary,
        },
        showPasswordText: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: colors.primary },
        forgotLink: {
          alignSelf: 'flex-end',
          marginBottom: Spacing.md,
          minHeight: MIN_TOUCH_TARGET,
          justifyContent: 'center',
        },
        forgotText: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: colors.primary },
        errorText: {
          fontFamily: Fonts.regular,
          color: colors.destructive,
          fontSize: FontSizes.sm,
          marginBottom: Spacing.md,
          textAlign: 'center',
        },
        button: {
          backgroundColor: colors.primary,
          paddingVertical: Spacing.lg,
          borderRadius: BorderRadius.md,
          alignItems: 'center',
          marginTop: Spacing.sm,
          minHeight: MIN_TOUCH_TARGET,
          justifyContent: 'center',
        },
        buttonDisabled: { backgroundColor: colors.textMuted },
        buttonText: {
          fontFamily: Fonts.medium,
          color: colors.white,
          fontSize: FontSizes.md,
        },
        toggleButton: {
          marginTop: Spacing.lg,
          alignItems: 'center',
          minHeight: MIN_TOUCH_TARGET,
          justifyContent: 'center',
        },
        toggleText: {
          fontFamily: Fonts.medium,
          color: colors.primary,
          fontSize: FontSizes.sm,
        },
      }),
    [colors]
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) router.replace('/(tabs)');
  }, [user]);

  if (user) return null;

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (isSignUp && !businessName.trim()) {
      setError('Please enter your business name');
      return;
    }

    setLoading(true);
    try {
      const result = isSignUp
        ? await signUp(email, password, businessName.trim())
        : await signIn(email, password);

      if (result.error) {
        setError(result.error.message);
      } else if (isSignUp) {
        setError('');
        setIsSignUp(false);
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setBusinessName('');
  };

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
          <Text style={styles.title}>
            LifeCycle<Text style={styles.titlePeriod}>.</Text>
          </Text>
          <Text style={styles.subtitle}>Track expiration dates, reduce waste</Text>

          <Text style={styles.modeTitle}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>

          {isSignUp && (
            <Input
              label="Business name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Business name"
              autoCapitalize="words"
              autoComplete="name"
            />
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete={isSignUp ? 'password-new' : 'password'}
            textContentType={isSignUp ? 'newPassword' : 'password'}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            }
          />

          {!isSignUp && (
            <Link href="/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotLink}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

