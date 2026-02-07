/**
 * Product detail — info header, batches list, add batch, delete product.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import {
  getProduct,
  updateProduct,
  createBatch,
  deleteBatch,
  deleteProduct,
} from '../../../lib/services/products';
import { useToast } from '../../../components/ui/Toast';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { Modal } from '../../../components/ui/Modal';
import { Colors, Fonts, FontSizes, Spacing } from '../../../constants/theme';
import { formatDate } from '../../../lib/utils/date';
import type { ProductWithBatches, ProductBatch } from '../../../lib/types/database';
import DateTimePicker from '@react-native-community/datetimepicker';

const today = new Date();
today.setHours(0, 0, 0, 0);

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function earliestExpiry(batches: ProductBatch[] | null): string | null {
  if (!batches?.length) return null;
  return batches.reduce(
    (min, b) => (!min || b.expiry_date < min ? b.expiry_date : min),
    batches[0].expiry_date
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [product, setProduct] = useState<ProductWithBatches | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addingBatch, setAddingBatch] = useState(false);
  const [newExpiry, setNewExpiry] = useState(toDateStr(today));
  const [newQty, setNewQty] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const load = async () => {
    if (!id) return;
    try {
      const p = await getProduct(id);
      setProduct(p);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleDeleteProduct = async () => {
    if (!id) return;
    try {
      await deleteProduct(id);
      success('Product deleted');
      setDeleteModalVisible(false);
      router.back();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    const batches = product?.product_batches ?? [];
    if (batches.length <= 1) {
      showError('Keep at least one batch');
      return;
    }
    Alert.alert('Delete batch', 'Remove this batch?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBatch(batchId);
            success('Batch removed');
            load();
          } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to delete');
          }
        },
      },
    ]);
  };

  const handleAddBatch = async () => {
    if (!id || !user) return;
    const qty = newQty.trim() ? Number(newQty) : null;
    if (newQty.trim() && (isNaN(Number(newQty)) || Number(newQty) < 0)) {
      showError('Quantity must be a positive number');
      return;
    }
    try {
      await createBatch({
        product_id: id,
        expiry_date: newExpiry,
        quantity: qty,
        batch_number: null,
        added_date: toDateStr(new Date()),
      });
      success('Batch added');
      setAddingBatch(false);
      setNewExpiry(toDateStr(today));
      setNewQty('');
      load();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to add batch');
    }
  };

  if (!id || (!loading && !product)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Product not found</Text>
      </View>
    );
  }

  if (loading && !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  const batches = (product?.product_batches ?? []).sort(
    (a, b) => a.expiry_date.localeCompare(b.expiry_date)
  );
  const exp = earliestExpiry(product?.product_batches ?? null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
      }
    >
      <Card style={styles.header}>
        <Text style={styles.name}>{product?.name}</Text>
        <Text style={styles.meta}>
          {product?.category || 'Uncategorized'}
          {product?.supplier ? ` · ${product.supplier}` : ''}
        </Text>
        {exp && <StatusBadge expiryDate={exp} />}
        {product?.location ? (
          <Text style={styles.meta}>Location: {product.location}</Text>
        ) : null}
        {product?.notes ? (
          <Text style={styles.notes}>{product.notes}</Text>
        ) : null}
      </Card>

      <Text style={styles.sectionTitle}>Batches</Text>
      {batches.map((b) => (
        <Card key={b.id} style={styles.batchCard}>
          <View style={styles.batchRow}>
            <View style={styles.batchMain}>
              <Text style={styles.batchExpiry}>{formatDate(b.expiry_date)}</Text>
              <Text style={styles.batchMeta}>
                Qty {b.quantity ?? '—'}
                {b.batch_number ? ` · ${b.batch_number}` : ''}
              </Text>
            </View>
            <StatusBadge expiryDate={b.expiry_date} />
            <TouchableOpacity
              onPress={() => handleDeleteBatch(b.id)}
              style={styles.deleteBatchBtn}
              disabled={batches.length <= 1}
            >
              <Text style={styles.deleteBatchText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      <TouchableOpacity style={styles.addBatchBtn} onPress={() => setAddingBatch(true)}>
        <Text style={styles.addBatchText}>+ Add Batch</Text>
      </TouchableOpacity>

      <Button
        title="Delete Product"
        variant="destructive"
        onPress={() => setDeleteModalVisible(true)}
        style={styles.deleteProductBtn}
      />

      <Modal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Delete product"
        message="Remove this product and all its batches? This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteProduct}
      />

      {addingBatch && (
        <Modal
          visible={addingBatch}
          onClose={() => setAddingBatch(false)}
          title="Add batch"
          onConfirm={handleAddBatch}
          confirmLabel="Add"
        >
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateInputText}>{newExpiry}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(newExpiry)}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(_, date) => {
                if (date) setNewExpiry(toDateStr(date));
                setShowDatePicker(false);
              }}
            />
          )}
          <Input
            label="Quantity (optional)"
            value={newQty}
            onChangeText={setNewQty}
            placeholder="Number"
            keyboardType="number-pad"
          />
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  muted: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  header: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  meta: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  notes: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  batchCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  batchMain: {
    flex: 1,
    minWidth: 120,
  },
  batchExpiry: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  batchMeta: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  deleteBatchBtn: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  deleteBatchText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.destructive,
  },
  addBatchBtn: {
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  addBatchText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.primary,
  },
  deleteProductBtn: {
    marginTop: Spacing.lg,
  },
  dateInput: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  dateInputText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
});
