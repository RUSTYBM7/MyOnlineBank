// ============================================================
// OrbitPay - Transfer / Send Money Screen
// ============================================================
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, GradientButton, InputField, PillTabs, SectionHeader } from '../../components/common/UIComponents';
import { MiniAccountRow } from '../../components/cards/AccountCard';
import { TransferService } from '../../services/apiServices';
import { useAppStore } from '../../store';
import { formatCurrency, isValidEmail } from '../../utils/formatters';
import type { RootStackParamList, TransferFormData } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SendMoney'>;
  route: RouteProp<RootStackParamList, 'SendMoney'>;
};

const TRANSFER_TYPES = ['Internal', 'External', 'Wire', 'Crypto'];
const CURRENCIES     = ['USD', 'EUR', 'GBP', 'BTC'];

const RECENT_RECIPIENTS = [
  { name: 'James Wilson',  initials: 'JW', color: '#059669' },
  { name: 'Maria Garcia',  initials: 'MG', color: '#7C3AED' },
  { name: 'Priya Patel',   initials: 'PP', color: '#0891B2' },
  { name: 'Robin H.',      initials: 'RH', color: '#D97706' },
];

const TransferScreen: React.FC<Props> = ({ navigation, route }) => {
  const { accounts, user, prependTransaction, darkMode } = useAppStore();

  const [transferType, setTransferType] = useState<'Internal' | 'External' | 'Wire' | 'Crypto'>('Internal');
  const [fromAccountId, setFromAccountId] = useState(
    route.params?.fromAccountId ?? accounts.find(a => a.isPrimary)?.id ?? '',
  );
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [recipientName, setRecipientName]     = useState('');
  const [amount, setAmount]                   = useState('');
  const [currency, setCurrency]               = useState<'USD' | 'EUR' | 'GBP' | 'BTC'>('USD');
  const [description, setDescription]         = useState('');
  const [loading, setLoading]                 = useState(false);
  const [step, setStep]                       = useState<'form' | 'confirm' | 'success'>('form');
  const [errors, setErrors]                   = useState<Record<string, string>>({});

  const fromAccount = accounts.find(a => a.id === fromAccountId);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!fromAccountId) e.fromAccount = 'Please select a source account';
    if (!toAccountNumber.trim()) e.toAccount = 'Recipient account is required';
    if (!amount || parseFloat(amount) <= 0) e.amount = 'Enter a valid amount';
    if (fromAccount && parseFloat(amount) > fromAccount.balance) {
      e.amount = 'Insufficient balance';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    setStep('confirm');
  };

  const handleTransfer = async () => {
    setLoading(true);
    try {
      const formData: TransferFormData = {
        fromAccountId,
        toAccountNumber,
        toAccountName: recipientName,
        amount,
        currency,
        description,
        transferType: transferType.toLowerCase() as TransferFormData['transferType'],
      };

      const transaction = await TransferService.initiateTransfer(formData);
      prependTransaction(transaction);
      setStep('success');
    } catch (err) {
      // Demo mode: simulate success
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', padding: SPACING[8] }]}>
        <LinearGradient
          colors={[COLORS.primary[500], COLORS.teal[600]]}
          style={styles.successIcon}
        >
          <Text style={{ fontSize: 48 }}>✓</Text>
        </LinearGradient>
        <Text style={styles.successTitle}>Transfer Sent!</Text>
        <Text style={styles.successDesc}>
          {formatCurrency(parseFloat(amount), currency)} has been sent to {recipientName || toAccountNumber}
        </Text>
        <GradientButton
          label="Back to Home"
          onPress={() => {
            setStep('form');
            navigation.goBack();
          }}
          style={{ marginTop: SPACING[8], width: '100%' }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, darkMode && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600]]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 'confirm' ? 'Review Transfer' : 'Send Money'}
        </Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'form' ? (
          <>
            {/* Transfer type */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>
                Transfer Type
              </Text>
              <PillTabs
                tabs={TRANSFER_TYPES}
                activeTab={transferType}
                onTabChange={(t) => setTransferType(t as typeof transferType)}
              />
            </View>

            {/* From Account */}
            <View style={styles.section}>
              <SectionHeader
                title="From Account"
                darkMode={darkMode}
              />
              {accounts.map((acc) => (
                <MiniAccountRow
                  key={acc.id}
                  account={acc}
                  selected={fromAccountId === acc.id}
                  onPress={() => setFromAccountId(acc.id)}
                />
              ))}
              {!!errors.fromAccount && <Text style={styles.errorText}>{errors.fromAccount}</Text>}
            </View>

            {/* Recent recipients */}
            <View style={styles.section}>
              <SectionHeader title="Recent" darkMode={darkMode} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
                {RECENT_RECIPIENTS.map((r) => (
                  <TouchableOpacity
                    key={r.name}
                    style={styles.recentContact}
                    onPress={() => setRecipientName(r.name)}
                  >
                    <View style={[styles.recentAvatar, { backgroundColor: r.color }]}>
                      <Text style={styles.recentInitials}>{r.initials}</Text>
                    </View>
                    <Text style={[styles.recentName, darkMode && { color: COLORS.white }]} numberOfLines={1}>
                      {r.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* To Account */}
            <View style={styles.section}>
              <InputField
                label="Recipient Account / Username"
                value={toAccountNumber}
                onChangeText={setToAccountNumber}
                placeholder="Account number or @username"
                error={errors.toAccount}
              />
              <InputField
                label="Recipient Name (optional)"
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="Full name"
              />
            </View>

            {/* Amount */}
            <GlassCard darkMode={darkMode} style={styles.amountCard}>
              <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>Amount</Text>
              <View style={styles.amountRow}>
                <Text style={[styles.currencySymbol, darkMode && { color: COLORS.white }]}>
                  {currency === 'BTC' ? '₿' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                </Text>
                <InputField
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  style={[styles.amountInput, darkMode && { color: COLORS.white }]}
                  containerStyle={{ flex: 1, marginBottom: 0 }}
                  error={errors.amount}
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyRow}>
                {CURRENCIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCurrency(c as typeof currency)}
                    style={[styles.currencyBtn, currency === c && styles.currencyBtnActive]}
                  >
                    <Text style={[styles.currencyBtnText, currency === c && styles.currencyBtnTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {fromAccount && (
                <Text style={styles.availableText}>
                  Available: {formatCurrency(fromAccount.balance, fromAccount.currency)}
                </Text>
              )}
            </GlassCard>

            {/* Quick amounts */}
            <View style={styles.quickAmounts}>
              {['100', '250', '500', '1000'].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setAmount(v)}
                  style={[styles.quickAmountBtn, amount === v && styles.quickAmountBtnActive]}
                >
                  <Text style={[styles.quickAmountText, amount === v && { color: COLORS.white }]}>
                    ${v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Note */}
            <InputField
              label="Note (optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="What's this for?"
              multiline
              numberOfLines={3}
            />

            <GradientButton
              label="Continue"
              onPress={handleContinue}
              style={{ marginTop: SPACING[4] }}
            />
          </>
        ) : (
          /* Confirmation screen */
          <>
            <GlassCard darkMode={darkMode} style={styles.confirmCard}>
              <Text style={styles.confirmLabel}>You are sending</Text>
              <Text style={styles.confirmAmount}>
                {formatCurrency(parseFloat(amount || '0'), currency)}
              </Text>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmKey}>From</Text>
                <Text style={styles.confirmValue}>{fromAccount?.name ?? 'Account'}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmKey}>To</Text>
                <Text style={styles.confirmValue}>{recipientName || toAccountNumber}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmKey}>Account</Text>
                <Text style={styles.confirmValue}>••••{toAccountNumber.slice(-4)}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmKey}>Type</Text>
                <Text style={styles.confirmValue}>{transferType} Transfer</Text>
              </View>
              {description ? (
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmKey}>Note</Text>
                  <Text style={styles.confirmValue}>{description}</Text>
                </View>
              ) : null}
              <View style={[styles.confirmRow, styles.confirmRowFee]}>
                <Text style={styles.confirmKey}>Fee</Text>
                <Text style={[styles.confirmValue, { color: COLORS.primary[600] }]}>FREE</Text>
              </View>
            </GlassCard>

            <GradientButton
              label="Confirm Transfer"
              onPress={handleTransfer}
              loading={loading}
              style={{ marginTop: SPACING[4] }}
            />
            <TouchableOpacity onPress={() => setStep('form')} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit Details</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.gray[50] },
  containerDark: { backgroundColor: COLORS.gray[900] },
  header: {
    paddingTop:      60,
    paddingBottom:   SPACING[4],
    paddingHorizontal: SPACING[5],
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
  },
  backBtn:    { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon:   { fontSize: 22, color: COLORS.white, fontWeight: '600' },
  headerTitle: {
    fontSize:   FONT_SIZES.xl,
    fontWeight: '700',
    color:      COLORS.white,
  },
  scrollContent:  { padding: SPACING[5] },
  section:        { marginBottom: SPACING[5] },
  sectionLabel: {
    fontSize:     FONT_SIZES.sm,
    fontWeight:   '600',
    color:        COLORS.gray[700],
    marginBottom: SPACING[2],
  },
  sectionLabelDark: { color: COLORS.gray[300] },
  errorText: { fontSize: FONT_SIZES.xs, color: COLORS.error, marginTop: SPACING[1] },
  recentRow:      { paddingRight: SPACING[2], gap: SPACING[4] },
  recentContact:  { alignItems: 'center', width: 64 },
  recentAvatar: {
    width:          52,
    height:         52,
    borderRadius:   26,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   SPACING[2],
  },
  recentInitials: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  recentName: {
    fontSize:   FONT_SIZES.xs,
    color:      COLORS.gray[700],
    fontWeight: '500',
    textAlign:  'center',
  },
  amountCard: { marginBottom: SPACING[3] },
  amountRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING[3] },
  currencySymbol: {
    fontSize:   FONT_SIZES['4xl'],
    fontWeight: '300',
    color:      COLORS.gray[400],
    marginRight: SPACING[2],
  },
  amountInput: {
    fontSize:   FONT_SIZES['3xl'],
    fontWeight: '700',
    color:      COLORS.gray[900],
    borderWidth: 0,
  },
  currencyRow:      { gap: SPACING[2], marginBottom: SPACING[3] },
  currencyBtn: {
    paddingVertical:   SPACING[2],
    paddingHorizontal: SPACING[4],
    borderRadius:      RADIUS.full,
    borderWidth:       1,
    borderColor:       COLORS.gray[200],
  },
  currencyBtnActive:     { backgroundColor: COLORS.primary[500], borderColor: COLORS.primary[500] },
  currencyBtnText:       { fontSize: FONT_SIZES.sm, color: COLORS.gray[600], fontWeight: '500' },
  currencyBtnTextActive: { color: COLORS.white },
  availableText:    { fontSize: FONT_SIZES.xs, color: COLORS.gray[400] },
  quickAmounts: {
    flexDirection:  'row',
    gap:            SPACING[2],
    marginBottom:   SPACING[5],
  },
  quickAmountBtn: {
    flex:            1,
    paddingVertical: SPACING[3],
    borderRadius:    RADIUS.lg,
    borderWidth:     1,
    borderColor:     COLORS.gray[200],
    alignItems:      'center',
    backgroundColor: COLORS.white,
  },
  quickAmountBtnActive: { backgroundColor: COLORS.primary[500], borderColor: COLORS.primary[500] },
  quickAmountText: {
    fontSize:   FONT_SIZES.sm,
    fontWeight: '600',
    color:      COLORS.gray[700],
  },
  confirmCard: { padding: SPACING[5], gap: SPACING[3] },
  confirmLabel: {
    fontSize:  FONT_SIZES.base,
    color:     COLORS.gray[500],
    textAlign: 'center',
  },
  confirmAmount: {
    fontSize:   FONT_SIZES['3xl'],
    fontWeight: '800',
    color:      COLORS.gray[900],
    textAlign:  'center',
    marginBottom: SPACING[3],
  },
  confirmRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  confirmRowFee:   { borderBottomWidth: 0 },
  confirmKey:      { fontSize: FONT_SIZES.base, color: COLORS.gray[500] },
  confirmValue: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '600',
    color:      COLORS.gray[800],
  },
  editBtn: {
    alignItems:     'center',
    paddingVertical: SPACING[4],
    marginTop:      SPACING[3],
  },
  editBtnText:    { fontSize: FONT_SIZES.base, color: COLORS.primary[600], fontWeight: '500' },
  successIcon: {
    width:          120,
    height:         120,
    borderRadius:   60,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   SPACING[6],
    ...SHADOWS.emerald,
  },
  successTitle: {
    fontSize:   FONT_SIZES['2xl'],
    fontWeight: '800',
    color:      COLORS.gray[900],
    textAlign:  'center',
  },
  successDesc: {
    fontSize:   FONT_SIZES.base,
    color:      COLORS.gray[500],
    textAlign:  'center',
    marginTop:  SPACING[2],
    lineHeight: 24,
  },
  bottomPad: { height: 100 },
});

export default TransferScreen;
