/**
 * useFeedbackList — community feedback list and current user's upvoted IDs.
 *
 * Fetches all feedback (newest first) and the set of feedback IDs the user has upvoted,
 * so the UI can show the list and highlight the upvote button for items the user voted on.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  getFeedbackList,
  getMyUpvotedFeedbackIds,
} from '../services/feedback';
import type { Feedback } from '../types/database';

export function useFeedbackList(userId: string | undefined) {
  const [data, setData] = useState<Feedback[]>([]);
  const [myUpvotedIds, setMyUpvotedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, ids] = await Promise.all([
        getFeedbackList(),
        userId ? getMyUpvotedFeedbackIds(userId) : Promise.resolve(new Set<string>()),
      ]);
      setData(list);
      setMyUpvotedIds(ids);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, myUpvotedIds, loading, error, refetch };
}
