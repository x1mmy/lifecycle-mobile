/**
 * Root Layout Component (_layout.tsx)
 * 
 * In Expo Router, the _layout.tsx file defines the layout for all screens
 * in that directory. This is the ROOT layout, meaning it wraps your entire app.
 * 
 * Think of it like:
 * - Next.js: This is similar to _app.tsx or layout.tsx in app directory
 * - React: This is the outermost component that wraps everything
 * 
 * What happens here:
 * 1. Set up navigation structure (tabs, stack, etc.)
 * 2. Provide global contexts (auth, theme, etc.)
 * 3. Load fonts, initialize services
 * 4. Handle app-wide configuration
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

/**
 * Prevent splash screen from auto-hiding
 * 
 * The splash screen is the image shown when app first opens.
 * We keep it visible until we've finished loading (fonts, auth check, etc.)
 */
SplashScreen.preventAutoHideAsync();

/**
 * RootLayout Component
 * 
 * This is the entry point for your app's UI.
 * Everything in your app will be a child of this component.
 */
export default function RootLayout() {
  /**
   * useEffect: Initialize App
   * 
   * This runs once when the app starts.
   * Perfect place for one-time setup tasks.
   */
  useEffect(() => {
    // Simulate loading time (you can remove this in production)
    // In a real app, you'd wait for fonts, data fetching, etc.
    const prepare = async () => {
      try {
        // Example: Load custom fonts
        // await Font.loadAsync({ ... });
        
        // Example: Check for app updates
        // await checkForUpdates();
        
        // Wait a moment (just for smooth splash screen transition)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn('Error during app initialization:', error);
      } finally {
        // Hide the splash screen - app is ready!
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  return (
    <>
      {/**
       * StatusBar Component
       * 
       * Controls the phone's status bar (time, battery, etc.)
       * - style="auto": Automatically adjusts for light/dark mode
       * - style="light": White text (use on dark backgrounds)
       * - style="dark": Dark text (use on light backgrounds)
       */}
      <StatusBar style="auto" />

      {/**
       * AuthProvider Wrapper
       * 
       * This makes authentication state available to all screens.
       * Now any screen can use useAuth() to get user info.
       */}
      <AuthProvider>
        {/**
         * Stack Navigator
         * 
         * Stack navigation = screens stack on top of each other
         * (like a stack of cards). When you navigate, new screen slides in.
         * 
         * This is perfect for:
         * - Login flow (login -> home)
         * - Product details (list -> detail)
         * - Settings (main -> edit profile)
         * 
         * Alternative navigators:
         * - Tabs: Bottom tabs for main sections (we'll add this later)
         * - Drawer: Side menu drawer
         */}
        <Stack
          screenOptions={{
            /**
             * Default screen options (applied to all screens)
             * 
             * These can be overridden on individual screens.
             */
            
            // Show/hide the header (top bar with back button)
            headerShown: true,
            
            // Header styling
            headerStyle: {
              backgroundColor: '#f4f4f4', // Light gray background
            },
            headerTintColor: '#000', // Black text and icons
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            
            // Animation when screen appears
            animation: 'slide_from_right', // iOS-style slide
            // Other options: 'fade', 'slide_from_bottom', 'none'
          }}
        >
          {/**
           * Screen Definitions
           * 
           * Each Screen component defines a route in your app.
           * The "name" prop corresponds to a file in the app directory.
           * 
           * Example file structure:
           * app/
           *   index.tsx       <- name="index"
           *   login.tsx       <- name="login"
           *   (tabs)/         <- group for tab navigation
           *     products.tsx  <- name="(tabs)/products"
           */}
          
          {/* Home screen (index.tsx) */}
          <Stack.Screen 
            name="index" 
            options={{
              title: 'LifeCycle', // Title shown in header
              // For home screen, you might want to hide back button
              headerLeft: () => null,
            }}
          />
          
          {/* Login screen (login.tsx) */}
          <Stack.Screen 
            name="login" 
            options={{
              title: 'Sign In',
              // Hide header on auth screens for cleaner look
              headerShown: false,
            }}
          />
          
          {/* 
           * Add more screens here as you build them:
           * 
           * <Stack.Screen 
           *   name="product-detail" 
           *   options={{ title: 'Product Details' }}
           * />
           * 
           * <Stack.Screen 
           *   name="scan-barcode" 
           *   options={{ 
           *     title: 'Scan Product',
           *     presentation: 'modal' // Opens as modal instead of push
           *   }}
           * />
           */}
        </Stack>
      </AuthProvider>
    </>
  );
}

/**
 * Navigation Tips:
 * 
 * 1. Navigate to a screen:
 *    import { router } from 'expo-router';
 *    router.push('/login');
 * 
 * 2. Go back:
 *    router.back();
 * 
 * 3. Replace current screen (no back button):
 *    router.replace('/home');
 * 
 * 4. Pass parameters:
 *    router.push('/product-detail?id=123');
 * 
 * 5. Get parameters in screen:
 *    import { useLocalSearchParams } from 'expo-router';
 *    const { id } = useLocalSearchParams();
 */

/**
 * Next Steps:
 * 
 * 1. Create app/index.tsx (home screen)
 * 2. Create app/login.tsx (login screen)
 * 3. Set up tab navigation for main app screens
 * 4. Add protected routes (redirect to login if not authenticated)
 */
