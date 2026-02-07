/**
 * Categories — Supabase CRUD.
 */

import { supabase } from '../supabase';
import type { Category, CategoryInsert } from '../types/database';

export async function getCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function createCategory(category: CategoryInsert): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert(category).select().single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<CategoryInsert>): Promise<void> {
  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
