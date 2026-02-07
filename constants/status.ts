import { Colors } from './theme';

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

export const StatusColors: Record<ProductStatus, { bg: string; text: string; border: string }> = {
  expired: { bg: Colors.destructiveLight, text: Colors.destructive, border: '#FECACA' },
  warning: { bg: Colors.warningLight, text: Colors.warning, border: '#FDE68A' },
  good: { bg: Colors.successLight, text: Colors.primaryDark, border: '#A7F3D0' },
};
