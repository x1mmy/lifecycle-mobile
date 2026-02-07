/**
 * useSettings — settings for current user with loading/error, refetch.
 */

import { useState, useCallback, useEffect } from 'react';
import { getSettings } from '../services/settings';
import type { Settings } from '../types/database';

export function useSettings(userId: string | undefined) {
  const [data, setData] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const settings = await getSettings(userId);
      setData(settings);
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
