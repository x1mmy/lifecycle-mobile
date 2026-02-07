/**
 * Dashboard — LifeCycle branding, expiry alert, stats, Quick Add CTA, Expiring Soon list.
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../lib/hooks/useProducts';
import { useProfile } from '../../lib/hooks/useProfile';
import { useSettings } from '../../lib/hooks/useSettings';
import { scheduleDailyAndWeeklyNotifications } from '../../lib/services/notifications';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { daysUntil } from '../../constants/status';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { FadeInView } from '../../components/ui/FadeInView';
import { MarkHandledButton } from '../../components/ui/MarkHandledButton';
import type { ProductWithBatches } from '../../lib/types/database';

const STAGGER_MS = 60;
const FADE_DURATION = 420;

function formatGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function earliestExpiry(batches: ProductWithBatches['product_batches']): string | null {
  if (!batches?.length) return null;
  return batches.reduce(
    (min, b) => (!min || b.expiry_date < min ? b.expiry_date : min),
    batches[0].expiry_date
  );
}

function totalUnits(products: ProductWithBatches[]): number {
  return products.reduce((sum, p) => {
    const batches = p.product_batches ?? [];
    return sum + batches.reduce((s, b) => s + (b.quantity ?? 0), 0);
  }, 0);
}

function formatExpiryLabel(expiryDate: string): { text: string; urgent: boolean } {
  const days = daysUntil(expiryDate);
  if (days < 0) return { text: 'Expired', urgent: true };
  if (days === 0) return { text: 'Today', urgent: true };
  if (days === 1) return { text: '1 day', urgent: false };
  return { text: `${days} days`, urgent: false };
}

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: products, loading, refetch } = useProducts(user?.id);
  const { data: settings } = useSettings(user?.id);
  const [handledIds, setHandledIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        scrollContent: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
        brand: { fontFamily: Fonts.bold, fontSize: FontSizes['2xl'], color: colors.textPrimary },
        brandPeriod: { color: colors.primary },
        subtitle: { fontFamily: Fonts.regular, fontSize: FontSizes.sm, color: colors.textSecondary, marginTop: 2 },
        avatar: {
          width: 44,
          height: 44,
          borderRadius: BorderRadius.full,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        },
        avatarText: { fontFamily: Fonts.bold, fontSize: FontSizes.sm, color: colors.primary },
        greeting: { fontFamily: Fonts.medium, fontSize: FontSizes.md, color: colors.textSecondary, marginBottom: Spacing.xs },
        date: { fontFamily: Fonts.regular, fontSize: FontSizes.sm, color: colors.textMuted, marginBottom: Spacing.xl },
        alertBanner: {
          backgroundColor: colors.destructiveLight,
          borderRadius: BorderRadius.md,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          marginBottom: Spacing.lg,
          borderLeftWidth: 4,
          borderLeftColor: colors.destructive,
        },
        alertText: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: colors.destructive },
        statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -Spacing.xs, marginBottom: Spacing.xl },
        statCardWrap: { width: '48%', marginHorizontal: '1%', marginBottom: Spacing.md },
        statCard: { padding: Spacing.lg, ...Shadows.sm },
        statValue: { fontFamily: Fonts.bold, fontSize: FontSizes['3xl'], color: colors.textPrimary },
        statLabel: { fontFamily: Fonts.regular, fontSize: FontSizes.xs, color: colors.textSecondary, marginTop: Spacing.xs },
        statWarning: { color: colors.warning },
        statDanger: { color: colors.destructive },
        quickAddCta: {
          backgroundColor: colors.primary,
          borderRadius: BorderRadius.lg,
          padding: Spacing.xl,
          marginBottom: Spacing.xl,
          alignItems: 'center',
          ...Shadows.lg,
        },
        quickAddIcon: {
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: 'rgba(255,255,255,0.25)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Spacing.md,
        },
        quickAddTitle: { fontFamily: Fonts.bold, fontSize: FontSizes.lg, color: colors.white, marginBottom: Spacing.xs },
        quickAddSubtitle: { fontFamily: Fonts.regular, fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.9)' },
        section: { marginBottom: Spacing.xl },
        sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
        sectionTitle: { fontFamily: Fonts.bold, fontSize: FontSizes.lg, color: colors.textPrimary },
        expiringCard: { padding: Spacing.lg, marginBottom: Spacing.sm, ...Shadows.sm },
        expiringRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
        expiringMain: { flex: 1, marginRight: Spacing.md },
        expiringName: { fontFamily: Fonts.medium, fontSize: FontSizes.md, color: colors.textPrimary },
        expiringMeta: { fontFamily: Fonts.regular, fontSize: FontSizes.sm, color: colors.textSecondary, marginTop: Spacing.xs },
        expiringRight: { alignItems: 'flex-end' },
        expiringDays: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: colors.warning },
        expiringDaysUrgent: { color: colors.destructive },
        bottomPad: { height: Spacing['2xl'] },
      }),
    [colors]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {
    if (!settings?.daily_expiry_alerts_enabled || !products) return;
    scheduleDailyAndWeeklyNotifications(products, {
      daily_expiry_alerts_enabled: settings.daily_expiry_alerts_enabled,
      alert_threshold: settings.alert_threshold,
    }).catch(() => {});
  }, [products, settings]);

  const stats = useMemo(() => {
    let total = 0;
    let expiringSoon = 0;
    let expired = 0;
    products.forEach((p) => {
      const batches = p.product_batches ?? [];
      total += batches.length ? 1 : 0;
      batches.forEach((b) => {
        const days = daysUntil(b.expiry_date);
        if (days < 0) expired++;
        else if (days <= 7) expiringSoon++;
      });
    });
    return {
      total,
      expiringSoon,
      expired,
      totalUnits: totalUnits(products),
    };
  }, [products]);

  const expiringTodayCount = useMemo(() => {
    return products.reduce((count, p) => {
      const exp = earliestExpiry(p.product_batches);
      return exp && daysUntil(exp) === 0 ? count + 1 : count;
    }, 0);
  }, [products]);

  const expiringSoonList = useMemo(() => {
    return products
      .filter((p) => {
        const exp = earliestExpiry(p.product_batches);
        return exp && daysUntil(exp) >= 0 && daysUntil(exp) <= 7;
      })
      .sort((a, b) => {
        const ea = earliestExpiry(a.product_batches);
        const eb = earliestExpiry(b.product_batches);
        if (!ea || !eb) return 0;
        return daysUntil(ea) - daysUntil(eb);
      })
      .slice(0, 8);
  }, [products]);

  const toggleHandled = (productId: string) => {
    setHandledIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const businessName = profile?.business_name?.trim() || 'there';
  const initials = (businessName || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!user) return null;

  if (products.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>LifeCycle<Text style={styles.brandPeriod}>.</Text></Text>
            <Text style={styles.subtitle}>{businessName}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.greeting}>{formatGreeting()}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <EmptyState
          icon="📦"
          title="No products yet"
          description="Add your first product to start tracking expiration dates."
          actionLabel="Add Your First Product"
          onAction={() => router.push('/(tabs)/products/add')}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={0} duration={FADE_DURATION}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>LifeCycle<Text style={styles.brandPeriod}>.</Text></Text>
            <Text style={styles.subtitle}>{businessName}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.greeting}>{formatGreeting()}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </FadeInView>

      {expiringTodayCount > 0 && (
        <FadeInView delay={STAGGER_MS} duration={FADE_DURATION}>
          <AnimatedPressable
            onPress={() => router.push('/(tabs)/products')}
            style={styles.alertBanner}
            haptic
          >
            <Text style={styles.alertText}>
              • {expiringTodayCount} item{expiringTodayCount !== 1 ? 's' : ''} expire today — Tap to view
            </Text>
          </AnimatedPressable>
        </FadeInView>
      )}

      <View style={styles.statsGrid}>
        {[
          { value: stats.total, label: 'Total Products', style: null },
          { value: stats.expiringSoon, label: 'Expiring Soon', style: styles.statWarning },
          { value: stats.expired, label: 'Expired', style: styles.statDanger },
          { value: stats.totalUnits, label: 'Total Units', style: null },
        ].map((item, i) => (
          <FadeInView
            key={item.label}
            delay={STAGGER_MS * 2 + i * STAGGER_MS}
            duration={FADE_DURATION}
            style={styles.statCardWrap}
          >
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, item.style]}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </Card>
          </FadeInView>
        ))}
      </View>

      <FadeInView delay={STAGGER_MS * 6} duration={FADE_DURATION}>
        <AnimatedPressable
          onPress={() => router.push('/(tabs)/products/add')}
          style={styles.quickAddCta}
          haptic
        >
          <View style={styles.quickAddIcon}>
            <Ionicons name="add" size={28} color={colors.white} />
          </View>
          <Text style={styles.quickAddTitle}>Quick Add Products</Text>
          <Text style={styles.quickAddSubtitle}>Scan or type to add fast.</Text>
        </AnimatedPressable>
      </FadeInView>

      {expiringSoonList.length > 0 && (
        <View style={styles.section}>
          <FadeInView delay={STAGGER_MS * 7} duration={FADE_DURATION}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={18} color={colors.warning} />
              <Text style={styles.sectionTitle}> Expiring Soon</Text>
            </View>
          </FadeInView>
          {expiringSoonList
            .filter((p) => !handledIds.has(p.id))
            .map((p, index) => {
              const exp = earliestExpiry(p.product_batches);
              if (!exp) return null;
              const batch = p.product_batches?.find((b) => b.expiry_date === exp);
              const qty = batch?.quantity ?? '—';
              const batchNum = batch?.batch_number ? `#${batch.batch_number}` : '';
              const meta = [batchNum, `${qty} units`].filter(Boolean).join(' · ');
              const { text: expiryLabel, urgent } = formatExpiryLabel(exp);
              return (
                <FadeInView
                  key={p.id}
                  delay={STAGGER_MS * 8 + index * STAGGER_MS}
                  duration={FADE_DURATION}
                >
                  <Card
                    style={styles.expiringCard}
                    onPress={() => router.push(`/(tabs)/products/${p.id}`)}
                  >
                    <View style={styles.expiringRow}>
                      <View style={styles.expiringMain}>
                        <Text style={styles.expiringName} numberOfLines={1}>
                          {p.name}
                        </Text>
                        <Text style={styles.expiringMeta}>{meta}</Text>
                      </View>
                      <View style={styles.expiringRight}>
                        <MarkHandledButton onPress={() => toggleHandled(p.id)} />
                        <Text style={[styles.expiringDays, urgent && styles.expiringDaysUrgent]}>
                          {expiryLabel}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </FadeInView>
              );
            })}
        </View>
      )}

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

