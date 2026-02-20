# 📱 Running LifeCycle Mobile on iPhone

This guide will walk you through running the LifeCycle mobile app on your iPhone.

---

## 🤔 How Does TypeScript Run on iPhone Without Xcode?

**Great question!** You're right that traditional iOS development requires Xcode. Here's how Expo makes this work:

### The Magic: Expo Go App

**Expo Go** (the app you installed from the App Store) is like a "browser" for React Native apps:

- ✅ **Already contains all iOS native code** - Pre-compiled and ready to use
- ✅ **Has React Native's JavaScript engine** - Can execute JavaScript/TypeScript
- ✅ **Acts as a runtime** - Your code runs inside it, just like a website runs in a browser

### How It Works:

```
Your TypeScript Code → Metro Bundler → JavaScript Bundle → Expo Go → Your iPhone
     (app/*.tsx)        (compiles TS)    (sends over)     (executes)   (displays)
```

**Step by step:**

1. **You write TypeScript** (like `app/index.tsx`)
2. **Metro Bundler compiles TypeScript → JavaScript** (happens on your Mac)
3. **Metro sends JavaScript bundle** to Expo Go over WiFi/tunnel
4. **Expo Go receives and executes** the JavaScript using React Native's engine
5. **Your app appears** on your iPhone!

### Why You Don't Need Xcode (For Development)

**Traditional iOS Development:**
```
Write Swift/Objective-C → Compile with Xcode → Build .ipa → Install on iPhone
```

**Expo Development (What You're Doing):**
```
Write TypeScript → Bundle JavaScript → Send to Expo Go → App Runs Instantly!
```

**Key difference:** Expo Go already has all the native iOS code compiled and built-in. You're just sending JavaScript that runs inside it.

### Think of It Like This:

- **Web Browser** = Runs HTML/CSS/JavaScript websites
- **Expo Go** = Runs React Native/TypeScript mobile apps

Both are "runtimes" that already have the native capabilities built-in. You just send them code to execute.

### When DO You Need Xcode?

Here's a complete breakdown of when Xcode is required vs optional:

---

#### ❌ **Xcode NOT Needed For:**

**1. Development with Expo Go (What You're Doing Now)**
- ✅ Write TypeScript/JavaScript code
- ✅ Test on physical iPhone via Expo Go
- ✅ Hot reload and instant updates
- ✅ Full development workflow

**2. Building for App Store (Using EAS Build - Cloud)**
- ✅ Build iOS apps in Expo's cloud
- ✅ Create `.ipa` files for App Store submission
- ✅ Handle code signing automatically
- ✅ No local tools needed

**3. Testing on Physical iPhone**
- ✅ Use Expo Go app (no Xcode needed)
- ✅ Test all features except custom native modules

---

#### ✅ **Xcode IS Needed For:**

**1. iOS Simulator (Testing Without Physical Device)**
- ❌ **Need Xcode** to run iOS Simulator
- Alternative: Use Expo Go on physical iPhone (no Xcode needed)

**2. Local iOS Builds (Instead of Cloud)**
- ❌ **Need Xcode** if you want to build `.ipa` files locally
- Alternative: Use EAS Build (cloud) - no Xcode needed

**3. Custom Native Modules**
- ❌ **Need Xcode** if you need native iOS code not included in Expo
- Most apps don't need this - Expo covers 99% of use cases

**4. Advanced Native Features**
- ❌ **Need Xcode** for:
  - Custom native UI components
  - Native iOS frameworks not in Expo SDK
  - Modifying native iOS code directly
  - Advanced native integrations

**5. Debugging Native Code**
- ❌ **Need Xcode** to debug native iOS code (Swift/Objective-C)
- JavaScript debugging works fine without Xcode

---

### Summary Table

| Task | Xcode Needed? | Alternative |
|------|---------------|-------------|
| **Development** | ❌ No | Expo Go on iPhone |
| **iOS Simulator** | ✅ Yes | Use physical iPhone + Expo Go |
| **Build for App Store** | ❌ No* | Use EAS Build (cloud) |
| **Local Build** | ✅ Yes | Use EAS Build instead |
| **Custom Native Code** | ✅ Yes | Most apps don't need this |
| **Publish to App Store** | ❌ No | EAS Submit handles it |

*You can build and publish to App Store without Xcode using EAS Build

---

### For Your Project (LifeCycle Mobile)

**Current Setup (No Xcode Needed):**
- ✅ Develop with Expo Go on iPhone
- ✅ Test all features
- ✅ Build for App Store using EAS Build
- ✅ Submit to App Store using EAS Submit

**You would only need Xcode if:**
- You want to test on iOS Simulator (instead of physical device)
- You need custom native iOS code (unlikely for your app)
- You prefer building locally instead of using cloud (EAS Build)

**Bottom line:** You can develop, build, and publish your iOS app to the App Store **without ever installing Xcode**, by using Expo Go for development and EAS Build for production builds.

---

## 🧠 Deep Dive: How Expo Works & Building Actual Apps

### Understanding the Two Modes of Expo Development

Expo has **two different ways** your app can run:

#### Mode 1: Expo Go (Development - What You Were Using)

**How it works:**
```
Your TypeScript Code → Metro Bundler → JavaScript Bundle → Expo Go App → Your Phone
```

**What happens:**
1. **Expo Go** is a pre-built app (like a "browser" for React Native)
2. It already contains **all native iOS code** compiled and ready
3. Your code is just **JavaScript** that runs inside Expo Go
4. Metro Bundler sends your JavaScript to Expo Go over the network
5. Expo Go executes it using React Native's JavaScript engine

**Limitations:**
- ❌ Can only use features included in Expo Go
- ❌ Can't use custom native modules
- ❌ App runs inside Expo Go (not standalone)
- ✅ Fast development (no compilation needed)

**Think of it like:** A web browser running a website. The browser (Expo Go) is already installed, you just send it code to run.

---

#### Mode 2: Standalone App (Production - What `npx expo run:ios` Does)

**How it works:**
```
Your TypeScript Code → Metro Bundler → JavaScript Bundle → Native iOS App → Simulator/Device
     ↓                      ↓                ↓                    ↓
  app/*.tsx          Compiles TS→JS    Bundle.js         Built with Xcode
```

**What happens:**
1. **Generates native iOS project** (`ios/` folder with Xcode project files)
2. **Compiles native code** (Swift/Objective-C) using Xcode
3. **Bundles your JavaScript** into the app
4. **Creates a standalone `.app`** file
5. **Installs on Simulator/Device** as a real app

**This is what `npx expo run:ios` does:**
- Creates `ios/` folder with Xcode project
- Runs CocoaPods to install native dependencies
- Uses Xcode to compile native code
- Bundles your JavaScript
- Creates a standalone app
- Installs and runs it on Simulator

**Advantages:**
- ✅ Full native capabilities
- ✅ Can use custom native modules
- ✅ Standalone app (not inside Expo Go)
- ✅ Same as what users will download from App Store

**Think of it like:** Building a real desktop application. You compile everything into a standalone executable.

---

### How Xcode Simulator Works

**Xcode Simulator** is a virtual iPhone/iPad that runs on your Mac:

#### What It Is:
- **Virtual device** - Simulates iPhone hardware/software
- **Runs real iOS** - Uses actual iOS code (not emulated)
- **Native performance** - Runs ARM code directly (on Apple Silicon) or x86 (on Intel)
- **Full iOS features** - Camera, location, notifications, etc. (simulated)

#### How It Works:

```
Your Mac → Xcode Simulator → iOS Runtime → Your App
    ↓            ↓                ↓            ↓
  macOS      Simulator      iOS 26.2      LifeCycle.app
```

1. **Simulator app** runs on your Mac (like a virtual machine)
2. **iOS runtime** (the 8.39 GB you downloaded) provides iOS system code
3. **Your app** (LifeCycle.app) runs inside the simulated iOS
4. **Everything works** like a real iPhone (just simulated)

#### Building for Simulator vs Real Device:

**For Simulator (`npx expo run:ios`):**
- Compiles for **x86_64** (Intel Mac) or **arm64** (Apple Silicon Mac)
- Creates `.app` bundle
- Installs directly to Simulator
- **Fast** - no code signing needed

**For Real Device:**
- Compiles for **arm64** (actual iPhone chip)
- Creates `.app` bundle
- Requires **code signing** (Apple Developer account)
- Installs via Xcode or TestFlight

---

### The Build Process: Step by Step

When you run `npx expo run:ios`, here's what happens:

#### Step 1: Prebuild (Generate Native Project)
```bash
expo prebuild --platform ios
```
- Creates `ios/` folder
- Generates `ios/LifeCycle.xcworkspace` (Xcode project)
- Sets up native configuration from `app.json`

#### Step 2: Install CocoaPods Dependencies
```bash
cd ios && pod install
```
- Reads `ios/Podfile` (list of native dependencies)
- Downloads native libraries (like expo-camera, expo-notifications)
- Links them to your project

#### Step 3: Build with Xcode
```bash
xcodebuild -workspace LifeCycle.xcworkspace -scheme LifeCycle -sdk iphonesimulator
```
- Compiles Swift/Objective-C code
- Links native libraries
- Bundles JavaScript (via Metro)
- Creates `LifeCycle.app`

#### Step 4: Install on Simulator
```bash
xcrun simctl install booted LifeCycle.app
```
- Copies `.app` to Simulator
- Registers it with iOS
- App appears on home screen

#### Step 5: Launch App
```bash
xcrun simctl launch booted com.stashlabs.lifecycle
```
- Starts your app
- Connects to Metro bundler for hot reload
- App runs!

---

### Key Differences: Expo Go vs Standalone App

| Feature | Expo Go | Standalone App (`npx expo run:ios`) |
|---------|---------|-------------------------------------|
| **Native Code** | Pre-compiled in Expo Go | Compiled fresh for your app |
| **Custom Modules** | ❌ Only Expo SDK | ✅ Any native module |
| **App Identity** | Runs inside Expo Go | Standalone app |
| **Build Time** | Instant (no build) | 5-10 min (first time) |
| **File Size** | Small (just JS) | Large (includes native code) |
| **Distribution** | Can't distribute | Can submit to App Store |
| **Development** | ✅ Fast iteration | ✅ Full native features |

---

### How Metro Bundler Works (The JavaScript Part)

**Metro** is Expo's JavaScript bundler (like Webpack for React Native):

```
TypeScript Files → Metro → JavaScript Bundle → App
  app/index.tsx         ↓          bundle.js
  app/login.tsx    Transpiles      (single file)
  components/*.tsx   Bundles
```

**What Metro does:**
1. **Transpiles** TypeScript → JavaScript
2. **Bundles** all files into one JavaScript file
3. **Optimizes** code (minifies, tree-shakes)
4. **Serves** bundle to app (via HTTP)

**In Development:**
- Metro runs on `localhost:8081`
- Serves bundle over HTTP
- Hot reloads when files change

**In Production Build:**
- Metro bundles JavaScript
- Embeds bundle in `.app` file
- App loads bundle from disk (no server needed)

---

### The Complete Picture

**Development Flow (Expo Go):**
```
You edit code → Metro recompiles → Expo Go reloads → See changes instantly
```

**Production Build Flow:**
```
You edit code → Run `npx expo run:ios` → Xcode compiles → App installed → Run app
```

**App Store Flow:**
```
You edit code → Run `eas build --platform ios` → Cloud builds → Download .ipa → Submit to App Store
```

---

### Why This Architecture?

**Expo Go (Development):**
- ✅ **Fast** - No compilation needed
- ✅ **Easy** - Just scan QR code
- ✅ **Flexible** - Works on any device
- ❌ **Limited** - Only Expo SDK features

**Standalone App (Production):**
- ✅ **Full featured** - All native capabilities
- ✅ **Realistic** - Same as App Store version
- ✅ **Customizable** - Add any native code
- ❌ **Slower** - Requires compilation

---

### Summary

1. **Expo Go** = Pre-built runtime that runs your JavaScript (fast development)
2. **Standalone App** = Your app compiled with native code (production-ready)
3. **Xcode Simulator** = Virtual iPhone that runs real iOS (testing without device)
4. **`npx expo run:ios`** = Builds standalone app and runs on Simulator
5. **Metro Bundler** = Compiles TypeScript and bundles JavaScript

**When you run `npx expo run:ios`:**
- Expo generates native iOS project
- Xcode compiles native code
- Metro bundles JavaScript
- Creates standalone app
- Installs on Simulator
- **Your app runs natively** (not in Expo Go)

This is exactly what users will get when they download from the App Store!

---

## Prerequisites

- ✅ **Mac computer** (you're on macOS, so you're good!)
- ✅ **Node.js 18+** installed
- ✅ **iPhone** (physical device) OR **Xcode** (for iOS Simulator)
- ✅ **Expo account** (free at https://expo.dev)

---

## Method 1: Using Expo Go on Your iPhone (EASIEST - Recommended)

This is the fastest way to test your app on your iPhone without any complex setup.

### Step 1: Install Expo Go on Your iPhone

1. Open the **App Store** on your iPhone
2. Search for **"Expo Go"**
3. Install the app (it's free)

### Step 2: Install Dependencies

Open Terminal and navigate to your project:

```bash
cd /Users/login/Documents/stash./lifecycle-mobile
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

Open `.env` in your editor and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Where to get these values:**
- Go to your Supabase project dashboard: https://app.supabase.com
- Navigate to: Settings → API
- Copy the "Project URL" and "anon public" key

### Step 4: Start the Development Server

```bash
npm start
```

Or:

```bash
npx expo start
```

You should see:
- A QR code in your terminal
- A development server URL (like `exp://192.168.x.x:8081`)
- Options to open on different platforms
- A message like: `Metro waiting on exp://...`

**Verify the server is running:** You should see the QR code and URL in your terminal. If you don't see these, the server isn't running properly - try `npx expo start --clear`

### Step 5: Connect Your iPhone

**⚠️ If you get "Unknown connection error" - Skip to Option B (Tunnel Mode) below!**

**Option A: Same WiFi Network (Recommended)**
1. Make sure your iPhone and Mac are on the **same WiFi network**
2. Open **Expo Go** app on your iPhone
3. Tap **"Scan QR Code"** (or tap the camera icon)
4. Scan the QR code from your terminal
5. The app will load on your iPhone!

**⚠️ If you get "The Internet connection appears to be offline" error:**
- This means Expo Go can't reach your Mac's server
- **Skip to Option B (Tunnel Mode)** - it will fix this immediately
- The error message is misleading - your internet is fine, it's a local network issue

**Option B: Tunnel Mode (USE THIS IF YOU GET CONNECTION ERRORS)**
This is the most reliable method and works even with network restrictions:

1. Stop the server (Ctrl+C in terminal)
2. Start with tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
3. Wait for the tunnel to establish (may take 30-60 seconds)
   - You'll see: `Tunnel ready. Scanning for QR code...`
4. Scan the QR code with Expo Go
5. The app will load on your iPhone!

**Why tunnel mode?** It routes traffic through Expo's servers, bypassing local network firewall/security issues.

---

## 🔍 Understanding Method A vs Method B: Why Tunnel Mode Worked for You

### Method A: LAN Mode (Same WiFi Network) - `npx expo start`

**How it works:**
```
Your iPhone → Your Router → Your Mac (192.168.0.58:8081)
     ↓              ↓              ↓
  Expo Go      Local WiFi    Metro Bundler
```

**The connection path:**
1. Your Mac starts Metro Bundler on `localhost:8081`
2. Expo detects your Mac's local IP (e.g., `192.168.0.58`)
3. Creates QR code with URL: `exp://192.168.0.58:8081`
4. Your iPhone scans QR code and tries to connect **directly** to your Mac's IP
5. **All traffic stays on your local network**

**Why it failed in your case:**
- ❌ **Mac Firewall blocked port 8081** - macOS firewall prevented your iPhone from connecting
- ❌ **Network isolation** - Your router might prevent devices from talking to each other
- ❌ **VPN interference** - If you had a VPN, it routed traffic away from local network
- ❌ **Router security settings** - Some routers block device-to-device communication

**When Method A works:**
- ✅ Mac firewall allows incoming connections on port 8081
- ✅ Router allows device-to-device communication
- ✅ No VPN interfering
- ✅ Both devices on same network segment

---

### Method B: Tunnel Mode - `npx expo start --tunnel`

**How it works:**
```
Your iPhone → Internet → Expo's Servers → Internet → Your Mac
     ↓           ↓            ↓              ↓          ↓
  Expo Go    WiFi/Cell   exp.direct    Tunnel      Metro Bundler
```

**The connection path:**
1. Your Mac starts Metro Bundler on `localhost:8081`
2. Expo creates a **tunnel** through Expo's servers
3. Creates QR code with URL: `exp://rfbmeie-anonymous-8081.exp.direct`
4. Your iPhone scans QR code and connects to **Expo's servers** (not your Mac directly)
5. Expo's servers relay the connection back to your Mac
6. **All traffic goes through Expo's infrastructure**

**Why it worked for you:**
- ✅ **Bypasses Mac firewall** - Your Mac connects OUT to Expo (outgoing connections aren't blocked)
- ✅ **Bypasses router restrictions** - Traffic goes through internet, not local network
- ✅ **Works with VPN** - VPN doesn't interfere since both devices connect to external servers
- ✅ **Works across networks** - Your iPhone and Mac don't need to be on same WiFi!

**Trade-offs:**
- ⚠️ **Slightly slower** - Extra hop through Expo's servers adds latency
- ⚠️ **Requires internet** - Both devices need internet connection (not just local network)
- ⚠️ **Takes longer to start** - Tunnel establishment takes 30-60 seconds

---

### Visual Comparison

**Method A (LAN Mode) - Direct Connection:**
```
iPhone ←→ Router ←→ Mac
  (Direct local connection)
  
❌ Blocked by firewall
❌ Blocked by router isolation
❌ Blocked by VPN
```

**Method B (Tunnel Mode) - Through Expo:**
```
iPhone → Internet → Expo Servers → Internet → Mac
  (Indirect connection via Expo)
  
✅ Bypasses firewall
✅ Bypasses router restrictions  
✅ Works with VPN
✅ Works across different networks
```

---

### Why Tunnel Mode Solved Your Problem

Based on your error messages, here's what happened:

1. **First error ("Internet connection appears offline"):**
   - Method A tried: iPhone → Mac directly
   - **Failed:** Mac firewall blocked port 8081
   - Your iPhone couldn't reach `192.168.0.58:8081`

2. **Second error ("Request timeout"):**
   - Still using Method A (or partial tunnel connection)
   - Connection attempted but timed out
   - Likely due to network restrictions or slow connection

3. **Tunnel Mode worked:**
   - Changed to: iPhone → Expo Servers → Mac
   - **Success:** Mac firewall doesn't block outgoing connections
   - Expo's servers handle the routing
   - Your Mac connects OUT to Expo (allowed by firewall)
   - Your iPhone connects to Expo (works from anywhere)

---

### When to Use Each Method

**Use Method A (LAN) when:**
- ✅ You're on a trusted home/office network
- ✅ You want fastest possible connection
- ✅ You don't have firewall/network restrictions
- ✅ Both devices are on same WiFi

**Use Method B (Tunnel) when:**
- ✅ You get connection errors with Method A
- ✅ You're on public/corporate WiFi
- ✅ You have VPN enabled
- ✅ Devices are on different networks
- ✅ You want maximum compatibility

**In your case:** Tunnel mode was the right choice because your Mac's firewall was blocking incoming connections on port 8081. Tunnel mode bypasses this by using outgoing connections instead.

**Option C: Manual Connection**
1. In Expo Go, tap **"Enter URL manually"**
2. Type the URL shown in your terminal:
   - For tunnel: `exp://u.expo.dev/...` (long URL)
   - For LAN: `exp://192.168.1.100:8081` (your Mac's IP)
3. Tap **"Connect"**

### Step 6: Test the App

Once connected, you should see:
- The LifeCycle app loading
- Login screen
- Ability to sign up/login

**Hot Reload:** Any changes you make to the code will automatically reload on your iPhone!

---

## Method 2: Using iOS Simulator (Requires Xcode)

If you want to test on a simulated iPhone without a physical device.

### Step 1: Install Xcode

1. Open the **App Store** on your Mac
2. Search for **"Xcode"**
3. Install Xcode (this is a large download, ~10GB+)
4. Open Xcode once to accept the license agreement
5. Install additional components when prompted

**Note:** Xcode may download additional components (like "Predictive Code Completion Model") - this is normal and can take time.

### Step 2: Set Up iOS Simulator (IMPORTANT!)

**If you get "No iOS devices available in Simulator.app" error, follow these steps:**

#### Option A: Open Simulator from Xcode

1. **Open Xcode**
2. Go to **Xcode → Open Developer Tool → Simulator**
3. Simulator app will open
4. Go to **File → New Simulator** (or press `Cmd+Shift+N`)
5. Choose a device (e.g., **iPhone 15 Pro** or **iPhone 15**)
6. Choose iOS version (latest available, e.g., **iOS 18.2**)
7. Click **Create**
8. The simulator will boot up (may take a minute)

#### Option B: Open Simulator Directly

1. **Open Spotlight** (Cmd+Space)
2. Type **"Simulator"**
3. Press Enter
4. If no devices exist, go to **File → New Simulator**
5. Choose device and iOS version
6. Click **Create**

#### Option C: List Available Simulators

Check what simulators you have:

```bash
xcrun simctl list devices
```

If you see devices listed but they're "Unavailable", you may need to download iOS runtime:

1. Open **Xcode**
2. Go to **Xcode → Settings → Platforms** (or **Preferences → Components**)
3. Download the iOS version you need

### Step 3: Install Xcode Command Line Tools

```bash
xcode-select --install
```

If it says "already installed", you're good to go.

### Step 4: Install CocoaPods (iOS Dependency Manager)

```bash
sudo gem install cocoapods
```

**Note:** This may ask for your password. CocoaPods manages iOS native dependencies.

### Step 5: Install Dependencies

```bash
cd /Users/login/Documents/stash./lifecycle-mobile
npm install
```

### Step 6: Set Up Environment Variables

Same as Method 1, Step 3 above.

### Step 7: Run Your App on iOS Simulator

**Important:** There are two ways to run on Simulator:

#### Option A: Build Development Client (RECOMMENDED - Runs Your Actual App)

This builds your app directly on the simulator (not Expo Go):

**Step 1: Make sure Simulator is ready**
1. Open Simulator (Xcode → Open Developer Tool → Simulator)
2. Create a device if needed (File → New Simulator)
3. Make sure it's booted (you see iOS home screen)

**Step 2: Build and run your app**

```bash
npx expo run:ios
```

**What this does:**
1. Generates iOS native project files (creates `ios/` folder)
2. Installs CocoaPods dependencies
3. Builds your app with Xcode
4. Installs and launches your app on Simulator

**Note:** 
- The first build takes 5-10 minutes (compiles native code)
- Subsequent builds are much faster (only rebuilds changed code)
- Your app will appear as "LifeCycle" on the Simulator home screen

**What you'll see:**
- Terminal will show build progress
- Xcode may open automatically (you can close it)
- Simulator will show your app installing
- App will launch automatically when ready

**If you get errors:**
- **CocoaPods not found:** `sudo gem install cocoapods`
- **Xcode not found:** Make sure Xcode is installed and `xcode-select -p` shows correct path
- **Simulator not found:** Open Simulator first, then run the command

#### Option B: Use Expo Go on Simulator (Easier but Less Native)

If `npx expo start --ios` opens Expo Go:

1. **Start dev server:**
   ```bash
   npx expo start
   ```

2. **In Expo Go on Simulator:**
   - Tap "Enter URL manually"
   - Type: `exp://localhost:8081` (or the URL shown in terminal)
   - Tap "Connect"

**Note:** Option A is better because it runs your actual app. Option B uses Expo Go which has limitations.

---

### Step 7 Alternative: Quick Start (If Expo Go Opens)

If `npx expo start --ios` opens Expo Go instead of your app:

1. **In Expo Go on Simulator**, you can connect to your dev server:
   - Look at your terminal - you'll see a URL like `exp://192.168.x.x:8081`
   - In Expo Go, tap "Enter URL manually"
   - Type that URL
   - Your app will load in Expo Go

2. **Or build your app directly** (better):
   ```bash
   npx expo run:ios
   ```
   This builds your actual app (not Expo Go) and runs it on Simulator.

### Troubleshooting "No iOS devices available" / CoreSimulatorService Errors

**If you get errors like:**
- "No iOS devices available in Simulator.app"
- "CoreSimulatorService connection became invalid"
- "Connection refused" errors

**Try these solutions in order:**

#### Solution 1: Restart CoreSimulatorService

```bash
# Kill any running simulator processes
killall Simulator
killall com.apple.CoreSimulator.CoreSimulatorService

# Wait a few seconds, then try again
npx expo start --ios
```

#### Solution 2: Ensure Xcode is Fully Set Up

1. **Open Xcode** (not just Simulator)
2. **Accept license agreement** (if prompted):
   ```bash
   sudo xcodebuild -license accept
   ```
3. **Install command line tools**:
   ```bash
   xcode-select --install
   ```
4. **Wait for Xcode to finish downloading components** (check Downloads window)
5. **Close Xcode completely** (Cmd+Q)
6. **Restart your Mac** (if components were just installed)

#### Solution 3: Open Simulator Manually First

1. **Open Xcode**
2. Go to **Xcode → Settings → Platforms** (or **Preferences → Components**)
3. **Download iOS runtime** if not already downloaded (this can be large, 5-10GB)
4. **Open Simulator**: Xcode → Open Developer Tool → Simulator
5. **Create a device**: File → New Simulator → Choose iPhone → Choose iOS version → Create
6. **Wait for simulator to boot** (you should see iOS home screen)
7. **Then run**: `npx expo start --ios`

#### Solution 4: Reset Simulator Service

```bash
# Reset simulator service
sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService

# Clear simulator data (WARNING: This deletes all simulators)
rm -rf ~/Library/Developer/CoreSimulator/Devices

# Restart your Mac
# Then open Xcode and create a new simulator
```

#### Solution 5: Check Xcode Installation

```bash
# Verify Xcode is properly installed
xcode-select -p
# Should show: /Applications/Xcode.app/Contents/Developer

# If it shows something else, reset it:
sudo xcode-select --reset

# Verify Xcode version
xcodebuild -version
```

#### Solution 6: Use Expo Go Instead (EASIEST!)

**Honestly, the easiest solution is to skip the Simulator entirely:**

1. **Use Expo Go on your physical iPhone** (Method 1)
2. **It's faster and more reliable**
3. **No Xcode setup needed**
4. **Tests on real device**

The Simulator is mainly useful if:
- You don't have an iPhone
- You want to test different screen sizes
- You're doing advanced native debugging

**For most development, Expo Go on a physical device is better!**

---

**If nothing works:**

1. **Make sure Xcode is fully downloaded** (check App Store - it should say "Open" not "Installing")
2. **Wait for all Xcode components to finish downloading** (check Downloads window)
3. **Restart your Mac** after Xcode installation completes
4. **Try opening Simulator from Xcode** (Xcode → Open Developer Tool → Simulator)
5. **Create a simulator device** before running Expo commands

---

## Troubleshooting

### ⚠️ "The Internet connection appears to be offline" Error

**If you see this exact error message:**
- "There was a problem running the requested app"
- "Unknown error: The Internet connection appears to be offline"
- URL shown: `exp://192.168.x.x:8081`

**This means:** Expo Go scanned the QR code successfully, but can't reach your Mac's development server. Your internet is fine - it's a local network connection issue.

**IMMEDIATE FIX - Use Tunnel Mode:**

1. **Stop the current server** (press `Ctrl+C` in terminal)
2. **Start with tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```
3. **Wait 30-60 seconds** for tunnel to establish
4. **Scan the NEW QR code** (it will be different - starts with `exp://u.expo.dev/...`)
5. **This should work!** ✅

**Why tunnel mode fixes this:** The error happens because your iPhone can't directly connect to your Mac at `192.168.0.58:8081`. Tunnel mode routes through Expo's servers, bypassing the local network issue.

---

### ⚠️ "Request Timeout" / "Opening project... taking longer than expected" Error

**If you see this error:**
- "Opening project, this is taking much longer than it should"
- "You might want to check your internet connectivity"
- "There was a problem running the requested app"
- "Unknown error: request timeout"

**This means:** The connection is being established, but the server is taking too long to respond or the bundle is failing to load.

**Try these solutions in order:**

#### Solution 1: Clear Cache and Restart (MOST COMMON FIX)

```bash
# Stop the server (Ctrl+C)
# Clear cache and restart
npx expo start --clear
```

Then scan the QR code again. The cache might be corrupted.

#### Solution 2: Check Your Terminal for Errors

Look at your terminal where `npx expo start` is running. Do you see:
- ❌ Red error messages?
- ❌ "Module not found" errors?
- ❌ "Failed to compile" messages?

**If yes:** Fix those errors first. The app won't load if there are compilation errors.

#### Solution 3: Try LAN Mode Instead of Tunnel

If you're using tunnel mode, it might be slow. Try LAN mode:

```bash
# Stop the server (Ctrl+C)
# Start in LAN mode (faster than tunnel)
npx expo start --lan
```

Make sure your iPhone and Mac are on the same WiFi network.

#### Solution 4: Check Metro Bundler Status

In your terminal, you should see:
```
Metro waiting on exp://...
```

If you see errors or warnings, that's the problem. Common issues:
- **"Port 8081 already in use"** → Kill the process: `lsof -i :8081` then `kill -9 <PID>`
- **"Cannot find module"** → Run `npm install` again
- **"Failed to resolve"** → Clear cache: `npx expo start --clear`

#### Solution 5: Restart Everything

Sometimes a full restart fixes timeout issues:

```bash
# 1. Stop the server (Ctrl+C)
# 2. Kill any remaining processes
lsof -i :8081
# Kill any PIDs shown (replace <PID> with actual number)
kill -9 <PID>

# 3. Clear cache
npx expo start --clear

# 4. Close Expo Go app on iPhone completely
# 5. Reopen Expo Go and scan QR code again
```

#### Solution 6: Check Network Speed

Timeout can happen if your network is very slow:

1. **Test your WiFi speed** on your iPhone
2. **Move closer to your router** if signal is weak
3. **Disable VPN** if you're using one (VPNs can slow connections)
4. **Try a different network** (like iPhone hotspot)

#### Solution 7: Reduce Initial Bundle Size

If your app has many dependencies, the initial load can timeout:

```bash
# Check your package.json - do you have unnecessary dependencies?
# Try removing unused packages to reduce bundle size
```

#### Solution 8: Use Development Build Instead

If Expo Go keeps timing out, consider creating a development build:

```bash
# This creates a custom Expo Go with your app pre-installed
eas build --profile development --platform ios
```

**Note:** This requires an Expo account and takes longer to set up initially.

---

**Most Common Cause:** Corrupted cache or compilation errors. **Try Solution 1 first** (`npx expo start --clear`) - it fixes 80% of timeout issues.

---

### "Expo Go can't connect to dev server" / "Unknown connection error"

**Why does this happen?**

When you run `npx expo start`, here's what happens behind the scenes:

1. **Expo starts a development server** on your Mac at `http://localhost:8081`
2. **It creates a QR code** containing a URL like `exp://192.168.1.100:8081` (your Mac's local IP address)
3. **Expo Go scans the QR code** and tries to connect to that IP address
4. **Your iPhone sends a request** to your Mac's IP address on port 8081
5. **The Mac should respond** with the app bundle

**The "unknown connection error" happens when step 5 fails** - your iPhone can't reach your Mac's server. Common reasons:

#### Root Causes:

1. **Firewall blocking incoming connections**
   - macOS Firewall blocks port 8081 by default
   - Your iPhone's request gets rejected before reaching Expo

2. **Network isolation (AP Isolation)**
   - Some routers prevent devices on the same WiFi from talking to each other
   - Security feature that blocks device-to-device communication
   - Your iPhone and Mac can't see each other even on the same network

3. **Different network segments**
   - Your Mac might be on a different subnet than your iPhone
   - Corporate/enterprise networks often segment devices
   - The IP addresses don't match what's in the QR code

4. **VPN interference**
   - VPNs route traffic through remote servers
   - Local network traffic gets misrouted
   - Your iPhone tries to connect through VPN instead of directly

5. **Port already in use**
   - Another app is using port 8081
   - Expo can't start the server properly
   - Connection attempts fail immediately

6. **Network security policies**
   - Corporate/school WiFi often blocks development servers
   - Port 8081 might be blocked by network admin
   - Security software blocking "suspicious" connections

**This is why tunnel mode works:** Instead of your iPhone connecting directly to your Mac, both devices connect to Expo's servers, which relay the connection. This bypasses all local network restrictions.

---

**Try these solutions in order:**

#### Solution 1: Use Tunnel Mode (MOST RELIABLE)
Tunnel mode works even if your network has restrictions:

```bash
# Stop the current server (Ctrl+C)
# Then start with tunnel:
npx expo start --tunnel
```

Wait 30-60 seconds for the tunnel to establish, then scan the QR code again.

**Why this works:** Tunnel mode uses Expo's servers to route traffic, bypassing local network issues.

#### Solution 2: Check Mac Firewall Settings
Your Mac's firewall might be blocking the connection:

1. **Open System Settings** (or System Preferences on older macOS)
2. Go to **Network** → **Firewall**
3. Click **Options** (or **Firewall Options**)
4. Make sure **"Block all incoming connections"** is **OFF**
5. If you see Expo or Node.js in the list, make sure it's set to **"Allow incoming connections"**
6. Restart the Expo server: `npx expo start`

#### Solution 3: Check Network Isolation
Some routers isolate devices from each other:

1. Check your router settings for **"AP Isolation"** or **"Client Isolation"**
2. If enabled, **disable it** (this allows devices on the same WiFi to communicate)
3. Restart your router if needed

#### Solution 4: Try Manual Connection
Instead of scanning QR code:

1. In Expo Go, tap **"Enter URL manually"**
2. Look at your terminal - you should see a URL like:
   - `exp://192.168.1.100:8081` (LAN mode)
   - `exp://u.expo.dev/...` (tunnel mode)
3. Type that exact URL (including `exp://`)
4. Tap **"Connect"**

#### Solution 5: Check Port 8081
Make sure nothing else is using port 8081:

```bash
# Check if port 8081 is in use
lsof -i :8081

# If something is using it, kill it:
kill -9 <PID>
```

Then restart: `npx expo start`

#### Solution 6: Disable VPN
If you're using a VPN on your Mac or iPhone:

1. **Disable VPN** on both devices
2. Try connecting again
3. VPNs can interfere with local network connections

#### Solution 7: Update Expo Go App
Make sure you have the latest version:

1. Open **App Store** on iPhone
2. Search for **"Expo Go"**
3. If there's an **"Update"** button, tap it
4. Try connecting again

#### Solution 8: Clear Expo Go Cache
Sometimes Expo Go's cache causes issues:

1. **Delete Expo Go** from your iPhone
2. **Reinstall** from App Store
3. Try connecting again

#### Solution 9: Check Network Type
Some networks (like corporate WiFi) block device-to-device communication:

1. Try connecting to a **personal hotspot** from your iPhone
2. Connect your Mac to that hotspot
3. Start Expo: `npx expo start`
4. Connect from Expo Go

#### Solution 10: Verify Server is Running
Make sure the dev server is actually running:

1. Check your terminal - you should see:
   ```
   › Metro waiting on exp://192.168.x.x:8081
   › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
   ```
2. If you don't see this, the server isn't running properly
3. Try: `npx expo start --clear`

**Most Common Fix:** Use tunnel mode (`npx expo start --tunnel`) - it solves 90% of connection issues!

### "Module not found" errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### "Build failed" on iOS Simulator

**Solutions:**
1. **Update Xcode:** Make sure you have the latest version
2. **Clean build:**
   ```bash
   npx expo start --clear
   ```
3. **Check Xcode:** Open Xcode → Preferences → Locations → Command Line Tools (should be set)

### "Cannot find simulator"

**Solutions:**
1. **List available simulators:**
   ```bash
   xcrun simctl list devices
   ```
2. **Open Simulator manually:**
   - Open Xcode
   - Go to: Xcode → Open Developer Tool → Simulator
   - Choose a device (e.g., iPhone 15 Pro)

### "Environment variables not working"

**Solutions:**
1. Make sure `.env` file exists in project root
2. Variables must start with `EXPO_PUBLIC_` prefix
3. Restart the dev server after changing `.env`
4. Clear cache: `npx expo start --clear`

### Camera/Barcode Scanner not working

**On Physical iPhone:**
- Make sure you've granted camera permissions in Settings → Expo Go → Camera

**On Simulator:**
- Camera features may not work in simulator (use physical device for testing camera)

---

## Development Workflow

### Making Changes

1. **Edit code** in your editor (VS Code/Cursor)
2. **Save the file**
3. **App auto-reloads** on your iPhone/Simulator
4. **See changes instantly!**

### Debugging

**View logs:**
- Check the terminal where `npm start` is running
- Or press `j` in the terminal to open debugger

**Reload manually:**
- Shake your iPhone (or Cmd+D in Simulator)
- Tap "Reload"

**Clear cache:**
```bash
npx expo start --clear
```

---

## Next Steps

Once you have the app running:

1. **Test Authentication:**
   - Try signing up with a test account
   - Try logging in
   - Test logout

2. **Explore the App:**
   - Navigate through different screens
   - Test the features that are implemented

3. **Start Developing:**
   - Check `DEVELOPMENT_ROADMAP.md` for what to build next
   - Read `QUICK_START.md` for development tips

---

## Quick Reference Commands

```bash
# Start dev server
npm start

# Start with iOS Simulator
npm run ios

# Start with tunnel (for remote testing)
npx expo start --tunnel

# Clear cache and restart
npx expo start --clear

# Stop server
Ctrl+C
```

---

## Need Help?

- **Expo Documentation:** https://docs.expo.dev/
- **Expo Discord:** https://chat.expo.dev/
- **Check project docs:**
  - `README.md` - Project overview
  - `SETUP_GUIDE.md` - Detailed setup instructions
  - `QUICK_START.md` - Quick reference

---

**You're all set! 🎉**

Start with Method 1 (Expo Go) - it's the easiest way to get started!

