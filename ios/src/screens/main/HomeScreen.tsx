// ============================================================
// OrbitPay - Dashboard / Home Screen
// ============================================================
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, FlatList, Animated, StatusBar, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, SectionHeader, SkeletonBox, QuickActionButton } from '../../components/common/UIComponents';
import { AccountCard } from '../../components/cards/AccountCard';
import { useAppStore, usePrimaryAccount, useTotalBalance, useUnreadCount } from '../../store';
import { AccountService } from '../../services/apiServices';
import { TransactionService } from '../../services/apiServices';
import { formatCurrency, formatAmount, timeAgo } from '../../utils/formatters';
import type { RootStackParamList, Transaction } from '../../types';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

// ---- Transaction Row ----------------------------------------
const TransactionRow: React.FC<{ transaction: Transaction; onPress: () => void }> = ({
  transaction, onPress,
}) => {
  const isCredit = transaction.amount > 0;
  const categoryEmoji: Record<string, string> = {
    transfer:     '↔️',
    deposit:      '⬇️',
    withdrawal:   '⬆️',
    investment:   '📈',
    topup:        '➕',
    debit:        '➖',
    credit:       '✅',
    loan_payment: '🏦',
    card_payment: '💳',
    bill_payment: '🧾',
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.txRow} activeOpacity={0.8}>
      <View style={[styles.txIconBg, isCredit ? styles.txIconBgCredit : styles.txIconBgDebit]}>
        <Text style={styles.txIcon}>{categoryEmoji[transaction.type] ?? '💸'}</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDesc} numberOfLines={1}>{transaction.description}</Text>
        <Text style={styles.txDate}>{timeAgo(transaction.createdAt)}</Text>
      </View>
      <View style={styles.txAmountArea}>
        <Text style={[styles.txAmount, isCredit ? styles.txAmountCredit : styles.txAmountDebit]}>
          {formatAmount(transaction.amount, transaction.currency)}
        </Text>
        <View style={[
          styles.txStatus,
          transaction.status === 'pending' ? styles.txStatusPending : styles.txStatusCompleted,
        ]}>
          <Text style={styles.txStatusText}>{transaction.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ---- AI Insight Card ----------------------------------------
const InsightCard: React.FC = () => {
  const insights = [
    { emoji: '💡', title: 'Save $320 this month', desc: 'By reducing dining out expenses by 15%', color: COLORS.primary[500] },
    { emoji: '📊', title: 'Spending up 8%', desc: 'Your shopping category increased this week', color: COLORS.warning },
    { emoji: '🎯', title: 'Savings goal 67% reached', desc: 'You\'re on track for your vacation fund', color: COLORS.teal[500] },
  ];
  const [idx, setIdx] = useState(0);
  const insight = insights[idx % insights.length];
  return (
    <TouchableOpacity onPress={() => setIdx(idx + 1)} activeOpacity={0.9}>
      <LinearGradient
        colors={[insight.color + 'DD', insight.color + '99']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.insightCard}
      >
        <Text style={styles.insightEmoji}>{insight.emoji}</Text>
        <View style={styles.insightText}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Text style={styles.insightDesc}>{insight.desc}</Text>
        </View>
        <Text style={styles.insightArrow}>›</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// ---- Dashboard Screen ---------------------------------------
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, accounts, transactions, setAccounts, setTransactions, darkMode } = useAppStore();
  const primaryAccount = usePrimaryAccount();
  const totalBalance   = useTotalBalance();
  const unreadCount    = useUnreadCount();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange:  [0, 80],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const loadData = useCallback(async () => {
    try {
      const [accs, txns] = await Promise.all([
        AccountService.getAccounts(),
        TransactionService.getTransactions({ limit: 20 }),
      ]);
      setAccounts(accs);
      setTransactions(txns.data ?? []);
    } catch {
      // Use mock data if API unavailable (demo mode)
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const quickActions = [
    { icon: '↑', label: 'Send',     color: COLORS.primary[500], onPress: () => navigation.navigate('SendMoney', {}) },
    { icon: '↓', label: 'Receive',  color: COLORS.teal[500],    onPress: () => navigation.navigate('RequestMoney') },
    { icon: '🏦', label: 'Pay Bill', color: COLORS.cyan[600],   onPress: () => navigation.navigate('BillPayDetail', {}) },
    { icon: '📋', label: 'History',  color: COLORS.primary[700], onPress: () => navigation.navigate('Main') },
  ];

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600], COLORS.cyan[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
            </Text>
            <Text style={styles.userName}>{user?.firstName ?? user?.fullName?.split(' ')[0] ?? 'Member'} 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={styles.headerBtn}
            >
              <Text style={styles.headerBtnIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.avatarBtn}
            >
              <Text style={styles.avatarEmoji}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total balance */}
        <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.totalBalanceArea}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalance}>
            {showBalance ? formatCurrency(totalBalance || (user?.balanceUsd ?? 0), 'USD') : '••••••••'}
          </Text>
          <Text style={styles.balanceChange}>+2.4% this month</Text>
        </TouchableOpacity>

        {/* Quick actions */}
        <View style={styles.quickActionsRow}>
          {quickActions.map((a) => (
            <QuickActionButton
              key={a.label}
              icon={<Text style={{ fontSize: 18, color: a.color }}>{a.icon}</Text>}
              label={a.label}
              onPress={a.onPress}
              color={a.color}
            />
          ))}
        </View>
      </LinearGradient>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* AI Insight */}
        <InsightCard />

        {/* Account cards */}
        <View style={styles.section}>
          <SectionHeader
            title="My Accounts"
            actionLabel="View All"
            onAction={() => navigation.navigate('Main')}
            darkMode={darkMode}
          />
          {loadingData ? (
            <View style={styles.skeletonCard}>
              <SkeletonBox height={190} style={{ borderRadius: RADIUS['2xl'] }} />
            </View>
          ) : accounts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.accountsScroll}
              pagingEnabled
              snapToInterval={width - SPACING[10] * 2 + SPACING[4]}
              decelerationRate="fast"
            >
              {accounts.slice(0, 4).map((account) => (
                <View key={account.id} style={[styles.accountCardWrapper, { width: width - SPACING[10] * 2 }]}>
                  <AccountCard
                    account={account}
                    onPress={() => navigation.navigate('AccountDetail', { accountId: account.id })}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <GlassCard style={styles.emptyAccountCard}>
              <Text style={styles.emptyText}>No accounts found</Text>
            </GlassCard>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <SectionHeader
            title="Recent Activity"
            actionLabel="See All"
            onAction={() => navigation.navigate('Main')}
            darkMode={darkMode}
          />
          {loadingData ? (
            [...Array(5)].map((_, i) => (
              <View key={i} style={[styles.skeletonRow, { marginBottom: SPACING[3] }]}>
                <SkeletonBox width={44} height={44} style={{ borderRadius: RADIUS.md }} />
                <View style={{ flex: 1, marginLeft: SPACING[3], gap: SPACING[2] }}>
                  <SkeletonBox height={14} width="60%" />
                  <SkeletonBox height={12} width="40%" />
                </View>
                <SkeletonBox height={16} width={70} />
              </View>
            ))
          ) : transactions.length > 0 ? (
            <GlassCard darkMode={darkMode} style={styles.txCard}>
              {transactions.slice(0, 8).map((tx, idx) => (
                <React.Fragment key={tx.id}>
                  <TransactionRow
                    transaction={tx}
                    onPress={() => navigation.navigate('TransactionDetail', { transactionId: tx.id })}
                  />
                  {idx < Math.min(7, transactions.length - 1) && <View style={styles.txDivider} />}
                </React.Fragment>
              ))}
            </GlassCard>
          ) : (
            <GlassCard style={styles.emptyAccountCard} darkMode={darkMode}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </GlassCard>
          )}
        </View>

        {/* KYC Banner */}
        {user?.kycStatus !== 'verified' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('KycVerification', {})}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.kycBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.kycBannerEmoji}>⚠️</Text>
              <View style={styles.kycBannerText}>
                <Text style={styles.kycBannerTitle}>Verify Your Identity</Text>
                <Text style={styles.kycBannerDesc}>
                  Complete KYC to unlock all features and higher limits
                </Text>
              </View>
              <Text style={styles.kycArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.bottomPad} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: COLORS.gray[50] },
  containerDark:      { backgroundColor: COLORS.gray[900] },
  headerGradient: {
    paddingTop:    60,
    paddingBottom: SPACING[6],
    paddingHorizontal: SPACING[5],
  },
  headerRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING[5],
  },
  greeting: {
    fontSize:  FONT_SIZES.sm,
    color:     'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },
  userName: {
    fontSize:   FONT_SIZES.xl,
    fontWeight: '700',
    color:      COLORS.white,
  },
  headerActions:   { flexDirection: 'row', gap: SPACING[3], alignItems: 'center' },
  headerBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  headerBtnIcon:   { fontSize: 18 },
  notifBadge: {
    position:        'absolute',
    top:             -4,
    right:           -4,
    backgroundColor: COLORS.error,
    borderRadius:    10,
    minWidth:        18,
    height:          18,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 4,
  },
  notifBadgeText:  { color: COLORS.white, fontSize: 9, fontWeight: '700' },
  avatarBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.4)',
  },
  avatarEmoji:         { fontSize: 18 },
  totalBalanceArea:    { alignItems: 'center', marginBottom: SPACING[6] },
  totalBalanceLabel: {
    fontSize:  FONT_SIZES.sm,
    color:     'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  totalBalance: {
    fontSize:      FONT_SIZES['4xl'],
    fontWeight:    '800',
    color:         COLORS.white,
    marginTop:     SPACING[1],
    letterSpacing: -1,
  },
  balanceChange: {
    fontSize:  FONT_SIZES.sm,
    color:     '#4ADE80',
    marginTop: 4,
    fontWeight: '500',
  },
  quickActionsRow: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius:   RADIUS.xl,
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[2],
  },
  scrollView:   { flex: 1 },
  scrollContent: { paddingTop: SPACING[5], paddingHorizontal: SPACING[5] },
  section:       { marginBottom: SPACING[6] },
  accountsScroll: { paddingRight: SPACING[4], gap: SPACING[4] },
  accountCardWrapper: { marginRight: SPACING[4] },
  skeletonCard:   { borderRadius: RADIUS['2xl'], overflow: 'hidden' },
  skeletonRow:    { flexDirection: 'row', alignItems: 'center' },
  txCard:         { padding: 0, overflow: 'hidden' },
  txRow: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  txIconBg: {
    width:          44,
    height:         44,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  txIconBgCredit:  { backgroundColor: COLORS.primary[50] },
  txIconBgDebit:   { backgroundColor: '#FEF2F2' },
  txIcon:          { fontSize: 20 },
  txInfo:          { flex: 1, marginLeft: SPACING[3] },
  txDesc: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '500',
    color:      COLORS.gray[800],
  },
  txDate:          { fontSize: FONT_SIZES.xs, color: COLORS.gray[400], marginTop: 2 },
  txAmountArea:    { alignItems: 'flex-end', gap: 4 },
  txAmount:        { fontSize: FONT_SIZES.base, fontWeight: '700' },
  txAmountCredit:  { color: COLORS.primary[600] },
  txAmountDebit:   { color: COLORS.error },
  txStatus: {
    paddingVertical:   2,
    paddingHorizontal: 8,
    borderRadius:      RADIUS.full,
  },
  txStatusCompleted: { backgroundColor: COLORS.primary[50] },
  txStatusPending:   { backgroundColor: '#FEF3C7' },
  txStatusText:      { fontSize: 9, fontWeight: '600', color: COLORS.gray[500], textTransform: 'capitalize' },
  txDivider:         { height: 1, backgroundColor: COLORS.gray[50], marginHorizontal: SPACING[4] },
  emptyAccountCard:  { alignItems: 'center', paddingVertical: SPACING[8] },
  emptyText:         { fontSize: FONT_SIZES.base, color: COLORS.gray[400] },
  kycBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    padding:         SPACING[4],
    borderRadius:    RADIUS.xl,
    marginBottom:    SPACING[4],
    gap:             SPACING[3],
  },
  kycBannerEmoji:  { fontSize: 24 },
  kycBannerText:   { flex: 1 },
  kycBannerTitle: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '700',
    color:      COLORS.white,
  },
  kycBannerDesc: {
    fontSize:  FONT_SIZES.xs,
    color:     'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  kycArrow:       { fontSize: FONT_SIZES.xl, color: COLORS.white, fontWeight: '300' },
  insightCard: {
    flexDirection:  'row',
    alignItems:     'center',
    borderRadius:   RADIUS.xl,
    padding:        SPACING[4],
    marginBottom:   SPACING[5],
    gap:            SPACING[3],
  },
  insightEmoji:   { fontSize: 28 },
  insightText:    { flex: 1 },
  insightTitle: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '700',
    color:      COLORS.white,
  },
  insightDesc: {
    fontSize:  FONT_SIZES.xs,
    color:     'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  insightArrow: { fontSize: FONT_SIZES.xl, color: COLORS.white, fontWeight: '300' },
  bottomPad:    { height: 100 },
});

export default HomeScreen;
