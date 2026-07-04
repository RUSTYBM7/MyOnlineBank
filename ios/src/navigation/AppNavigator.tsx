// ============================================================
// OrbitPay - App Navigator
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import { useAppStore, useUnreadCount } from '../store';
import type { RootStackParamList, MainTabParamList } from '../types';

// Auth Screens
import SplashScreen    from '../screens/auth/SplashScreen';
import LoginScreen     from '../screens/auth/LoginScreen';
import BiometricScreen from '../screens/auth/BiometricScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

// Main Tab Screens
import HomeScreen     from '../screens/main/HomeScreen';
import TransferScreen from '../screens/main/TransferScreen';
import AccountsScreen from '../screens/main/AccountsScreen';
import CardsScreen    from '../screens/main/CardsScreen';
import BillsScreen    from '../screens/main/BillsScreen';

// Secondary Screens
import ProfileScreen      from '../screens/secondary/ProfileScreen';
import KycScreen          from '../screens/secondary/KycScreen';
import NotificationsScreen from '../screens/secondary/NotificationsScreen';
import SupportScreen      from '../screens/secondary/SupportScreen';
import TransactionDetailScreen from '../screens/secondary/TransactionDetailScreen';
import AccountDetailScreen     from '../screens/secondary/AccountDetailScreen';
import ChangePasswordScreen    from '../screens/secondary/ChangePasswordScreen';
import LinkedAccountsScreen    from '../screens/secondary/LinkedAccountsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<MainTabParamList>();

// ─── Tab Icon Component ────────────────────────────────────
interface TabIconProps {
  emoji:   string;
  focused: boolean;
  label:   string;
  badge?:  number;
}
const TabIcon: React.FC<TabIconProps> = ({ emoji, focused, label, badge }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 120, useNativeDriver: true }),
        Animated.spring(scale,  { toValue: 1,    friction: 5,   useNativeDriver: true }),
      ]).start();
    }
  }, [focused]);

  return (
    <View style={tabStyles.iconWrapper}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={tabStyles.emoji}>{emoji}</Text>
      </Animated.View>
      {badge && badge > 0 ? (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge > 99 ? '99+' : String(badge)}</Text>
        </View>
      ) : null}
      {focused && <View style={tabStyles.activeDot} />}
    </View>
  );
};

const tabStyles = StyleSheet.create({
  iconWrapper: { alignItems: 'center', width: 40 },
  emoji:       { fontSize: 22 },
  activeDot:   { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.primary[500], marginTop: 2 },
  badge: {
    position:        'absolute',
    top:             -4,
    right:           -4,
    minWidth:        16,
    height:          16,
    borderRadius:    8,
    backgroundColor: COLORS.error,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
});

// ─── Bottom Tab Navigator ──────────────────────────────────
const MainTabs: React.FC = () => {
  const { darkMode } = useAppStore();
  const unread = useUnreadCount();

  const tabBarBackground = () => (
    <LinearGradient
      colors={darkMode ? [COLORS.gray[900], COLORS.gray[900]] : ['#FFFFFF', '#F9FAFB']}
      style={StyleSheet.absoluteFill}
    />
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:  false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize:   FONT_SIZES.xs,
          fontWeight: '600',
          marginTop:  -2,
        },
        tabBarStyle: {
          height:          Platform.OS === 'ios' ? 88 : 68,
          paddingBottom:   Platform.OS === 'ios' ? 24 : 8,
          paddingTop:      8,
          borderTopWidth:  1,
          borderTopColor:  darkMode ? COLORS.gray[800] : COLORS.gray[100],
          elevation:       8,
          shadowColor:     '#000',
          shadowOffset:    { width: 0, height: -2 },
          shadowOpacity:   0.06,
          shadowRadius:    8,
        },
        tabBarActiveTintColor:   COLORS.primary[600],
        tabBarInactiveTintColor: darkMode ? COLORS.gray[500] : COLORS.gray[400],
        tabBarBackground,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} label="Home" />,
        }}
      />
      <Tab.Screen
        name="Transfer"
        component={TransferScreen}
        options={{
          tabBarLabel: 'Transfer',
          tabBarIcon: ({ focused }) => <TabIcon emoji="↗️" focused={focused} label="Transfer" />,
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          tabBarLabel: 'Accounts',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏦" focused={focused} label="Accounts" />,
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          tabBarLabel: 'Cards',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💳" focused={focused} label="Cards" />,
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          tabBarLabel: 'Bills',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📄" focused={focused} label="Bills" badge={unread > 0 ? unread : undefined} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ─── Root Stack Navigator ──────────────────────────────────
const AppNavigator: React.FC = () => {
  const { isAuthenticated, darkMode } = useAppStore();

  const navTheme = darkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: COLORS.gray[900],
          card:       COLORS.gray[800],
          border:     COLORS.gray[700],
          primary:    COLORS.primary[500],
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: COLORS.gray[50],
          card:       COLORS.white,
          border:     COLORS.gray[100],
          primary:    COLORS.primary[500],
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation:   'slide_from_right',
          contentStyle: { backgroundColor: darkMode ? COLORS.gray[900] : COLORS.gray[50] },
        }}
      >
        {/* Always-available: Splash */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />

        {/* Unauthenticated flow */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login"      component={LoginScreen}      options={{ animation: 'fade' }} />
        <Stack.Screen name="Biometric"  component={BiometricScreen}  options={{ animation: 'fade' }} />

        {/* Authenticated flow */}
        <Stack.Screen name="Main"               component={MainTabs}               options={{ animation: 'fade' }} />
        <Stack.Screen name="Profile"            component={ProfileScreen} />
        <Stack.Screen name="KycVerification"    component={KycScreen} />
        <Stack.Screen name="Notifications"      component={NotificationsScreen} />
        <Stack.Screen name="Support"            component={SupportScreen} />
        <Stack.Screen name="TransactionDetail"  component={TransactionDetailScreen} />
        <Stack.Screen name="AccountDetail"      component={AccountDetailScreen} />
        <Stack.Screen name="ChangePassword"     component={ChangePasswordScreen} />
        <Stack.Screen name="LinkedAccounts"     component={LinkedAccountsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
