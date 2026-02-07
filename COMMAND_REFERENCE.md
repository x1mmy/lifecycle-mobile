# LifeCycle Mobile - Command Reference Guide

## 🚀 Quick Command Reference

This is a quick reference for the most common commands you'll use while developing your LifeCycle mobile app.

---

## Development Commands

### Starting the Development Server

```bash
# Start Expo dev server (shows QR code)
npm start
# OR
npx expo start

# Start with specific platform
npm run android    # Opens in Android emulator
npm run ios        # Opens in iOS simulator (Mac only)
npm run web        # Opens in web browser

# Start with options
npx expo start --clear        # Clear cache before starting
npx expo start --tunnel       # Use tunnel (works across networks)
npx expo start --localhost    # Use localhost (faster, same network only)
npx expo start --android      # Open Android emulator automatically
```

### Installing Dependencies

```bash
# Install a package (generic npm package)
npm install package-name

# Install Expo-specific package (handles version compatibility)
npx expo install package-name

# Install multiple packages
npx expo install package-1 package-2 package-3

# Install dev dependency
npm install -D package-name

# Update all dependencies
npx expo install --fix
```

### Common Package Installations

```bash
# Camera and barcode scanning
npx expo install expo-camera expo-barcode-scanner

# Storage
npx expo install @react-native-async-storage/async-storage
npx expo install expo-secure-store

# Notifications
npx expo install expo-notifications expo-device

# Navigation
npx expo install expo-router react-native-safe-area-context react-native-screens

# Supabase
npm install @supabase/supabase-js
```

---

## Expo Account & Authentication

```bash
# Log in to your Expo account
expo login
# OR
eas login

# Log out
expo logout

# Check who you're logged in as
expo whoami
```

---

## Building Your App

### EAS Build Commands

```bash
# Configure EAS (first time only - creates eas.json)
eas build:configure

# Build for Android (development build)
eas build --platform android --profile development

# Build for Android (preview - APK for testing)
eas build --platform android --profile preview

# Build for Android (production - AAB for Play Store)
eas build --platform android --profile production

# Build for iOS (requires Mac + Xcode for some features)
eas build --platform ios --profile production

# Build for both platforms
eas build --platform all

# Check build status
eas build:list
```

### Local Development Builds

```bash
# Create a development build locally (if you have Android Studio)
npx expo run:android

# Install and run development build
npx expo install expo-dev-client
npx expo run:android
```

---

## Testing on Devices

### Physical Device (Easiest)

1. Install Expo Go app from Google Play Store
2. Run `npm start`
3. Scan QR code with Expo Go app
4. App loads on your phone!

```bash
# Start with tunnel (if QR scan not working)
npx expo start --tunnel
```

### Android Emulator

```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33

# Or just press 'a' in Expo dev server terminal
# (after running npm start)
```

---

## Publishing & Distribution

### Over-the-Air (OTA) Updates

```bash
# Configure EAS Update (first time)
eas update:configure

# Publish an update (pushes JS changes without new build)
eas update --branch production --message "Fixed bug in product list"

# Different branches
eas update --branch development
eas update --branch staging
eas update --branch production

# Check update status
eas update:list
```

### Submit to App Stores

```bash
# Submit latest build to Google Play Store
eas submit --platform android --latest

# Submit specific build
eas submit --platform android --id BUILD_ID

# Submit to Apple App Store
eas submit --platform ios --latest

# Auto-submit after build
eas build --platform android --profile production --auto-submit
```

---

## Managing Environment & Secrets

```bash
# View environment variables for a build profile
eas env:list

# Set an environment variable
eas env:create VARIABLE_NAME="value" --profile production

# Delete an environment variable
eas env:delete VARIABLE_NAME --profile production

# Pull environment variables from EAS
eas env:pull .env.production
```

---

## Debugging & Development

### Debugging

```bash
# Open React DevTools in browser
npm start
# Then press 'd' in terminal

# Open element inspector
# Shake device OR press Cmd+D (iOS) / Cmd+M (Android)

# Enable remote debugging
# In dev menu, select "Debug Remote JS"
# Opens debugger in Chrome DevTools
```

### Logs & Diagnostics

```bash
# View Android logs
npx react-native log-android

# View iOS logs (Mac only)
npx react-native log-ios

# Clear Metro bundler cache
npx expo start --clear

# Reset everything (nuclear option)
rm -rf node_modules
rm package-lock.json
npm install
npx expo start --clear
```

### TypeScript

```bash
# Check TypeScript errors (without running app)
npx tsc --noEmit

# Watch mode (auto-check on file changes)
npx tsc --noEmit --watch
```

---

## Database & Backend (Supabase)

### Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Pull database schema
supabase db pull

# Generate TypeScript types from schema
supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts

# Run migrations
supabase db push
```

---

## Project Management

### Git Commands (Version Control)

```bash
# Initialize git repository
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Create new branch
git checkout -b feature/product-list

# Switch branches
git checkout main

# Merge branch
git merge feature/product-list
```

### Project Info

```bash
# Check Expo SDK version
npx expo --version

# Check project configuration
cat app.json

# List all dependencies
npm list --depth=0

# Check for outdated packages
npm outdated

# Update Expo SDK
npx expo upgrade
```

---

## Useful Shortcuts in Dev Server

When running `npm start`, you can press keys in the terminal:

- **a** - Open on Android device/emulator
- **i** - Open on iOS simulator (Mac only)
- **w** - Open in web browser
- **r** - Reload app
- **m** - Toggle menu
- **d** - Open React DevTools
- **shift+d** - Toggle performance monitor
- **c** - Clear Metro bundler cache
- **q** - Quit dev server

---

## Troubleshooting Commands

### When things go wrong...

```bash
# Nuclear option: Delete everything and start fresh
rm -rf node_modules package-lock.json
npm install
npx expo start --clear

# Clear Expo cache
rm -rf ~/.expo
rm -rf /tmp/metro-*

# Clear Android build cache
cd android
./gradlew clean
cd ..

# Fix watchman issues (file watching)
watchman watch-del-all

# Kill all Node/Metro processes
killall -9 node
```

### Check versions

```bash
node --version        # Should be 18+
npm --version         # Should be 9+
expo --version        # Check Expo CLI version
eas --version         # Check EAS CLI version
npx expo-doctor       # Check for common issues
```

---

## Example Workflows

### Starting a new development session

```bash
# 1. Pull latest code
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start dev server
npm start

# 4. Open on your phone (scan QR code)
# OR press 'a' for Android emulator
```

### Adding a new feature

```bash
# 1. Create feature branch
git checkout -b feature/barcode-scanning

# 2. Install needed packages
npx expo install expo-camera expo-barcode-scanner

# 3. Code your feature...
# (create new files, modify existing ones)

# 4. Test on device
npm start

# 5. Commit changes
git add .
git commit -m "Add barcode scanning feature"

# 6. Push to GitHub
git push origin feature/barcode-scanning
```

### Creating a production build

```bash
# 1. Make sure everything is committed
git status

# 2. Update version in app.json
# Edit version number (e.g., 1.0.0 -> 1.1.0)

# 3. Create build
eas build --platform android --profile production

# 4. Wait for build to complete (check EAS dashboard)

# 5. Test the build before submitting
# Download APK from dashboard and install on device

# 6. If good, submit to Play Store
eas submit --platform android --latest
```

### Pushing a quick fix without new build

```bash
# 1. Fix the bug in your code

# 2. Test locally
npm start

# 3. Commit changes
git add .
git commit -m "Fix: Product list crash on empty data"

# 4. Push update over-the-air
eas update --branch production --message "Bug fix: Empty product list"

# Users get the fix within minutes!
```

---

## Helpful Resources

### Official Documentation
- Expo Docs: https://docs.expo.dev/
- EAS Docs: https://docs.expo.dev/eas/
- React Native: https://reactnative.dev/
- Supabase: https://supabase.com/docs

### Getting Help
- Expo Discord: https://chat.expo.dev/
- Stack Overflow: Tag your questions with `expo` and `react-native`
- GitHub Issues: https://github.com/expo/expo/issues

---

## Save This File!

Bookmark this file or keep it open in a tab. You'll reference these commands constantly during development.

**Pro tip:** Add aliases to your shell config for commonly used commands:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias expo-start="npx expo start --clear"
alias expo-android="npx expo start --android"
alias expo-tunnel="npx expo start --tunnel"
alias eas-build-android="eas build --platform android --profile production"
```

Happy coding! 🚀
