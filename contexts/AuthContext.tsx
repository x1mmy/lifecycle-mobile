/**
 * Authentication Context Provider
 * 
 * This file creates a React Context that manages user authentication state
 * across your entire app. Think of it as a "global state" for the current user.
 * 
 * Why we need this:
 * - Every screen needs to know if a user is logged in
 * - We don't want to check auth status on every single screen manually
 * - Context lets us access user info from anywhere in the app
 * 
 * This is similar to how you might use Context API in your Next.js web app.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * TypeScript Interface: AuthContextType
 * 
 * Defines what data and functions our auth context will provide.
 * This gives you autocomplete and type safety when using the context.
 */
interface AuthContextType {
  // The current user's session (null if not logged in)
  session: Session | null;
  
  // The current user object (null if not logged in)
  user: User | null;
  
  // Is the app still checking if a user is logged in?
  // (Important for showing loading screens)
  loading: boolean;
  
  // Function to sign in with email/password
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  
  // Function to sign up a new user
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  
  // Function to sign out the current user
  signOut: () => Promise<void>;
}

/**
 * Create the Context
 * 
 * This creates an empty context that will be filled with actual values
 * by the AuthProvider component below.
 */
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

/**
 * AuthProvider Component
 * 
 * This component wraps your entire app and provides authentication state
 * to all child components. It's like a "container" that holds user info.
 * 
 * Usage in your app:
 * <AuthProvider>
 *   <YourApp />
 * </AuthProvider>
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State to store the current session
  // Session contains: user info, access token, refresh token, expiration
  const [session, setSession] = useState<Session | null>(null);
  
  // State to store just the user object (extracted from session for convenience)
  const [user, setUser] = useState<User | null>(null);
  
  // State to track if we're still checking for an existing session
  // This prevents showing login screen briefly before realizing user is logged in
  const [loading, setLoading] = useState(true);

  /**
   * useEffect Hook: Initialize Authentication
   * 
   * This runs once when the app starts. It:
   * 1. Checks if there's an existing session (user already logged in)
   * 2. Sets up a listener for auth state changes (login/logout)
   */
  useEffect(() => {
    // Check for existing session
    // This looks in AsyncStorage for a saved session from previous app use
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false); // We've finished checking
    });

    /**
     * Listen for auth state changes
     * 
     * This listener is triggered whenever:
     * - User logs in
     * - User logs out
     * - Token is refreshed
     * - User session expires
     * 
     * The listener keeps our app's state in sync with Supabase's auth state
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Update our local state with the new session
        setSession(session);
        setUser(session?.user ?? null);
        
        // Log the event for debugging (optional, remove in production)
        console.log('Auth state changed:', _event);
      }
    );

    /**
     * Cleanup function
     * 
     * This runs when the component unmounts (app closes).
     * It removes the auth listener to prevent memory leaks.
     */
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array = run once on mount

  /**
   * Sign In Function
   * 
   * Logs in a user with email and password.
   * Returns an error object if login fails.
   */
  const signIn = async (email: string, password: string) => {
    // Call Supabase auth API
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Return error (or null if successful)
    // The onAuthStateChange listener will automatically update session state
    return { error };
  };

  /**
   * Sign Up Function
   * 
   * Creates a new user account with email and password.
   * Note: By default, Supabase sends a confirmation email.
   * You can disable this in Supabase dashboard if you want instant signups.
   */
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { error };
  };

  /**
   * Sign Out Function
   * 
   * Logs out the current user and clears their session.
   * This removes the auth token from AsyncStorage.
   */
  const signOut = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will automatically set session to null
  };

  /**
   * Provide the context value to all child components
   * 
   * Any component in your app can now access:
   * - session (user's session data)
   * - user (user object with id, email, etc.)
   * - loading (is auth check still in progress?)
   * - signIn, signUp, signOut functions
   */
  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        loading, 
        signIn, 
        signUp, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom Hook: useAuth
 * 
 * This is a convenience hook that makes it easy to access auth context.
 * 
 * Usage in any component:
 * 
 * import { useAuth } from '../contexts/AuthContext';
 * 
 * function MyScreen() {
 *   const { user, loading, signOut } = useAuth();
 *   
 *   if (loading) return <Text>Loading...</Text>;
 *   if (!user) return <Text>Please log in</Text>;
 *   
 *   return (
 *     <View>
 *       <Text>Welcome {user.email}</Text>
 *       <Button onPress={signOut} title="Sign Out" />
 *     </View>
 *   );
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Error handling: Make sure this hook is used inside AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
