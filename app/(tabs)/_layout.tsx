/**
 * Tab navigator — Dribbble-style: dark pill bar, Scan centered (2 | Scan | 2), 5 tabs.
 * Tab press: always navigates to main screen for that tab (pop to top for nested stacks).
 */

import React from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Fonts } from '../../constants/theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TabBarButtonWithReplace(props: any & { href: string }) {
  const { href, children, onPress, ...rest } = props;
  return (
    <Pressable
      {...rest}
      onPress={(e: unknown) => {
        router.replace(href as '/');
        if (typeof onPress === 'function') onPress(e);
      }}
    >
      {children}
    </Pressable>
  );
}

const TAB_BAR_RADIUS = 28;
const SCAN_PILL_SIZE = 48;
const SCAN_ICON_SIZE = 24;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 86 : 70;
const BOTTOM_PAD = Platform.OS === 'ios' ? 26 : 10;

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const tabBarBg = isDark ? colors.card : '#1C1917';
  const tabBarActiveTint = isDark ? colors.primary : '#FFFFFF';
  const tabBarInactiveTint = isDark ? colors.textMuted : 'rgba(255,255,255,0.5)';
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: Fonts.medium },
        tabBarActiveTintColor: tabBarActiveTint,
        tabBarInactiveTintColor: tabBarInactiveTint,
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 10,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          height: TAB_BAR_HEIGHT,
          paddingTop: 8,
          paddingBottom: BOTTOM_PAD,
          backgroundColor: tabBarBg,
          borderTopWidth: 0,
          borderTopLeftRadius: TAB_BAR_RADIUS,
          borderTopRightRadius: TAB_BAR_RADIUS,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size ?? 22}
              color={color}
            />
          ),
          headerTitle: 'Dashboard',
          tabBarButton: (props) => (
            <TabBarButtonWithReplace {...props} href="/(tabs)" />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'cube' : 'cube-outline'}
              size={size ?? 22}
              color={color}
            />
          ),
          headerShown: true,
          tabBarButton: (props) => (
            <TabBarButtonWithReplace {...props} href="/(tabs)/products" />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.scanPill, focused && styles.scanPillActive]}>
              <Ionicons
                name="barcode"
                size={SCAN_ICON_SIZE}
                color="#FFFFFF"
              />
            </View>
          ),
          headerShown: false,
          tabBarButton: (props) => (
            <TabBarButtonWithReplace {...props} href="/(tabs)/scan" />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={size ?? 22}
              color={color}
            />
          ),
          headerShown: true,
          headerTitle: 'Alerts',
          tabBarButton: (props) => (
            <TabBarButtonWithReplace {...props} href="/(tabs)/alerts" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={size ?? 22}
              color={color}
            />
          ),
          headerShown: false,
          tabBarButton: (props) => (
            <TabBarButtonWithReplace {...props} href="/(tabs)/settings" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanPill: {
    width: SCAN_PILL_SIZE,
    height: SCAN_PILL_SIZE,
    borderRadius: SCAN_PILL_SIZE / 2,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  scanPillActive: {
    backgroundColor: '#059669',
  },
});
