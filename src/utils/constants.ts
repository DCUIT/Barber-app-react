export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://barber-web-tkgd.onrender.com';

export const COLORS = {
  primary: '#c5a059',
  background: '#1a1a2e',
  card: '#16213e',
  success: '#10b981',
  error: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b',
  text: '#fff',
  muted: '#9ca3af',
  border: '#374151',
};

export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  Pending: { label: 'Chờ xác nhận', color: '#c5a059' },
  Accepted: { label: 'Đã xác nhận', color: '#10b981' },
  Completed: { label: 'Hoàn thành', color: '#3b82f6' },
  Cancelled: { label: 'Đã hủy', color: '#ef4444' },
};
