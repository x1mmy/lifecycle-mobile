/**
 * SearchBar — search icon + input + clear, debounced onChange.
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search…',
  debounceMs = 300,
}: SearchBarProps) {
  const { colors } = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const emitChange = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChangeText(text);
        debounceRef.current = null;
      }, debounceMs);
    },
    [onChangeText, debounceMs]
  );

  const handleChange = (text: string) => {
    setLocalValue(text);
    emitChange(text);
  };

  const clear = () => {
    setLocalValue('');
    onChangeText('');
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: Spacing.md,
        },
        icon: { marginRight: Spacing.sm },
        input: {
          flex: 1,
          fontFamily: Fonts.regular,
          fontSize: FontSizes.md,
          color: colors.textPrimary,
          paddingVertical: Spacing.md,
        },
        clear: {
          fontFamily: Fonts.medium,
          fontSize: FontSizes.sm,
          color: colors.textMuted,
          padding: Spacing.xs,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={20} color={colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
      />
      {localValue.length > 0 ? (
        <TouchableOpacity onPress={clear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
