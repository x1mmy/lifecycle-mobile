/**
 * FilterChips — horizontal scrollable chips, single or multi select.
 */

import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export interface ChipOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: ChipOption[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multi?: boolean;
}

export function FilterChips({ options, selected, onSelect, multi = false }: FilterChipsProps) {
  const { colors } = useTheme();
  const isSelected = (value: string) =>
    Array.isArray(selected) ? selected.includes(value) : selected === value;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          gap: Spacing.sm,
          paddingVertical: Spacing.sm,
        },
        chip: {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          borderRadius: BorderRadius.full,
          backgroundColor: colors.borderLight,
        },
        chipActive: { backgroundColor: colors.primary },
        label: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textSecondary,
        },
        labelActive: { color: colors.white },
      }),
    [colors]
  );
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((opt) => {
        const active = isSelected(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {opt.label}
              {opt.count != null ? ` (${opt.count})` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
