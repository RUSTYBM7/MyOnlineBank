// ============================================================
// OrbitPay - Profile / Settings Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Switch, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, StatusBadge, GradientButton } from '../../components/common/UIComponents';
import { useAppStore } from '../../store';
import { AuthService } from '../../services/authService';
import { SecureStore, AppStorage } from '../../utils/secureStorage';
import { STORAGE_KEYS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (v: boolean) => void;
  color?: string;
  darkMode?: boolean;
}
const SettingRow: React.FC<SettingRowProps> = ({
  icon, label, value, onPress, toggle, toggleValue, onToggleChange, color = COLORS.primary[500], darkMode,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress && !toggle}
    activeOpacity={0.8}
    style={styles.settingRow}
  >
    <View style={[styles.settingIconBg, { backgroundColor: `${color}20` }]}>
      <Text style={styles.settingIcon}>{icon}</Text>
    </View>
    <View style={styles.settingInfo}>
      <Text style={[styles.settingLabel, darkMode && { color: COLORS.white }]}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
    </View>
    {toggle ? (
      <Switch
        value={toggleValue}
        onValueChange={onToggleChange}
        trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
        thumbColor={COLORS.white}
      />
    ) : (
      onPress && <Text style={styles.settingChevron}>›</Text>
    )}
  </TouchableOpacity>
);

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, darkMode, toggleDarkMode, logout, biometricEnabled, biometricType, setBiometricEnabled } = useAppStore();
  const [pushEnabled, setPushEnabled] = useState(user?.pushNotificationsEnabled ?? true);
  const [loggingOut, setLoggingOut]   = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await AuthService.logout();
          } finally {
            await SecureStore.clearAll();
            await AppStorage.clearAll();
            logout();
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleBiometricToggle = async (val: boolean) => {
    if (val) {
      const ok = await AuthService.loginWithBiometric().catch(() => null);
      if (ok) setBiometricEnabled(true);
    } else {
      await SecureStore.clearBiometricCredentials();
      setBiometricEnabled(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Personal Information', onPress: () => {} },
        { icon: '🔒', label: 'Change Password',       onPress: () => navigation.navigate('ChangePassword') },
        { icon: '🔑', label: 'Two-Factor Authentication', value: user?.twoFactorEnabled ? 'Enabled' : 'Disabled', onPress: () => {} },
        { icon: '🏦', label: 'Linked Accounts', onPress: () => navigation.navigate('LinkedAccounts') },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon:          biometricType === 'FaceID' ? '🔒' : '👆',
          label:         `${biometricType === 'FaceID' ? 'Face ID' : biometricType === 'TouchID' ? 'Touch ID' : 'Biometric'} Login`,
          toggle:        true,
          toggleValue:   biometricEnabled,
          onToggleChange: handleBiometricToggle,
        },
        { icon: '🛡️', label: 'Security Activity', onPress: () => {} },
        { icon: '📱', label: 'Trusted Devices', onPress: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon:          '🌙',
          label:         'Dark Mode',
          toggle:        true,
          toggleValue:   darkMode,
          onToggleChange: toggleDarkMode,
        },
        {
          icon:          '🔔',
          label:         'Push Notifications',
          toggle:        true,
          toggleValue:   pushEnabled,
          onToggleChange: setPushEnabled,
        },
        { icon: '🌍', label: 'Language & Region', value: 'English (US)', onPress: () => {} },
        { icon: '💵', label: 'Default Currency', value: 'USD', onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: '💬', label: 'Live Support',    onPress: () => navigation.navigate('Support') },
        { icon: '❓', label: 'Help Center',     onPress: () => {} },
        { icon: '📄', label: 'Terms & Privacy', onPress: () => {} },
        { icon: 'ℹ️', label: 'App Version',     value: '1.0.0 (Build 1)' },
      ],
    },
  ];

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary[700], COLORS.teal[600]]}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user?.fullName ?? 'User')}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Text style={styles.editAvatarIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.fullName ?? 'Member'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          <View style={styles.memberBadge}>
            <StatusBadge status={user?.kycStatus ?? 'pending'} />
            <View style={[styles.tierBadge, {
              backgroundColor:
                user?.tier === 'premium' ? COLORS.cardGradients.gold[0] :
                user?.tier === 'standard' ? COLORS.primary[500] : COLORS.gray[500],
            }]}>
              <Text style={styles.tierText}>
                {(user?.tier ?? 'basic').toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            {[
              { label: 'Member Since', value: formatDate(user?.createdAt ?? new Date().toISOString(), 'short') },
              { label: 'Account',      value: user?.accountStatus ?? 'active' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Settings sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <View key={section.title} style={styles.sectionGroup}>
              <Text style={[styles.sectionTitle, darkMode && { color: COLORS.gray[400] }]}>
                {section.title}
              </Text>
              <GlassCard darkMode={darkMode} style={styles.sectionCard}>
                {section.items.map((item, i) => (
                  <React.Fragment key={item.label}>
                    <SettingRow
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                      onPress={item.onPress}
                      toggle={item.toggle}
                      toggleValue={item.toggleValue}
                      onToggleChange={item.onToggleChange}
                      darkMode={darkMode}
                    />
                    {i < section.items.length - 1 && (
                      <View style={styles.rowDivider} />
                    )}
                  </React.Fragment>
                ))}
              </GlassCard>
            </View>
          ))}

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.logoutBtn, darkMode && styles.logoutBtnDark]}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>
              {loggingOut ? 'Logging out...' : '🚪 Log Out'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>
    </View>
  );
};

// Add missing type reference
const CARD_GRADIENTS = {
  gold: ['#D97706', '#B45309'],
};

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.gray[50] },
  containerDark: { backgroundColor: COLORS.gray[900] },
  header: {
    paddingTop:    70,
    paddingBottom: SPACING[6],
    alignItems:    'center',
    paddingHorizontal: SPACING[5],
  },
  avatarContainer: {
    position:     'relative',
    marginBottom: SPACING[3],
  },
  avatar: {
    width:          88,
    height:         88,
    borderRadius:   44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems:     'center',
    justifyContent: 'center',
    borderWidth:    3,
    borderColor:    'rgba(255,255,255,0.5)',
  },
  avatarText:    { fontSize: FONT_SIZES['2xl'], fontWeight: '700', color: COLORS.white },
  editAvatarBtn: {
    position:        'absolute',
    bottom:          0,
    right:           0,
    width:           28,
    height:          28,
    borderRadius:    14,
    backgroundColor: COLORS.white,
    alignItems:      'center',
    justifyContent:  'center',
    ...SHADOWS.sm,
  },
  editAvatarIcon: { fontSize: 14 },
  userName: {
    fontSize:   FONT_SIZES['2xl'],
    fontWeight: '700',
    color:      COLORS.white,
  },
  userEmail: {
    fontSize:   FONT_SIZES.sm,
    color:      'rgba(255,255,255,0.7)',
    marginTop:  4,
    marginBottom: SPACING[3],
  },
  memberBadge: {
    flexDirection: 'row',
    gap:           SPACING[2],
    marginBottom:  SPACING[4],
    alignItems:    'center',
  },
  tierBadge: {
    paddingVertical:   4,
    paddingHorizontal: 10,
    borderRadius:      RADIUS.full,
  },
  tierText: { fontSize: 10, color: COLORS.white, fontWeight: '700', letterSpacing: 1 },
  statsRow: {
    flexDirection:  'row',
    gap:            SPACING[6],
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius:   RADIUS.xl,
    padding:        SPACING[4],
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.white, textTransform: 'capitalize' },
  statLabel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  sectionsContainer: { padding: SPACING[5] },
  sectionGroup:      { marginBottom: SPACING[5] },
  sectionTitle: {
    fontSize:     FONT_SIZES.xs,
    fontWeight:   '700',
    color:        COLORS.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom:  SPACING[2],
  },
  sectionCard: { padding: 0, overflow: 'hidden' },
  settingRow: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    gap:             SPACING[3],
  },
  settingIconBg: {
    width:          40,
    height:         40,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  settingIcon:    { fontSize: 18 },
  settingInfo:    { flex: 1 },
  settingLabel: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '500',
    color:      COLORS.gray[800],
  },
  settingValue:   { fontSize: FONT_SIZES.xs, color: COLORS.gray[400], marginTop: 2 },
  settingChevron: { fontSize: FONT_SIZES.xl, color: COLORS.gray[300], fontWeight: '300' },
  rowDivider: {
    height:          1,
    backgroundColor: COLORS.gray[100],
    marginLeft:      SPACING[4] + 40 + SPACING[3],
  },
  logoutBtn: {
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.xl,
    paddingVertical: SPACING[4],
    alignItems:      'center',
    ...SHADOWS.sm,
    borderWidth:     1,
    borderColor:     '#FEE2E2',
    marginTop:       SPACING[3],
  },
  logoutBtnDark: { backgroundColor: COLORS.gray[800], borderColor: '#7F1D1D' },
  logoutText:    { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.error },
});

export default ProfileScreen;
