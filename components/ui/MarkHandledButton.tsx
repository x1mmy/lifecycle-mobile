/**
 * MarkHandledButton — checkmark + label with bounce-on-press success feedback.
 */

import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, FontSizes, Spacing } from '../../constants/theme';

interface MarkHandledButtonProps {
  onPress: () => void;
}

export function MarkHandledButton({ onPress }: MarkHandledButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

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
        <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
      </Animated.View>
      <Text style={styles.label}>Mark handled</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
    color: Colors.primary,
  },
});
