/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind-aware className merge.
 * Used across the codebase as `cn(...)` to compose conditional Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as USD currency. */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format a date as a short string like "Nov 12, 2025". */
export function formatDate(value: Date | string | number): string {
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Format a Date as a friendly relative string ("5m ago", "yesterday"). */
export function formatRelative(value: Date | string | number): string {
  const d = value instanceof Date ? value : new Date(value);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

/** Mask all but the last 4 characters of a string (account number, etc.). */
export function maskTail(value: string, visible = 4): string {
  if (value.length <= visible) return value;
  return `•••• ${value.slice(-visible)}`;
}

/** Truncate text with ellipsis at a max length. */
export function truncate(value: string, max = 60): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** Delay utility for sequential async operations. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Stable, deterministic string ID generation (no external dep). */
export function makeId(prefix = 'id'): string {
  const r = Math.random().toString(36).slice(2, 10);
  const t = Date.now().toString(36).slice(-6);
  return `${prefix}_${t}${r}`;
}

/** Safe JSON parse — returns fallback on invalid JSON. */
export function safeJson<T>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

/** Validate an email shape with a permissive regex. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Validate a 10-digit US phone number, accepting common formatting. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}

/** Format a 10-digit phone number as (XXX) XXX-XXXX. */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value;
}

/** Convert a snake_case string to Title Case. */
export function titleize(input: string): string {
  return input
    .replace(/[_-]+/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

/** Get initials (up to 2 characters) from a person's name. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
