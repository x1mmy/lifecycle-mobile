/**
 * Notifications — permissions, local notifications, daily 9am + weekly. Works in Expo Go.
 * Uses notification.wav for sound when configured in app.json.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { daysUntil } from '../../constants/status';
import type { ProductWithBatches } from '../types/database';

const CHANNEL_ID = 'lifecycle-alerts';
const SOUND_FILE = 'notification.wav';
const STORAGE_DAILY_ID = 'lifecycle_daily_notification_id';
const STORAGE_WEEKLY_ID = 'lifecycle_weekly_notification_id';
const ALERT_HOUR = 9;
const ALERT_MINUTE = 0;

// So notifications show and play sound when app is in foreground too
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldAnimate: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Expiry alerts',
      importance: Notifications.AndroidImportance.HIGH,
      sound: SOUND_FILE,
      enableVibrate: true,
    });
  }
}

/**
 * Send a test notification in a few seconds — good for simulating in Expo Go.
 * Put the app in background or lock the device to see/hear it like a real notification.
 */
export async function sendTestNotification(): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) {
    throw new Error('Notification permission not granted');
  }
  await setupNotificationChannel();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'LifeCycle test',
      body: 'This is a test notification. Your notification.wav will play if configured.',
      sound: SOUND_FILE,
      data: { type: 'test' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL as const,
      seconds: 3,
      channelId: CHANNEL_ID,
    },
  });
}

/**
 * Schedule a local "expiry alert" — e.g. "3 items expire today".
 * Call this from your app when you want to remind the user (e.g. daily check).
 */
export async function scheduleExpiryAlert(opts: {
  title: string;
  body: string;
  inSeconds?: number;
}): Promise<string | null> {
  const granted = await requestNotificationPermissions();
  if (!granted) return null;
  await setupNotificationChannel();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: opts.title,
      body: opts.body,
      sound: SOUND_FILE,
      data: { type: 'expiry-alert' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL as const,
      seconds: opts.inSeconds ?? 1,
      channelId: CHANNEL_ID,
    },
  });
  return id;
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function earliestExpiry(batches: ProductWithBatches['product_batches']): string | null {
  if (!batches?.length) return null;
  return batches.reduce(
    (min, b) => (!min || b.expiry_date < min ? b.expiry_date : min),
    batches[0].expiry_date
  );
}

function countExpiringToday(products: ProductWithBatches[]): number {
  return products.filter((p) => {
    const exp = earliestExpiry(p.product_batches);
    return exp && daysUntil(exp) === 0;
  }).length;
}

function countExpiringThisWeek(products: ProductWithBatches[]): number {
  return products.filter((p) => {
    const exp = earliestExpiry(p.product_batches);
    return exp && daysUntil(exp) >= 0 && daysUntil(exp) <= 7;
  }).length;
}

function getNext9am(): Date {
  const d = new Date();
  d.setHours(ALERT_HOUR, ALERT_MINUTE, 0, 0);
  if (d.getTime() <= Date.now()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function getNextMonday9am(): Date {
  const now = new Date();
  const d = new Date(now);
  d.setHours(ALERT_HOUR, ALERT_MINUTE, 0, 0);
  const day = now.getDay();
  const today9am = new Date(now);
  today9am.setHours(ALERT_HOUR, ALERT_MINUTE, 0, 0);
  const daysToAdd =
    day === 1
      ? now.getTime() < today9am.getTime()
        ? 0
        : 7
      : day === 0
        ? 1
        : (8 - day) % 7;
  d.setDate(d.getDate() + daysToAdd);
  if (d.getTime() <= Date.now()) {
    d.setDate(d.getDate() + 7);
  }
  return d;
}

export async function cancelDailyAndWeeklyNotifications(): Promise<void> {
  try {
    const [dailyId, weeklyId] = await Promise.all([
      AsyncStorage.getItem(STORAGE_DAILY_ID),
      AsyncStorage.getItem(STORAGE_WEEKLY_ID),
    ]);
    if (dailyId) await Notifications.cancelScheduledNotificationAsync(dailyId);
    if (weeklyId) await Notifications.cancelScheduledNotificationAsync(weeklyId);
    await AsyncStorage.multiRemove([STORAGE_DAILY_ID, STORAGE_WEEKLY_ID]);
  } catch {
    // ignore
  }
}

export interface NotificationSettings {
  daily_expiry_alerts_enabled: boolean;
  alert_threshold: number;
}

/**
 * Schedule daily (9am) and weekly (Monday 9am) expiry notifications.
 * Reschedules with current counts; call when app opens (e.g. Dashboard) or when settings change.
 */
export async function scheduleDailyAndWeeklyNotifications(
  products: ProductWithBatches[],
  settings: NotificationSettings
): Promise<void> {
  if (!settings.daily_expiry_alerts_enabled) {
    await cancelDailyAndWeeklyNotifications();
    return;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) return;
  await setupNotificationChannel();

  await cancelDailyAndWeeklyNotifications();

  const todayCount = countExpiringToday(products);
  const weekCount = countExpiringThisWeek(products);
  const next9am = getNext9am();
  const nextMonday = getNextMonday9am();

  const dailyId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'LifeCycle',
      body:
        todayCount === 0
          ? 'No products expiring today.'
          : `${todayCount} product${todayCount === 1 ? '' : 's'} expiring today.`,
      sound: SOUND_FILE,
      data: { type: 'daily-expiry' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE as const,
      date: next9am,
      channelId: CHANNEL_ID,
    },
  });

  const weeklyId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'LifeCycle',
      body:
        weekCount === 0
          ? 'No products expiring this week.'
          : `${weekCount} product${weekCount === 1 ? '' : 's'} expiring this week.`,
      sound: SOUND_FILE,
      data: { type: 'weekly-expiry' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE as const,
      date: nextMonday,
      channelId: CHANNEL_ID,
    },
  });

  await AsyncStorage.multiSet([
    [STORAGE_DAILY_ID, dailyId],
    [STORAGE_WEEKLY_ID, weeklyId],
  ]);
}
