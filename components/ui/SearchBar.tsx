/**
 * SearchBar — search icon + input + clear, debounced onChange.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';

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

  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
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

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  icon: {
    fontSize: FontSizes.md,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
  },
  clear: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    padding: Spacing.xs,
  },
});
