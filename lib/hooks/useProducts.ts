/**
 * useProducts — products list with loading/error, refetch, filters.
 */

import { useState, useCallback, useEffect } from 'react';
import { getProducts } from '../services/products';
import type { ProductWithBatches } from '../types/database';

export interface UseProductsFilters {
  search?: string;
  category?: string;
  sort?: 'expiry' | 'name' | 'category' | 'quantity';
}

export function useProducts(userId: string | undefined, filters?: UseProductsFilters) {
  const [data, setData] = useState<ProductWithBatches[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getProducts(userId, filters);
      setData(list);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [userId, filters?.search, filters?.category, filters?.sort]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
