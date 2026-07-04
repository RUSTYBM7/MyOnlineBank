import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccountNumber(): string {
  // Generate a 10-digit account number
  const num = Math.floor(1000000000 + Math.random() * 9000000000);
  return num.toString();
}

export function generateCardNumber(): string {
  // Generate a 16-digit card number (Luhn-valid)
  const prefix = '4'; // Visa prefix
  let number = prefix;
  for (let i = 0; i < 14; i++) {
    number += Math.floor(Math.random() * 10);
  }
  // Luhn checksum
  let sum = 0;
  let isEven = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return number + checkDigit;
}

export function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

export function generateReferenceNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORB';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function sanitizeUser(user: Record<string, unknown>): Record<string, unknown> {
  const { passwordHash, mfaSecret, mfaBackupCodes, ...sanitized } = user;
  void passwordHash; void mfaSecret; void mfaBackupCodes;
  return sanitized;
}

export function sanitizeAdmin(admin: Record<string, unknown>): Record<string, unknown> {
  const { passwordHash, mfaSecret, ...sanitized } = admin;
  void passwordHash; void mfaSecret;
  return sanitized;
}

export function now(): string {
  return new Date().toISOString();
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateTransferFee(amount: number, type: string): number {
  switch (type) {
    case 'internal': return 0;
    case 'external': return Math.min(amount * 0.002, 25); // 0.2% max $25
    case 'wire': return amount > 10000 ? 35 : 15;
    default: return 0;
  }
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  return { data, total, page, limit, totalPages };
}
