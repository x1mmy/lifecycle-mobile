/**
 * Feedback — submit feedback and see community submissions with upvotes.
 *
 * Why we collect this:
 * - Lets users share how they feel, feature ideas, bugs, or anything else.
 * - Type (General, Feature request, Bug, Other) helps us triage; message is required.
 * - All authenticated users can see other submissions and upvote (one vote per user per feedback).
 * - Submissions and upvotes are stored in our DB; RLS controls who can read/insert/upvote.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../components/ui/Toast';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import {
  submitFeedback,
  addUpvote,
  removeUpvote,
} from '../../../lib/services/feedback';
import { useFeedbackList } from '../../../lib/hooks/useFeedbackList';
import { formatDate } from '../../../lib/utils/date';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../../../constants/theme';
import type { Feedback } from '../../../lib/types/database';

const FEEDBACK_TYPES = [
  { value: 'General', label: 'General' },
  { value: 'Feature request', label: 'Feature request' },
  { value: 'Bug', label: 'Bug' },
  { value: 'Other', label: 'Other' },
] as const;

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const { data: feedbackList, myUpvotedIds, loading, refetch } = useFeedbackList(user?.id);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
        sectionTitle: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
          marginBottom: Spacing.sm,
        },
        label: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textPrimary,
          marginBottom: Spacing.sm,
        },
        chipRow: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: Spacing.sm,
          marginBottom: Spacing.lg,
        },
        chip: {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          borderRadius: BorderRadius.full,
          backgroundColor: colors.borderLight,
        },
        chipActive: { backgroundColor: colors.primary },
        chipText: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
        },
        chipTextActive: { color: colors.white },
        submitBtn: { marginTop: Spacing.lg },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: Spacing.xl,
        },
        listSectionTitle: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
          marginBottom: Spacing.md,
        },
        formSection: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
        listWrapper: { flex: 1 },
        listContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['4xl'] },
        empty: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textSecondary,
          textAlign: 'center',
          paddingVertical: Spacing.xl,
        },
        card: {
          backgroundColor: colors.card,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
          padding: Spacing.lg,
          marginBottom: Spacing.md,
        },
        cardHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: Spacing.sm,
        },
        cardType: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.xs,
          color: colors.textSecondary,
        },
        cardDate: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.xs,
          color: colors.textMuted,
        },
        cardMessage: {
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
          marginBottom: Spacing.sm,
        },
        cardFooter: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
        },
        upvoteBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.xs,
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.sm,
        },
        upvoteCount: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
        },
        loadingRow: { padding: Spacing.xl, alignItems: 'center' },
      }),
    [colors]
  );

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await submitFeedback({
        type: selectedType ?? undefined,
        message,
        userId: user.id,
        email: user.email ?? undefined,
      });
      success('Thanks for your feedback');
      Keyboard.dismiss();
      setMessage('');
      setSelectedType(null);
      refetch();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to send feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (item: Feedback) => {
    if (!user) return;
    const isUpvoted = myUpvotedIds.has(item.id);
    setUpvotingId(item.id);
    try {
      if (isUpvoted) {
        await removeUpvote(item.id, user.id);
        success('Upvote removed');
      } else {
        await addUpvote(item.id, user.id);
        success('Upvoted');
      }
      refetch();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Could not update vote');
    } finally {
      setUpvotingId(null);
    }
  };

  const renderItem = ({ item }: { item: Feedback }) => {
    const isUpvoted = myUpvotedIds.has(item.id);
    const isUpvoting = upvotingId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardType}>{item.type ?? 'General'}</Text>
          <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
        </View>
        <Text style={styles.cardMessage}>{item.message}</Text>
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.upvoteBtn}
            onPress={() => handleUpvote(item)}
            disabled={isUpvoting}
          >
            {isUpvoting ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons
                name={isUpvoted ? 'thumbs-up' : 'thumbs-up-outline'}
                size={20}
                color={isUpvoted ? colors.primary : colors.textSecondary}
              />
            )}
            <Text style={styles.upvoteCount}>{item.upvotes_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Form is outside FlatList so typing doesn't re-render the list and dismiss the keyboard */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Submit feedback</Text>
        <Text style={styles.label}>Type (optional)</Text>
        <View style={styles.chipRow}>
          {FEEDBACK_TYPES.map((opt) => {
            const active = selectedType === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedType(active ? null : opt.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          label="Message"
          value={message}
          onChangeText={setMessage}
          placeholder="How are you finding LifeCycle? Any features you'd like? Issues?"
          multiline
        />

        <Button
          title="Send feedback"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitBtn}
        />

        <View style={styles.divider} />
        <Text style={styles.listSectionTitle}>Community feedback</Text>
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          data={feedbackList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <Text style={styles.empty}>No feedback yet. Be the first to share!</Text>
            )
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} colors={[colors.primary]} />
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </View>
  );
}
