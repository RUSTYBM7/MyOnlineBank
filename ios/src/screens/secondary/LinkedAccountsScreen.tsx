// ============================================================
// OrbitPay - Linked Accounts Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, StatusBar, Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, GradientButton, StatusBadge } from '../../components/common/UIComponents';
import { useAppStore } from '../../store';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LinkedAccounts'>;
};

interface LinkedAccount {
  id:           string;
  bankName:     string;
  accountType:  string;
  lastFour:     string;
  status:       'verified' | 'pending' | 'failed';
  isPrimary:    boolean;
  addedAt:      string;
}

const BANK_ICONS: Record<string, string> = {
  'Chase':          '🏦',
  'Bank of America': '🏦',
  'Wells Fargo':    '🏦',
  'Citibank':       '🏦',
  'TD Bank':        '🏦',
  default:          '🏦',
};

const MOCK_LINKED: LinkedAccount[] = [
  { id: 'ext1', bankName: 'Chase Bank', accountType: 'Checking', lastFour: '4521', status: 'verified', isPrimary: true,  addedAt: '2024-01-15' },
  { id: 'ext2', bankName: 'Wells Fargo',bankType: 'savings',     accountType: 'Savings',  lastFour: '8832', status: 'verified', isPrimary: false, addedAt: '2024-03-08' },
];

const LinkedAccountsScreen: React.FC<Props> = ({ navigation }) => {
  const { darkMode } = useAppStore();
  const [accounts, setAccounts] = useState<LinkedAccount[]>(MOCK_LINKED);
  const [adding, setAdding]     = useState(false);

  const handleRemove = (account: LinkedAccount) => {
    Alert.alert(
      'Remove Account',
      `Remove ${account.bankName} ••••${account.lastFour}? You will not be able to transfer to/from this account until re-linked.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setAccounts(prev => prev.filter(a => a.id !== account.id)),
        },
      ],
    );
  };

  const handleSetPrimary = (id: string) => {
    setAccounts(prev => prev.map(a => ({ ...a, isPrimary: a.id === id })));
  };

  const handleAddAccount = () => {
    Alert.alert(
      'Link External Account',
      'You will be redirected to Plaid to securely connect your bank account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // Demo: show success
            Alert.alert('Coming Soon', 'Plaid integration will be available in the next release.');
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primary[700], COLORS.teal[600]]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Linked Accounts</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Connected accounts */}
        <Text style={[styles.sectionTitle, darkMode && { color: COLORS.white }]}>
          Connected Accounts ({accounts.length})
        </Text>

        {accounts.map(account => (
          <GlassCard key={account.id} darkMode={darkMode} style={styles.accountCard}>
            <View style={styles.accountRow}>
              <View style={styles.bankIconBg}>
                <Text style={{ fontSize: 24 }}>{BANK_ICONS[account.bankName] ?? '🏦'}</Text>
              </View>
              <View style={styles.accountInfo}>
                <View style={styles.accountNameRow}>
                  <Text style={[styles.bankName, darkMode && { color: COLORS.white }]}>{account.bankName}</Text>
                  {account.isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>Primary</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.accountType}>{account.accountType} ••••{account.lastFour}</Text>
                <View style={styles.metaRow}>
                  <StatusBadge status={account.status} />
                  <Text style={styles.addedDate}>Added {account.addedAt}</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={[styles.accountActions, darkMode && { borderTopColor: COLORS.gray[700] }]}>
              {!account.isPrimary && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleSetPrimary(account.id)}
                >
                  <Text style={styles.actionBtnText}>Set as Primary</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnDanger]}
                onPress={() => handleRemove(account)}
              >
                <Text style={[styles.actionBtnText, { color: COLORS.error }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}

        {accounts.length === 0 && (
          <GlassCard darkMode={darkMode} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🏦</Text>
            <Text style={[styles.emptyTitle, darkMode && { color: COLORS.white }]}>No Linked Accounts</Text>
            <Text style={styles.emptyDesc}>Link an external bank account to enable transfers.</Text>
          </GlassCard>
        )}

        {/* Add account */}
        <GradientButton
          label="+ Link New Account"
          onPress={handleAddAccount}
          loading={adding}
          style={styles.addBtn}
        />

        {/* Security note */}
        <GlassCard darkMode={darkMode} style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔒</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.securityTitle, darkMode && { color: COLORS.white }]}>Secured by Plaid</Text>
            <Text style={styles.securityDesc}>
              Your credentials are never shared with OrbitPay. Bank connections are encrypted with 256-bit SSL.
            </Text>
          </View>
        </GlassCard>

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
  sectionTitle: {
    fontSize:     FONT_SIZES.base,
    fontWeight:   '700',
    color:        COLORS.gray[800],
    marginBottom: SPACING[3],
  },
  accountCard:    { marginBottom: SPACING[3] },
  accountRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING[3] },
  bankIconBg: {
    width:          56,
    height:         56,
    borderRadius:   RADIUS.lg,
    backgroundColor: COLORS.primary[50],
    alignItems:     'center',
    justifyContent: 'center',
    borderWidth:    1,
    borderColor:    COLORS.primary[100],
  },
  accountInfo:    { flex: 1 },
  accountNameRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING[2], marginBottom: 2 },
  bankName:  { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.gray[800] },
  primaryBadge: {
    backgroundColor: COLORS.primary[500],
    borderRadius:    RADIUS.full,
    paddingVertical: 2,
    paddingHorizontal: SPACING[2],
  },
  primaryBadgeText: { fontSize: 9, color: COLORS.white, fontWeight: '700', textTransform: 'uppercase' },
  accountType: { fontSize: FONT_SIZES.sm, color: COLORS.gray[500], marginBottom: SPACING[2] },
  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: SPACING[2] },
  addedDate: { fontSize: FONT_SIZES.xs, color: COLORS.gray[400] },
  accountActions: {
    flexDirection:   'row',
    justifyContent:  'flex-end',
    gap:             SPACING[3],
    marginTop:       SPACING[3],
    paddingTop:      SPACING[3],
    borderTopWidth:  1,
    borderTopColor:  COLORS.gray[100],
  },
  actionBtn: { paddingVertical: SPACING[2], paddingHorizontal: SPACING[3] },
  actionBtnDanger: {},
  actionBtnText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.primary[500] },
  emptyCard:  { alignItems: 'center', paddingVertical: SPACING[8], marginBottom: SPACING[4] },
  emptyIcon:  { fontSize: 48, marginBottom: SPACING[3] },
  emptyTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.gray[700], marginBottom: SPACING[2] },
  emptyDesc:  { fontSize: FONT_SIZES.sm, color: COLORS.gray[500], textAlign: 'center' },
  addBtn: { marginBottom: SPACING[4] },
  securityNote: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING[3] },
  securityIcon:  { fontSize: 22, marginTop: 2 },
  securityTitle: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.gray[700], marginBottom: 2 },
  securityDesc:  { fontSize: FONT_SIZES.xs, color: COLORS.gray[500], lineHeight: 18 },
});

export default LinkedAccountsScreen;
