# LifeCycle Mobile App

> Track product expiration dates, reduce waste, and help small businesses comply with food safety regulations.

A React Native mobile app built with Expo, connecting to the same Supabase backend as the LifeCycle web application.

---

## 📱 What is LifeCycle?

LifeCycle is an inventory management platform designed for small Australian businesses (convenience stores, cafes, supermarkets, pharmacies) to track product expiration dates and reduce waste. The mobile app enables on-the-go barcode scanning, real-time inventory updates, and push notifications for expiring products.

### Key Features (Planned)

- ✅ **User Authentication** - Email/password and Google OAuth
- 📦 **Product Management** - Add, edit, delete products with expiry tracking
- 📷 **Barcode Scanning** - Native camera barcode scanning
- 🔔 **Push Notifications** - Alerts for products nearing expiration
- 📊 **Inventory Dashboard** - Overview of expiring products
- 🌐 **Offline Support** - View cached products without internet
- 💳 **Subscription Management** - Freemium model with plan enforcement
- 🌙 **Dark Mode** - System-based theme switching
- 📸 **Product Photos** - Capture and store product images

---

## 🏗️ Project Structure

```
lifecycle-mobile/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx        # Root layout (wraps entire app)
│   ├── index.tsx          # Home screen
│   ├── login.tsx          # Authentication screen
│   └── (tabs)/            # Tab navigation group (to be created)
│       ├── products.tsx   # Product list
│       ├── scan.tsx       # Barcode scanner
│       └── profile.tsx    # User profile
│
├── components/            # Reusable React components
│   ├── ProductCard.tsx   # Product list item
│   ├── Scanner.tsx       # Barcode scanner component
│   └── Button.tsx        # Reusable button component
│
├── contexts/              # React Context providers
│   └── AuthContext.tsx   # Authentication state management
│
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client configuration
│   └── database.types.ts # TypeScript types (generated from Supabase)
│
├── assets/               # Images, fonts, icons
│   ├── icon.png         # App icon
│   ├── splash.png       # Splash screen
│   └── adaptive-icon.png # Android adaptive icon
│
├── app.json             # Expo configuration
├── eas.json             # EAS Build configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── .env                 # Environment variables (not in git)
└── .env.example         # Example environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- EAS CLI installed (`npm install -g eas-cli`)
- Expo account (free at https://expo.dev)
- Android device with Expo Go OR Android Studio emulator

### Installation

1. **Clone the repository**
   ```bash
   cd lifecycle-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open on your device**
   - Scan QR code with Expo Go app
   - OR press 'a' to open Android emulator

### Environment Variables

You need these environment variables in your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key (optional)
```

Get these from your Supabase project dashboard at:
https://app.supabase.com/project/YOUR_PROJECT/settings/api

---

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Detailed environment setup instructions
- **[Development Roadmap](DEVELOPMENT_ROADMAP.md)** - Feature roadmap and development phases
- **[Command Reference](COMMAND_REFERENCE.md)** - Common commands for development and deployment
- **[PRD](LifeCycle_Mobile_App_PRD.docx)** - Full product requirements document

---

## 🛠️ Tech Stack

- **Framework:** React Native with Expo (SDK 52+)
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based, like Next.js)
- **Backend:** Supabase (shared with web app)
- **Authentication:** Supabase Auth (email/password + Google OAuth)
- **Database:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage (for product images)
- **Payments:** Stripe (for subscriptions)
- **Notifications:** Expo Notifications + FCM
- **Analytics:** TBD (Mixpanel or Amplitude)
- **Crash Reporting:** TBD (Sentry)

---

## 📱 Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Clear cache and restart
npx expo start --clear

# Build for Android (preview)
eas build --platform android --profile preview

# Build for production
eas build --platform android --profile production

# Push over-the-air update
eas update --branch production

# Submit to Google Play
eas submit --platform android --latest
```

See [COMMAND_REFERENCE.md](COMMAND_REFERENCE.md) for complete list.

---

## 🎯 Current Status

**Phase:** Foundation ✅  
**Status:** Development environment set up, authentication complete

### Completed
- [x] Project setup with Expo + TypeScript
- [x] Supabase client configuration
- [x] Authentication context (login/signup)
- [x] Basic navigation structure
- [x] Login screen
- [x] Home screen with auth check

### Next Up (Phase 2)
- [ ] Products list screen
- [ ] Add product screen
- [ ] Product detail screen
- [ ] Edit product screen

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for full roadmap.

---

## 🔐 Security

- **Row Level Security (RLS):** All database tables protected by Supabase RLS policies
- **Authentication:** Supabase Auth with JWT tokens stored in secure device storage
- **API Keys:** Public anon key only (safe to expose), service role key never in client
- **Environment Variables:** Sensitive data in `.env` (not committed to git)
- **HTTPS:** All API calls over HTTPS

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run TypeScript check
npx tsc --noEmit

# Run linter
npm run lint
```

---

## 📦 Building & Distribution

### Android (Google Play Store)

1. **Build production APK/AAB:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submit to Google Play:**
   ```bash
   eas submit --platform android --latest
   ```

3. **Wait for review** (typically 1-3 days)

### iOS (Apple App Store) - Future

Requires:
- Apple Developer account ($99/year)
- Mac computer (for some features)
- iOS device for testing

See [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) for iOS launch plan (v2.0).

---

## 🎨 Design System

- **Colors:**
  - Primary: `#007AFF` (iOS blue)
  - Success: `#34C759` (iOS green)
  - Warning: `#FF9500` (iOS orange)
  - Danger: `#FF3B30` (iOS red)
  - Background: `#FFFFFF` / `#000000` (light/dark mode)

- **Typography:**
  - System font (San Francisco on iOS, Roboto on Android)
  - Scale: 12, 14, 16, 18, 24, 28, 36

- **Spacing:**
  - Base unit: 4px
  - Scale: 4, 8, 12, 16, 20, 24, 32, 40

---

## 🤝 Contributing

This is a private project for Stash Labs. If you're a team member:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request on GitHub

---

## 📞 Support

- **Technical Issues:** Check [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) troubleshooting section
- **Expo Help:** https://chat.expo.dev/
- **Supabase Help:** https://discord.supabase.com/
- **Team Contact:** [Your internal communication channel]

---

## 📄 License

Proprietary - © 2025 Stash Labs. All rights reserved.

---

## 🎯 Goals

**3-Month Goals:**
- 100+ mobile downloads
- 30+ daily active users
- 4.0+ Google Play Store rating
- 30% of users primarily using mobile

**6-Month Goals:**
- 500+ mobile downloads
- 150+ daily active users
- 50% of users primarily using mobile
- Launch iOS version

See [Product Requirements Document](LifeCycle_Mobile_App_PRD.docx) for detailed metrics and KPIs.

---

**Built with ❤️ by Stash Labs**

Helping small businesses reduce waste, one product at a time. 🌱
# lifecycle-mobile
