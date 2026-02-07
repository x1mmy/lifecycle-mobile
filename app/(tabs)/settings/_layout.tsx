/**
 * Settings stack — index, profile, notifications, categories.
 */

import { Stack } from 'expo-router';
import { Colors, Fonts } from '../../../constants/theme';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontFamily: Fonts.medium },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="profile" options={{ title: 'Business Profile' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="categories" options={{ title: 'Categories' }} />
    </Stack>
  );
}
