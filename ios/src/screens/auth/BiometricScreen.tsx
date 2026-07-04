// ============================================================
// OrbitPay - Biometric Authentication Screen
// ============================================================
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { COLORS, FONT_SIZES, RADIUS, SPACING, SHADOWS } from '../../utils/constants';
import { BiometricService, AuthService } from '../../services/authService';
import { useAppStore } from '../../store';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Biometric'>;
  route: RouteProp<RootStackParamList, 'Biometric'>;
};

const BiometricScreen: React.FC<Props> = ({ navigation, route }) => {
  const reason = route.params?.reason ?? 'Authenticate to continue';
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  const { biometricType, setUser, setTokens, setAuthenticated } = useAppStore();

  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const iconAnim   = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const pulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  };

  const successBounce = () => {
    Animated.sequence([
      Animated.spring(bounceAnim, { toValue: -20, tension: 200, friction: 4, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 0,   tension: 200, friction: 6, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => { pulse(); }, []);

  const authenticate = async () => {
    setStatus('scanning');
    try {
      const { user, tokens } = await AuthService.loginWithBiometric();
      setStatus('success');
      successBounce();
      setUser(user);
      setTokens(tokens);
      setAuthenticated(true);
    } catch {
      setStatus('failed');
      Animated.sequence([
        Animated.timing(iconAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
        Animated.timing(iconAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.timing(iconAnim, { toValue: 1,   duration: 100, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(authenticate, 400);
    return () => clearTimeout(timer);
  }, []);

  const icon = biometricType === 'FaceID' ? '🔒' : '👆';
  const title = biometricType === 'FaceID' ? 'Face ID' : biometricType === 'TouchID' ? 'Touch ID' : 'Biometric';

  const colors = {
    idle:     [COLORS.primary[600], COLORS.teal[600]],
    scanning: [COLORS.teal[600], COLORS.cyan[600]],
    success:  [COLORS.primary[500], COLORS.primary[700]],
    failed:   ['#DC2626', '#B91C1C'],
  }[status];

  return (
    <LinearGradient
      colors={[COLORS.gray[900], COLORS.primary[900]]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>OrbitPay</Text>
        <Text style={styles.reason}>{reason}</Text>
      </View>

      {/* Biometric animation */}
      <View style={styles.biometricArea}>
        {/* Outer ring pulse */}
        <Animated.View style={[styles.ring, styles.ringOuter, { transform: [{ scale: pulseAnim }] }]} />
        <Animated.View style={[styles.ring, styles.ringMiddle, { transform: [{ scale: pulseAnim }] }]} />

        {/* Icon button */}
        <Animated.View
          style={[
            { transform: [{ scale: iconAnim }, { translateY: bounceAnim }] },
          ]}
        >
          <TouchableOpacity
            onPress={authenticate}
            activeOpacity={0.85}
            disabled={status === 'scanning' || status === 'success'}
          >
            <LinearGradient
              colors={colors}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.icon}>{status === 'success' ? '✓' : status === 'failed' ? '✗' : icon}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Status text */}
      <View style={styles.statusArea}>
        <Text style={styles.statusTitle}>{title} Authentication</Text>
        <Text style={styles.statusText}>
          {status === 'idle'     ? 'Tap to authenticate' :
           status === 'scanning' ? `Scanning with ${title}...` :
           status === 'success'  ? 'Authentication successful!' :
           'Try again'}
        </Text>
      </View>

      {/* Fallback */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.fallbackBtn}>
          <Text style={styles.fallbackText}>Use Password Instead</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingTop:     80,
    paddingBottom:  60,
    paddingHorizontal: SPACING[8],
  },
  header:   { alignItems: 'center' },
  appName: {
    fontSize:   FONT_SIZES['2xl'],
    fontWeight: '800',
    color:      COLORS.white,
    marginBottom: SPACING[2],
  },
  reason: {
    fontSize:  FONT_SIZES.base,
    color:     'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  biometricArea: {
    width:          220,
    height:         220,
    alignItems:     'center',
    justifyContent: 'center',
  },
  ring: {
    position:      'absolute',
    borderRadius:  999,
    borderWidth:   1,
    borderColor:   'rgba(255,255,255,0.12)',
  },
  ringOuter:  { width: 220, height: 220 },
  ringMiddle: { width: 170, height: 170 },
  iconContainer: {
    width:          110,
    height:         110,
    borderRadius:   55,
    alignItems:     'center',
    justifyContent: 'center',
    ...SHADOWS.emerald,
  },
  icon:       { fontSize: 50 },
  statusArea: { alignItems: 'center', gap: SPACING[2] },
  statusTitle: {
    fontSize:   FONT_SIZES.xl,
    fontWeight: '700',
    color:      COLORS.white,
    textAlign:  'center',
  },
  statusText: {
    fontSize:   FONT_SIZES.base,
    color:      'rgba(255,255,255,0.6)',
    textAlign:  'center',
  },
  footer:     { width: '100%', gap: SPACING[3] },
  fallbackBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius:    RADIUS.xl,
    paddingVertical: SPACING[4],
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.15)',
  },
  fallbackText: { color: COLORS.white, fontSize: FONT_SIZES.base, fontWeight: '600' },
  cancelBtn:    { alignItems: 'center', paddingVertical: SPACING[2] },
  cancelText: { color: 'rgba(255,255,255,0.5)', fontSize: FONT_SIZES.base },
});

export default BiometricScreen;
