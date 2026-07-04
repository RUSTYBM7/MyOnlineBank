// ============================================================
// OrbitPay - App Root Component
// ============================================================
import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, LogBox, Platform, AppState, AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import { useAppStore } from './store';
import { AuthService } from './services/authService';
import { SecureStore, AppStorage } from './utils/secureStorage';
import { MockDataService } from './services/mockDataService';

// Suppress known non-critical warnings in dev
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
  'AsyncStorage has been extracted',
]);

const App: React.FC = () => {
  const { setUser, setTokens, setDarkMode, setBiometricEnabled, setBiometricType, logout, darkMode } = useAppStore();
  const [initialized, setInitialized] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // ─── Bootstrap: restore session + preferences ─────────────
  useEffect(() => {
    (async () => {
      try {
        // 1. Restore dark mode preference
        const savedDark = await AppStorage.getDarkMode();
        if (savedDark !== null) setDarkMode(savedDark);

        // 2. Detect biometric capability
        const { BiometricService } = await import('./services/authService');
        const bioType = await BiometricService.getSupportedType();
        setBiometricType(bioType);

        // 3. Try to restore auth session
        const tokens = await SecureStore.getAuthTokens();
        if (tokens?.accessToken) {
          const isValid = AuthService.isTokenValid(tokens.accessToken);
          if (isValid) {
            const user = await SecureStore.getUserData();
            if (user) {
              setTokens(tokens);
              setUser(user);
              setBiometricEnabled(true);
            }
          } else {
            // Try refresh
            try {
              const freshTokens = await AuthService.refreshTokens(tokens.refreshToken);
              const user = await SecureStore.getUserData();
              if (user && freshTokens) {
                setTokens(freshTokens);
                setUser(user);
                setBiometricEnabled(true);
              }
            } catch {
              await SecureStore.clearAuthTokens();
            }
          }
        }

        // 4. Seed mock data into store if no API data present
        MockDataService.seed();

      } catch (e) {
        // Non-fatal — app continues to Login
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  // ─── App state change (background/foreground) ─────────────
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // App came to foreground: check session validity
        const tokens = await SecureStore.getAuthTokens();
        if (!tokens?.accessToken || !AuthService.isTokenValid(tokens.accessToken)) {
          logout();
        }
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'light-content'}
          backgroundColor="transparent"
          translucent
        />
        {initialized && <AppNavigator />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
