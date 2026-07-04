// ============================================================
// OrbitPay - Splash Screen
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const logoScale  = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const ring1Scale = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      // Rings expand
      Animated.stagger(150, [
        Animated.spring(ring1Scale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.spring(ring2Scale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      ]),
      // Text fades in
      Animated.stagger(200, [
        Animated.timing(titleOpacity,    { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // Hold for 1s
      Animated.delay(1200),
      // Fade out
      Animated.parallel([
        Animated.timing(logoOpacity,     { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(titleOpacity,    { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start(() => onAnimationComplete());
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.primary[800], COLORS.teal[700], COLORS.cyan[600]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background pattern */}
      <View style={styles.patternContainer}>
        {[...Array(12)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternDot,
              {
                top:  (Math.floor(i / 4)) * (height / 3) + 60,
                left: (i % 4) * (width / 4) + 20,
              },
            ]}
          />
        ))}
      </View>

      {/* Animated rings around logo */}
      <View style={styles.logoArea}>
        <Animated.View
          style={[
            styles.ring,
            styles.ring2,
            { transform: [{ scale: ring2Scale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring1,
            { transform: [{ scale: ring1Scale }] },
          ]}
        />

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity:   logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.logoEmoji}>🌐</Text>
        </Animated.View>
      </View>

      {/* App name & tagline */}
      <View style={styles.textArea}>
        <Animated.Text style={[styles.appName, { opacity: titleOpacity }]}>
          OrbitPay
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
          Credit Union Banking
        </Animated.Text>
      </View>

      {/* FDIC badge */}
      <Animated.View style={[styles.badge, { opacity: subtitleOpacity }]}>
        <Text style={styles.badgeText}>FDIC Insured · 256-bit Encryption</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
  },
  patternContainer: { position: 'absolute', width, height },
  patternDot: {
    position:        'absolute',
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  logoArea: {
    alignItems:     'center',
    justifyContent: 'center',
    width:          200,
    height:         200,
  },
  ring: {
    position:        'absolute',
    borderRadius:    9999,
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.15)',
  },
  ring1: { width: 130, height: 130 },
  ring2: { width: 175, height: 175 },
  logoContainer: {
    width:           90,
    height:          90,
    borderRadius:    45,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.35)',
  },
  logoEmoji: { fontSize: 44 },
  textArea: { alignItems: 'center', marginTop: SPACING[6] },
  appName: {
    fontSize:      FONT_SIZES['4xl'],
    fontWeight:    '800',
    color:         COLORS.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize:      FONT_SIZES.base,
    color:         'rgba(255,255,255,0.75)',
    marginTop:     SPACING[1],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  badge: {
    position:     'absolute',
    bottom:       60,
    paddingVertical:   SPACING[2],
    paddingHorizontal: SPACING[5],
    borderRadius:      RADIUS_FULL,
    backgroundColor:   'rgba(255,255,255,0.15)',
    borderWidth:       1,
    borderColor:       'rgba(255,255,255,0.25)',
  },
  badgeText: {
    color:     'rgba(255,255,255,0.8)',
    fontSize:  FONT_SIZES.xs,
    fontWeight: '500',
  },
});

const RADIUS_FULL = 9999;
export default SplashScreen;
