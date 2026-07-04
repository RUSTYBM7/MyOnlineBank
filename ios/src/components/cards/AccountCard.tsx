// ============================================================
// OrbitPay - Account Card Component (glassmorphism design)
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import type { BankAccount } from '../../types';

interface AccountCardProps {
  account: BankAccount;
  onPress?: () => void;
  showFull?: boolean;
}

const CARD_GRADIENTS: Record<string, string[]> = {
  mint:    ['#059669', '#047857'],
  teal:    ['#0D9488', '#0F766E'],
  cyan:    ['#0891B2', '#0E7490'],
  purple:  ['#7C3AED', '#5B21B6'],
  dark:    ['#1F2937', '#111827'],
  gold:    ['#D97706', '#B45309'],
  navy:    ['#1E40AF', '#1E3A8A'],
  default: ['#059669', '#047857'],
};

export const AccountCard: React.FC<AccountCardProps> = ({
  account, onPress, showFull = false,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const gradientColors = CARD_GRADIENTS[account.color] ?? CARD_GRADIENTS.default;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.wrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, SHADOWS.emerald]}
      >
        {/* Background decoration */}
        <View style={styles.circleLg} />
        <View style={styles.circleSm} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.accountType}>
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
            </Text>
            <Text style={styles.accountName}>{account.name}</Text>
          </View>
          {account.isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Primary</Text>
            </View>
          )}
        </View>

        {/* Balance */}
        <View style={styles.balanceRow}>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balance}>
              {showBalance
                ? formatCurrency(account.balance, account.currency)
                : '••••••'}
            </Text>
          </TouchableOpacity>
          <View style={styles.eyeBtn}>
            <Text style={styles.eyeIcon}>{showBalance ? '👁' : '👁‍🗨'}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Account Number</Text>
            <Text style={styles.footerValue}>
              {maskAccountNumber(account.accountNumber)}
            </Text>
          </View>
          {showFull && (
            <View style={styles.interestBadge}>
              <Text style={styles.interestText}>{account.interestRate}% APY</Text>
            </View>
          )}
          <View style={styles.statusDot}>
            <View
              style={[
                styles.dot,
                { backgroundColor: account.status === 'active' ? '#4ADE80' : '#FCD34D' },
              ]}
            />
            <Text style={styles.statusText}>{account.status}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// ---- Mini Account Row for lists ---------------------------
interface MiniAccountProps {
  account: BankAccount;
  onPress?: () => void;
  selected?: boolean;
}
export const MiniAccountRow: React.FC<MiniAccountProps> = ({ account, onPress, selected }) => {
  const gradientColors = CARD_GRADIENTS[account.color] ?? CARD_GRADIENTS.default;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.miniRow, selected && styles.miniRowSelected]}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.miniIcon}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.miniIconText}>
          {account.type === 'checking' ? '💳' : '🏦'}
        </Text>
      </LinearGradient>
      <View style={styles.miniInfo}>
        <Text style={styles.miniName}>{account.name}</Text>
        <Text style={styles.miniNumber}>••••{account.accountNumber.slice(-4)}</Text>
      </View>
      <Text style={styles.miniBalance}>
        {formatCurrency(account.balance, account.currency)}
      </Text>
    </TouchableOpacity>
  );
};

// ---- Styles ------------------------------------------------
const styles = StyleSheet.create({
  wrapper: { borderRadius: RADIUS['2xl'], overflow: 'hidden' },
  card: {
    borderRadius:    RADIUS['2xl'],
    padding:         SPACING[6],
    minHeight:       195,
    justifyContent: 'space-between',
    overflow:        'hidden',
  },
  circleLg: {
    position:      'absolute',
    width:         200,
    height:        200,
    borderRadius:  100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top:           -80,
    right:         -60,
  },
  circleSm: {
    position:      'absolute',
    width:         120,
    height:        120,
    borderRadius:  60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom:        -40,
    left:          -20,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  accountType: {
    fontSize:   FONT_SIZES.xs,
    color:      'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  accountName: {
    fontSize:   FONT_SIZES.md,
    color:      COLORS.white,
    fontWeight: '600',
    marginTop:  2,
  },
  primaryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING[3],
    paddingVertical:   4,
    borderRadius:      RADIUS.full,
    borderWidth:       1,
    borderColor:       'rgba(255,255,255,0.3)',
  },
  primaryBadgeText: {
    color:      COLORS.white,
    fontSize:   FONT_SIZES.xs,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginVertical: SPACING[3],
  },
  balanceLabel: {
    fontSize: FONT_SIZES.xs,
    color:    'rgba(255,255,255,0.65)',
  },
  balance: {
    fontSize:   FONT_SIZES['3xl'],
    color:      COLORS.white,
    fontWeight: '700',
    marginTop:  4,
    letterSpacing: -0.5,
  },
  eyeBtn: {
    width:          36,
    height:         36,
    borderRadius:   18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems:     'center',
    justifyContent: 'center',
  },
  eyeIcon: { fontSize: 16 },
  footer: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-end',
  },
  footerLabel: {
    fontSize: FONT_SIZES.xs,
    color:    'rgba(255,255,255,0.6)',
  },
  footerValue: {
    fontSize:   FONT_SIZES.sm,
    color:      COLORS.white,
    fontWeight: '500',
    marginTop:  2,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  interestBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING[3],
    paddingVertical:   3,
    borderRadius:      RADIUS.full,
  },
  interestText: {
    color:      COLORS.white,
    fontSize:   FONT_SIZES.xs,
    fontWeight: '700',
  },
  statusDot: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  statusText: {
    fontSize:  FONT_SIZES.xs,
    color:     'rgba(255,255,255,0.7)',
    textTransform: 'capitalize',
  },
  // Mini row
  miniRow: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: COLORS.gray[50],
    borderRadius:    RADIUS.lg,
    padding:         SPACING[3],
    marginBottom:    SPACING[2],
    borderWidth:     1,
    borderColor:     COLORS.gray[100],
  },
  miniRowSelected: {
    borderColor:     COLORS.primary[500],
    backgroundColor: COLORS.primary[50],
  },
  miniIcon: {
    width:          44,
    height:         44,
    borderRadius:   RADIUS.md,
    alignItems:     'center',
    justifyContent: 'center',
  },
  miniIconText: { fontSize: 20 },
  miniInfo: { flex: 1, marginLeft: SPACING[3] },
  miniName: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '600',
    color:      COLORS.gray[800],
  },
  miniNumber: {
    fontSize: FONT_SIZES.xs,
    color:    COLORS.gray[500],
    marginTop: 2,
  },
  miniBalance: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '700',
    color:      COLORS.primary[700],
  },
});
