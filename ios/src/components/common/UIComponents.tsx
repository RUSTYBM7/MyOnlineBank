// ============================================================
// OrbitPay - Shared UI Components
// ============================================================
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  TextInput, Platform, ViewStyle, TextStyle, Pressable,
  type TextInputProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS, FONT_SIZES } from '../../utils/constants';

// ---- GlassCard ---------------------------------------------
interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  darkMode?: boolean;
}
export const GlassCard: React.FC<GlassCardProps> = ({
  children, style, onPress, darkMode = false,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.glassCard,
        darkMode && styles.glassCardDark,
        SHADOWS.md,
        style,
      ]}
    >
      {children}
    </Container>
  );
};

// ---- GradientButton ----------------------------------------
interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}
export const GradientButton: React.FC<GradientButtonProps> = ({
  label, onPress, loading = false, disabled = false,
  style, labelStyle, colors, size = 'md', icon,
}) => {
  const btnColors = colors ?? [COLORS.primary[500], COLORS.teal[600]];
  const sizeStyle = {
    sm: { paddingVertical: SPACING[2], paddingHorizontal: SPACING[4] },
    md: { paddingVertical: SPACING[4], paddingHorizontal: SPACING[6] },
    lg: { paddingVertical: SPACING[5], paddingHorizontal: SPACING[8] },
  }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.buttonWrapper, style]}
    >
      <LinearGradient
        colors={disabled ? [COLORS.gray[300], COLORS.gray[400]] : btnColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientBtn, sizeStyle, SHADOWS.emerald]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <View style={styles.btnContent}>
            {icon}
            <Text style={[styles.btnLabel, icon ? { marginLeft: 8 } : undefined, labelStyle]}>
              {label}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

// ---- OutlineButton -----------------------------------------
interface OutlineButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
  disabled?: boolean;
}
export const OutlineButton: React.FC<OutlineButtonProps> = ({
  label, onPress, style, color = COLORS.primary[500], disabled = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
    style={[
      styles.outlineBtn,
      { borderColor: color },
      disabled && { opacity: 0.5 },
      style,
    ]}
  >
    <Text style={[styles.outlineBtnLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

// ---- InputField --------------------------------------------
interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  darkMode?: boolean;
}
export const InputField: React.FC<InputFieldProps> = ({
  label, error, containerStyle, rightElement, leftElement, darkMode, ...props
}) => (
  <View style={[styles.inputContainer, containerStyle]}>
    {label && (
      <Text style={[styles.inputLabel, darkMode && styles.inputLabelDark]}>
        {label}
      </Text>
    )}
    <View
      style={[
        styles.inputWrapper,
        darkMode && styles.inputWrapperDark,
        !!error && styles.inputWrapperError,
      ]}
    >
      {leftElement && <View style={styles.inputAddon}>{leftElement}</View>}
      <TextInput
        {...props}
        style={[styles.input, darkMode && styles.inputDark, props.style]}
        placeholderTextColor={darkMode ? COLORS.gray[500] : COLORS.gray[400]}
      />
      {rightElement && <View style={styles.inputAddon}>{rightElement}</View>}
    </View>
    {!!error && <Text style={styles.inputError}>{error}</Text>}
  </View>
);

// ---- Badge -------------------------------------------------
interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}
export const Badge: React.FC<BadgeProps> = ({
  label, color = COLORS.primary[100], textColor = COLORS.primary[700], size = 'md', style,
}) => (
  <View
    style={[
      styles.badge,
      { backgroundColor: color },
      size === 'sm' && { paddingVertical: 2, paddingHorizontal: 6 },
      style,
    ]}
  >
    <Text style={[styles.badgeText, { color: textColor }, size === 'sm' && { fontSize: 10 }]}>
      {label}
    </Text>
  </View>
);

// ---- StatusBadge -------------------------------------------
export const StatusBadge: React.FC<{ status: string; style?: ViewStyle }> = ({ status, style }) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active:    { bg: COLORS.primary[100], text: COLORS.primary[700], label: 'Active' },
    completed: { bg: COLORS.primary[100], text: COLORS.primary[700], label: 'Completed' },
    pending:   { bg: '#FEF3C7',           text: '#D97706',           label: 'Pending' },
    failed:    { bg: '#FEE2E2',           text: COLORS.error,        label: 'Failed' },
    frozen:    { bg: '#DBEAFE',           text: '#2563EB',           label: 'Frozen' },
    suspended: { bg: '#FEF3C7',           text: '#D97706',           label: 'Suspended' },
    flagged:   { bg: '#FEE2E2',           text: COLORS.error,        label: 'Flagged' },
    verified:  { bg: COLORS.primary[100], text: COLORS.primary[700], label: 'Verified' },
    rejected:  { bg: '#FEE2E2',           text: COLORS.error,        label: 'Rejected' },
  };
  const config = map[status] ?? { bg: COLORS.gray[100], text: COLORS.gray[600], label: status };
  return <Badge label={config.label} color={config.bg} textColor={config.text} size="sm" style={style} />;
};

// ---- SectionHeader -----------------------------------------
interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  darkMode?: boolean;
}
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title, actionLabel, onAction, darkMode,
}) => (
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ---- Divider -----------------------------------------------
export const Divider: React.FC<{ style?: ViewStyle; color?: string }> = ({ style, color }) => (
  <View style={[styles.divider, color ? { backgroundColor: color } : undefined, style]} />
);

// ---- EmptyState --------------------------------------------
interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: { label: string; onPress: () => void };
}
export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon, action }) => (
  <View style={styles.emptyState}>
    {icon}
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyMessage}>{message}</Text>
    {action && (
      <GradientButton label={action.label} onPress={action.onPress} style={{ marginTop: SPACING[4] }} />
    )}
  </View>
);

// ---- LoadingSpinner ----------------------------------------
export const LoadingSpinner: React.FC<{ size?: 'small' | 'large'; color?: string }> = ({
  size = 'large', color = COLORS.primary[500],
}) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

// ---- Skeleton Placeholder ----------------------------------
export const SkeletonBox: React.FC<{ width?: number | string; height?: number; style?: ViewStyle }> = ({
  width = '100%', height = 16, style,
}) => (
  <View
    style={[
      styles.skeleton,
      { width: width as number, height },
      style,
    ]}
  />
);

// ---- QuickActionButton -------------------------------------
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  color?: string;
}
export const QuickActionButton: React.FC<QuickActionProps> = ({
  icon, label, onPress, color = COLORS.primary[500],
}) => (
  <TouchableOpacity onPress={onPress} style={styles.quickAction} activeOpacity={0.8}>
    <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
      {icon}
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

// ---- Pill Tabs ---------------------------------------------
interface PillTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  style?: ViewStyle;
}
export const PillTabs: React.FC<PillTabsProps> = ({ tabs, activeTab, onTabChange, style }) => (
  <View style={[styles.pillTabs, style]}>
    {tabs.map((tab) => (
      <Pressable
        key={tab}
        onPress={() => onTabChange(tab)}
        style={[styles.pillTab, activeTab === tab && styles.pillTabActive]}
      >
        <Text style={[styles.pillTabText, activeTab === tab && styles.pillTabTextActive]}>
          {tab}
        </Text>
      </Pressable>
    ))}
  </View>
);

// ---- Styles ------------------------------------------------
const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: COLORS.glassBg,
    borderRadius:    RADIUS.xl,
    borderWidth:     1,
    borderColor:     COLORS.glassBorder,
    padding:         SPACING[4],
    overflow:        'hidden',
  },
  glassCardDark: {
    backgroundColor: COLORS.glassBgDark,
    borderColor:     COLORS.glassBorderDark,
  },
  buttonWrapper: { borderRadius: RADIUS.xl, overflow: 'hidden' },
  gradientBtn: {
    borderRadius:    RADIUS.xl,
    alignItems:      'center',
    justifyContent:  'center',
    flexDirection:   'row',
  },
  btnContent:     { flexDirection: 'row', alignItems: 'center' },
  btnLabel: {
    color:      COLORS.white,
    fontSize:   FONT_SIZES.md,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  outlineBtn: {
    borderWidth:    1.5,
    borderRadius:   RADIUS.xl,
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[6],
    alignItems:     'center',
    justifyContent: 'center',
  },
  outlineBtnLabel: { fontSize: FONT_SIZES.md, fontWeight: '600' },
  inputContainer:  { marginBottom: SPACING[4] },
  inputLabel: {
    fontSize:     FONT_SIZES.sm,
    fontWeight:   '500',
    color:        COLORS.gray[700],
    marginBottom: SPACING[1],
  },
  inputLabelDark: { color: COLORS.gray[300] },
  inputWrapper: {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor: COLORS.white,
    borderRadius:   RADIUS.lg,
    borderWidth:    1,
    borderColor:    COLORS.gray[200],
    paddingHorizontal: SPACING[4],
    minHeight:      50,
  },
  inputWrapperDark: {
    backgroundColor: COLORS.gray[800],
    borderColor:     COLORS.gray[700],
  },
  inputWrapperError: { borderColor: COLORS.error },
  input: {
    flex:      1,
    fontSize:  FONT_SIZES.base,
    color:     COLORS.gray[900],
    paddingVertical: Platform.OS === 'ios' ? SPACING[3] : SPACING[2],
  },
  inputDark: { color: COLORS.white },
  inputAddon: { marginRight: SPACING[2] },
  inputError: {
    fontSize:   FONT_SIZES.xs,
    color:      COLORS.error,
    marginTop:  SPACING[1],
  },
  badge: {
    paddingVertical:   4,
    paddingHorizontal: 10,
    borderRadius:      RADIUS.full,
  },
  badgeText: { fontSize: FONT_SIZES.xs, fontWeight: '600' },
  sectionHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING[3],
  },
  sectionTitle: {
    fontSize:   FONT_SIZES.lg,
    fontWeight: '700',
    color:      COLORS.gray[900],
  },
  sectionTitleDark: { color: COLORS.white },
  sectionAction: {
    fontSize:   FONT_SIZES.sm,
    fontWeight: '600',
    color:      COLORS.primary[600],
  },
  divider: {
    height:          1,
    backgroundColor: COLORS.gray[100],
    marginVertical:  SPACING[2],
  },
  emptyState: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: SPACING[12],
    paddingHorizontal: SPACING[8],
  },
  emptyTitle: {
    fontSize:   FONT_SIZES.xl,
    fontWeight: '700',
    color:      COLORS.gray[800],
    marginTop:  SPACING[4],
    textAlign:  'center',
  },
  emptyMessage: {
    fontSize:  FONT_SIZES.base,
    color:     COLORS.gray[500],
    marginTop: SPACING[2],
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  skeleton: {
    backgroundColor: COLORS.gray[200],
    borderRadius:    RADIUS.sm,
  },
  quickAction: { alignItems: 'center', gap: SPACING[2] },
  quickActionIcon: {
    width:          52,
    height:         52,
    borderRadius:   RADIUS.lg,
    alignItems:     'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize:   FONT_SIZES.xs,
    fontWeight: '500',
    color:      COLORS.gray[700],
    textAlign:  'center',
  },
  pillTabs: {
    flexDirection:   'row',
    backgroundColor: COLORS.gray[100],
    borderRadius:    RADIUS.full,
    padding:         4,
  },
  pillTab: {
    flex:            1,
    paddingVertical: SPACING[2],
    alignItems:      'center',
    borderRadius:    RADIUS.full,
  },
  pillTabActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  pillTabText: {
    fontSize:   FONT_SIZES.sm,
    fontWeight: '500',
    color:      COLORS.gray[500],
  },
  pillTabTextActive: {
    color:      COLORS.primary[600],
    fontWeight: '600',
  },
});
