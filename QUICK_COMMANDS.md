# 🚀 Quick Commands Reference - LifeCycle Mobile

Quick reference guide for running your LifeCycle app on iPhone and iOS Simulator.

---

## 📱 Running on Your iPhone (Using Expo Go)

### Prerequisites
- ✅ Expo Go app installed on your iPhone (from App Store)
- ✅ iPhone and Mac on same WiFi network (or use tunnel mode)

### Basic Commands

#### Start Development Server (Tunnel Mode - Most Reliable)
```bash
npx expo start --tunnel
```
- ✅ Works even with firewall/network restrictions
- ✅ Works across different networks
- ⚠️ Takes 30-60 seconds to establish tunnel
- 📱 Scan QR code with Expo Go app

#### Start Development Server (LAN Mode - Faster)
```bash
npx expo start --lan
```
- ✅ Faster than tunnel mode
- ⚠️ Requires same WiFi network
- ⚠️ May not work with firewall restrictions
- 📱 Scan QR code with Expo Go app

#### Start Development Server (Default)
```bash
npx expo start
```
- Same as `--lan` mode
- 📱 Scan QR code with Expo Go app

#### Clear Cache and Restart
```bash
npx expo start --clear
```
- Use if you get errors or timeout issues
- Clears Metro bundler cache

---

## 💻 Running on iOS Simulator (Using Xcode)

### Prerequisites
- ✅ Xcode installed
- ✅ iOS runtime downloaded (Xcode → Settings → Components)
- ✅ CocoaPods installed (`sudo gem install cocoapods`)

### Basic Commands

#### Build and Run on Simulator (Standalone App)
```bash
npx expo run:ios
```
- ✅ Builds your actual app (not Expo Go)
- ✅ Full native capabilities
- ⚠️ First build takes 5-10 minutes
- ✅ Subsequent builds are faster
- 📱 App appears as "LifeCycle" on Simulator

#### Start Dev Server and Open Simulator (Opens Expo Go)
```bash
npx expo start --ios
```
- ⚠️ Opens Expo Go on Simulator (not your app)
- 📱 Then connect Expo Go to dev server manually
- Use `npx expo run:ios` instead for standalone app

#### Open Simulator Manually
```bash
# From Xcode
Xcode → Open Developer Tool → Simulator

# Or from command line
open -a Simulator
```

#### List Available Simulators
```bash
xcrun simctl list devices
```

#### Boot a Specific Simulator
```bash
xcrun simctl boot "iPhone 15 Pro"
```

---

## 🔧 Troubleshooting Commands

### Kill Processes
```bash
# Kill Expo/Metro processes
killall node

# Kill Simulator
killall Simulator

# Kill CoreSimulatorService
killall com.apple.CoreSimulator.CoreSimulatorService
```

### Check Port Usage
```bash
# Check if port 8081 is in use
lsof -i :8081

# Kill process using port 8081
kill -9 <PID>
```

### Clear Caches
```bash
# Clear Expo cache
npx expo start --clear

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

### Check Xcode Setup
```bash
# Check Xcode path
xcode-select -p

# Reset Xcode path
sudo xcode-select --reset

# Check Xcode version
xcodebuild -version
```

---

## 📋 Common Workflows

### Workflow 1: Develop on iPhone (Recommended for Most Development)
```bash
# 1. Start dev server with tunnel
npx expo start --tunnel

# 2. Open Expo Go on iPhone
# 3. Scan QR code
# 4. App loads instantly
# 5. Make code changes → Auto-reloads on phone
```

### Workflow 2: Develop on Simulator (For Native Features Testing)
```bash
# 1. Open Simulator
open -a Simulator

# 2. Build and run app
npx expo run:ios

# 3. Wait for build (5-10 min first time)
# 4. App launches automatically
# 5. Make code changes → Auto-reloads
```

### Workflow 3: Quick Test on Simulator
```bash
# If you already built once, just start dev server
npx expo start

# Then press 'i' in terminal to open Simulator
# Or manually open Simulator and it will connect
```

---

## 🎯 Quick Decision Guide

**Use iPhone (Expo Go) when:**
- ✅ Fast development iteration
- ✅ Testing on real device
- ✅ Don't need custom native modules
- ✅ Quick testing

**Use Simulator (`npx expo run:ios`) when:**
- ✅ Testing native features
- ✅ Don't have iPhone nearby
- ✅ Testing different screen sizes
- ✅ Need standalone app experience

---

## 📝 Environment Variables

Make sure you have `.env` file with:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🔄 Hot Reload

Both methods support hot reload:
- **Save file** → App automatically reloads
- **Shake device/Simulator** → Opens developer menu
- **Press 'r' in terminal** → Reload app manually

---

## 💡 Pro Tips

1. **First time setup:** Use tunnel mode (`--tunnel`) - most reliable
2. **Daily development:** Use LAN mode (`--lan`) - faster
3. **Testing native features:** Use `npx expo run:ios` - full capabilities
4. **Quick testing:** Use Expo Go on iPhone - fastest
5. **If something breaks:** Clear cache (`--clear`) - fixes 80% of issues

---

## 🆘 Quick Fixes

**"Connection timeout" error:**
```bash
npx expo start --clear --tunnel
```

**"No iOS devices available" error:**
```bash
# Open Simulator first, then:
npx expo run:ios
```

**"Port 8081 already in use" error:**
```bash
lsof -i :8081
kill -9 <PID>
npx expo start
```

**"Module not found" error:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

---

**For detailed explanations, see [IPHONE_SETUP.md](./IPHONE_SETUP.md)**

