/**
 * Barcode scanner — MyFitnessPal-style: instant feedback, fast lookup, clear frame.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lookupBarcode } from '../../lib/services/barcode';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

const BARCODE_TYPES = ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'] as const;
const FLASH_DURATION_MS = 400;
const MIN_SCAN_INTERVAL_MS = 1500;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [result, setResult] = useState<{
    barcode: string;
    name: string | null;
    supplier: string | null;
    category: string | null;
    loading: boolean;
  } | null>(null);
  const lastScanTime = useRef(0);
  const flashOpacity = useRef(new Animated.Value(0)).current;

  const handleBarCodeScanned = useCallback(
    async (scanningResult: { data: string }) => {
      const barcodeData = scanningResult?.data?.trim();
      if (!barcodeData) return;
      const now = Date.now();
      if (scanned || now - lastScanTime.current < MIN_SCAN_INTERVAL_MS) return;
      lastScanTime.current = now;
      setScanned(true);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowFlash(true);
      flashOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.delay(FLASH_DURATION_MS - 240),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(() => setShowFlash(false));

      setResult({
        barcode: barcodeData,
        name: null,
        supplier: null,
        category: null,
        loading: true,
      });

      try {
        const lookup = await lookupBarcode(barcodeData);
        setResult((prev) =>
          prev ? { ...prev, ...lookup, loading: false } : null
        );
      } catch {
        setResult((prev) =>
          prev ? { ...prev, loading: false } : null
        );
      }
    },
    [scanned, flashOpacity]
  );

  const reset = useCallback(() => {
    setScanned(false);
    setResult(null);
  }, []);

  const goToAddProduct = useCallback(() => {
    if (!result) return;
    router.replace({
      pathname: '/(tabs)/products/add',
      params: {
        barcode: result.barcode,
        name: result.name ?? '',
        category: result.category ?? '',
      },
    });
  }, [result]);

  const close = useCallback(() => {
    router.back();
  }, []);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.muted}>Checking camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.muted}>
          Allow camera access to scan barcodes. We use it only for scanning.
        </Text>
        <Button title="Grant permission" onPress={requestPermission} style={styles.btn} />
        <Button title="Close" variant="ghost" onPress={close} style={styles.btn} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
      />
      {showFlash && (
        <Animated.View
          style={[styles.flashOverlay, { opacity: flashOpacity }]}
          pointerEvents="none"
        >
          <View style={styles.flashCard}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
            <Text style={styles.flashText}>Got it!</Text>
            <Text style={styles.flashSub}>Looking up product…</Text>
          </View>
        </Animated.View>
      )}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setTorchOn((on) => !on)}
            style={[styles.torchBtn, torchOn && styles.torchBtnActive]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={torchOn ? 'flash' : 'flash-outline'}
              size={24}
              color={torchOn ? Colors.primary : Colors.white}
            />
            <Text style={[styles.torchLabel, torchOn && styles.torchLabelActive]}>
              {torchOn ? 'Torch on' : 'Torch'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={close} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.frame} />
        <Text style={styles.hint}>Align barcode within the frame</Text>
      </SafeAreaView>

      <Modal
        visible={!!result}
        transparent
        animationType="slide"
        onRequestClose={reset}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={reset}
        />
        <View style={styles.resultSheet}>
          <View style={styles.resultHandle} />
          <Text style={styles.resultTitle}>Scan result</Text>
          {result?.loading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loaderText}>Looking up product…</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultBarcode}>{result?.barcode}</Text>
              <Text style={styles.resultName}>
                {result?.name || 'Product name not found'}
              </Text>
              {result?.supplier ? (
                <Text style={styles.resultMeta}>Brand: {result.supplier}</Text>
              ) : null}
              {result?.category ? (
                <Text style={styles.resultMeta}>Category: {result.category}</Text>
              ) : null}
              <View style={styles.resultActions}>
                <Button
                  title="Add Product"
                  onPress={goToAddProduct}
                  style={styles.resultBtn}
                />
                <Button
                  title="Scan Again"
                  variant="secondary"
                  onPress={reset}
                  style={styles.resultBtn}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  muted: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  btn: {
    marginTop: Spacing.md,
    minWidth: 200,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  torchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.md,
  },
  torchBtnActive: {
    backgroundColor: Colors.primaryLight,
  },
  torchLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.white,
  },
  torchLabelActive: {
    color: Colors.primary,
  },
  closeBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.md,
  },
  closeText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.white,
  },
  frame: {
    width: 280,
    height: 140,
    borderWidth: 3,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'transparent',
    ...Shadows.lg,
  },
  hint: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Spacing['2xl'],
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    minWidth: 200,
    ...Shadows.lg,
  },
  flashText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  flashSub: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  resultSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'] + 24,
  },
  resultHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  resultTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  resultBarcode: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  resultName: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  resultMeta: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  loaderWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loaderText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  resultActions: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  resultBtn: {
    marginTop: Spacing.sm,
  },
});
