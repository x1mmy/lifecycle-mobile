import type { ColorPalette } from './theme';

export type ProductStatus = 'expired' | 'warning' | 'good';

export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getProductStatus(expiryDate: string): ProductStatus {
  const days = daysUntil(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 7) return 'warning';
  return 'good';
}

export function getStatusLabel(status: ProductStatus, days: number): string {
  if (status === 'expired') return 'Expired';
  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day left';
  if (days <= 7) return `${days}d left`;
  return 'Good';
}

/** Theme-aware status colors. Pass useTheme().colors from a component. */
export function getStatusColors(colors: ColorPalette): Record<ProductStatus, { bg: string; text: string; border: string }> {
  return {
    expired: { bg: colors.destructiveLight, text: colors.destructive, border: colors.destructiveLight },
    warning: { bg: colors.warningLight, text: colors.warning, border: colors.warningLight },
    good: { bg: colors.successLight, text: colors.primaryDark, border: colors.successLight },
  };
}
