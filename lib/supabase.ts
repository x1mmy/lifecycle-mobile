/**
 * Supabase Client Configuration
 * 
 * This file sets up the connection to your existing Supabase backend.
 * It's the SAME Supabase instance used by your web app, so all your
 * existing data (products, users, authentication) will be accessible here.
 * 
 * Key concepts:
 * - Supabase is a "Backend as a Service" - it provides database, auth, storage
 * - The client is how your mobile app talks to Supabase
 * - This uses the SAME credentials as your Next.js web app
 */

import 'react-native-url-polyfill/auto'; // Required for Supabase to work in React Native
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Environment Variables
 * 
 * These come from your .env file. They should be the EXACT same values
 * as your web app's NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 
 * Note: In Expo, we use EXPO_PUBLIC_ prefix instead of NEXT_PUBLIC_
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Validate Environment Variables
 * 
 * This checks that you've set up your .env file correctly.
 * If these aren't set, the app won't be able to connect to Supabase.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables! Make sure you have:\n' +
    'EXPO_PUBLIC_SUPABASE_URL\n' +
    'EXPO_PUBLIC_SUPABASE_ANON_KEY\n' +
    'in your .env file'
  );
}

/**
 * Create Supabase Client
 * 
 * This is the main object you'll use to interact with Supabase throughout your app.
 * 
 * Configuration options:
 * - auth.storage: Where to store auth tokens (AsyncStorage = phone's local storage)
 * - auth.autoRefreshToken: Automatically refresh expired tokens
 * - auth.persistSession: Remember user login between app restarts
 * - auth.detectSessionInUrl: Not needed for mobile (only for web OAuth redirects)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use AsyncStorage instead of web's localStorage
    // This stores authentication tokens securely on the device
    storage: AsyncStorage,
    
    // Automatically refresh auth tokens before they expire
    // This keeps users logged in without manual intervention
    autoRefreshToken: true,
    
    // Save the user's session even after closing the app
    // User stays logged in until they explicitly log out
    persistSession: true,
    
    // URL detection is for web OAuth flows (not needed in mobile)
    detectSessionInUrl: false,
  },
});

/**
 * How to use this in your app:
 * 
 * // Import the supabase client
 * import { supabase } from './lib/supabase';
 * 
 * // Fetch data from database
 * const { data, error } = await supabase
 *   .from('products')
 *   .select('*')
 *   .eq('user_id', userId);
 * 
 * // Sign in a user
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Listen to auth state changes (login/logout)
 * supabase.auth.onAuthStateChange((event, session) => {
 *   console.log('Auth event:', event);
 *   console.log('User:', session?.user);
 * });
 */

/**
 * Export Types
 * 
 * If you have database types generated from your Supabase schema,
 * you can import and use them here. This gives you autocomplete
 * and type safety when querying your database.
 * 
 * Example (once you generate types):
 * import { Database } from './database.types';
 * export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {...});
 */
