// ============================================================
// OrbitPay - Change Password Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES } from '../../utils/constants';
import { GlassCard, InputField, GradientButton } from '../../components/common/UIComponents';
import { UserService } from '../../services/apiServices';
import { useAppStore } from '../../store';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>;
};

interface PasswordStrength {
  score:  number;   // 0-4
  label:  string;
  color:  string;
}

const getPasswordStrength = (pw: string): PasswordStrength => {
  let score = 0;
  if (pw.length >= 8)             score++;
  if (/[A-Z]/.test(pw))           score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  const levels = [
    { label: '',        color: COLORS.gray[200] },
    { label: 'Weak',    color: COLORS.error },
    { label: 'Fair',    color: COLORS.warning },
    { label: 'Good',    color: COLORS.primary[400] },
    { label: 'Strong',  color: COLORS.success },
  ];
  return { score, ...levels[score] };
};

const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { darkMode } = useAppStore();
  const [current, setCurrent]   = useState('');
  const [next,    setNext]       = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors,  setErrors]    = useState<Record<string, string>>({});

  const strength = getPasswordStrength(next);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!current)           e.current = 'Current password is required';
    if (next.length < 8)    e.next    = 'Password must be at least 8 characters';
    if (strength.score < 2) e.next    = 'Password is too weak';
    if (next !== confirm)   e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await UserService.updatePassword(current, next);
      Alert.alert('Password Updated', 'Your password has been changed successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Incorrect current password or request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { label: 'At least 8 characters',  met: next.length >= 8 },
    { label: 'One uppercase letter',   met: /[A-Z]/.test(next) },
    { label: 'One number',             met: /[0-9]/.test(next) },
    { label: 'One special character',  met: /[^A-Za-z0-9]/.test(next) },
  ];

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primary[700], COLORS.teal[600]]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GlassCard darkMode={darkMode} style={styles.formCard}>
          <InputField
            label="Current Password"
            value={current}
            onChangeText={setCurrent}
            secureTextEntry
            placeholder="Enter your current password"
            error={errors.current}
            darkMode={darkMode}
          />
          <View style={{ height: SPACING[4] }} />
          <InputField
            label="New Password"
            value={next}
            onChangeText={setNext}
            secureTextEntry
            placeholder="Enter new password"
            error={errors.next}
            darkMode={darkMode}
          />

          {/* Password strength bar */}
          {next.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                {[0, 1, 2, 3].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.strengthSegment,
                      { backgroundColor: i < strength.score ? strength.color : COLORS.gray[200] },
                    ]}
                  />
                ))}
              </View>
              {strength.label ? (
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              ) : null}
            </View>
          )}

          <View style={{ height: SPACING[4] }} />
          <InputField
            label="Confirm New Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholder="Confirm new password"
            error={errors.confirm}
            darkMode={darkMode}
          />
        </GlassCard>

        {/* Requirements */}
        {next.length > 0 && (
          <GlassCard darkMode={darkMode} style={styles.requirementsCard}>
            <Text style={[styles.requirementsTitle, darkMode && { color: COLORS.white }]}>Password Requirements</Text>
            {requirements.map((req) => (
              <View key={req.label} style={styles.requirementRow}>
                <Text style={{ color: req.met ? COLORS.success : COLORS.gray[400], fontSize: 14 }}>
                  {req.met ? '✓' : '○'}
                </Text>
                <Text style={[styles.requirementText, req.met && styles.requirementMet, darkMode && !req.met && { color: COLORS.gray[400] }]}>
                  {req.label}
                </Text>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Security tip */}
        <GlassCard darkMode={darkMode} style={styles.tipCard}>
          <Text style={styles.tipIcon}>🔒</Text>
          <Text style={[styles.tipText, darkMode && { color: COLORS.gray[300] }]}>
            Use a unique password that you don't use on other websites. Consider using a password manager.
          </Text>
        </GlassCard>

        <GradientButton
          label={loading ? 'Updating...' : 'Update Password'}
          onPress={handleSubmit}
          loading={loading}
          disabled={!current || !next || !confirm}
          style={styles.submitBtn}
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.gray[50] },
  containerDark: { backgroundColor: COLORS.gray[900] },
  header: {
    paddingTop:    60,
    paddingBottom: SPACING[4],
    paddingHorizontal: SPACING[5],
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
  },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:    { fontSize: 22, color: COLORS.white, fontWeight: '600' },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
  scrollContent: { padding: SPACING[5] },
  formCard:    { marginBottom: SPACING[4] },
  strengthContainer: { marginTop: SPACING[2] },
  strengthBar: { flexDirection: 'row', gap: 4, marginBottom: SPACING[1] },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: FONT_SIZES.xs, fontWeight: '600', textAlign: 'right' },
  requirementsCard: { marginBottom: SPACING[4] },
  requirementsTitle: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.gray[700], marginBottom: SPACING[3] },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING[2], marginBottom: SPACING[2] },
  requirementText: { fontSize: FONT_SIZES.sm, color: COLORS.gray[500] },
  requirementMet:  { color: COLORS.gray[700] },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING[3], marginBottom: SPACING[5] },
  tipIcon: { fontSize: 20, marginTop: 2 },
  tipText: { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.gray[600], lineHeight: 20 },
  submitBtn: {},
});

export default ChangePasswordScreen;
