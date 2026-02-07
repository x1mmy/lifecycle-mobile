/**
 * Modal — confirmation dialog with overlay.
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../../constants/theme';
import { Button } from './Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
}

export function Modal({
  visible,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = false,
  children,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.content}
            >
              <Text style={styles.title}>{title}</Text>
              {message ? <Text style={styles.message}>{message}</Text> : null}
              {children}
              <View style={styles.actions}>
                <TouchableOpacity onPress={onClose} style={styles.cancelWrap}>
                  <Text style={styles.cancelText}>{cancelLabel}</Text>
                </TouchableOpacity>
                {onConfirm ? (
                  <Button
                    title={confirmLabel}
                    onPress={async () => {
                      await Promise.resolve(onConfirm());
                      onClose();
                    }}
                    variant={destructive ? 'destructive' : 'primary'}
                    style={styles.confirmBtn}
                  />
                ) : null}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  content: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  cancelWrap: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.primary,
  },
  confirmBtn: {
    minWidth: 100,
  },
});
