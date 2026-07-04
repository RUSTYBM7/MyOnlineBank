// ============================================================
// OrbitPay - Login Screen
// ============================================================
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, KeyboardAvoidingView, Platform, StatusBar,
  Dimensions, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GradientButton, InputField, OutlineButton } from '../../components/common/UIComponents';
import { AuthService, BiometricService } from '../../services/authService';
import { useAppStore } from '../../store';
import { isValidEmail } from '../../utils/formatters';
import type { RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'memberId' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState<{ identifier?: string; password?: string }>({});

  const { setUser, setTokens, setAuthenticated, biometricType, biometricEnabled } = useAppStore();

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!identifier.trim()) {
      newErrors.identifier = `${loginMethod === 'email' ? 'Email' : loginMethod === 'memberId' ? 'Member ID' : 'Phone'} is required`;
    } else if (loginMethod === 'email' && !isValidEmail(identifier)) {
      newErrors.identifier = 'Invalid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) { shake(); return; }

    setLoading(true);
    try {
      const credentials = {
        password,
        ...(loginMethod === 'email'    ? { email: identifier }    : {}),
        ...(loginMethod === 'memberId' ? { memberId: identifier }  : {}),
        ...(loginMethod === 'phone'    ? { phone: identifier }     : {}),
      };

      const { user, tokens } = await AuthService.login(credentials);
      setUser(user);
      setTokens(tokens);
      setAuthenticated(true);
    } catch (err: unknown) {
      shake();
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    navigation.navigate('Biometric', { reason: 'Login to OrbitPay' });
  };

  const methodLabels = { email: 'Email', memberId: 'Member ID', phone: 'Phone' };
  const methodPlaceholders = {
    email:    'Enter your email address',
    memberId: 'Enter your Member ID',
    phone:    '+1 (555) 000-0000',
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[COLORS.primary[800], COLORS.teal[700]]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.logoText}>🌐</Text>
          <Text style={styles.brandName}>OrbitPay</Text>
          <Text style={styles.brandTagline}>Credit Union Banking</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formCard, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.signinText}>Sign in to your account</Text>

            {/* Login method picker */}
            <View style={styles.methodPicker}>
              {(['email', 'memberId', 'phone'] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setLoginMethod(method)}
                  style={[
                    styles.methodBtn,
                    loginMethod === method && styles.methodBtnActive,
                  ]}
                >
                  <Text style={[
                    styles.methodBtnText,
                    loginMethod === method && styles.methodBtnTextActive,
                  ]}>
                    {methodLabels[method]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Identifier input */}
            <InputField
              label={methodLabels[loginMethod]}
              value={identifier}
              onChangeText={setIdentifier}
              placeholder={methodPlaceholders[loginMethod]}
              keyboardType={
                loginMethod === 'email' ? 'email-address' :
                loginMethod === 'phone' ? 'phone-pad' : 'default'
              }
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.identifier}
            />

            {/* Password input */}
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              error={errors.password}
              rightElement={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              }
            />

            {/* Forgot password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign in button */}
            <GradientButton
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: SPACING[2] }}
            />

            {/* Biometric login */}
            {biometricEnabled && biometricType !== 'None' && (
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={styles.biometricBtn}
              >
                <Text style={styles.biometricIcon}>
                  {biometricType === 'FaceID' ? '🔒' : '👆'}
                </Text>
                <Text style={styles.biometricText}>
                  Sign in with {biometricType === 'FaceID' ? 'Face ID' : 'Touch ID'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register CTA */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
                <Text style={styles.registerLink}>Open Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Security notice */}
          <View style={styles.securityNotice}>
            <Text style={styles.securityText}>
              🔒 256-bit AES Encryption · FDIC Insured
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.primary[800] },
  header: {
    paddingTop:    80,
    paddingBottom: 50,
    alignItems:    'center',
  },
  headerContent: { alignItems: 'center' },
  logoText:      { fontSize: 48, marginBottom: SPACING[2] },
  brandName: {
    fontSize:      FONT_SIZES['3xl'],
    fontWeight:    '800',
    color:         COLORS.white,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize:   FONT_SIZES.sm,
    color:      'rgba(255,255,255,0.7)',
    marginTop:  SPACING[1],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  formContainer: { flex: 1, backgroundColor: COLORS.gray[50] },
  scrollContent: { padding: SPACING[5] },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS['2xl'],
    padding:         SPACING[6],
    ...SHADOWS.lg,
  },
  welcomeText: {
    fontSize:   FONT_SIZES['2xl'],
    fontWeight: '700',
    color:      COLORS.gray[900],
  },
  signinText: {
    fontSize:   FONT_SIZES.base,
    color:      COLORS.gray[500],
    marginTop:  4,
    marginBottom: SPACING[6],
  },
  methodPicker: {
    flexDirection:   'row',
    backgroundColor: COLORS.gray[100],
    borderRadius:    RADIUS.full,
    padding:         3,
    marginBottom:    SPACING[5],
  },
  methodBtn: {
    flex:            1,
    paddingVertical: SPACING[2],
    alignItems:      'center',
    borderRadius:    RADIUS.full,
  },
  methodBtnActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  methodBtnText: {
    fontSize:   FONT_SIZES.sm,
    color:      COLORS.gray[500],
    fontWeight: '500',
  },
  methodBtnTextActive: {
    color:      COLORS.primary[600],
    fontWeight: '600',
  },
  toggleText: {
    fontSize:   FONT_SIZES.sm,
    color:      COLORS.primary[600],
    fontWeight: '500',
  },
  forgotBtn:    { alignSelf: 'flex-end', marginTop: -SPACING[3], marginBottom: SPACING[4] },
  forgotText:   { fontSize: FONT_SIZES.sm, color: COLORS.primary[600], fontWeight: '500' },
  biometricBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      SPACING[4],
    paddingVertical: SPACING[3],
    borderRadius:   RADIUS.xl,
    borderWidth:    1,
    borderColor:    COLORS.gray[200],
    gap:            SPACING[2],
  },
  biometricIcon: { fontSize: 20 },
  biometricText: { fontSize: FONT_SIZES.base, color: COLORS.gray[700], fontWeight: '500' },
  dividerRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginVertical: SPACING[5],
    gap:            SPACING[3],
  },
  dividerLine:  { flex: 1, height: 1, backgroundColor: COLORS.gray[200] },
  dividerText:  { fontSize: FONT_SIZES.sm, color: COLORS.gray[400] },
  registerRow:  { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: FONT_SIZES.base, color: COLORS.gray[600] },
  registerLink: { fontSize: FONT_SIZES.base, color: COLORS.primary[600], fontWeight: '700' },
  securityNotice: {
    alignItems:    'center',
    marginTop:     SPACING[6],
    marginBottom:  SPACING[4],
  },
  securityText: {
    fontSize:  FONT_SIZES.xs,
    color:     COLORS.gray[400],
    textAlign: 'center',
  },
});

export default LoginScreen;
