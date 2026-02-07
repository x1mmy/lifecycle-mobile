/**
 * Products stack — list, add, [id].
 */

import { Stack } from 'expo-router';
import { Colors, Fonts } from '../../../constants/theme';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontFamily: Fonts.medium },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Products' }} />
      <Stack.Screen name="add" options={{ title: 'Quick Add' }} />
      <Stack.Screen name="[id]" options={{ title: 'Product Detail' }} />
    </Stack>
  );
}
