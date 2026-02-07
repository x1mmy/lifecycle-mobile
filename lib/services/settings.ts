/**
 * Profile + settings — Supabase read/update.
 */

import { supabase } from '../supabase';
import type { Profile, Settings, ProfileUpdate, SettingsUpdate } from '../types/database';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Profile;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<void> {
  const { error } = await supabase.from('profiles').upsert({ id: userId, ...updates });
  if (error) throw error;
}

export async function getSettings(userId: string): Promise<Settings | null> {
  const { data, error } = await supabase.from('settings').select('*').eq('user_id', userId).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Settings;
}

export async function updateSettings(userId: string, updates: SettingsUpdate): Promise<void> {
  const { data } = await supabase.from('settings').select('id').eq('user_id', userId).single();
  if (data) {
    const { error } = await supabase.from('settings').update(updates).eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('settings').insert({ user_id: userId, ...updates });
    if (error) throw error;
  }
}
