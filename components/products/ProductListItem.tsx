/**
 * ProductListItem — card with name, category, earliest expiry, quantity, status badge, chevron.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts, FontSizes, Spacing } from '../../constants/theme';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
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
}

export function ProductListItem({ product, onPress }: ProductListItemProps) {
  const exp = earliestExpiry(product.product_batches);
  const qty = totalQty(product.product_batches);
  const batchCount = product.product_batches?.length ?? 0;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.meta}>
            {product.category || 'Uncategorized'}
            {exp ? ` · ${exp}` : ''}
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

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
  },
  name: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  meta: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
    color: Colors.textMuted,
  },
  chevron: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes['2xl'],
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
});
