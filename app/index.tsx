/**
 * Home Screen (index.tsx)
 * 
 * This is the main landing screen of your app.
 * In Expo Router, index.tsx is like Next.js's index.tsx - it's the root route.
 * 
 * URL: / (root)
 * 
 * This screen will:
 * 1. Check if user is logged in
 * 2. Show loading state while checking
 * 3. Redirect to login if not authenticated
 * 4. Show main dashboard if authenticated
 */

import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {
  /**
   * Get authentication state from AuthContext
   * 
   * This hook gives us:
   * - user: Current user object (null if not logged in)
   * - loading: Is auth check still in progress?
   * - signOut: Function to log out user
   */
  const { user, loading, signOut } = useAuth();

  /**
   * useEffect: Handle Authentication State
   * 
   * When auth state changes, decide what to do:
   * - If still loading: Do nothing (show loading indicator)
   * - If no user: Redirect to login screen
   * - If user exists: Stay on this screen (they're logged in!)
   */
  useEffect(() => {
    // Don't do anything while still checking auth state
    if (loading) return;

    // No user = not logged in, redirect to login screen
    if (!user) {
      router.replace('/login');
    }
  }, [user, loading]); // Re-run when user or loading changes

  /**
   * Handle Sign Out
   * 
   * When user taps "Sign Out" button:
   * 1. Call signOut() function from AuthContext
   * 2. This clears the session from AsyncStorage
   * 3. onAuthStateChange listener triggers
   * 4. user becomes null
   * 5. useEffect detects null user and redirects to /login
   */
  const handleSignOut = async () => {
    await signOut();
    // No need to manually redirect - useEffect will handle it
  };

  /**
   * Loading State
   * 
   * Show a spinner while checking if user is logged in.
   * This prevents briefly showing login screen before realizing user is logged in.
   */
  if (loading) {
    return (
      <View style={styles.container}>
        {/* ActivityIndicator = spinning loading icon */}
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  /**
   * Not Authenticated State
   * 
   * This briefly shows before redirect to login screen.
   * You could return null here, but showing a message is helpful for debugging.
   */
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Redirecting to login...</Text>
      </View>
    );
  }

  /**
   * Authenticated State
   * 
   * User is logged in! Show the main app content.
   * For now, this is a simple welcome screen.
   * Later, you'll replace this with your product list, dashboard, etc.
   */
  return (
    <View style={styles.container}>
      {/* Welcome message with user's email */}
      <Text style={styles.title}>Welcome to LifeCycle!</Text>
      <Text style={styles.subtitle}>
        Logged in as: {user.email}
      </Text>

      {/* 
        Placeholder content
        Replace this with your actual home screen content:
        - Product list
        - Expiring soon alerts
        - Quick scan button
        - Statistics dashboard
      */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          🎉 Your app is set up!
        </Text>
        <Text style={styles.placeholderSubtext}>
          Start building your LifeCycle mobile app here.
        </Text>
        <Text style={styles.placeholderSubtext}>
          Next steps:
        </Text>
        <Text style={styles.placeholderSubtext}>
          1. Create product list screen
        </Text>
        <Text style={styles.placeholderSubtext}>
          2. Implement barcode scanning
        </Text>
        <Text style={styles.placeholderSubtext}>
          3. Add expiry date notifications
        </Text>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * StyleSheet
 * 
 * React Native uses StyleSheet.create() instead of CSS.
 * It's similar to CSS-in-JS, but optimized for native performance.
 * 
 * Key differences from web CSS:
 * - Use camelCase (backgroundColor, not background-color)
 * - No units needed for most values (they're in "density-independent pixels")
 * - Flexbox is default layout (not block/inline)
 * - No margin collapse like in CSS
 */
const styles = StyleSheet.create({
  // Main container (like body in web)
  container: {
    flex: 1, // Take up all available space
    backgroundColor: '#fff', // White background
    alignItems: 'center', // Center horizontally (flexbox)
    justifyContent: 'center', // Center vertically (flexbox)
    padding: 20, // Padding on all sides
  },

  // Loading text shown with spinner
  loadingText: {
    marginTop: 10, // Space above text
    fontSize: 16,
    color: '#666', // Gray color
  },

  // Main title text
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },

  // Subtitle text (user email)
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },

  // Placeholder content box
  placeholder: {
    backgroundColor: '#f4f4f4', // Light gray background
    padding: 20,
    borderRadius: 12, // Rounded corners
    marginBottom: 30,
    width: '100%', // Full width of container
  },

  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Center text
  },

  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },

  // Sign Out Button
  signOutButton: {
    backgroundColor: '#FF3B30', // Red color (iOS destructive action)
    paddingHorizontal: 30, // Horizontal padding
    paddingVertical: 12, // Vertical padding
    borderRadius: 8, // Rounded corners
    
    // Shadow on iOS (elevation on Android is separate)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
    // Shadow on Android
    elevation: 3,
  },

  signOutButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: '600', // Semi-bold
  },
});

/**
 * React Native Component Basics:
 * 
 * Common components you'll use:
 * - View: Like <div> in web (container)
 * - Text: All text must be in <Text> (unlike web where you can put text anywhere)
 * - TouchableOpacity: Tappable button with opacity feedback
 * - ScrollView: Scrollable container (like overflow: scroll in CSS)
 * - Image: Display images
 * - TextInput: Text input field
 * - ActivityIndicator: Loading spinner
 * - FlatList: Efficient list for long lists (like virtualized list in web)
 * 
 * Key differences from web:
 * - No <div>, <p>, <button> - use React Native components
 * - All text must be in <Text> components
 * - Styling is via StyleSheet, not CSS files
 * - Flexbox is the default layout system
 * - No hover states (it's a touch interface!)
 */
