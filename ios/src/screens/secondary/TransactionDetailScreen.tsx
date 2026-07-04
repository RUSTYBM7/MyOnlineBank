// ============================================================
// OrbitPay - Transaction Detail Screen
// ============================================================
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Share, StatusBar, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, StatusBadge, GradientButton } from '../../components/common/UIComponents';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate, formatAmount } from '../../utils/formatters';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TransactionDetail'>;
  route:      RouteProp<RootStackParamList, 'TransactionDetail'>;
};

const CATEGORY_ICONS: Record<string, string> = {
  food_dining:   '🍽️',
  transport:     '🚗',
  shopping:      '🛍️',
  entertainment: '🎬',
  healthcare:    '💊',
  utilities:     '⚡',
  travel:        '✈️',
  transfer:      '↗️',
  salary:        '💼',
  investment:    '📈',
  withdrawal:    '💸',
  deposit:       '💰',
  refund:        '↩️',
  other:         '💳',
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
  mono?: boolean;
  darkMode: boolean;
}> = ({ label, value, valueColor, mono, darkMode }) => (
  <View style={detailStyles.row}>
    <Text style={[detailStyles.label, darkMode && { color: COLORS.gray[400] }]}>{label}</Text>
    <Text style={[
      detailStyles.value,
      darkMode && { color: COLORS.white },
      valueColor ? { color: valueColor } : undefined,
      mono ? detailStyles.mono : undefined,
    ]}>
      {value}
    </Text>
  </View>
);
const detailStyles = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING[3] },
  label: { fontSize: FONT_SIZES.sm, color: COLORS.gray[500] },
  value: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.gray[800], maxWidth: '55%', textAlign: 'right' },
  mono:  { fontFamily: 'Courier', fontSize: FONT_SIZES.xs },
});

const TransactionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactions, darkMode } = useAppStore();
  const { transactionId } = route.params;
  const tx = transactions.find(t => t.id === transactionId);

  if (!tx) {
    return (
      <View style={[styles.container, darkMode && styles.containerDark, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: COLORS.gray[500] }}>Transaction not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: SPACING[4] }}>
          <Text style={{ color: COLORS.primary[500] }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCredit  = tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'credit';
  const amountStr = formatCurrency(Math.abs(tx.amount), tx.currency);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `OrbitPay Transaction\n${tx.description}\n${isCredit ? '+' : '-'}${amountStr}\n${formatDate(tx.createdAt, 'long')}\nRef: ${tx.reference}`,
        title:   'Transaction Receipt',
      });
    } catch {}
  };

  const handleDispute = () => {
    Alert.alert(
      'Dispute Transaction',
      'Are you sure you want to dispute this transaction? Our team will review it within 3-5 business days.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit Dispute', style: 'destructive', onPress: () => Alert.alert('Dispute Filed', 'We will review your dispute and contact you shortly.') },
      ],
    );
  };

  const statusColor = tx.status === 'completed' ? COLORS.success : tx.status === 'pending' ? COLORS.warning : COLORS.error;

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600]]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareIcon}>⬆</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Amount hero */}
        <GlassCard darkMode={darkMode} style={styles.amountCard}>
          <View style={[styles.txIcon, { backgroundColor: `${isCredit ? COLORS.success : COLORS.primary[500]}20` }]}>
            <Text style={styles.txIconText}>{CATEGORY_ICONS[tx.category] ?? '💳'}</Text>
          </View>
          <Text style={[styles.merchantName, darkMode && { color: COLORS.white }]}>{tx.merchantName ?? tx.description}</Text>
          <Text style={[
            styles.amountLarge,
            { color: isCredit ? COLORS.success : darkMode ? COLORS.white : COLORS.gray[900] },
          ]}>
            {isCredit ? '+' : '-'}{amountStr}
          </Text>
          <View style={styles.statusRow}>
            <StatusBadge status={tx.status} />
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{tx.status}</Text>
          </View>
          <Text style={styles.txDate}>{formatDate(tx.createdAt, 'long')}</Text>
        </GlassCard>

        {/* Details card */}
        <GlassCard darkMode={darkMode} style={styles.detailsCard}>
          <Text style={[styles.sectionTitle, darkMode && { color: COLORS.white }]}>Details</Text>
          <View style={styles.divider} />
          <DetailRow label="Transaction ID" value={tx.id.slice(0, 12) + '...'} mono darkMode={darkMode} />
          <View style={styles.divider} />
          <DetailRow label="Reference"      value={tx.reference ?? '—'}         mono darkMode={darkMode} />
          <View style={styles.divider} />
          <DetailRow label="Category"       value={tx.category.replace(/_/g, ' ')} darkMode={darkMode} />
          <View style={styles.divider} />
          <DetailRow label="Type"           value={tx.type}                     darkMode={darkMode} />
          <View style={styles.divider} />
          <DetailRow label="Account"        value={tx.accountId ?? '—'}         darkMode={darkMode} />
          {tx.fee && tx.fee > 0 ? (
            <>
              <View style={styles.divider} />
              <DetailRow label="Processing Fee" value={formatCurrency(tx.fee, tx.currency)} valueColor={COLORS.warning} darkMode={darkMode} />
            </>
          ) : null}
          {tx.exchangeRate ? (
            <>
              <View style={styles.divider} />
              <DetailRow label="Exchange Rate" value={`1 USD = ${tx.exchangeRate} ${tx.currency}`} darkMode={darkMode} />
            </>
          ) : null}
        </GlassCard>

        {/* Merchant info if available */}
        {tx.merchantName && (
          <GlassCard darkMode={darkMode} style={styles.merchantCard}>
            <Text style={[styles.sectionTitle, darkMode && { color: COLORS.white }]}>Merchant</Text>
            <View style={styles.divider} />
            <DetailRow label="Merchant" value={tx.merchantName} darkMode={darkMode} />
            {tx.merchantCategory && (
              <>
                <View style={styles.divider} />
                <DetailRow label="Category" value={tx.merchantCategory} darkMode={darkMode} />
              </>
            )}
          </GlassCard>
        )}

        {/* Description */}
        {tx.description && (
          <GlassCard darkMode={darkMode} style={styles.descCard}>
            <Text style={[styles.sectionTitle, darkMode && { color: COLORS.white }]}>Description</Text>
            <Text style={[styles.descText, darkMode && { color: COLORS.gray[300] }]}>{tx.description}</Text>
          </GlassCard>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <GradientButton label="Download Receipt" onPress={handleShare} style={styles.actionBtn} />
          {tx.status === 'completed' && !isCredit && (
            <TouchableOpacity style={[styles.disputeBtn, darkMode && styles.disputeBtnDark]} onPress={handleDispute}>
              <Text style={styles.disputeBtnText}>Dispute This Transaction</Text>
            </TouchableOpacity>
          )}
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
    paddingBottom: SPACING[4],
    paddingHorizontal: SPACING[5],
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
  },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:    { fontSize: 22, color: COLORS.white, fontWeight: '600' },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.white },
  shareBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  shareIcon:   { fontSize: 20, color: COLORS.white },
  scrollContent: { padding: SPACING[5] },
  amountCard:  { alignItems: 'center', marginBottom: SPACING[4] },
  txIcon: {
    width:          72,
    height:         72,
    borderRadius:   36,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   SPACING[3],
  },
  txIconText:   { fontSize: 32 },
  merchantName: {
    fontSize:     FONT_SIZES.xl,
    fontWeight:   '700',
    color:        COLORS.gray[800],
    marginBottom: SPACING[2],
    textAlign:    'center',
  },
  amountLarge: {
    fontSize:     FONT_SIZES['4xl'],
    fontWeight:   '800',
    marginBottom: SPACING[3],
    letterSpacing: -1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING[2],
    marginBottom:  SPACING[2],
  },
  statusDot:  { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FONT_SIZES.sm, fontWeight: '600', textTransform: 'capitalize' },
  txDate:     { fontSize: FONT_SIZES.sm, color: COLORS.gray[400] },
  detailsCard:  { marginBottom: SPACING[4] },
  merchantCard: { marginBottom: SPACING[4] },
  descCard:     { marginBottom: SPACING[4] },
  sectionTitle: {
    fontSize:     FONT_SIZES.base,
    fontWeight:   '700',
    color:        COLORS.gray[800],
    marginBottom: SPACING[2],
  },
  divider: { height: 1, backgroundColor: COLORS.gray[100] },
  descText: { fontSize: FONT_SIZES.sm, color: COLORS.gray[600], lineHeight: 22, marginTop: SPACING[2] },
  actions: { gap: SPACING[3] },
  actionBtn: {},
  disputeBtn: {
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.xl,
    paddingVertical: SPACING[4],
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     `${COLORS.error}30`,
    ...SHADOWS.sm,
  },
  disputeBtnDark: { backgroundColor: COLORS.gray[800], borderColor: '#7F1D1D' },
  disputeBtnText: { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.error },
});

export default TransactionDetailScreen;
