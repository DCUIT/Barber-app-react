export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://barber-web-tkgd.onrender.com';

export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  Pending: { label: 'Chờ xác nhận', color: '#c5a059' },
  Accepted: { label: 'Đã xác nhận', color: '#10b981' },
  Completed: { label: 'Hoàn thành', color: '#3b82f6' },
  Cancelled: { label: 'Đã hủy', color: '#ef4444' },
};
