/**
 * Add/Edit Product — Quick Add: Scan CTA, compact form, Save & Add Next.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useCategories } from '../../../lib/hooks/useCategories';
import {
  getProduct,
  createProduct,
  updateProduct,
  createBatch,
  updateBatch as updateBatchService,
  deleteBatch,
} from '../../../lib/services/products';
import { useToast } from '../../../components/ui/Toast';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { FilterChips } from '../../../components/ui/FilterChips';
import { AnimatedPressable } from '../../../components/ui/AnimatedPressable';
import { Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import type { ProductInsert, ProductBatch } from '../../../lib/types/database';
import DateTimePicker from '@react-native-community/datetimepicker';

const today = new Date();
today.setHours(0, 0, 0, 0);

interface BatchRow {
  id: string;
  expiry_date: string;
  quantity: string;
  batch_number: string;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatExpiryDisplay(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function AddProductScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ id?: string; barcode?: string; name?: string; category?: string }>();
  const isEdit = !!params.id;
  const { data: categories } = useCategories(user?.id);
  const { success, error: showError } = useToast();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        scroll: { flex: 1 },
        scrollContent: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
        scanCta: {
          backgroundColor: '#1E293B',
          borderRadius: BorderRadius.lg,
          padding: Spacing.xl,
          alignItems: 'center',
          marginBottom: Spacing.xl,
          ...Shadows.md,
        },
        scanCtaTitle: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes.lg,
          color: colors.white,
          marginTop: Spacing.md,
        },
        scanCtaSub: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textMuted,
          marginTop: Spacing.xs,
        },
        quickField: { marginBottom: Spacing.md },
        categorySection: { marginBottom: Spacing.md },
        categoryLabel: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textPrimary,
          marginBottom: Spacing.xs,
        },
        categoryInput: { marginTop: Spacing.sm, marginBottom: 0 },
        justAddedSection: {
          marginTop: Spacing.xl,
          paddingTop: Spacing.xl,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        justAddedTitle: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
          marginBottom: Spacing.md,
        },
        justAddedRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
          marginBottom: Spacing.sm,
        },
        justAddedText: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          flex: 1,
        },
        loading: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        },
        loadingText: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textSecondary,
        },
        barcodeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.md },
        barcodeInput: { flex: 1 },
        scanBtn: { minWidth: 80 },
        sectionTitle: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.lg,
          color: colors.textPrimary,
          marginTop: Spacing.xl,
          marginBottom: Spacing.md,
        },
        batchCard: {
          backgroundColor: colors.card,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
          padding: Spacing.lg,
          marginBottom: Spacing.md,
        },
        batchRow: { marginBottom: Spacing.md },
        batchLabel: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textPrimary,
          marginBottom: Spacing.xs,
        },
        dateBtn: {
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          backgroundColor: colors.background,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        dateBtnText: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
        },
        removeBatch: { marginTop: Spacing.sm, paddingVertical: Spacing.sm },
        removeBatchText: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.destructive,
        },
        addBatch: { paddingVertical: Spacing.md, marginBottom: Spacing.lg },
        addBatchText: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.md,
          color: colors.primary,
        },
        saveBtn: { marginTop: Spacing.md },
        bottomPad: { height: Spacing['2xl'] },
      }),
    [colors]
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [barcode, setBarcode] = useState('');
  const [batches, setBatches] = useState<BatchRow[]>([
    { id: '1', expiry_date: toDateStr(today), quantity: '', batch_number: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [datePickerBatchId, setDatePickerBatchId] = useState<string | null>(null);
  const [initialBatchIds, setInitialBatchIds] = useState<string[]>([]);
  const [justAdded, setJustAdded] = useState<{ name: string; expiry: string; qty: number | null }[]>([]);

  useEffect(() => {
    if (params.barcode) setBarcode(params.barcode);
    if (params.name) setName(params.name);
    if (params.category) setCategory(params.category);
  }, [params.barcode, params.name, params.category]);

  useEffect(() => {
    if (!isEdit || !params.id) return;
    getProduct(params.id)
      .then((p) => {
        if (!p) return;
        setName(p.name);
        setCategory(p.category ?? '');
        setSupplier(p.supplier ?? '');
        setLocation(p.location ?? '');
        setNotes(p.notes ?? '');
        setBarcode(p.barcode ?? '');
        const rows =
          p.product_batches?.length ?
            p.product_batches.map((b) => ({
              id: b.id,
              expiry_date: b.expiry_date,
              quantity: b.quantity != null ? String(b.quantity) : '',
              batch_number: b.batch_number ?? '',
            }))
          : [{ id: '1', expiry_date: toDateStr(today), quantity: '', batch_number: '' }];
        setBatches(rows);
        setInitialBatchIds(p.product_batches?.map((b) => b.id) ?? []);
      })
      .catch((e) => showError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoadingProduct(false));
  }, [isEdit, params.id]);

  const openScan = () => {
    router.push('/(tabs)/scan');
  };

  const addBatch = () => {
    setBatches((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        expiry_date: toDateStr(today),
        quantity: '',
        batch_number: '',
      },
    ]);
  };

  const removeBatch = (id: string) => {
    if (batches.length <= 1) return;
    setBatches((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBatch = (id: string, updates: Partial<BatchRow>) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const validate = (): string | null => {
    if (!name.trim()) return 'Product name is required';
    if (!category.trim()) return 'Category is required';
    for (let i = 0; i < batches.length; i++) {
      if (!batches[i].expiry_date) return `Batch ${i + 1}: expiry date is required`;
      const q = batches[i].quantity.trim();
      if (q && (isNaN(Number(q)) || Number(q) < 0)) return `Batch ${i + 1}: quantity must be a positive number`;
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      showError(err);
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const addedDate = new Date().toISOString().slice(0, 10);
      if (isEdit && params.id) {
        await updateProduct(params.id, {
          name: name.trim(),
          category: category.trim(),
          supplier: supplier.trim() || null,
          location: location.trim() || null,
          notes: notes.trim() || null,
          barcode: barcode.trim() || null,
        });
        const currentIds = batches.map((b) => b.id);
        for (const bid of initialBatchIds) {
          if (!currentIds.includes(bid)) await deleteBatch(bid);
        }
        for (const b of batches) {
          if (b.id.startsWith('new-')) {
            await createBatch({
              product_id: params.id,
              expiry_date: b.expiry_date,
              quantity: b.quantity.trim() ? Number(b.quantity) : null,
              batch_number: b.batch_number.trim() || null,
              added_date: addedDate,
            });
          } else {
            await updateBatchService(b.id, {
              expiry_date: b.expiry_date,
              quantity: b.quantity.trim() ? Number(b.quantity) : null,
              batch_number: b.batch_number.trim() || null,
            });
          }
        }
        success('Product updated');
      } else {
        await createProduct(
          {
            user_id: user.id,
            name: name.trim(),
            category: category.trim(),
            supplier: supplier.trim() || null,
            location: location.trim() || null,
            notes: notes.trim() || null,
            barcode: barcode.trim() || null,
            added_date: addedDate,
          },
          batches.map((b) => ({
            expiry_date: b.expiry_date,
            quantity: b.quantity.trim() ? Number(b.quantity) : null,
            batch_number: b.batch_number.trim() || null,
            added_date: addedDate,
          }))
        );
        success('Product added');
        setJustAdded((prev) => [
          { name: name.trim(), expiry: batches[0]?.expiry_date ?? toDateStr(today), qty: batches[0]?.quantity ? Number(batches[0].quantity) : null },
          ...prev.slice(0, 4),
        ]);
        if (!isEdit) {
          setName('');
          setCategory('');
          setBatches([{ id: `new-${Date.now()}`, expiry_date: toDateStr(today), quantity: '', batch_number: '' }]);
          setBarcode('');
          return;
        }
      }
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/products');
      }
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct && isEdit) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AnimatedPressable onPress={openScan} style={styles.scanCta} haptic>
          <Ionicons name="barcode" size={32} color={colors.white} />
          <Text style={styles.scanCtaTitle}>Scan Barcode to Auto-fill</Text>
          <Text style={styles.scanCtaSub}>or enter manually</Text>
        </AnimatedPressable>

        <Input
          label="Product Name *"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Greek Yoghurt 500g"
        />
        <View style={styles.batchCard}>
          <Text style={styles.batchLabel}>Expiry Date *</Text>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setDatePickerBatchId(batches[0]?.id ?? null)}
          >
            <Text style={styles.dateBtnText}>{batches[0]?.expiry_date ?? toDateStr(today)}</Text>
          </TouchableOpacity>
          {batches[0] && datePickerBatchId === batches[0].id && (
            <DateTimePicker
              value={new Date(batches[0].expiry_date)}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(_, date) => {
                if (date) updateBatch(batches[0].id, { expiry_date: toDateStr(date) });
                setDatePickerBatchId(null);
              }}
            />
          )}
        </View>
        <Input
          label="Quantity"
          value={batches[0]?.quantity ?? ''}
          onChangeText={(v) => batches[0] && updateBatch(batches[0].id, { quantity: v })}
          placeholder="e.g. 24"
          keyboardType="number-pad"
          containerStyle={styles.quickField}
        />
        <View style={styles.categorySection}>
          <Text style={styles.categoryLabel}>Category *</Text>
          {categories.length > 0 && (
            <FilterChips
              options={categories.map((c) => ({ value: c.name, label: c.name }))}
              selected={category}
              onSelect={setCategory}
            />
          )}
          <Input
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Dairy"
            containerStyle={styles.categoryInput}
          />
        </View>
        <Input
          label="Batch #"
          value={batches[0]?.batch_number ?? ''}
          onChangeText={(v) => batches[0] && updateBatch(batches[0].id, { batch_number: v })}
          placeholder="e.g. B-24"
          containerStyle={styles.quickField}
        />

        <Text style={styles.sectionTitle}>More details (optional)</Text>
        <Input
          label="Supplier"
          value={supplier}
          onChangeText={setSupplier}
          placeholder="Supplier"
        />
        <Input
          label="Barcode"
          value={barcode}
          onChangeText={setBarcode}
          placeholder="Barcode"
        />
        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
          multiline
        />

        <Text style={styles.sectionTitle}>Extra batches (optional)</Text>
        {batches.slice(1).map((batch) => (
          <View key={batch.id} style={styles.batchCard}>
            <View style={styles.batchRow}>
              <Text style={styles.batchLabel}>Expiry</Text>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setDatePickerBatchId(batch.id)}
              >
                <Text style={styles.dateBtnText}>{batch.expiry_date}</Text>
              </TouchableOpacity>
              {datePickerBatchId === batch.id && (
                <DateTimePicker
                  value={new Date(batch.expiry_date)}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(_, date) => {
                    if (date) updateBatch(batch.id, { expiry_date: toDateStr(date) });
                    setDatePickerBatchId(null);
                  }}
                />
              )}
            </View>
            <Input
              label="Quantity"
              value={batch.quantity}
              onChangeText={(v) => updateBatch(batch.id, { quantity: v })}
              placeholder="Optional"
              keyboardType="number-pad"
            />
            <Input
              label="Batch number"
              value={batch.batch_number}
              onChangeText={(v) => updateBatch(batch.id, { batch_number: v })}
              placeholder="Optional"
            />
            <TouchableOpacity
              style={styles.removeBatch}
              onPress={() => removeBatch(batch.id)}
            >
              <Text style={styles.removeBatchText}>Remove batch</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addBatch} onPress={addBatch}>
          <Text style={styles.addBatchText}>+ Add batch</Text>
        </TouchableOpacity>

        <Button
          title={isEdit ? 'Save' : 'Save & Add Next →'}
          onPress={handleSave}
          loading={loading}
          style={styles.saveBtn}
        />
        {justAdded.length > 0 && (
          <View style={styles.justAddedSection}>
            <Text style={styles.justAddedTitle}>Just Added</Text>
            {justAdded.map((item, i) => (
              <View key={i} style={styles.justAddedRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                <Text style={styles.justAddedText}>
                  {item.name} — Expires {formatExpiryDisplay(item.expiry)}
                  {item.qty != null ? ` - Qty: ${item.qty}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

