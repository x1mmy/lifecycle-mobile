/**
 * Barcode lookup — barcode_cache first, then Open Food Facts API; cache result.
 */

import { supabase } from '../supabase';
import type { BarcodeCache } from '../types/database';

const OPEN_FOOD_FACTS_BASE = 'https://world.openfoodfacts.org/api/v0/product';

export interface BarcodeResult {
  name: string | null;
  supplier: string | null;
  category: string | null;
}

export async function lookupBarcode(barcode: string): Promise<BarcodeResult> {
  const trimmed = barcode.trim();
  if (!trimmed) return { name: null, supplier: null, category: null };

  const cached = await getCached(trimmed);
  if (cached) return cached;

  try {
    const res = await fetch(`${OPEN_FOOD_FACTS_BASE}/${trimmed}.json`);
    const json = await res.json();
    if (json.status !== 1 || !json.product) {
      return { name: null, supplier: null, category: null };
    }
    const p = json.product;
    const name = p.product_name ?? p.product_name_en ?? null;
    const brand = p.brands ?? p.brand ?? null;
    const category = p.categories ?? p.categories_hierarchy?.[0] ?? null;
    const categoryStr = typeof category === 'string' ? category : Array.isArray(category) ? category[0] : null;

    const result: BarcodeResult = {
      name: name || null,
      supplier: brand || null,
      category: categoryStr || null,
    };

    await cacheResult(trimmed, result);
    return result;
  } catch {
    return { name: null, supplier: null, category: null };
  }
}

/** barcode_cache.name is NOT NULL in DB — use empty string when unknown */
const CACHE_NAME_EMPTY = '';

async function getCached(barcode: string): Promise<BarcodeResult | null> {
  const { data, error } = await supabase
    .from('barcode_cache')
    .select('name, supplier, category')
    .eq('barcode', barcode)
    .single();
  if (error || !data) return null;
  return {
    name: (data as BarcodeCache).name ?? null,
    supplier: (data as BarcodeCache).supplier ?? null,
    category: (data as BarcodeCache).category ?? null,
  };
}

async function cacheResult(barcode: string, result: BarcodeResult): Promise<void> {
  try {
    await supabase.from('barcode_cache').upsert({
      barcode,
      name: result.name ?? CACHE_NAME_EMPTY,
      supplier: result.supplier ?? null,
      category: result.category ?? null,
    });
  } catch {
    // ignore cache write failure
  }
}
