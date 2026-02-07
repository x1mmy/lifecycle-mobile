/**
 * LoadingSkeleton — animated pulse placeholders.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  style?: object;
}

export function LoadingSkeleton({ width = '100%', height = 20, style }: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height },
        { opacity },
        style,
      ]}
    />
  );
}

export function ProductListSkeleton() {
  return (
    <View style={styles.list}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.row}>
          <LoadingSkeleton width={120} height={16} />
          <LoadingSkeleton width={80} height={14} style={{ marginTop: Spacing.sm }} />
          <LoadingSkeleton width={60} height={24} style={{ marginTop: Spacing.md, borderRadius: BorderRadius.full }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  list: {
    padding: Spacing.lg,
  },
  row: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
