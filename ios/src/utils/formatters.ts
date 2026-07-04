// ============================================================
// OrbitPay - Formatting Utilities
// ============================================================

import { CURRENCY_SYMBOLS } from './constants';

/** Format a number as a currency string. */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  options?: { compact?: boolean; decimals?: number },
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const decimals = options?.decimals ?? (currency === 'BTC' ? 6 : 2);

  if (options?.compact && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 1_000_000) {
      return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
    }
    return `${symbol}${(amount / 1_000).toFixed(1)}K`;
  }

  return `${symbol}${Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/** Returns "+$1,234.00" or "-$1,234.00" with sign prefix */
export function formatAmount(amount: number, currency: string = 'USD'): string {
  const formatted = formatCurrency(Math.abs(amount), currency);
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
}

/** Format a date string to readable form */
export function formatDate(dateStr: string, format: 'short' | 'long' | 'time' = 'short'): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** "2 hours ago", "3 days ago", etc. */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return formatDate(dateStr, 'short');
}

/** Mask card number: "•••• •••• •••• 4532" */
export function maskCardNumber(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

/** Mask account number: "••••••7890" */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return `••••${accountNumber.slice(-4)}`;
}

/** Format card expiry: "12/27" */
export function formatExpiry(month: number, year: number): string {
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}

/** Capitalise first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Replace underscores with spaces and capitalise each word */
export function humanise(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** Truncate a string with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/** Validate email address */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate US phone number */
export function isValidPhone(phone: string): boolean {
  return /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone);
}

/** Convert a hex color to rgba */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Generate initials from a full name */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Format a percentage change */
export function formatPercent(value: number, digits: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

/** Parse a currency string back to number */
export function parseCurrency(str: string): number {
  return parseFloat(str.replace(/[^0-9.-]/g, ''));
}
