/**
 * Tab navigator — Dribbble-style: dark pill bar, Scan centered (2 | Scan | 2), 5 tabs.
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, FontSizes } from '../../constants/theme';

const TAB_BAR_DARK = '#1C1917';
const TAB_BAR_RADIUS = 28;
const SCAN_PILL_SIZE = 48;
const SCAN_ICON_SIZE = 24;
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 86 : 70;
const BOTTOM_PAD = Platform.OS === 'ios' ? 26 : 10;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontFamily: Fonts.medium },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
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
          backgroundColor: TAB_BAR_DARK,
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
          headerShown: false,
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
                color={Colors.white}
              />
            </View>
          ),
          headerShown: false,
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  scanPillActive: {
    backgroundColor: Colors.primaryDark,
  },
});
