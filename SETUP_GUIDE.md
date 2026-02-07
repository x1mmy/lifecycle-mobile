# LifeCycle Mobile App - Development Environment Setup

## Overview
This guide will walk you through setting up your development environment for building the LifeCycle mobile app using React Native with Expo. No prior mobile development experience required!

---

## Prerequisites

### 1. Node.js & npm
You'll need Node.js 18+ installed (you likely already have this from your Next.js web app).

**Check your current version:**
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**If you need to install/update:**
- Download from: https://nodejs.org/ (get the LTS version)
- Or use nvm (Node Version Manager) if you prefer version management

---

## Step 1: Install Expo CLI

Expo CLI is the command-line tool for creating and managing Expo projects.

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
```

**What is Expo?**
- Expo is a framework built on top of React Native
- It provides pre-configured tools and services
- Makes mobile development much easier for beginners
- Handles complex native configurations automatically

---

## Step 2: Install EAS CLI

EAS (Expo Application Services) is used for building and deploying your app.

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version
```

**What is EAS?**
- Cloud build service (builds Android APKs without needing Android Studio locally)
- Handles app submissions to app stores
- Provides over-the-air updates (push fixes without app store approval)
- Free tier includes 30 builds per month

---

## Step 3: Set Up Android Development (for testing)

You have two options for testing your app:

### Option A: Physical Android Device (RECOMMENDED for beginners)
This is the easiest way to get started!

1. **Enable Developer Mode on your Android phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to Settings → Developer Options
   - Turn on "USB Debugging"

3. **Install Expo Go app on your phone:**
   - Download "Expo Go" from Google Play Store
   - This app lets you test your app during development

### Option B: Android Emulator (requires more setup)
Only needed if you don't have an Android phone.

1. **Download Android Studio:**
   - Visit: https://developer.android.com/studio
   - Install Android Studio (large download ~1GB)

2. **Set up Android Virtual Device (AVD):**
   - Open Android Studio
   - Go to Tools → Device Manager
   - Create Virtual Device → Choose "Pixel 5" or similar
   - Download a system image (Android 13 recommended)
   - Finish setup

---

## Step 4: Create Expo Account

You'll need an Expo account for building and deploying.

1. **Sign up:**
   - Visit: https://expo.dev/signup
   - Create account (free)

2. **Login via CLI:**
   ```bash
   expo login
   # Or
   eas login
   ```

---

## Step 5: Create Your Project

Now the fun part - creating your LifeCycle mobile app!

```bash
# Navigate to where you want your project
cd ~/projects  # Or wherever you keep your code

# Create new Expo project with TypeScript template
npx create-expo-app lifecycle-mobile --template expo-template-blank-typescript

# Navigate into project
cd lifecycle-mobile
```

**What just happened?**
- Created a new React Native project with Expo
- Set up with TypeScript (same as your web app)
- Installed all necessary dependencies
- Created basic project structure

---

## Step 6: Project Structure Overview

Your new project should look like this:

```
lifecycle-mobile/
├── app/                 # Your app screens (we'll use Expo Router)
├── assets/             # Images, fonts, icons
├── components/         # Reusable React components
├── constants/          # Configuration constants
├── node_modules/       # Dependencies (don't commit to git)
├── app.json           # Expo configuration
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── App.tsx            # Entry point (we'll replace with Expo Router)
```

---

## Step 7: Install Essential Dependencies

Install the packages you'll need for LifeCycle:

```bash
# Navigate to your project directory
cd lifecycle-mobile

# Install Expo Router (for navigation - like Next.js routing)
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Install Supabase client (connects to your existing backend)
npm install @supabase/supabase-js

# Install AsyncStorage (for offline data caching)
npx expo install @react-native-async-storage/async-storage

# Install camera for barcode scanning
npx expo install expo-camera expo-barcode-scanner

# Install secure storage for auth tokens
npx expo install expo-secure-store

# Install notifications
npx expo install expo-notifications expo-device expo-constants

# Environment variables
npm install react-native-dotenv
npx expo install expo-constants
```

**Why each dependency?**
- `expo-router`: File-based routing (just like Next.js!)
- `@supabase/supabase-js`: Connects to your existing Supabase backend
- `@react-native-async-storage/async-storage`: Stores data locally (like localStorage)
- `expo-camera` + `expo-barcode-scanner`: Native barcode scanning
- `expo-secure-store`: Securely stores auth tokens
- `expo-notifications`: Push notifications for expiring products
- `react-native-dotenv`: Manages environment variables

---

## Step 8: Configure Expo Router

Let's set up file-based routing (similar to Next.js):

1. **Update `package.json`:**

Add this to your `package.json`:

```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

2. **Create app directory structure:**

```bash
# Create the app directory (if it doesn't exist)
mkdir -p app

# Create basic route files
touch app/_layout.tsx
touch app/index.tsx
```

---

## Step 9: Set Up Environment Variables

Create your environment configuration:

```bash
# Create .env file in project root
touch .env
```

Add to `.env`:
```env
# Copy these from your existing web app .env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Stripe (for subscription management)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

**Important:**
- Use `EXPO_PUBLIC_` prefix (not `NEXT_PUBLIC_`)
- Never commit `.env` to git (add to `.gitignore`)
- These are the SAME values from your web app

---

## Step 10: Initialize Git

Set up version control:

```bash
# Initialize git repository
git init

# Create .gitignore (if not already created)
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/

# Environment
.env
.env.local

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# macOS
.DS_Store

# IDE
.vscode/
.idea/
EOF

# Make first commit
git add .
git commit -m "Initial commit: LifeCycle mobile app setup"
```

---

## Step 11: Test Your Setup

Let's make sure everything works:

```bash
# Start the development server
npx expo start
```

**What you should see:**
- A QR code in your terminal
- Developer tools in your browser
- Options to open on Android/iOS/web

**To test on your phone:**
1. Open Expo Go app on your Android phone
2. Scan the QR code from your terminal
3. App should load on your phone!

**To test on emulator:**
1. Start Android emulator from Android Studio
2. Press 'a' in the terminal where expo is running
3. App should open in emulator

---

## Step 12: Configure EAS Build

Set up cloud builds (for creating APK files):

```bash
# Configure EAS
eas build:configure
```

This creates `eas.json` with build profiles.

**Modify `eas.json` to match your needs:**

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## Next Steps

You're now ready to start building! Here's what to do next:

### Immediate Next Steps:
1. **Set up Supabase client** - Connect to your existing backend
2. **Create authentication flow** - Login/signup screens
3. **Build basic navigation** - Set up your app's screen structure
4. **Implement barcode scanning** - Core feature for product tracking

### Recommended Learning Resources:
- **Expo Documentation:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Expo Router Docs:** https://expo.github.io/router/docs/

---

## Common Issues & Solutions

### "Expo Go won't connect to dev server"
- Make sure phone and computer are on same WiFi
- Try running `npx expo start --tunnel` (slower but works across networks)

### "Module not found" errors
- Run `npm install` again
- Clear cache: `npx expo start --clear`

### "Build failed" on EAS
- Check `eas.json` configuration
- Verify Expo account is properly linked
- Review build logs in Expo dashboard

### TypeScript errors
- Make sure you have TypeScript installed: `npm install -D typescript @types/react @types/react-native`
- Run `npx tsc --noEmit` to check for type errors

---

## Development Workflow

Your typical development workflow will be:

1. **Make changes** to your code in VS Code/Cursor
2. **Save files** - Expo will auto-reload the app
3. **Test on device** - Check changes immediately
4. **Commit to git** - Save your progress
5. **Build for testing** - Use EAS to create APK when ready

---

## Summary

You now have:
- ✅ Expo CLI installed
- ✅ EAS CLI for cloud builds
- ✅ New project created with TypeScript
- ✅ Expo Router configured (file-based routing)
- ✅ Essential dependencies installed
- ✅ Environment variables set up
- ✅ Git repository initialized
- ✅ Ready to connect to Supabase backend

**You're ready to start building LifeCycle mobile! 🚀**

The next step is to create the basic app structure and connect to your Supabase backend.
