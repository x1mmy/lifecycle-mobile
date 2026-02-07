/**
 * Onboarding — First-run intro (3 slides): scan, add, alerts.
 * Stored in AsyncStorage; shown only once.
 */

import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Fonts, FontSizes, Spacing } from '../constants/theme';

const ONBOARDING_DONE_KEY = 'onboarding_done';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: 'barcode-outline' as const,
    title: 'Scan to add',
    subtitle: 'Use your camera to scan product barcodes and add them to your inventory in seconds.',
  },
  {
    id: '2',
    icon: 'cube-outline' as const,
    title: 'Track expiration dates',
    subtitle: 'LifeCycle tracks expiry dates and helps you manage stock before products go to waste.',
  },
  {
    id: '3',
    icon: 'notifications-outline' as const,
    title: 'Stay on top of alerts',
    subtitle: 'Get notified when products are expiring soon, so you can take action in time.',
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const handleFinish = async () => {
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    router.replace('/login');
  };

  const handleNext = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => handleFinish();

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={item.icon} size={64} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === index ? colors.primary : colors.border },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>{index === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          {index < slides.length - 1 && (
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.nextIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skip: {
    position: 'absolute',
    top: 56,
    right: Spacing.lg,
    zIndex: 1,
  },
  skipText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
  },
  slide: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 120,
    alignItems: 'center',
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes['2xl'],
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: 48,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: 12,
    minWidth: 200,
  },
  nextText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: '#FFFFFF',
  },
  nextIcon: {
    marginLeft: Spacing.sm,
  },
});
