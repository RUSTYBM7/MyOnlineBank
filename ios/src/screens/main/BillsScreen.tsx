// ============================================================
// OrbitPay - Bills & Payments Screen
// ============================================================
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, SectionHeader, StatusBadge, GradientButton, EmptyState } from '../../components/common/UIComponents';
import { BillService } from '../../services/apiServices';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate, timeAgo } from '../../utils/formatters';
import type { RootStackParamList, BillPayment } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

const BILLER_ICONS: Record<string, string> = {
  utilities:    '⚡',
  internet:     '🌐',
  insurance:    '🛡️',
  streaming:    '📺',
  phone:        '📱',
  rent:         '🏠',
  credit_card:  '💳',
  loan:         '🏦',
  gym:          '💪',
  subscriptions: '🔄',
  other:        '📄',
};

const STATUS_COLORS: Record<string, string> = {
  paid:      COLORS.success,
  pending:   COLORS.warning,
  overdue:   COLORS.error,
  scheduled: COLORS.primary[500],
  cancelled: COLORS.gray[400],
};

interface BillCardProps {
  bill: BillPayment;
  onPay: (bill: BillPayment) => void;
  darkMode: boolean;
}
const BillCard: React.FC<BillCardProps> = ({ bill, onPay, darkMode }) => {
  const isOverdue  = bill.status === 'overdue';
  const isPending  = bill.status === 'pending' || bill.status === 'scheduled';
  const isPaid     = bill.status === 'paid';
  const dueDate    = new Date(bill.dueDate);
  const daysUntil  = Math.ceil((dueDate.getTime() - Date.now()) / 86400000);

  return (
    <GlassCard darkMode={darkMode} style={[styles.billCard, isOverdue && styles.billCardOverdue]}>
      <View style={styles.billRow}>
        {/* Icon */}
        <View style={[styles.billIcon, { backgroundColor: `${STATUS_COLORS[bill.status]}20` }]}>
          <Text style={styles.billIconText}>{BILLER_ICONS[bill.category] ?? '📄'}</Text>
        </View>

        {/* Info */}
        <View style={styles.billInfo}>
          <Text style={[styles.billName, darkMode && { color: COLORS.white }]} numberOfLines={1}>
            {bill.billerName}
          </Text>
          <Text style={styles.billAccount}>{bill.accountNumber ?? 'Auto Pay'}</Text>
          <View style={styles.billMeta}>
            {isOverdue ? (
              <Text style={styles.overdueText}>Overdue · {timeAgo(bill.dueDate)}</Text>
            ) : isPaid ? (
              <Text style={styles.paidText}>Paid {formatDate(bill.paidAt ?? bill.dueDate, 'short')}</Text>
            ) : (
              <Text style={[styles.dueDateText, daysUntil <= 3 && styles.dueDateWarning]}>
                Due {daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : `in ${daysUntil}d`}
              </Text>
            )}
          </View>
        </View>

        {/* Amount + Action */}
        <View style={styles.billRight}>
          <Text style={[styles.billAmount, isOverdue && { color: COLORS.error }, darkMode && !isOverdue && { color: COLORS.white }]}>
            {formatCurrency(bill.amount, bill.currency ?? 'USD')}
          </Text>
          {isPending || isOverdue ? (
            <TouchableOpacity
              style={[styles.payBtn, isOverdue && styles.payBtnOverdue]}
              onPress={() => onPay(bill)}
              activeOpacity={0.8}
            >
              <Text style={styles.payBtnText}>{isOverdue ? 'Pay Now' : 'Pay'}</Text>
            </TouchableOpacity>
          ) : (
            <StatusBadge status={bill.status} />
          )}
        </View>
      </View>

      {bill.autoPay && (
        <View style={styles.autoPay}>
          <Text style={styles.autoPayText}>🔄 Auto-pay enabled</Text>
        </View>
      )}
    </GlassCard>
  );
};

const BillsScreen: React.FC<Props> = ({ navigation }) => {
  const { bills, setBills, darkMode } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [paying, setPaying] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await BillService.getBills();
      setBills(data);
    } catch { /* use store */ }
  }, []);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handlePay = (bill: BillPayment) => {
    Alert.alert(
      `Pay ${bill.billerName}`,
      `Confirm payment of ${formatCurrency(bill.amount, bill.currency ?? 'USD')} from your primary account.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Payment',
          onPress: async () => {
            setPaying(bill.id);
            try {
              await BillService.payBill(bill.id, bill.amount, bill.currency ?? 'USD');
              Alert.alert('Payment Sent!', `${bill.billerName} payment has been processed.`);
              await load();
            } catch {
              Alert.alert('Payment Failed', 'Unable to process payment. Please try again.');
            } finally {
              setPaying(null);
            }
          },
        },
      ],
    );
  };

  const filtered = bills.filter(b => {
    if (activeFilter === 'pending') return b.status === 'pending' || b.status === 'overdue' || b.status === 'scheduled';
    if (activeFilter === 'paid')    return b.status === 'paid';
    return true;
  });

  const totalDue = bills
    .filter(b => b.status === 'pending' || b.status === 'overdue')
    .reduce((s, b) => s + b.amount, 0);

  const overdueCount = bills.filter(b => b.status === 'overdue').length;

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600]]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Bills & Payments</Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{formatCurrency(totalDue, 'USD')}</Text>
            <Text style={styles.headerStatLabel}>Total Due</Text>
          </View>
          {overdueCount > 0 && (
            <View style={[styles.headerStat, styles.headerStatOverdue]}>
              <Text style={[styles.headerStatValue, { color: '#FCA5A5' }]}>{overdueCount}</Text>
              <Text style={[styles.headerStatLabel, { color: '#FCA5A5' }]}>Overdue</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Filter tabs */}
      <View style={[styles.filters, darkMode && styles.filtersDark]}>
        {(['all', 'pending', 'paid'] as const).map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f === 'pending' ? 'Due' : 'Paid'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary[500]} />}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            title="No Bills"
            message="No bills found for this filter. Add billers to get started."
            icon={<Text style={{ fontSize: 56 }}>📄</Text>}
          />
        ) : (
          <>
            <SectionHeader
              title={`${filtered.length} ${activeFilter === 'paid' ? 'Paid' : activeFilter === 'pending' ? 'Upcoming' : ''} Bill${filtered.length !== 1 ? 's' : ''}`}
              actionLabel="+ Add Biller"
              onAction={() => {}}
              darkMode={darkMode}
            />
            {filtered.map(bill => (
              <BillCard key={bill.id} bill={bill} onPay={handlePay} darkMode={darkMode} />
            ))}
          </>
        )}

        {/* Schedule / autopay promo */}
        <GlassCard darkMode={darkMode} style={styles.promoCard}>
          <Text style={styles.promoIcon}>⚡</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.promoTitle, darkMode && { color: COLORS.white }]}>Never Miss a Bill</Text>
            <Text style={styles.promoDesc}>Set up auto-pay to avoid late fees automatically.</Text>
          </View>
          <TouchableOpacity style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>Setup</Text>
          </TouchableOpacity>
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
    paddingBottom: SPACING[5],
    paddingHorizontal: SPACING[5],
  },
  headerTitle: { fontSize: FONT_SIZES['2xl'], fontWeight: '700', color: COLORS.white, marginBottom: SPACING[4] },
  headerStats: { flexDirection: 'row', gap: SPACING[4] },
  headerStat:  { alignItems: 'center' },
  headerStatOverdue: { backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: RADIUS.md, paddingHorizontal: SPACING[3], paddingVertical: SPACING[1] },
  headerStatValue: { fontSize: FONT_SIZES['2xl'], fontWeight: '800', color: COLORS.white },
  headerStatLabel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  filters: {
    flexDirection:  'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING[5],
    paddingVertical:   SPACING[3],
    gap:            SPACING[2],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  filtersDark: { backgroundColor: COLORS.gray[800], borderBottomColor: COLORS.gray[700] },
  filterTab:   { paddingVertical: SPACING[2], paddingHorizontal: SPACING[4], borderRadius: RADIUS.full, backgroundColor: COLORS.gray[100] },
  filterTabActive: { backgroundColor: COLORS.primary[500] },
  filterText:  { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.gray[500] },
  filterTextActive: { color: COLORS.white },
  scrollContent:   { padding: SPACING[5] },
  billCard:        { marginBottom: SPACING[3] },
  billCardOverdue: { borderWidth: 1, borderColor: `${COLORS.error}30` },
  billRow:  { flexDirection: 'row', alignItems: 'center', gap: SPACING[3] },
  billIcon: { width: 48, height: 48, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  billIconText: { fontSize: 22 },
  billInfo: { flex: 1 },
  billName: { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.gray[800] },
  billAccount: { fontSize: FONT_SIZES.xs, color: COLORS.gray[400], marginTop: 1 },
  billMeta:    { marginTop: 4 },
  overdueText: { fontSize: FONT_SIZES.xs, color: COLORS.error, fontWeight: '600' },
  paidText:    { fontSize: FONT_SIZES.xs, color: COLORS.success, fontWeight: '500' },
  dueDateText: { fontSize: FONT_SIZES.xs, color: COLORS.gray[500] },
  dueDateWarning: { color: COLORS.warning, fontWeight: '600' },
  billRight:  { alignItems: 'flex-end', gap: SPACING[2] },
  billAmount: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.gray[800] },
  payBtn: {
    backgroundColor: COLORS.primary[500],
    borderRadius:    RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: SPACING[3],
  },
  payBtnOverdue: { backgroundColor: COLORS.error },
  payBtnText:   { fontSize: FONT_SIZES.xs, color: COLORS.white, fontWeight: '700' },
  autoPay: { marginTop: SPACING[3], borderTopWidth: 1, borderTopColor: COLORS.gray[100], paddingTop: SPACING[2] },
  autoPayText: { fontSize: FONT_SIZES.xs, color: COLORS.gray[400] },
  promoCard: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING[3],
    marginTop:      SPACING[4],
  },
  promoIcon:  { fontSize: 28 },
  promoTitle: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.gray[800] },
  promoDesc:  { fontSize: FONT_SIZES.xs, color: COLORS.gray[500], marginTop: 2 },
  promoBtn: {
    backgroundColor: COLORS.primary[500],
    borderRadius:    RADIUS.full,
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[4],
  },
  promoBtnText: { fontSize: FONT_SIZES.sm, color: COLORS.white, fontWeight: '600' },
});

export default BillsScreen;
