const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN');
const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
const DATETIME_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

export function formatPrice(amount: number): string {
  if (!amount) return '0đ';
  return CURRENCY_FORMATTER.format(amount) + 'đ';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return DATE_FORMATTER.format(d);
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return DATETIME_FORMATTER.format(d);
}

export function toDateInputString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
