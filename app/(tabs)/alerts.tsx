/**
 * Alerts — expiry alerts: expiring today, expiring soon, expired. Real content, not a link.
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../lib/hooks/useProducts';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Fonts, FontSizes, Spacing, Shadows } from '../../constants/theme';
import { daysUntil } from '../../constants/status';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { MarkHandledButton } from '../../components/ui/MarkHandledButton';
import { FadeInView } from '../../components/ui/FadeInView';
import type { ProductWithBatches } from '../../lib/types/database';

const STAGGER_MS = 50;
const FADE_DURATION = 380;

function earliestExpiry(batches: ProductWithBatches['product_batches']): string | null {
  if (!batches?.length) return null;
  return batches.reduce(
    (min, b) => (!min || b.expiry_date < min ? b.expiry_date : min),
    batches[0].expiry_date
  );
}

function formatExpiryLabel(expiryDate: string): { text: string; urgent: boolean } {
  const days = daysUntil(expiryDate);
  if (days < 0) return { text: 'Expired', urgent: true };
  if (days === 0) return { text: 'Today', urgent: true };
  if (days === 1) return { text: '1 day left', urgent: false };
  return { text: `${days} days left`, urgent: false };
}

export default function AlertsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: products, loading, refetch } = useProducts(user?.id);
  const [handledIds, setHandledIds] = useState<Set<string>>(new Set());
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        scrollContent: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
        section: { marginBottom: Spacing.xl },
        sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
        sectionHeaderUrgent: {},
        sectionHeaderExpired: {},
        sectionTitle: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes.lg,
          color: colors.textPrimary,
        },
        sectionTitleUrgent: { color: colors.destructive },
        sectionTitleExpired: { color: colors.destructive },
        alertCard: { padding: Spacing.lg, marginBottom: Spacing.sm, ...Shadows.sm },
        alertRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
        alertMain: { flex: 1, marginRight: Spacing.md },
        alertName: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
        },
        alertMeta: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          marginTop: Spacing.xs,
        },
        alertRight: { alignItems: 'flex-end' },
        alertDays: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.warning,
        },
        alertDaysUrgent: { color: colors.destructive },
        settingsLink: { marginTop: Spacing.xl, alignItems: 'center' },
        settingsLinkText: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textMuted,
        },
        bottomPad: { height: Spacing['2xl'] },
      }),
    [colors]
  );

  const { today, soon, expired } = useMemo(() => {
    const today: ProductWithBatches[] = [];
    const soon: ProductWithBatches[] = [];
    const expired: ProductWithBatches[] = [];
    products.forEach((p) => {
      const exp = earliestExpiry(p.product_batches);
      if (!exp) return;
      const d = daysUntil(exp);
      if (d < 0) expired.push(p);
      else if (d === 0) today.push(p);
      else if (d <= 7) soon.push(p);
    });
    const sortByExpiry = (a: ProductWithBatches, b: ProductWithBatches) => {
      const ea = earliestExpiry(a.product_batches);
      const eb = earliestExpiry(b.product_batches);
      if (!ea || !eb) return 0;
      return daysUntil(ea) - daysUntil(eb);
    };
    soon.sort(sortByExpiry);
    expired.sort((a, b) => {
      const ea = earliestExpiry(a.product_batches);
      const eb = earliestExpiry(b.product_batches);
      if (!ea || !eb) return 0;
      return daysUntil(ea) - daysUntil(eb);
    });
    return { today, soon, expired };
  }, [products]);

  const toggleHandled = (productId: string) => {
    setHandledIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const visibleToday = today.filter((p) => !handledIds.has(p.id));
  const visibleSoon = soon.filter((p) => !handledIds.has(p.id));
  const visibleExpired = expired.filter((p) => !handledIds.has(p.id));
  const hasAny = visibleToday.length > 0 || visibleSoon.length > 0 || visibleExpired.length > 0;

  const renderAlertCard = (p: ProductWithBatches, index: number, sectionDelay: number) => {
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
        delay={sectionDelay + index * STAGGER_MS}
        duration={FADE_DURATION}
      >
        <Card
          style={styles.alertCard}
          onPress={() => router.push(`/(tabs)/products/${p.id}`)}
        >
          <View style={styles.alertRow}>
            <View style={styles.alertMain}>
              <Text style={styles.alertName} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={styles.alertMeta}>{meta}</Text>
            </View>
            <View style={styles.alertRight}>
              <MarkHandledButton onPress={() => toggleHandled(p.id)} />
              <Text style={[styles.alertDays, urgent && styles.alertDaysUrgent]}>
                {expiryLabel}
              </Text>
            </View>
          </View>
        </Card>
      </FadeInView>
    );
  };

  if (!user) return null;

  if (!hasAny && !loading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <EmptyState
          icon="🔔"
          title="No alerts right now"
          description="When products expire today, within 7 days, or are already expired, they’ll show up here."
          actionLabel="View products"
          onAction={() => router.push('/(tabs)/products')}
        />
        <View style={styles.settingsLink}>
          <Text
            style={styles.settingsLinkText}
            onPress={() => router.push('/(tabs)/settings/notifications')}
          >
            Notification settings →
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      showsVerticalScrollIndicator={false}
    >
      {visibleToday.length > 0 && (
        <View style={styles.section}>
          <View style={[styles.sectionHeader, styles.sectionHeaderUrgent]}>
            <Ionicons name="alert-circle" size={18} color={colors.destructive} />
            <Text style={[styles.sectionTitle, styles.sectionTitleUrgent]}>
              {' '}Expiring today
            </Text>
          </View>
          {visibleToday.map((p, i) => renderAlertCard(p, i, 0))}
        </View>
      )}

      {visibleSoon.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={18} color={colors.warning} />
            <Text style={styles.sectionTitle}> Expiring soon (1–7 days)</Text>
          </View>
          {visibleSoon.map((p, i) =>
            renderAlertCard(p, i, STAGGER_MS * (visibleToday.length + 1))
          )}
        </View>
      )}

      {visibleExpired.length > 0 && (
        <View style={styles.section}>
          <View style={[styles.sectionHeader, styles.sectionHeaderExpired]}>
            <Ionicons name="close-circle" size={18} color={colors.destructive} />
            <Text style={[styles.sectionTitle, styles.sectionTitleExpired]}>
              {' '}Expired
            </Text>
          </View>
          {visibleExpired.map((p, i) =>
            renderAlertCard(
              p,
              i,
              STAGGER_MS * (visibleToday.length + visibleSoon.length + 1)
            )
          )}
        </View>
      )}

      <View style={styles.settingsLink}>
        <Text
          style={styles.settingsLinkText}
          onPress={() => router.push('/(tabs)/settings/notifications')}
        >
          Notification settings →
        </Text>
      </View>
      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

