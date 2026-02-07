/**
 * Categories — list, add, edit, delete (with warning if products use it).
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useCategories } from '../../../lib/hooks/useCategories';
import { useProducts } from '../../../lib/hooks/useProducts';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../lib/services/categories';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Fonts, FontSizes, Spacing } from '../../../constants/theme';
import type { Category } from '../../../lib/types/database';

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: categories, loading, refetch } = useCategories(user?.id);
  const { data: products } = useProducts(user?.id);
  const { success, error: showError } = useToast();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        listContent: { padding: Spacing.lg, paddingBottom: Spacing['2xl'] },
        empty: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textSecondary,
          textAlign: 'center',
          marginTop: Spacing.xl,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          padding: Spacing.lg,
          marginBottom: Spacing.sm,
        },
        rowMain: { flex: 1 },
        name: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
        },
        desc: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          marginTop: Spacing.xs,
        },
        count: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.xs,
          color: colors.textMuted,
          marginTop: Spacing.xs,
        },
        deleteBtn: { padding: Spacing.sm, marginLeft: Spacing.sm },
        deleteText: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.destructive,
        },
        addBtn: { margin: Spacing.lg },
        modalOverlay: {
          flex: 1,
          justifyContent: 'center',
          padding: Spacing.lg,
        },
        modalBackdrop: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.overlay,
        },
        modalContent: {
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: Spacing.xl,
        },
        modalTitle: {
          fontFamily: Fonts.bold,
          fontSize: FontSizes.lg,
          color: colors.textPrimary,
          marginBottom: Spacing.lg,
        },
        modalActions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: Spacing.md,
          marginTop: Spacing.lg,
        },
      }),
    [colors]
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const productCategoryCount = React.useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const c = (p.category || '').trim();
      if (c) map[c] = (map[c] ?? 0) + 1;
    });
    return map;
  }, [products]);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setModalVisible(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description ?? '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!user || !name.trim()) {
      showError('Name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, { name: name.trim(), description: description.trim() || null });
        success('Category updated');
      } else {
        await createCategory({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
        });
        success('Category added');
      }
      setModalVisible(false);
      refetch();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat: Category) => {
    const count = productCategoryCount[cat.name] ?? 0;
    if (count > 0) {
      Alert.alert(
        'Cannot delete',
        `${count} product(s) use this category. Change their category first.`
      );
      return;
    }
    Alert.alert('Delete category', `Remove "${cat.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(cat.id);
            success('Category deleted');
            refetch();
          } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to delete');
          }
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>No categories yet. Add one below.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowMain} onPress={() => openEdit(item)}>
              <Text style={styles.name}>{item.name}</Text>
              {item.description ? (
                <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
              ) : null}
              {(productCategoryCount[item.name] ?? 0) > 0 && (
                <Text style={styles.count}>
                  {(productCategoryCount[item.name] ?? 0)} product(s)
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Add category" onPress={openAdd} style={styles.addBtn} />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit category' : 'Add category'}
            </Text>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Category name"
            />
            <Input
              label="Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              multiline
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="ghost" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleSave} loading={saving} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

