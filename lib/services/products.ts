/**
 * Products + batches — Supabase queries.
 */

import { supabase } from '../supabase';
import type {
  Product,
  ProductWithBatches,
  ProductBatch,
  ProductInsert,
  ProductBatchInsert,
} from '../types/database';

export async function getProducts(
  userId: string,
  options?: { search?: string; category?: string; sort?: 'expiry' | 'name' | 'category' | 'quantity' }
): Promise<ProductWithBatches[]> {
  let q = supabase
    .from('products')
    .select('*, product_batches(*)')
    .eq('user_id', userId)
    .order('added_date', { ascending: false });

  if (options?.search?.trim()) {
    q = q.or(
      `name.ilike.%${options.search.trim()}%,category.ilike.%${options.search.trim()}%,notes.ilike.%${options.search.trim()}%`
    );
  }
  if (options?.category?.trim()) {
    q = q.eq('category', options.category.trim());
  }

  const { data, error } = await q;
  if (error) throw error;

  let list = (data ?? []) as ProductWithBatches[];

  if (options?.sort === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  } else if (options?.sort === 'category') {
    list = [...list].sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  } else if (options?.sort === 'expiry' || options?.sort === 'quantity') {
    list = [...list].sort((a, b) => {
      const aEarliest = earliestExpiry(a.product_batches);
      const bEarliest = earliestExpiry(b.product_batches);
      if (aEarliest && bEarliest) return aEarliest.localeCompare(bEarliest);
      if (aEarliest) return -1;
      if (bEarliest) return 1;
      return 0;
    });
    if (options?.sort === 'quantity') {
      list = [...list].sort((a, b) => totalQty(b.product_batches) - totalQty(a.product_batches));
    }
  }

  return list;
}

function earliestExpiry(batches: ProductBatch[] | null): string | null {
  if (!batches?.length) return null;
  return batches.reduce((min, b) => (!min || b.expiry_date < min ? b.expiry_date : min), batches[0].expiry_date);
}

function totalQty(batches: ProductBatch[] | null): number {
  if (!batches?.length) return 0;
  return batches.reduce((s, b) => s + (b.quantity ?? 0), 0);
}

export async function getProduct(productId: string): Promise<ProductWithBatches | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_batches(*)')
    .eq('id', productId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as ProductWithBatches;
}

export async function createProduct(
  product: ProductInsert,
  batches: Omit<ProductBatchInsert, 'product_id'>[]
): Promise<Product> {
  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (productError) throw productError;

  if (batches.length) {
    const batchRows: ProductBatchInsert[] = batches.map((b) => ({
      ...b,
      product_id: productData.id,
    }));
    const { error: batchError } = await supabase.from('product_batches').insert(batchRows);
    if (batchError) throw batchError;
  }

  return productData as Product;
}

export async function updateProduct(id: string, updates: Partial<ProductInsert>): Promise<void> {
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteProducts(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const { error } = await supabase.from('products').delete().in('id', ids);
  if (error) throw error;
}

export async function createBatch(batch: ProductBatchInsert): Promise<ProductBatch> {
  const { data, error } = await supabase.from('product_batches').insert(batch).select().single();
  if (error) throw error;
  return data as ProductBatch;
}

export async function updateBatch(id: string, updates: Partial<ProductBatchInsert>): Promise<void> {
  const { error } = await supabase.from('product_batches').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteBatch(id: string): Promise<void> {
  const { error } = await supabase.from('product_batches').delete().eq('id', id);
  if (error) throw error;
}
