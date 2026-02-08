/**
 * Types matching Supabase schema — products, batches, categories, profiles, settings, barcode_cache.
 */

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  supplier: string | null;
  location: string | null;
  notes: string | null;
  barcode: string | null;
  added_date: string;
}

export interface ProductBatch {
  id: string;
  product_id: string;
  batch_number: string | null;
  expiry_date: string;
  quantity: number | null;
  added_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProductWithBatches extends Product {
  product_batches: ProductBatch[] | null;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  business_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  daily_expiry_alerts_enabled: boolean;
  alert_threshold: number;
  weekly_report: boolean;
  created_at: string;
  updated_at: string;
}

export interface BarcodeCache {
  barcode: string;
  name: string;
  supplier: string | null;
  category: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  email: string | null;
  type: string | null;
  message: string;
  upvotes_count: number;
  created_at: string;
}

export type ProductInsert = Omit<Product, 'id'> & { id?: string };
export type ProductBatchInsert = Omit<ProductBatch, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
export type SettingsUpdate = Partial<Omit<Settings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
