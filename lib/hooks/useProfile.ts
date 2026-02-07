/**
 * useProfile — profile for current user with loading/error, refetch.
 */

import { useState, useCallback, useEffect } from 'react';
import { getProfile } from '../services/settings';
import type { Profile } from '../types/database';

export function useProfile(userId: string | undefined) {
  const [data, setData] = useState<Profile | null>(null);
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
      const profile = await getProfile(userId);
      setData(profile);
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
