/**
 * Login Screen (login.tsx)
 * 
 * This screen handles user authentication (login and signup).
 * Users who are not authenticated will be redirected here from the home screen.
 * 
 * Features:
 * - Email/password login
 * - Email/password signup
 * - Toggle between login and signup modes
 * - Error handling and display
 * - Loading states
 * 
 * URL: /login
 */

import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  /**
   * Get authentication functions from context
   * 
   * signIn and signUp are functions we defined in AuthContext
   * user tells us if someone is already logged in
   */
  const { signIn, signUp, user } = useAuth();

  /**
   * Component State
   * 
   * React hooks to manage form data and UI state
   */
  
  // Form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Is this login mode or signup mode?
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Is the form currently submitting?
  const [loading, setLoading] = useState(false);
  
  // Error message to display
  const [error, setError] = useState('');

  /**
   * If user is already logged in, redirect to home
   * 
   * This prevents logged-in users from seeing the login screen
   * if they navigate directly to /login
   */
  if (user) {
    router.replace('/');
    return null; // Don't render anything while redirecting
  }

  /**
   * Handle Form Submission
   * 
   * This function is called when user taps "Sign In" or "Sign Up" button
   */
  const handleSubmit = async () => {
    // Clear any previous error messages
    setError('');

    /**
     * Form Validation
     * 
     * Check that user filled in both fields before submitting
     */
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email format validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    /**
     * Show loading state
     * 
     * This disables the button and shows a spinner while
     * we wait for Supabase to respond
     */
    setLoading(true);

    try {
      /**
       * Call appropriate auth function based on mode
       * 
       * isSignUp determines if we're creating a new account
       * or logging into an existing one
       */
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        /**
         * Authentication Error Handling
         * 
         * Supabase returns helpful error messages we can show to users:
         * - "Invalid login credentials" - wrong email/password
         * - "User already registered" - email already exists
         * - "Email not confirmed" - user needs to verify email
         */
        setError(error.message);
      } else {
        /**
         * Success!
         * 
         * If no error, user is now authenticated.
         * The AuthContext's onAuthStateChange listener will:
         * 1. Detect the new session
         * 2. Update the user state
         * 3. Trigger redirect to home screen (via useEffect in index.tsx)
         * 
         * For signup with email confirmation enabled:
         * Show a message telling user to check their email
         */
        if (isSignUp) {
          Alert.alert(
            'Account Created!',
            'Please check your email to confirm your account.',
            [{ text: 'OK' }]
          );
          // Switch to login mode so they can sign in after confirming
          setIsSignUp(false);
        }
        // If login was successful, redirect happens automatically
      }
    } catch (err: any) {
      /**
       * Unexpected Error Handling
       * 
       * Catch any errors that weren't caught by Supabase
       * (network issues, etc.)
       */
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      /**
       * Always turn off loading state
       * 
       * This runs whether we succeeded or failed,
       * so the button becomes clickable again
       */
      setLoading(false);
    }
  };

  /**
   * Toggle between Login and Sign Up modes
   * 
   * Clears form and errors when switching
   */
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(''); // Clear any error messages
    setEmail(''); // Clear email field
    setPassword(''); // Clear password field
  };

  return (
    /**
     * KeyboardAvoidingView
     * 
     * This component automatically adjusts when keyboard appears,
     * so your form doesn't get hidden behind the keyboard.
     * 
     * behavior="padding": Adds padding to push content up (best for most forms)
     * Platform.OS === 'ios': Different behavior for iOS vs Android
     */
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        {/* App Title */}
        <Text style={styles.title}>LifeCycle</Text>
        <Text style={styles.subtitle}>
          Track expiration dates, reduce waste
        </Text>

        {/* Mode indicator */}
        <Text style={styles.modeTitle}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>

        {/**
         * Email Input Field
         * 
         * TextInput is React Native's text input component
         */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail} // Updates email state on each keystroke
          autoCapitalize="none" // Don't auto-capitalize email
          keyboardType="email-address" // Show @ symbol on keyboard
          autoComplete="email" // Browser can suggest saved emails
          textContentType="emailAddress" // iOS autofill
        />

        {/**
         * Password Input Field
         */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Hide password text (shows ••••)
          autoCapitalize="none"
          autoComplete={isSignUp ? 'password-new' : 'password'}
          textContentType={isSignUp ? 'newPassword' : 'password'}
        />

        {/**
         * Error Message Display
         * 
         * Only shown when there's an error
         */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {/**
         * Submit Button (Sign In / Sign Up)
         * 
         * TouchableOpacity provides visual feedback when tapped
         * Disabled when loading to prevent double-submission
         */}
        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled, // Gray out when loading
          ]}
          onPress={handleSubmit}
          disabled={loading} // Can't tap while loading
        >
          {loading ? (
            // Show spinner while submitting
            <ActivityIndicator color="#fff" />
          ) : (
            // Show button text
            <Text style={styles.buttonText}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        {/**
         * Toggle Mode Link
         * 
         * "Don't have an account? Sign up" or "Already have an account? Sign in"
         */}
        <TouchableOpacity 
          onPress={toggleMode}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>

        {/**
         * Optional: Social Login Buttons
         * 
         * You can add Google/Apple login here later.
         * Supabase supports OAuth providers.
         * 
         * Example:
         * <TouchableOpacity style={styles.googleButton}>
         *   <Text>Continue with Google</Text>
         * </TouchableOpacity>
         */}
      </View>
    </KeyboardAvoidingView>
  );
}

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  formContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    paddingHorizontal: 30, // Side padding
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },

  modeTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#000',
  },

  /**
   * Input Field Style
   * 
   * Common styling for text inputs
   */
  input: {
    backgroundColor: '#f4f4f4', // Light gray background
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    
    // Border
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  /**
   * Error Message
   * 
   * Red text to show validation/auth errors
   */
  errorText: {
    color: '#FF3B30', // iOS red
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },

  /**
   * Primary Action Button
   */
  button: {
    backgroundColor: '#007AFF', // iOS blue
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
    // Shadow (Android)
    elevation: 3,
  },

  /**
   * Disabled Button State
   * 
   * Gray out button when loading
   */
  buttonDisabled: {
    backgroundColor: '#999',
    elevation: 0, // Remove shadow when disabled
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  /**
   * Toggle Mode Button
   * 
   * Text link to switch between login/signup
   */
  toggleButton: {
    marginTop: 16,
    alignItems: 'center',
  },

  toggleText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

/**
 * Next Steps for This Screen:
 * 
 * 1. Add "Forgot Password" link
 *    - Calls supabase.auth.resetPasswordForEmail()
 * 
 * 2. Add social login (Google)
 *    - Calls supabase.auth.signInWithOAuth({ provider: 'google' })
 * 
 * 3. Add terms & privacy policy links
 *    - Required for app store submission
 * 
 * 4. Add password strength indicator
 *    - Show weak/medium/strong as user types
 * 
 * 5. Add "Remember Me" toggle
 *    - Configure session persistence duration
 */
