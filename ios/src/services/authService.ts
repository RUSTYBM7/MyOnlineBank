// ============================================================
// OrbitPay - Auth Service (login, logout, biometric, refresh)
// ============================================================
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { api } from './apiClient';
import { SecureStore } from '../utils/secureStorage';
import { API_ENDPOINTS, BIOMETRIC_REASON } from '../utils/constants';
import type { AuthCredentials, AuthTokens, BiometricType, User } from '../types';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

// ---- Biometric helpers -------------------------------------
export const BiometricService = {
  async getSupportedType(): Promise<BiometricType> {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      if (!available) return 'None';
      if (biometryType === BiometryTypes.FaceID) return 'FaceID';
      if (biometryType === BiometryTypes.TouchID) return 'TouchID';
      return 'Biometrics';
    } catch {
      return 'None';
    }
  },

  async isAvailable(): Promise<boolean> {
    const type = await BiometricService.getSupportedType();
    return type !== 'None';
  },

  async authenticate(reason: string = BIOMETRIC_REASON): Promise<boolean> {
    try {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage: reason });
      return success;
    } catch {
      return false;
    }
  },

  async createBiometricKey(): Promise<string | null> {
    try {
      const { publicKey } = await rnBiometrics.createKeys();
      return publicKey;
    } catch {
      return null;
    }
  },

  async signPayload(payload: string): Promise<string | null> {
    try {
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: BIOMETRIC_REASON,
        payload,
      });
      return success ? (signature ?? null) : null;
    } catch {
      return null;
    }
  },

  async deleteKeys(): Promise<void> {
    try {
      await rnBiometrics.deleteKeys();
    } catch {
      // Ignore
    }
  },
};

// ---- Auth API calls ----------------------------------------
export const AuthService = {
  async login(credentials: AuthCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await api.post<{ user: User; tokens: AuthTokens }>(
      API_ENDPOINTS.LOGIN,
      credentials,
    );
    await SecureStore.setAuthTokens(result.tokens);
    await SecureStore.setUserData(result.user);
    return result;
  },

  async loginWithBiometric(): Promise<{ user: User; tokens: AuthTokens }> {
    const creds = await SecureStore.getBiometricCredentials();
    if (!creds) throw new Error('No biometric credentials stored');

    const authenticated = await BiometricService.authenticate();
    if (!authenticated) throw new Error('Biometric authentication failed');

    return AuthService.login({
      email: creds.username,
      password: creds.password,
    });
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } finally {
      await SecureStore.clearAll();
    }
  },

  async refreshTokens(): Promise<AuthTokens | null> {
    const tokens = await SecureStore.getAuthTokens();
    if (!tokens?.refreshToken) return null;

    try {
      const newTokens = await api.post<AuthTokens>(API_ENDPOINTS.REFRESH, {
        refreshToken: tokens.refreshToken,
      });
      await SecureStore.setAuthTokens(newTokens);
      return newTokens;
    } catch {
      await SecureStore.clearAll();
      return null;
    }
  },

  async getMe(): Promise<User> {
    return api.get<User>(API_ENDPOINTS.ME);
  },

  async sendOtp(phone: string): Promise<void> {
    await api.post(API_ENDPOINTS.SEND_OTP, { phone });
  },

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const result = await api.post<{ verified: boolean }>(API_ENDPOINTS.VERIFY_OTP, {
      phone,
      otp,
    });
    return result.verified;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },

  async getStoredUser(): Promise<User | null> {
    return SecureStore.getUserData();
  },

  async getStoredTokens(): Promise<AuthTokens | null> {
    return SecureStore.getAuthTokens();
  },

  async isTokenValid(): Promise<boolean> {
    const tokens = await SecureStore.getAuthTokens();
    if (!tokens) return false;
    return tokens.expiresAt > Date.now();
  },
};
