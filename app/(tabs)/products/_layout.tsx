/**
 * Products stack — list, add, [id].
 * Drill transition: slide_from_right for list → detail hierarchy.
 * Product detail: explicit header with back button.
 */

import { Stack } from 'expo-router';
import { useTheme } from '../../../contexts/ThemeContext';
import { Fonts } from '../../../constants/theme';

export default function ProductsLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: Fonts.medium },
        headerBackTitleVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Products', headerShown: false }} />
      <Stack.Screen name="add" options={{ title: 'Quick Add' }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Product Detail',
          headerShown: true,
          headerBackVisible: true,
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
