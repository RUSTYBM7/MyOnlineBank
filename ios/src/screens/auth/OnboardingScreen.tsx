// ============================================================
// OrbitPay - Onboarding Screen
// ============================================================
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, RADIUS, SPACING, FONT_SIZES } from '../../utils/constants';
import { AppStorage } from '../../utils/secureStorage';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const SLIDES = [
  {
    id:    '1',
    icon:  '🏦',
    title: 'Banking Made Simple',
    desc:  'Manage all your accounts, transfers, and payments in one beautifully designed app.',
    gradient: [COLORS.primary[700], COLORS.teal[600]] as [string, string],
  },
  {
    id:    '2',
    icon:  '🔒',
    title: 'Bank-Grade Security',
    desc:  'Your money is protected with Face ID, Touch ID, and end-to-end encryption.',
    gradient: [COLORS.teal[700], '#0891B2'] as [string, string],
  },
  {
    id:    '3',
    icon:  '💸',
    title: 'Instant Transfers',
    desc:  'Send money globally in seconds. Real-time exchange rates. Zero hidden fees.',
    gradient: ['#0891B2', COLORS.primary[600]] as [string, string],
  },
  {
    id:    '4',
    icon:  '📊',
    title: 'Smart Insights',
    desc:  'AI-powered spending analytics help you save more and reach your financial goals.',
    gradient: [COLORS.primary[600], '#7C3AED'] as [string, string],
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await AppStorage.setOnboardingComplete();
    navigation.replace('Login');
  };

  const handleSkip = async () => {
    await AppStorage.setOnboardingComplete();
    navigation.replace('Login');
  };

  const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slide}>
      <View style={styles.iconWrapper}>
        <Text style={styles.slideIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDesc}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient that animates between slides */}
      <LinearGradient
        colors={SLIDES[currentIndex].gradient}
        style={StyleSheet.absoluteFill}
      />

      {/* Skip button */}
      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Logo */}
      <View style={styles.logoRow}>
        <Text style={styles.logoText}>OrbitPay</Text>
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setCurrentIndex(idx);
        }}
        style={styles.flatList}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      {/* CTA Button */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity style={styles.ctaBtn} onPress={goNext} activeOpacity={0.9}>
          <Text style={styles.ctaBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>

        {currentIndex === SLIDES.length - 1 && (
          <TouchableOpacity style={styles.loginLink} onPress={handleFinish}>
            <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text></Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FDIC notice */}
      <Text style={styles.fdic}>FDIC Insured · Member NCUA · Equal Housing Lender</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1 },
  skipBtn: {
    position:  'absolute',
    top:       56,
    right:     SPACING[5],
    zIndex:    10,
    paddingVertical:   SPACING[2],
    paddingHorizontal: SPACING[3],
  },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZES.sm, fontWeight: '500' },
  logoRow: {
    alignItems:  'center',
    marginTop:   64,
    paddingTop:  SPACING[2],
  },
  logoText: {
    fontSize:   FONT_SIZES['2xl'],
    fontWeight: '800',
    color:      COLORS.white,
    letterSpacing: -0.5,
  },
  flatList: { flex: 1, marginTop: SPACING[6] },
  slide: {
    width:         SCREEN_W,
    alignItems:    'center',
    paddingHorizontal: SPACING[8],
    justifyContent: 'center',
  },
  iconWrapper: {
    width:           120,
    height:          120,
    borderRadius:    60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    SPACING[8],
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.35)',
  },
  slideIcon:  { fontSize: 56 },
  slideTitle: {
    fontSize:   FONT_SIZES['3xl'],
    fontWeight: '800',
    color:      COLORS.white,
    textAlign:  'center',
    marginBottom: SPACING[4],
    lineHeight:  38,
  },
  slideDesc: {
    fontSize:   FONT_SIZES.base,
    color:      'rgba(255,255,255,0.8)',
    textAlign:  'center',
    lineHeight: 26,
  },
  pagination: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    gap:            SPACING[2],
    marginVertical: SPACING[6],
  },
  dot: {
    height:       8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  ctaWrapper: {
    paddingHorizontal: SPACING[5],
    marginBottom:      SPACING[4],
    gap:               SPACING[3],
  },
  ctaBtn: {
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.full,
    paddingVertical: SPACING[4],
    alignItems:      'center',
  },
  ctaBtnText: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.primary[600] },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.75)' },
  loginLinkBold: { fontWeight: '700', color: COLORS.white },
  fdic: {
    fontSize:  FONT_SIZES.xs,
    color:     'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: SPACING[8],
  },
});

export default OnboardingScreen;
