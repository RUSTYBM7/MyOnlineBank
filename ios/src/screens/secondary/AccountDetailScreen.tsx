// ============================================================
// OrbitPay - Account Detail Screen
// ============================================================
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING, FONT_SIZES } from '../../utils/constants';
import { GlassCard, SectionHeader, StatusBadge, PillTabs, EmptyState } from '../../components/common/UIComponents';
import { TransactionService } from '../../services/apiServices';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate, maskAccountNumber, timeAgo } from '../../utils/formatters';
import type { RootStackParamList, Transaction } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AccountDetail'>;
  route:      RouteProp<RootStackParamList, 'AccountDetail'>;
};

const CATEGORY_ICONS: Record<string, string> = {
  food_dining: '🍽️', transport: '🚗', shopping: '🛍️', entertainment: '🎬',
  healthcare: '💊',   utilities: '⚡', travel: '✈️',    transfer: '↗️',
  salary: '💼',       investment: '📈', withdrawal: '💸', deposit: '💰',
  refund: '↩️',       other: '💳',
};

const GRADIENT_COLORS: Record<string, [string, string]> = {
  mint:   ['#10B981', '#14B8A6'],
  teal:   ['#14B8A6', '#0891B2'],
  purple: ['#8B5CF6', '#7C3AED'],
  gold:   ['#D97706', '#B45309'],
  dark:   ['#1E293B', '#334155'],
  navy:   ['#1D4ED8', '#1E40AF'],
};

const AccountDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { accounts, transactions, setTransactions, darkMode } = useAppStore();
  const { accountId } = route.params;
  const account = accounts.find(a => a.id === accountId);

  const [refreshing, setRefreshing]       = useState(false);
  const [activeTab, setActiveTab]         = useState(0);
  const [showBalance, setShowBalance]     = useState(true);
  const [localTxs, setLocalTxs]           = useState<Transaction[]>([]);

  const tabs = ['Transactions', 'Details', 'Activity'];

  const accountTxs = (localTxs.length > 0 ? localTxs : transactions)
    .filter(t => t.accountId === accountId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const load = useCallback(async () => {
    try {
      const data = await TransactionService.getTransactions({ accountId, limit: 50 });
      setLocalTxs(data);
    } catch {}
  }, [accountId]);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!account) {
    return (
      <View style={[styles.container, darkMode && styles.containerDark, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: COLORS.gray[500] }}>Account not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: SPACING[4] }}>
          <Text style={{ color: COLORS.primary[500] }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const gradient = GRADIENT_COLORS[account.color ?? 'mint'];

  const renderTransactions = () => {
    if (accountTxs.length === 0) {
      return (
        <EmptyState
          title="No Transactions"
          message="Your transaction history for this account will appear here."
          icon={<Text style={{ fontSize: 48 }}>📋</Text>}
        />
      );
    }
    return accountTxs.map(tx => {
      const isCredit = tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'credit';
      return (
        <TouchableOpacity
          key={tx.id}
          style={[styles.txRow, darkMode && styles.txRowDark]}
          onPress={() => navigation.navigate('TransactionDetail', { transactionId: tx.id })}
          activeOpacity={0.8}
        >
          <View style={[styles.txIcon, { backgroundColor: `${isCredit ? COLORS.success : COLORS.primary[500]}15` }]}>
            <Text style={styles.txIconEmoji}>{CATEGORY_ICONS[tx.category] ?? '💳'}</Text>
          </View>
          <View style={styles.txInfo}>
            <Text style={[styles.txName, darkMode && { color: COLORS.white }]} numberOfLines={1}>
              {tx.merchantName ?? tx.description}
            </Text>
            <Text style={styles.txDate}>{timeAgo(tx.createdAt)}</Text>
          </View>
          <View style={styles.txRight}>
            <Text style={[styles.txAmount, { color: isCredit ? COLORS.success : darkMode ? COLORS.white : COLORS.gray[800] }]}>
              {isCredit ? '+' : '-'}{formatCurrency(Math.abs(tx.amount), tx.currency)}
            </Text>
            <StatusBadge status={tx.status} />
          </View>
        </TouchableOpacity>
      );
    });
  };

  const renderDetails = () => (
    <GlassCard darkMode={darkMode}>
      {[
        { label: 'Account Number', value: maskAccountNumber(account.accountNumber) },
        { label: 'Routing Number',  value: account.routingNumber ?? '—' },
        { label: 'Account Type',    value: account.type },
        { label: 'Currency',        value: account.currency },
        { label: 'Interest Rate',   value: account.interestRate ? `${account.interestRate}% APY` : '—' },
        { label: 'Opened',          value: formatDate(account.createdAt, 'long') },
        { label: 'Status',          value: account.status },
      ].map((row, i, arr) => (
        <View key={row.label}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, darkMode && { color: COLORS.gray[400] }]}>{row.label}</Text>
            <Text style={[styles.detailValue, darkMode && { color: COLORS.white }]}>{row.value}</Text>
          </View>
          {i < arr.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </GlassCard>
  );

  const renderActivity = () => (
    <GlassCard darkMode={darkMode}>
      {[
        { label: 'Total Credits',  value: formatCurrency(accountTxs.filter(t => t.type === 'deposit' || t.type === 'credit').reduce((s, t) => s + t.amount, 0), account.currency) },
        { label: 'Total Debits',   value: formatCurrency(accountTxs.filter(t => t.type !== 'deposit' && t.type !== 'credit').reduce((s, t) => s + t.amount, 0), account.currency) },
        { label: 'Transactions',   value: String(accountTxs.length) },
        { label: 'Avg. Transaction', value: accountTxs.length > 0 ? formatCurrency(accountTxs.reduce((s, t) => s + Math.abs(t.amount), 0) / accountTxs.length, account.currency) : '—' },
        { label: 'Last Activity',  value: accountTxs[0] ? timeAgo(accountTxs[0].createdAt) : 'None' },
      ].map((row, i, arr) => (
        <View key={row.label}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, darkMode && { color: COLORS.gray[400] }]}>{row.label}</Text>
            <Text style={[styles.detailValue, darkMode && { color: COLORS.white }]}>{row.value}</Text>
          </View>
          {i < arr.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </GlassCard>
  );

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />

      {/* Hero header with gradient */}
      <LinearGradient colors={gradient} style={styles.hero}>
        <View style={styles.heroNav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.heroLabel}>{account.type.toUpperCase()} ACCOUNT</Text>
        <Text style={styles.heroName}>{account.name}</Text>
        <TouchableOpacity onPress={() => setShowBalance(b => !b)} activeOpacity={0.8}>
          <Text style={styles.heroBalance}>
            {showBalance ? formatCurrency(account.balance, account.currency) : '••••••'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.heroAccount}>{maskAccountNumber(account.accountNumber)}</Text>

        {/* Quick action row */}
        <View style={styles.quickRow}>
          {[
            { icon: '↗️', label: 'Send',    onPress: () => navigation.navigate('Transfer') },
            { icon: '↙️', label: 'Receive', onPress: () => {} },
            { icon: '📋', label: 'Statement', onPress: () => {} },
            { icon: '⚙️', label: 'Manage', onPress: () => {} },
          ].map(a => (
            <TouchableOpacity key={a.label} style={styles.quickAction} onPress={a.onPress}>
              <View style={styles.quickActionIcon}>
                <Text style={{ fontSize: 18 }}>{a.icon}</Text>
              </View>
              <Text style={styles.quickActionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabBar, darkMode && styles.tabBarDark]}>
        <PillTabs tabs={tabs} activeIndex={activeTab} onChange={setActiveTab} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[500]} />}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 0 && renderTransactions()}
        {activeTab === 1 && renderDetails()}
        {activeTab === 2 && renderActivity()}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: COLORS.gray[50] },
  containerDark:  { backgroundColor: COLORS.gray[900] },
  hero: {
    paddingTop:        60,
    paddingBottom:     SPACING[5],
    paddingHorizontal: SPACING[5],
  },
  heroNav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING[4] },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, color: COLORS.white, fontWeight: '600' },
  heroLabel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: 1.5 },
  heroName:  { fontSize: FONT_SIZES['2xl'], fontWeight: '800', color: COLORS.white, marginTop: 4 },
  heroBalance: { fontSize: FONT_SIZES['4xl'], fontWeight: '800', color: COLORS.white, marginTop: SPACING[2], letterSpacing: -1 },
  heroAccount: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.65)', marginTop: SPACING[1], marginBottom: SPACING[5] },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: SPACING[1] },
  quickActionIcon: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.3)',
  },
  quickActionLabel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  tabBar:     { backgroundColor: COLORS.white, paddingHorizontal: SPACING[5], paddingVertical: SPACING[3], borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  tabBarDark: { backgroundColor: COLORS.gray[800], borderBottomColor: COLORS.gray[700] },
  scrollContent: { padding: SPACING[5] },
  txRow: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingVertical: SPACING[3],
    backgroundColor: COLORS.white,
    borderRadius:  RADIUS.xl,
    paddingHorizontal: SPACING[4],
    marginBottom:  SPACING[2],
    gap:           SPACING[3],
  },
  txRowDark: { backgroundColor: COLORS.gray[800] },
  txIcon:    { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  txIconEmoji: { fontSize: 20 },
  txInfo:    { flex: 1 },
  txName:    { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.gray[800] },
  txDate:    { fontSize: FONT_SIZES.xs, color: COLORS.gray[400], marginTop: 2 },
  txRight:   { alignItems: 'flex-end', gap: SPACING[1] },
  txAmount:  { fontSize: FONT_SIZES.base, fontWeight: '700' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING[3] },
  detailLabel: { fontSize: FONT_SIZES.sm, color: COLORS.gray[500] },
  detailValue: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.gray[800], textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: COLORS.gray[100] },
});

export default AccountDetailScreen;
