import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || 'fallback-admin-secret';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export function generateAccessToken(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN } as jwt.SignOptions
  );
}

export function generateRefreshToken(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload, type: 'refresh', jti: uuidv4() },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
}

export function generateAdminAccessToken(payload: Omit<AdminTokenPayload, 'type' | 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    JWT_ADMIN_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN } as jwt.SignOptions
  );
}

export function generateAdminRefreshToken(payload: Omit<AdminTokenPayload, 'type' | 'iat' | 'exp'>): string {
  return jwt.sign(
    { ...payload, type: 'refresh', jti: uuidv4() },
    JWT_ADMIN_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN } as jwt.SignOptions
  );
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, JWT_ADMIN_SECRET) as AdminTokenPayload;
}

export function getRefreshTokenExpiryDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 7); // 7 days
  return date;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}
