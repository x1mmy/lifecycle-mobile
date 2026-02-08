/**
 * Feedback — submit, list, and upvote user feedback in Supabase.
 *
 * Why we do this:
 * - Users can send feedback (feelings, feature ideas, bugs) from Settings.
 * - All authenticated users can see other submissions and upvote (one vote per user per feedback).
 * - upvotes_count is kept in sync via a DB trigger on feedback_upvotes.
 *
 * How it works:
 * - submitFeedback: validate message, insert into feedback.
 * - getFeedbackList: select feedback ordered by created_at desc.
 * - getMyUpvotedFeedbackIds: select feedback_id from feedback_upvotes where user_id = me.
 * - addUpvote / removeUpvote: insert/delete in feedback_upvotes (trigger updates upvotes_count).
 */

import { supabase } from '../supabase';
import type { Feedback } from '../types/database';

const MESSAGE_MAX_LENGTH = 2000;

export type SubmitFeedbackParams = {
  type?: string;
  message: string;
  userId?: string;
  email?: string;
};

export async function submitFeedback(params: SubmitFeedbackParams): Promise<void> {
  const trimmed = params.message.trim();
  if (!trimmed) {
    throw new Error('Please enter your feedback.');
  }
  if (trimmed.length > MESSAGE_MAX_LENGTH) {
    throw new Error(`Feedback must be under ${MESSAGE_MAX_LENGTH} characters.`);
  }

  const { error } = await supabase.from('feedback').insert({
    user_id: params.userId ?? null,
    email: params.email ?? null,
    type: params.type ?? null,
    message: trimmed,
  });

  if (error) throw error;
}

/**
 * Fetch all feedback for the community list (newest first).
 * RLS allows SELECT for authenticated users.
 */
export async function getFeedbackList(): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('id, user_id, email, type, message, upvotes_count, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Feedback[];
}

/**
 * Fetch feedback IDs the current user has upvoted (for highlighting upvote button).
 */
export async function getMyUpvotedFeedbackIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('feedback_upvotes')
    .select('feedback_id')
    .eq('user_id', userId);

  if (error) throw error;
  const ids = (data ?? []).map((r: { feedback_id: string }) => r.feedback_id);
  return new Set(ids);
}

/**
 * Add an upvote for the current user. One vote per user per feedback; duplicate insert will fail (unique key).
 */
export async function addUpvote(feedbackId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('feedback_upvotes').insert({
    feedback_id: feedbackId,
    user_id: userId,
  });
  if (error) throw error;
}

/**
 * Remove the current user's upvote (toggle off).
 */
export async function removeUpvote(feedbackId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('feedback_upvotes')
    .delete()
    .eq('feedback_id', feedbackId)
    .eq('user_id', userId);
  if (error) throw error;
}
