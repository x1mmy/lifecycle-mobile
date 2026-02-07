/**
 * MarkHandledButton — checkmark + label with bounce-on-press success feedback.
 */

import React, { useRef, useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Fonts, FontSizes, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface MarkHandledButtonProps {
  onPress: () => void;
}

export function MarkHandledButton({ onPress }: MarkHandledButtonProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.xs,
          marginBottom: Spacing.xs,
        },
        label: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.xs,
          color: colors.primary,
        },
      }),
    [colors]
  );

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.35,
        useNativeDriver: true,
        tension: 400,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 12,
      }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
      </Animated.View>
      <Text style={styles.label}>Mark handled</Text>
    </TouchableOpacity>
  );
}
