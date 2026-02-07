/**
 * ProductListItem — card with name, category, earliest expiry, quantity, status badge, chevron.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, FontSizes, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate } from '../../lib/utils/date';
import { getProductStatus, getStatusLabel, daysUntil } from '../../constants/status';
import type { ProductWithBatches } from '../../lib/types/database';

function earliestExpiry(batches: ProductWithBatches['product_batches']): string | null {
  if (!batches?.length) return null;
  return batches.reduce(
    (min, b) => (!min || b.expiry_date < min ? b.expiry_date : min),
    batches[0].expiry_date
  );
}

function totalQty(batches: ProductWithBatches['product_batches']): number {
  if (!batches?.length) return 0;
  return batches.reduce((s, b) => s + (b.quantity ?? 0), 0);
}

interface ProductListItemProps {
  product: ProductWithBatches;
  onPress: () => void;
  onDelete?: () => void;
  selectionMode?: boolean;
  selected?: boolean;
}

function formatExpiryDisplay(expiryDate: string): string {
  const days = daysUntil(expiryDate);
  const status = getProductStatus(expiryDate);
  if (status === 'expired' || days <= 7) {
    return getStatusLabel(status, days);
  }
  return formatDate(expiryDate);
}

export function ProductListItem({ product, onPress, selectionMode, selected }: ProductListItemProps) {
  const { colors } = useTheme();
  const exp = earliestExpiry(product.product_batches);
  const qty = totalQty(product.product_batches);
  const batchCount = product.product_batches?.length ?? 0;
  const expiryDisplay = exp ? formatExpiryDisplay(exp) : null;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: { padding: Spacing.lg, marginBottom: Spacing.sm },
        row: { flexDirection: 'row', alignItems: 'center' },
        checkboxWrap: { marginRight: Spacing.md },
        main: { flex: 1 },
        name: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
        },
        meta: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          marginTop: Spacing.xs,
        },
        footer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Spacing.sm,
          gap: Spacing.sm,
        },
        qty: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textMuted,
        },
        chevron: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes['2xl'],
          color: colors.textMuted,
          marginLeft: Spacing.sm,
        },
      }),
    [colors]
  );

  return (
    <Card
      onPress={onPress}
      style={styles.card}
      accessibilityLabel={`${product.name}, ${product.category || 'Uncategorized'}${expiryDisplay ? `, ${expiryDisplay}` : ''}`}
      accessibilityRole="button"
    >
      <View style={styles.row}>
        {selectionMode && (
          <View style={styles.checkboxWrap}>
            <Ionicons
              name={selected ? 'checkbox' : 'square-outline'}
              size={24}
              color={selected ? colors.primary : colors.textMuted}
            />
          </View>
        )}
        <View style={styles.main}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.meta}>
            {product.category || 'Uncategorized'}
            {expiryDisplay ? ` · ${expiryDisplay}` : ''}
            {batchCount > 0 ? ` · ${batchCount} batch${batchCount !== 1 ? 'es' : ''}` : ''}
          </Text>
          <View style={styles.footer}>
            {exp ? <StatusBadge expiryDate={exp} /> : null}
            <Text style={styles.qty}>Qty {qty}</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Card>
  );
}
