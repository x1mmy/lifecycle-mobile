/**
 * useCategories — categories list with loading/error, refetch.
 */

import { useState, useCallback, useEffect } from 'react';
import { getCategories } from '../services/categories';
import type { Category } from '../types/database';

export function useCategories(userId: string | undefined) {
  const [data, setData] = useState<Category[]>([]);
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
      const list = await getCategories(userId);
      setData(list);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
