/**
 * Login Screen — LifeCycle auth (login/signup).
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router, Link } from 'expo-router';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, MIN_TOUCH_TARGET } from '../constants/theme';

export default function LoginScreen() {
  const { signIn, signUp, user } = useAuth();

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
            <TextInput
              style={styles.input}
              placeholder="Business name"
              placeholderTextColor={Colors.textMuted}
              value={businessName}
              onChangeText={setBusinessName}
              autoCapitalize="words"
              autoComplete="name"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete={isSignUp ? 'password-new' : 'password'}
              textContentType={isSignUp ? 'newPassword' : 'password'}
            />
            <TouchableOpacity
              style={styles.showPasswordBtn}
              onPress={() => setShowPassword((p) => !p)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.showPasswordText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

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
              <ActivityIndicator color={Colors.white} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['4xl'],
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes['4xl'],
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
  },
  titlePeriod: {
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: Spacing['4xl'],
  },
  modeTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes['2xl'],
    marginBottom: Spacing['2xl'],
    color: Colors.textPrimary,
  },
  input: {
    fontFamily: Fonts.regular,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
  },
  passwordRow: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 70,
  },
  showPasswordBtn: {
    position: 'absolute',
    right: Spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
  },
  showPasswordText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  forgotText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  errorText: {
    fontFamily: Fonts.regular,
    color: Colors.destructive,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    color: Colors.white,
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
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
});
