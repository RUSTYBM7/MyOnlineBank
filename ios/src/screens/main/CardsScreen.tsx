// ============================================================
// OrbitPay - Cards Management Screen
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Alert, StatusBar, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, GradientButton, SectionHeader, StatusBadge, Badge } from '../../components/common/UIComponents';
import { CardService } from '../../services/apiServices';
import { useAppStore } from '../../store';
import { formatCurrency, maskCardNumber, formatExpiry } from '../../utils/formatters';
import type { RootStackParamList, Card } from '../../types';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
};

// ---- Card Visual Component ----------------------------------
const CardVisual: React.FC<{ card: Card; flipped?: boolean; onFlip?: () => void }> = ({
  card, flipped = false, onFlip,
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isBack, setIsBack] = useState(false);

  const CARD_GRADIENTS: Record<string, string[]> = {
    mint:    ['#059669', '#047857'],
    teal:    ['#0D9488', '#0F766E'],
    purple:  ['#7C3AED', '#5B21B6'],
    gold:    ['#D97706', '#B45309'],
    dark:    ['#1F2937', '#111827'],
    navy:    ['#1E40AF', '#1E3A8A'],
    default: ['#059669', '#047857'],
  };

  const gradColors = CARD_GRADIENTS[card.color] ?? CARD_GRADIENTS.default;
  const networkIcon = card.cardNetwork === 'visa' ? 'VISA' : card.cardNetwork === 'mastercard' ? '●●' : 'AMEX';

  const handleFlip = () => {
    setIsBack(!isBack);
    Animated.timing(flipAnim, {
      toValue:  isBack ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    onFlip?.();
  };

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <TouchableOpacity onPress={handleFlip} activeOpacity={0.9} style={styles.cardWrapper}>
      {/* Front */}
      <Animated.View style={[styles.cardFace, { transform: [{ rotateY: frontInterpolate }] }]}>
        <LinearGradient colors={gradColors} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.cardCircle1} />
          <View style={styles.cardCircle2} />
          <View style={styles.cardHeader}>
            <Text style={styles.cardBrand}>OrbitPay</Text>
            <Text style={styles.cardNetwork}>{networkIcon}</Text>
          </View>
          <View style={styles.cardChip}>
            <View style={styles.chip} />
            {card.contactlessEnabled && <Text style={styles.contactless}>))))</Text>}
          </View>
          <Text style={styles.cardNumber}>{maskCardNumber(card.lastFourDigits)}</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardName}>{card.name}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardName}>{formatExpiry(card.expiryMonth, card.expiryYear)}</Text>
            </View>
          </View>
          {card.status === 'frozen' && (
            <View style={styles.frozenOverlay}>
              <Text style={styles.frozenText}>❄️ FROZEN</Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Back */}
      <Animated.View style={[styles.cardFace, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
        <LinearGradient colors={gradColors} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.magneticStripe} />
          <View style={styles.cvvArea}>
            <View style={styles.cvvStripe} />
            <View style={styles.cvvBox}>
              <Text style={styles.cvvLabel}>CVV</Text>
              <Text style={styles.cvvValue}>•••</Text>
            </View>
          </View>
          <Text style={styles.cardBackNote}>Tap front to flip back</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ---- Card Action Row ----------------------------------------
const CardActionRow: React.FC<{
  card: Card;
  onFreeze: () => void;
  onViewDetails: () => void;
}> = ({ card, onFreeze, onViewDetails }) => (
  <View style={styles.actionRow}>
    {[
      { icon: card.status === 'frozen' ? '🔓' : '❄️', label: card.status === 'frozen' ? 'Unfreeze' : 'Freeze',  onPress: onFreeze },
      { icon: '🔒', label: 'Set PIN',     onPress: () => {} },
      { icon: '📋', label: 'Limits',      onPress: () => {} },
      { icon: '📄', label: 'Details',     onPress: onViewDetails },
    ].map((action) => (
      <TouchableOpacity key={action.label} style={styles.actionBtn} onPress={action.onPress} activeOpacity={0.8}>
        <View style={styles.actionIconBg}>
          <Text style={styles.actionIcon}>{action.icon}</Text>
        </View>
        <Text style={styles.actionLabel}>{action.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ---- Cards Screen ------------------------------------------
const CardsScreen: React.FC<Props> = ({ navigation }) => {
  const { cards, setCards, updateCard, darkMode, user } = useAppStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await CardService.getCards();
        setCards(data);
      } catch {
        // Use store data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedCard = cards[selectedIdx];

  const handleFreezeToggle = async (card: Card) => {
    const action = card.status === 'frozen' ? 'unfreeze' : 'freeze';
    Alert.alert(
      `${action === 'freeze' ? 'Freeze' : 'Unfreeze'} Card`,
      `Are you sure you want to ${action} your ${card.name} card ending in ${card.lastFourDigits}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'freeze' ? 'Freeze Card' : 'Unfreeze Card',
          style: action === 'freeze' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              if (action === 'freeze') {
                await CardService.freezeCard(card.id);
                updateCard(card.id, { status: 'frozen' });
              } else {
                await CardService.unfreezeCard(card.id);
                updateCard(card.id, { status: 'active' });
              }
            } catch {
              // Demo: update local state only
              updateCard(card.id, { status: action === 'freeze' ? 'frozen' : 'active' });
            }
          },
        },
      ],
    );
  };

  const userCards = cards.filter((c) => c.userId === user?.id || !c.userId);

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.primary[700], COLORS.teal[600]]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Cards</Text>
        <TouchableOpacity style={styles.addCardBtn} onPress={() => navigation.navigate('AddCard')}>
          <Text style={styles.addCardBtnText}>+ Add Card</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardCarousel}
          snapToInterval={width - SPACING[10] * 2 + SPACING[4]}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / (width - SPACING[10] * 2 + SPACING[4]),
            );
            setSelectedIdx(Math.min(idx, userCards.length - 1));
          }}
        >
          {userCards.map((card) => (
            <View key={card.id} style={[styles.cardSlide, { width: width - SPACING[10] * 2 }]}>
              <CardVisual card={card} />
            </View>
          ))}
          {/* Add card placeholder */}
          <TouchableOpacity
            style={[styles.cardSlide, styles.addCardSlide, { width: width - SPACING[10] * 2 }]}
            onPress={() => navigation.navigate('AddCard')}
          >
            <Text style={styles.addCardPlusIcon}>＋</Text>
            <Text style={styles.addCardPlaceholderText}>Add New Card</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Card dots indicator */}
        <View style={styles.dotsRow}>
          {userCards.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === selectedIdx && styles.dotActive]}
            />
          ))}
        </View>

        {/* Card actions */}
        {selectedCard && (
          <>
            <CardActionRow
              card={selectedCard}
              onFreeze={() => handleFreezeToggle(selectedCard)}
              onViewDetails={() => navigation.navigate('CardDetail', { cardId: selectedCard.id })}
            />

            {/* Card stats */}
            <View style={styles.section}>
              <SectionHeader title="Card Details" darkMode={darkMode} />
              <GlassCard darkMode={darkMode}>
                {[
                  { label: 'Card Type',    value: `${selectedCard.type.charAt(0).toUpperCase()}${selectedCard.type.slice(1)} Card` },
                  { label: 'Network',      value: selectedCard.cardNetwork.toUpperCase() },
                  { label: 'Status',       value: selectedCard.status,       isStatus: true },
                  { label: 'Virtual',      value: selectedCard.isVirtual ? 'Yes' : 'No' },
                  { label: 'Daily Limit',  value: formatCurrency(selectedCard.dailyLimit) },
                  { label: 'Monthly Limit', value: formatCurrency(selectedCard.monthlyLimit) },
                  ...(selectedCard.creditLimit ? [
                    { label: 'Credit Limit',    value: formatCurrency(selectedCard.creditLimit) },
                    { label: 'Available Credit', value: formatCurrency(selectedCard.availableCredit ?? 0) },
                  ] : []),
                ].map((item, i, arr) => (
                  <View key={item.label} style={[styles.detailRow, i < arr.length - 1 && styles.detailRowBorder]}>
                    <Text style={[styles.detailKey, darkMode && { color: COLORS.gray[400] }]}>{item.label}</Text>
                    {item.isStatus ? (
                      <StatusBadge status={selectedCard.status} />
                    ) : (
                      <Text style={[styles.detailValue, darkMode && { color: COLORS.white }]}>{item.value}</Text>
                    )}
                  </View>
                ))}
              </GlassCard>
            </View>

            {/* Card controls */}
            <View style={styles.section}>
              <SectionHeader title="Card Controls" darkMode={darkMode} />
              <GlassCard darkMode={darkMode} style={{ gap: SPACING[4] }}>
                {[
                  { label: 'Contactless Payments', enabled: selectedCard.contactlessEnabled },
                  { label: 'International Transactions', enabled: selectedCard.internationalEnabled },
                  { label: 'Online Transactions', enabled: selectedCard.onlineEnabled },
                ].map((control) => (
                  <View key={control.label} style={styles.controlRow}>
                    <Text style={[styles.controlLabel, darkMode && { color: COLORS.white }]}>
                      {control.label}
                    </Text>
                    <View style={[styles.toggle, control.enabled ? styles.toggleOn : styles.toggleOff]}>
                      <View style={[styles.toggleThumb, control.enabled && styles.toggleThumbOn]} />
                    </View>
                  </View>
                ))}
              </GlassCard>
            </View>
          </>
        )}

        <View style={styles.bottomPad} />
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
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: FONT_SIZES['2xl'], fontWeight: '700', color: COLORS.white },
  addCardBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical:   SPACING[2],
    paddingHorizontal: SPACING[4],
    borderRadius:      RADIUS.full,
    borderWidth:       1,
    borderColor:       'rgba(255,255,255,0.3)',
  },
  addCardBtnText: { color: COLORS.white, fontSize: FONT_SIZES.sm, fontWeight: '600' },
  scrollContent:  { paddingTop: SPACING[5] },
  cardCarousel:   { paddingHorizontal: SPACING[5], gap: SPACING[4] },
  cardSlide:      { marginRight: SPACING[4] },
  cardWrapper: {
    width:  '100%',
    height: 200,
  },
  cardFace: {
    position: 'absolute',
    width:    '100%',
    height:   200,
    backfaceVisibility: 'hidden',
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
  },
  cardBack: { transform: [{ rotateY: '180deg' }] },
  cardGradient: {
    flex:            1,
    padding:         SPACING[5],
    justifyContent:  'space-between',
    borderRadius:    RADIUS['2xl'],
    overflow:        'hidden',
  },
  cardCircle1: {
    position:      'absolute',
    width:         220,
    height:        220,
    borderRadius:  110,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top:           -100,
    right:         -70,
  },
  cardCircle2: {
    position:      'absolute',
    width:         130,
    height:        130,
    borderRadius:  65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom:        -50,
    left:          -20,
  },
  cardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: {
    fontSize:   FONT_SIZES.base,
    fontWeight: '700',
    color:      COLORS.white,
    letterSpacing: 0.5,
  },
  cardNetwork: {
    fontSize:   FONT_SIZES.lg,
    color:      COLORS.white,
    fontWeight: '800',
    letterSpacing: -2,
  },
  cardChip:     { flexDirection: 'row', alignItems: 'center', gap: SPACING[3] },
  chip: {
    width:        38,
    height:       28,
    borderRadius: 4,
    backgroundColor: 'rgba(255,220,50,0.85)',
    borderWidth:  1,
    borderColor:  'rgba(255,200,0,0.5)',
  },
  contactless: { color: 'rgba(255,255,255,0.5)', fontSize: 16 },
  cardNumber: {
    fontSize:      FONT_SIZES.lg,
    color:         COLORS.white,
    letterSpacing: 2,
    fontFamily:    'Courier',
    fontWeight:    '600',
  },
  cardFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: {
    fontSize:      9,
    color:         'rgba(255,255,255,0.6)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardName: {
    fontSize:   FONT_SIZES.sm,
    color:      COLORS.white,
    fontWeight: '600',
    marginTop:  2,
  },
  frozenOverlay: {
    position:        'absolute',
    inset:           0,
    backgroundColor: 'rgba(30,58,138,0.75)',
    alignItems:      'center',
    justifyContent:  'center',
    borderRadius:    RADIUS['2xl'],
  },
  frozenText:  { color: COLORS.white, fontSize: FONT_SIZES.xl, fontWeight: '700' },
  magneticStripe: {
    height:          50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: -SPACING[5],
    marginTop:       SPACING[6],
  },
  cvvArea:   { flexDirection: 'row', alignItems: 'center', marginTop: SPACING[3] },
  cvvStripe: { flex: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 4 },
  cvvBox: {
    backgroundColor: COLORS.white,
    padding:         SPACING[2],
    borderRadius:    4,
    marginLeft:      SPACING[3],
    minWidth:        60,
    alignItems:      'center',
  },
  cvvLabel:     { fontSize: 9, color: COLORS.gray[500], letterSpacing: 1 },
  cvvValue:     { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.gray[800] },
  cardBackNote: { color: 'rgba(255,255,255,0.5)', fontSize: FONT_SIZES.xs, textAlign: 'center' },
  addCardSlide: {
    borderWidth:    2,
    borderColor:    COLORS.gray[300],
    borderStyle:    'dashed',
    borderRadius:   RADIUS['2xl'],
    height:         200,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            SPACING[3],
  },
  addCardPlusIcon: { fontSize: 40, color: COLORS.gray[400] },
  addCardPlaceholderText: { fontSize: FONT_SIZES.base, color: COLORS.gray[400], fontWeight: '500' },
  dotsRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    gap:            SPACING[2],
    marginTop:      SPACING[4],
    marginBottom:   SPACING[5],
  },
  dot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.gray[300] },
  dotActive: { backgroundColor: COLORS.primary[500], width: 20 },
  actionRow: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[5],
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING[5],
    borderRadius:   RADIUS.xl,
    ...SHADOWS.md,
    marginBottom:   SPACING[5],
  },
  actionBtn:   { alignItems: 'center', gap: SPACING[2] },
  actionIconBg: {
    width:          48,
    height:         48,
    borderRadius:   RADIUS.lg,
    backgroundColor: COLORS.primary[50],
    alignItems:     'center',
    justifyContent: 'center',
  },
  actionIcon:  { fontSize: 22 },
  actionLabel: { fontSize: FONT_SIZES.xs, color: COLORS.gray[600], fontWeight: '500' },
  section:     { paddingHorizontal: SPACING[5], marginBottom: SPACING[5] },
  detailRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: SPACING[3],
  },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  detailKey:   { fontSize: FONT_SIZES.base, color: COLORS.gray[500] },
  detailValue: { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.gray[800] },
  controlRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  controlLabel: { fontSize: FONT_SIZES.base, color: COLORS.gray[700], fontWeight: '500' },
  toggle: {
    width:         50,
    height:        28,
    borderRadius:  14,
    justifyContent: 'center',
    padding:        3,
  },
  toggleOn:    { backgroundColor: COLORS.primary[500] },
  toggleOff:   { backgroundColor: COLORS.gray[300] },
  toggleThumb: {
    width:  22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  toggleThumbOn: { alignSelf: 'flex-end' },
  bottomPad:   { height: 100 },
});

export default CardsScreen;
