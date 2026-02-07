/**
 * Notifications — daily expiry alerts, alert threshold, weekly report, test notification.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useSettings } from '../../../lib/hooks/useSettings';
import { updateSettings } from '../../../lib/services/settings';
import { sendTestNotification, cancelDailyAndWeeklyNotifications } from '../../../lib/services/notifications';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';
import { Colors, Fonts, FontSizes, Spacing } from '../../../constants/theme';

const THRESHOLD_OPTIONS = [3, 7, 14, 30];

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { data: settings, loading, refetch } = useSettings(user?.id);
  const { success, error: showError } = useToast();

  const [dailyAlerts, setDailyAlerts] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(7);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testSending, setTestSending] = useState(false);

  useEffect(() => {
    if (settings) {
      setDailyAlerts(settings.daily_expiry_alerts_enabled);
      setAlertThreshold(settings.alert_threshold);
      setWeeklyReport(settings.weekly_report);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateSettings(user.id, {
        daily_expiry_alerts_enabled: dailyAlerts,
        alert_threshold: alertThreshold,
        weekly_report: weeklyReport,
      });
      success('Settings saved');
      refetch();
      if (!dailyAlerts) await cancelDailyAndWeeklyNotifications();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    setTestSending(true);
    try {
      await sendTestNotification();
      success('Test notification in 3 seconds — put app in background to see it');
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to send test');
    } finally {
      setTestSending(false);
    }
  };

  if (!user) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily expiry alerts</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable daily expiry alerts</Text>
          <Switch
            value={dailyAlerts}
            onValueChange={setDailyAlerts}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={dailyAlerts ? Colors.primary : Colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert threshold (days)</Text>
        <View style={styles.chips}>
          {THRESHOLD_OPTIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, alertThreshold === d && styles.chipActive]}
              onPress={() => setAlertThreshold(d)}
            >
              <Text style={[styles.chipText, alertThreshold === d && styles.chipTextActive]}>
                {d} days
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly report</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable weekly report</Text>
          <Switch
            value={weeklyReport}
            onValueChange={setWeeklyReport}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={weeklyReport ? Colors.primary : Colors.textMuted}
          />
        </View>
      </View>

      <Button title="Save" onPress={handleSave} loading={saving} style={styles.saveBtn} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test notification (Expo Go)</Text>
        <Text style={styles.hint}>
          Sends a local notification in 3 seconds. Put the app in the background or lock the device to see and hear it like a real push. Uses your notification.wav sound when configured.
        </Text>
        <Button
          title="Send test notification"
          onPress={handleTestNotification}
          loading={testSending}
          variant="secondary"
          style={styles.testBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  section: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 9999,
    backgroundColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  saveBtn: {
    marginTop: Spacing.lg,
  },
  hint: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  testBtn: {
    marginTop: Spacing.xs,
  },
});
