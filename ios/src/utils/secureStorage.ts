// ============================================================
// OrbitPay - Secure Storage (Keychain + AsyncStorage)
// ============================================================
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYCHAIN_KEYS, STORAGE_KEYS } from './constants';
import type { AuthTokens, User } from '../types';

// ---- Keychain (Encrypted Secure Storage) -------------------

export const SecureStore = {
  /**
   * Store auth tokens securely in Keychain.
   * Tokens are stored with biometric protection when available.
   */
  async setAuthTokens(tokens: AuthTokens): Promise<void> {
    try {
      await Keychain.setGenericPassword(
        KEYCHAIN_KEYS.AUTH_TOKEN,
        JSON.stringify(tokens),
        {
          service: KEYCHAIN_KEYS.AUTH_TOKEN,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      );
    } catch (e) {
      console.error('[SecureStore] setAuthTokens error:', e);
    }
  },

  async getAuthTokens(): Promise<AuthTokens | null> {
    try {
      const creds = await Keychain.getGenericPassword({
        service: KEYCHAIN_KEYS.AUTH_TOKEN,
      });
      if (!creds) return null;
      return JSON.parse(creds.password) as AuthTokens;
    } catch {
      return null;
    }
  },

  async clearAuthTokens(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_KEYS.AUTH_TOKEN });
    } catch (e) {
      console.error('[SecureStore] clearAuthTokens error:', e);
    }
  },

  /**
   * Store biometric-protected credentials.
   * These are used for Face ID / Touch ID login.
   */
  async setBiometricCredentials(
    username: string,
    password: string,
  ): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        KEYCHAIN_KEYS.BIOMETRIC_CREDS,
        username,
        password,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
          authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
        },
      );
      return true;
    } catch {
      return false;
    }
  },

  async getBiometricCredentials(): Promise<{ username: string; password: string } | null> {
    try {
      const creds = await Keychain.getInternetCredentials(KEYCHAIN_KEYS.BIOMETRIC_CREDS);
      if (!creds) return null;
      return { username: creds.username, password: creds.password };
    } catch {
      return null;
    }
  },

  async clearBiometricCredentials(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.BIOMETRIC_CREDS });
    } catch (e) {
      console.error('[SecureStore] clearBiometricCredentials error:', e);
    }
  },

  /**
   * Store PIN hash securely.
   */
  async setPinHash(hash: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(
        KEYCHAIN_KEYS.PIN_HASH,
        hash,
        {
          service: KEYCHAIN_KEYS.PIN_HASH,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      );
    } catch (e) {
      console.error('[SecureStore] setPinHash error:', e);
    }
  },

  async getPinHash(): Promise<string | null> {
    try {
      const creds = await Keychain.getGenericPassword({ service: KEYCHAIN_KEYS.PIN_HASH });
      return creds ? creds.password : null;
    } catch {
      return null;
    }
  },

  /** Cache encrypted user data in Keychain to survive app restart. */
  async setUserData(user: User): Promise<void> {
    try {
      await Keychain.setGenericPassword(
        KEYCHAIN_KEYS.USER_DATA,
        JSON.stringify(user),
        {
          service: KEYCHAIN_KEYS.USER_DATA,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        },
      );
    } catch (e) {
      console.error('[SecureStore] setUserData error:', e);
    }
  },

  async getUserData(): Promise<User | null> {
    try {
      const creds = await Keychain.getGenericPassword({ service: KEYCHAIN_KEYS.USER_DATA });
      if (!creds) return null;
      return JSON.parse(creds.password) as User;
    } catch {
      return null;
    }
  },

  async clearAll(): Promise<void> {
    await Promise.allSettled([
      Keychain.resetGenericPassword({ service: KEYCHAIN_KEYS.AUTH_TOKEN }),
      Keychain.resetGenericPassword({ service: KEYCHAIN_KEYS.PIN_HASH }),
      Keychain.resetGenericPassword({ service: KEYCHAIN_KEYS.USER_DATA }),
      Keychain.resetInternetCredentials({ server: KEYCHAIN_KEYS.BIOMETRIC_CREDS }),
    ]);
  },
};

// ---- AsyncStorage (Non-sensitive preferences) --------------

export const AppStorage = {
  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('[AppStorage] set error:', e);
    }
  },

  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setJSON<T>(key: string, value: T): Promise<void> {
    await AppStorage.set(key, JSON.stringify(value));
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await AppStorage.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('[AppStorage] remove error:', e);
    }
  },

  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.error('[AppStorage] clearAll error:', e);
    }
  },

  async isOnboardingComplete(): Promise<boolean> {
    const val = await AppStorage.get(STORAGE_KEYS.ONBOARDING_DONE);
    return val === 'true';
  },

  async setOnboardingComplete(): Promise<void> {
    await AppStorage.set(STORAGE_KEYS.ONBOARDING_DONE, 'true');
  },

  async getDarkMode(): Promise<boolean> {
    const val = await AppStorage.get(STORAGE_KEYS.DARK_MODE);
    return val === 'true';
  },

  async setDarkMode(enabled: boolean): Promise<void> {
    await AppStorage.set(STORAGE_KEYS.DARK_MODE, String(enabled));
  },
};
