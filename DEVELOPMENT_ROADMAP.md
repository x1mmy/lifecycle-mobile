# LifeCycle Mobile App - Development Roadmap

## 📋 Quick Start Checklist

Before you start coding, make sure you've completed these setup steps:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Expo account created at https://expo.dev
- [ ] Android device with Expo Go OR Android Studio emulator
- [ ] Project created (`npx create-expo-app lifecycle-mobile`)
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created with Supabase credentials
- [ ] Logged into EAS (`eas login`)

## 🎯 Development Phases

### Phase 1: Foundation (Week 1-2) ✅ YOU ARE HERE

**Goal:** Get a working app with authentication

#### Completed:
- [x] Project setup with Expo + TypeScript
- [x] Supabase client configuration
- [x] Authentication context (login/signup)
- [x] Basic navigation structure (Expo Router)
- [x] Login screen
- [x] Home screen with auth check

#### To Do:
- [ ] Test login/signup flow with real Supabase backend
- [ ] Style login screen to match brand
- [ ] Add "Forgot Password" functionality
- [ ] Add loading states and error handling improvements
- [ ] Test on physical Android device

**Testing Checklist:**
```bash
# Start development server
npm start

# Scan QR code with Expo Go app on your phone
# OR press 'a' to open Android emulator

# Test the following:
1. App loads without errors
2. Can create new account
3. Can log in with existing account
4. Session persists after closing/reopening app
5. Can log out successfully
```

---

### Phase 2: Core Product Management (Week 3-4)

**Goal:** Implement basic CRUD operations for products

#### Features to Build:

**2.1 Products List Screen** 📱
- [ ] Create `app/(tabs)/products.tsx` screen
- [ ] Fetch products from Supabase `products` table
- [ ] Display products in a FlatList (scrollable list)
- [ ] Show: product name, expiry date, days until expiry
- [ ] Color-code items by urgency (red < 7 days, yellow < 30 days, green > 30 days)
- [ ] Add pull-to-refresh functionality
- [ ] Handle empty state (no products yet)
- [ ] Handle loading state
- [ ] Handle error state

**2.2 Product Detail Screen**
- [ ] Create `app/product/[id].tsx` screen (dynamic route)
- [ ] Show all product information
- [ ] Display product image (if available)
- [ ] Show expiry countdown
- [ ] Add edit button
- [ ] Add delete button (with confirmation)

**2.3 Add Product Screen**
- [ ] Create `app/product/add.tsx` screen
- [ ] Form inputs: product name, barcode, expiry date
- [ ] Date picker for expiry date
- [ ] Manual barcode entry (for now)
- [ ] Save to Supabase
- [ ] Navigate back to list after save
- [ ] Show success message

**2.4 Edit Product Screen**
- [ ] Create `app/product/edit/[id].tsx` screen
- [ ] Pre-fill form with existing product data
- [ ] Update product in Supabase
- [ ] Handle concurrent edit conflicts

**Code Structure:**
```typescript
// Example: app/(tabs)/products.tsx
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ProductsScreen() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('expiry_date', { ascending: true });
    
    if (error) console.error(error);
    else setProducts(data);
    setLoading(false);
  };

  // ... render FlatList with products
}
```

---

### Phase 3: Barcode Scanning (Week 5)

**Goal:** Native camera barcode scanning

#### Features to Build:

**3.1 Barcode Scanner Screen**
- [ ] Create `app/scan.tsx` screen
- [ ] Request camera permissions
- [ ] Integrate expo-camera
- [ ] Integrate expo-barcode-scanner
- [ ] Scan and detect barcodes (EAN-13, UPC-A, etc.)
- [ ] Vibrate on successful scan
- [ ] Show scan indicator overlay
- [ ] Handle scan results

**3.2 Product Database Lookup**
- [ ] After scanning, look up barcode in your community database
- [ ] If found: Pre-fill product name and details
- [ ] If not found: Allow manual entry
- [ ] Option to contribute to community database

**3.3 Batch Scanning Mode**
- [ ] Scan multiple products without leaving camera
- [ ] Queue scanned items
- [ ] Review and save all at once

**Permission Handling:**
```typescript
import { Camera } from 'expo-camera';

const [permission, requestPermission] = Camera.useCameraPermissions();

if (!permission?.granted) {
  return (
    <View>
      <Text>Camera access is required to scan barcodes</Text>
      <Button title="Grant Permission" onPress={requestPermission} />
    </View>
  );
}
```

---

### Phase 4: Notifications (Week 6)

**Goal:** Push notifications for expiring products

#### Features to Build:

**4.1 Push Notification Setup**
- [ ] Configure expo-notifications
- [ ] Request notification permissions
- [ ] Register device for push notifications
- [ ] Store push token in Supabase `push_tokens` table
- [ ] Test sending notifications

**4.2 Notification Scheduling**
- [ ] Create Supabase Edge Function or cron job
- [ ] Query products expiring in 1, 3, 7 days
- [ ] Send push notifications to users
- [ ] Handle notification tap (deep link to product)

**4.3 Notification Preferences**
- [ ] Settings screen for notification preferences
- [ ] Choose days in advance (1, 3, 7, 14, 30)
- [ ] Time of day preferences
- [ ] Enable/disable by category

---

### Phase 5: Offline Support (Week 7-8)

**Goal:** Basic offline functionality

#### Features to Build:

**5.1 Local Caching**
- [ ] Cache products in AsyncStorage
- [ ] Load from cache first, then sync from server
- [ ] Show cached data when offline
- [ ] Display "offline mode" indicator

**5.2 Offline Mutations Queue**
- [ ] Queue create/update/delete operations when offline
- [ ] Sync changes when back online
- [ ] Show pending sync status
- [ ] Handle conflicts (last-write-wins for v1)

**5.3 Background Sync**
- [ ] Periodically check for network and sync
- [ ] Background fetch for new data
- [ ] Update badge count for expiring items

---

### Phase 6: UI/UX Polish (Week 9-10)

**Goal:** Professional, intuitive interface

#### Features to Build:

**6.1 Navigation Improvements**
- [ ] Bottom tab navigation (Products, Scan, Notifications, Profile)
- [ ] Smooth transitions between screens
- [ ] Proper back button handling
- [ ] Deep linking support

**6.2 Design System**
- [ ] Create reusable component library
- [ ] Consistent color palette
- [ ] Typography scale
- [ ] Spacing system
- [ ] Button variants
- [ ] Input field variants

**6.3 Animations & Micro-interactions**
- [ ] Smooth list animations
- [ ] Loading skeletons
- [ ] Success/error animations
- [ ] Swipe gestures (delete, mark as handled)

**6.4 Accessibility**
- [ ] Screen reader support (labels)
- [ ] Minimum touch target size (48dp)
- [ ] Color contrast ratio (WCAG AA)
- [ ] Keyboard navigation
- [ ] VoiceOver/TalkBack testing

---

### Phase 7: Subscription & Plan Management (Week 11)

**Goal:** Enforce plan limits, upsell to paid tiers

#### Features to Build:

**7.1 Plan Limit Enforcement**
- [ ] Check user's plan before adding products
- [ ] Show "upgrade required" modal when limit reached
- [ ] Display current usage (47/50 products)
- [ ] Link to Stripe billing portal

**7.2 Subscription Management**
- [ ] Show current plan in profile
- [ ] "Upgrade" button in app
- [ ] Link to Stripe Checkout (web)
- [ ] Handle webhooks for plan changes
- [ ] Sync plan status with Supabase

**7.3 Feature Gating**
- [ ] Disable camera scanning on Free plan (show upgrade prompt)
- [ ] Limit to 50 products on Free
- [ ] Disable notifications on Free
- [ ] Show "Pro" badges on locked features

---

### Phase 8: Testing & QA (Week 12-13)

**Goal:** Ensure stability and reliability

#### Testing Checklist:

**8.1 Unit Tests**
- [ ] Test auth functions
- [ ] Test product CRUD operations
- [ ] Test barcode scanning logic
- [ ] Test notification scheduling

**8.2 Integration Tests**
- [ ] Test end-to-end flows
- [ ] Test offline/online transitions
- [ ] Test RLS policies (multi-user isolation)

**8.3 Manual Testing**
- [ ] Test on multiple Android devices
- [ ] Test on different Android versions
- [ ] Test with slow network
- [ ] Test with no network
- [ ] Test with large datasets (1000+ products)
- [ ] Test edge cases (expired token, deleted account, etc.)

**8.4 Beta Testing**
- [ ] Create internal testing track on Google Play
- [ ] Invite 5-10 beta testers
- [ ] Collect feedback
- [ ] Fix critical bugs

---

### Phase 9: Launch Preparation (Week 14)

**Goal:** Get ready for Google Play Store

#### Launch Checklist:

**9.1 App Store Assets**
- [ ] App icon (512x512px)
- [ ] Feature graphic (1024x500px)
- [ ] Screenshots (phone + tablet)
- [ ] App description (short + long)
- [ ] Privacy policy URL
- [ ] Terms of service URL

**9.2 Legal & Compliance**
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance (if applicable)
- [ ] Data deletion instructions
- [ ] Contact email for support

**9.3 Build Configuration**
- [ ] Set app version (1.0.0)
- [ ] Create production build with EAS
- [ ] Test production build on device
- [ ] Configure app signing

**9.4 Google Play Console Setup**
- [ ] Create Google Play Developer account ($25 fee)
- [ ] Create app listing
- [ ] Upload APK/AAB
- [ ] Complete content rating questionnaire
- [ ] Set pricing (free) and countries
- [ ] Submit for review

**Build Commands:**
```bash
# Create production Android build
eas build --platform android --profile production

# Submit to Google Play (after build completes)
eas submit --platform android --latest
```

---

### Phase 10: Post-Launch (Month 2+)

**Goal:** Iterate based on user feedback

#### Ongoing Tasks:

**10.1 Monitoring**
- [ ] Set up crash reporting (Sentry)
- [ ] Monitor Play Store reviews
- [ ] Track key metrics (DAU, retention, crashes)
- [ ] Set up analytics (Mixpanel/Amplitude)

**10.2 Feature Roadmap** (from PRD)
- [ ] Dark mode (v1.1)
- [ ] Batch scan mode (v1.1)
- [ ] Product photos (v1.2)
- [ ] Quick add widget (v1.2)
- [ ] Export reports (v1.3)
- [ ] Inventory analytics (v1.3)
- [ ] iOS launch (v2.0)
- [ ] Multi-store support (v2.0)

**10.3 Iteration**
- [ ] Fix bugs reported by users
- [ ] Improve performance based on metrics
- [ ] A/B test features
- [ ] Optimize onboarding flow
- [ ] Add requested features

---

## 🚀 How to Start Building

### Step 1: Set Up Your Environment
```bash
# Clone/navigate to your project
cd lifecycle-mobile

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm start
```

### Step 2: Test Authentication
1. Open app in Expo Go
2. Try signing up
3. Try signing in
4. Try signing out
5. Close app and reopen (should stay logged in)

### Step 3: Build Products List (First Real Feature!)
```bash
# Create new screen
mkdir -p app/(tabs)
touch app/(tabs)/products.tsx

# Start building! Follow Phase 2.1 above
```

### Step 4: Learn As You Go
- Reference the commented code files I created
- Check Expo docs: https://docs.expo.dev/
- Check React Native docs: https://reactnative.dev/
- Ask questions when stuck!

---

## 📚 Key Resources

**Documentation:**
- Expo Router: https://expo.github.io/router/docs/
- React Native: https://reactnative.dev/docs/getting-started
- Supabase: https://supabase.com/docs
- TypeScript: https://www.typescriptlang.org/docs/

**Communities:**
- Expo Discord: https://chat.expo.dev/
- React Native Community: https://www.reactnative.dev/help
- Supabase Discord: https://discord.supabase.com/

**Learning:**
- Expo Learn: https://docs.expo.dev/tutorial/introduction/
- React Native School: https://www.reactnativeschool.com/
- FreeCodeCamp React Native: https://www.youtube.com/watch?v=obH0Po_RdWk

---

## 🐛 Common Issues & Solutions

### Issue: "Metro bundler won't start"
**Solution:** 
```bash
# Clear cache and restart
npx expo start --clear
```

### Issue: "Can't connect to dev server on phone"
**Solution:**
1. Make sure phone and computer on same WiFi
2. Try tunnel mode: `npx expo start --tunnel`

### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: "Build failed on EAS"
**Solution:**
1. Check build logs in Expo dashboard
2. Verify app.json configuration
3. Make sure no missing dependencies in package.json

### Issue: Supabase auth not working
**Solution:**
1. Check .env file has correct credentials
2. Verify Supabase RLS policies allow access
3. Check browser console for CORS errors
4. Test with Supabase dashboard SQL editor

---

## ✅ Ready to Build!

You now have:
- ✅ Complete development environment
- ✅ Well-documented starter code
- ✅ Clear roadmap to follow
- ✅ Resources for learning
- ✅ Common issues documented

**Start with Phase 1 testing, then move to Phase 2 (Products List).**

Good luck building LifeCycle! 🚀
