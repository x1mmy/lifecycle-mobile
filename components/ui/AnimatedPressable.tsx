/**
 * AnimatedPressable — scale-down on press, spring back. Makes taps feel alive.
 */

import React, { useRef } from 'react';
import { Pressable, Animated, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

const PRESS_SCALE = 0.97;
const SPRING_CONFIG = { tension: 300, friction: 20 };

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  haptic?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'menuitem' | 'none';
}

export function AnimatedPressable({
  children,
  onPress,
  style,
  haptic = false,
  disabled = false,
  accessibilityLabel,
  accessibilityRole = 'button',
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: PRESS_SCALE,
      useNativeDriver: true,
      ...SPRING_CONFIG,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      ...SPRING_CONFIG,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPressCancel={handlePressOut}
      disabled={disabled}
      style={styles.wrapper}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    >
      <Animated.View style={[styles.inner, style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
  inner: {
    alignSelf: 'stretch',
  },
});
