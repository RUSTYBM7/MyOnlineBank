// ============================================================
// OrbitPay - Accounts Screen
// ============================================================
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, SectionHeader, StatusBadge, GradientButton } from '../../components/common/UIComponents';
import { AccountCard } from '../../components/cards/AccountCard';
import { AccountService } from '../../services/apiServices';
import { useAppStore, useTotalBalance } from '../../store';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const AccountsScreen: React.FC<Props> = ({ navigation }) => {
  const { accounts, setAccounts, darkMode } = useAppStore();
  const totalBalance = useTotalBalance();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await AccountService.getAccounts();
      setAccounts(data);
    } catch { /* use local */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const ACCOUNT_TYPE_ICONS: Record<string, string> = {
    checking: '💳',
    savings:  '🏦',
    joint:    '👥',
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600]]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Accounts</Text>
        <View style={styles.totalBalanceBox}>
          <Text style={styles.totalBalanceLabel}>Total Portfolio</Text>
          <Text style={styles.totalBalanceValue}>{formatCurrency(totalBalance, 'USD')}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Account cards */}
        <SectionHeader title="My Accounts" actionLabel="+ Open Account" onAction={() => {}} darkMode={darkMode} />
        {accounts.map((account) => (
          <View key={account.id} style={styles.accountItem}>
            <AccountCard
              account={account}
              showFull
              onPress={() => navigation.navigate('AccountDetail', { accountId: account.id })}
            />
          </View>
        ))}

        {/* Account summary */}
        <View style={styles.summarySection}>
          <SectionHeader title="Summary" darkMode={darkMode} />
          <GlassCard darkMode={darkMode}>
            {[
              { label: 'Total Checking', value: formatCurrency(accounts.filter(a => a.type === 'checking').reduce((s, a) => s + a.balance, 0), 'USD') },
              { label: 'Total Savings',  value: formatCurrency(accounts.filter(a => a.type === 'savings').reduce((s, a) => s + a.balance, 0), 'USD') },
              { label: 'Total Accounts', value: String(accounts.length) },
              { label: 'Primary Account', value: accounts.find(a => a.isPrimary)?.name ?? 'N/A' },
            ].map((item, i, arr) => (
              <View key={item.label} style={[styles.summaryRow, i < arr.length - 1 && styles.summaryRowBorder]}>
                <Text style={[styles.summaryKey, darkMode && { color: COLORS.gray[400] }]}>{item.label}</Text>
                <Text style={[styles.summaryValue, darkMode && { color: COLORS.white }]}>{item.value}</Text>
              </View>
            ))}
          </GlassCard>
        </View>

        {/* Quick links */}
        <View style={styles.quickLinks}>
          {[
            { icon: '📋', label: 'Statements',   onPress: () => {} },
            { icon: '📅', label: 'Scheduled',    onPress: () => navigation.navigate('Main') },
            { icon: '🔔', label: 'Alerts',       onPress: () => navigation.navigate('Notifications') },
            { icon: '📤', label: 'Export',        onPress: () => {} },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.quickLink, darkMode && styles.quickLinkDark]}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.quickLinkIcon}>{item.icon}</Text>
              <Text style={[styles.quickLinkLabel, darkMode && { color: COLORS.white }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
    paddingBottom: SPACING[6],
    paddingHorizontal: SPACING[5],
  },
  headerTitle: {
    fontSize:   FONT_SIZES['2xl'],
    fontWeight: '700',
    color:      COLORS.white,
    marginBottom: SPACING[4],
  },
  totalBalanceBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius:    RADIUS.xl,
    padding:         SPACING[4],
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.25)',
  },
  totalBalanceLabel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  totalBalanceValue: { fontSize: FONT_SIZES['3xl'], fontWeight: '800', color: COLORS.white, marginTop: 4 },
  scrollContent:  { padding: SPACING[5] },
  accountItem:    { marginBottom: SPACING[4] },
  summarySection: { marginTop: SPACING[4], marginBottom: SPACING[5] },
  summaryRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: SPACING[3],
  },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  summaryKey:   { fontSize: FONT_SIZES.base, color: COLORS.gray[500] },
  summaryValue: { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.gray[800] },
  quickLinks: {
    flexDirection:   'row',
    flexWrap:        'wrap',
    gap:             SPACING[3],
    marginBottom:    SPACING[5],
  },
  quickLink: {
    flex:            1,
    minWidth:        '45%',
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.xl,
    padding:         SPACING[4],
    alignItems:      'center',
    gap:             SPACING[2],
    ...SHADOWS.sm,
  },
  quickLinkDark: { backgroundColor: COLORS.gray[800] },
  quickLinkIcon: { fontSize: 28 },
  quickLinkLabel: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.gray[700] },
});

export default AccountsScreen;
