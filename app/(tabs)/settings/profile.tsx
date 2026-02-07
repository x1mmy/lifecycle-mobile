/**
 * Business Profile — Business Name, Email (read-only), Phone, Address.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useProfile } from '../../../lib/hooks/useProfile';
import { updateProfile } from '../../../lib/services/settings';
import { useToast } from '../../../components/ui/Toast';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Fonts, FontSizes, Spacing } from '../../../constants/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { data: profile, loading, refetch } = useProfile(user?.id);
  const { success, error: showError } = useToast();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        content: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
        saveBtn: { marginTop: Spacing.lg },
      }),
    [colors]
  );

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.business_name ?? '');
      setPhone(profile.phone ?? '');
      setAddress(profile.address ?? '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        business_name: businessName.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        email: user.email ?? undefined,
      });
      success('Profile saved');
      refetch();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        label="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
        placeholder="Business name"
      />
      <Input
        label="Email"
        value={user.email ?? ''}
        editable={false}
        placeholder="Email"
      />
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />
      <Input
        label="Address"
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        multiline
      />
      <Button title="Save" onPress={handleSave} loading={saving} style={styles.saveBtn} />
    </ScrollView>
  );
}

