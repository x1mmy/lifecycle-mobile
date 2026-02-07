/**
 * Toast — ToastProvider context + useToast() hook, slide-in notifications.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;
const DISMISS_MS = 3500;

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string) => show(message, 'success'), [show]);
  const error = useCallback((message: string) => show(message, 'error'), [show]);

  const value: ToastContextValue = { show, success, error };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const anim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 9,
    }).start();

    const t = setTimeout(onDismiss, DISMISS_MS);
    return () => clearTimeout(t);
  }, []);

  const bg =
    toast.type === 'success'
      ? Colors.primary
      : toast.type === 'error'
        ? Colors.destructive
        : Colors.textPrimary;

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg }, { transform: [{ translateY: anim }] }]} pointerEvents="none">
      <Text style={styles.toastText} numberOfLines={2}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    maxWidth: '100%',
  },
  toastText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.white,
  },
});
