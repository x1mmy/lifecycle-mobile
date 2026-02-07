/**
 * Product list — SearchBar, filter, FlatList, swipe/long-press delete, FAB.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useProducts } from '../../../lib/hooks/useProducts';
import { router } from 'expo-router';
import { deleteProducts } from '../../../lib/services/products';
import { useToast } from '../../../components/ui/Toast';
import { SearchBar } from '../../../components/ui/SearchBar';
import { FilterChips, ChipOption } from '../../../components/ui/FilterChips';
import { AnimatedPressable } from '../../../components/ui/AnimatedPressable';
import { ProductListItem } from '../../../components/products/ProductListItem';
import { EmptyState } from '../../../components/ui/EmptyState';
import { FadeInView } from '../../../components/ui/FadeInView';
import { ProductListSkeleton } from '../../../components/ui/LoadingSkeleton';
import { Fonts, FontSizes, Spacing } from '../../../constants/theme';
import { daysUntil } from '../../../constants/status';
import type { ProductWithBatches } from '../../../lib/types/database';

type SortOption = 'expiry' | 'name' | 'category' | 'quantity';
type StatusFilter = 'all' | 'expired' | 'expiring' | 'good';

function earliestExpiry(batches: ProductWithBatches['product_batches']): string | null {
  if (!batches?.length) return null;
  return batches.reduce(
    (min, b) => (!min || b.expiry_date < min ? b.expiry_date : min),
    batches[0].expiry_date
  );
}

export default function ProductsListScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOption>('expiry');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        toolbar: {
          padding: Spacing.lg,
          paddingBottom: Spacing.sm,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        sortRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
        sortLabel: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          marginRight: Spacing.sm,
        },
        sortChips: { flex: 1 },
        bulkDelete: {
          marginTop: Spacing.md,
          padding: Spacing.md,
          backgroundColor: colors.destructiveLight,
          borderRadius: 8,
          alignItems: 'center',
        },
        bulkDeleteText: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: colors.destructive },
        selectBtn: {
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.md,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
        },
        selectBtnActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
        selectBtnText: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: colors.textSecondary },
        selectBtnTextActive: { color: colors.primary },
        cancelSelect: { marginTop: Spacing.sm, padding: Spacing.sm, alignItems: 'center' },
        cancelSelectText: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: colors.textMuted },
        listWrap: { flex: 1 },
        listContent: { padding: Spacing.lg, paddingBottom: 100 },
        footer: { height: Spacing.lg },
        fab: {
          position: 'absolute',
          right: Spacing.xl,
          bottom: 32,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        fabText: { fontSize: 28, color: colors.white, fontFamily: Fonts.medium, lineHeight: 32 },
      }),
    [colors]
  );

  const { data: products, loading, refetch } = useProducts(user?.id, {
    search: search || undefined,
    sort,
  });
  const [refreshing, setRefreshing] = useState(false);

  const { success, error: showError } = useToast();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const filtered = React.useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter((p) => {
      const exp = earliestExpiry(p.product_batches);
      if (!exp) return statusFilter === 'good';
      const days = daysUntil(exp);
      if (statusFilter === 'expired') return days < 0;
      if (statusFilter === 'expiring') return days >= 0 && days <= 7;
      return days > 7;
    });
  }, [products, statusFilter]);

  const statusCounts = React.useMemo(() => {
    let expired = 0,
      expiring = 0,
      good = 0;
    products.forEach((p) => {
      const exp = earliestExpiry(p.product_batches);
      if (!exp) {
        good++;
        return;
      }
      const d = daysUntil(exp);
      if (d < 0) expired++;
      else if (d <= 7) expiring++;
      else good++;
    });
    return { expired, expiring, good };
  }, [products]);

  const statusOptions: ChipOption[] = [
    { value: 'all', label: 'All', count: products.length },
    { value: 'expired', label: 'Expired', count: statusCounts.expired },
    { value: 'expiring', label: 'Expiring Soon', count: statusCounts.expiring },
    { value: 'good', label: 'Good', count: statusCounts.good },
  ];

  const sortOptions: ChipOption[] = [
    { value: 'expiry', label: 'Expiry' },
    { value: 'name', label: 'Name' },
    { value: 'category', label: 'Category' },
    { value: 'quantity', label: 'Quantity' },
  ];

  const handleDelete = useCallback(
    async (id: string) => {
      Alert.alert('Delete product', 'Remove this product and all its batches?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProducts([id]);
              success('Product deleted');
              refetch();
            } catch (e) {
              showError(e instanceof Error ? e.message : 'Failed to delete');
            }
          },
        },
      ]);
    },
    [refetch, success, showError]
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    Alert.alert('Delete products', `Remove ${selectedIds.size} product(s) and their batches?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProducts(Array.from(selectedIds));
            success('Products deleted');
            setSelectedIds(new Set());
            setSelectionMode(false);
            refetch();
          } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to delete');
          }
        },
      },
    ]);
  }, [selectedIds, refetch, success, showError]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const renderItem = ({ item }: { item: ProductWithBatches }) => (
    <ProductListItem
      product={item}
      onPress={() => {
        if (selectionMode) toggleSelect(item.id);
        else router.push(`/(tabs)/products/${item.id}`);
      }}
      selectionMode={selectionMode}
      selected={selectedIds.has(item.id)}
    />
  );

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search products…" />
        <FilterChips options={statusOptions} selected={statusFilter} onSelect={(v) => setStatusFilter(v as StatusFilter)} />
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort:</Text>
          <View style={styles.sortChips}>
            <FilterChips options={sortOptions} selected={sort} onSelect={(v) => setSort(v as SortOption)} />
          </View>
          <TouchableOpacity
            style={[styles.selectBtn, selectionMode && styles.selectBtnActive]}
            onPress={() => setSelectionMode((prev) => !prev)}
          >
            <Text style={[styles.selectBtnText, selectionMode && styles.selectBtnTextActive]}>
              {selectionMode ? 'Cancel' : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
        {selectionMode && selectedIds.size > 0 && (
          <TouchableOpacity style={styles.bulkDelete} onPress={handleBulkDelete}>
            <Text style={styles.bulkDeleteText}>Delete selected ({selectedIds.size})</Text>
          </TouchableOpacity>
        )}
        {selectionMode && selectedIds.size === 0 && (
          <TouchableOpacity style={styles.cancelSelect} onPress={exitSelectionMode}>
            <Text style={styles.cancelSelectText}>Cancel selection</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && filtered.length === 0 ? (
        <ProductListSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No products"
          description={products.length === 0 ? 'Add your first product to get started.' : 'No products match your filters.'}
          actionLabel={products.length === 0 ? 'Add Product' : undefined}
          onAction={products.length === 0 ? () => router.push('/(tabs)/products/add') : undefined}
        />
      ) : (
        <FadeInView key={`${statusFilter}-${sort}`} delay={0} duration={280} style={styles.listWrap}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListFooterComponent={<View style={styles.footer} />}
          />
        </FadeInView>
      )}

      <AnimatedPressable
        style={styles.fab}
        onPress={() => router.push('/(tabs)/products/add')}
        haptic
      >
        <Text style={styles.fabText}>+</Text>
      </AnimatedPressable>
    </View>
  );
}

