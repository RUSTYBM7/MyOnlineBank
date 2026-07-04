// ============================================================
// OrbitPay - KYC Verification Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../utils/constants';
import { GlassCard, GradientButton, StatusBadge } from '../../components/common/UIComponents';
import { KycService } from '../../services/apiServices';
import { useAppStore } from '../../store';
import type { RootStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'KycVerification'>;
  route: RouteProp<RootStackParamList, 'KycVerification'>;
};

const STEPS = [
  { id: 'identity',  title: 'Identity Document', desc: 'Upload government-issued ID, passport, or driver\'s license', icon: '🪪', docType: 'id_card' },
  { id: 'selfie',    title: 'Selfie Verification', desc: 'Take a selfie to match with your ID document', icon: '🤳', docType: 'selfie' },
  { id: 'address',   title: 'Proof of Address', desc: 'Upload utility bill, bank statement, or lease agreement', icon: '🏠', docType: 'address_proof' },
];

interface StepStatus {
  id: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'verified' | 'failed';
  fileUri?: string;
  fileName?: string;
}

const KycScreen: React.FC<Props> = ({ navigation }) => {
  const { user, kycDocuments, darkMode } = useAppStore();
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateStep = (id: string, updates: Partial<StepStatus>) => {
    setStepStatuses(prev => ({ ...prev, [id]: { ...prev[id], id, status: 'pending', ...updates } }));
  };

  const pickDocument = async (step: typeof STEPS[0]) => {
    const result = await launchImageLibrary({
      mediaType:  'mixed',
      quality:    0.8,
      selectionLimit: 1,
    });

    if (result.didCancel || !result.assets?.length) return;
    const asset = result.assets[0];
    updateStep(step.id, { status: 'uploading', fileUri: asset.uri, fileName: asset.fileName });

    try {
      await KycService.uploadDocument(
        step.docType,
        asset.uri!,
        asset.type ?? 'image/jpeg',
      );
      updateStep(step.id, { status: 'uploaded' });
    } catch {
      // Demo mode — mark as uploaded anyway
      updateStep(step.id, { status: 'uploaded' });
    }
  };

  const handleSubmit = async () => {
    const uploaded = Object.values(stepStatuses).filter(s => s.status === 'uploaded' || s.status === 'verified');
    if (uploaded.length < STEPS.length) {
      Alert.alert('Incomplete', 'Please upload all required documents before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate API call
      Alert.alert(
        'Submitted!',
        'Your documents have been submitted for review. We\'ll notify you within 24 hours.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } finally {
      setSubmitting(false);
    }
  };

  const allUploaded = STEPS.every(s => {
    const st = stepStatuses[s.id];
    return st && (st.status === 'uploaded' || st.status === 'verified');
  });

  const kycStatus = user?.kycStatus ?? 'not_submitted';

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
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status banner */}
        <GlassCard darkMode={darkMode} style={styles.statusBanner}>
          <View style={styles.statusBannerRow}>
            <Text style={styles.statusBannerIcon}>
              {kycStatus === 'verified' ? '✅' : kycStatus === 'pending' ? '⏳' : kycStatus === 'rejected' ? '❌' : '⚠️'}
            </Text>
            <View style={styles.statusBannerText}>
              <Text style={[styles.statusBannerTitle, darkMode && { color: COLORS.white }]}>
                {kycStatus === 'verified' ? 'Identity Verified' :
                 kycStatus === 'pending' ? 'Under Review' :
                 kycStatus === 'rejected' ? 'Verification Failed' :
                 'Verification Required'}
              </Text>
              <Text style={styles.statusBannerDesc}>
                {kycStatus === 'verified' ? 'Your account is fully verified and all features are unlocked.' :
                 kycStatus === 'pending' ? 'We are reviewing your documents. This typically takes 24 hours.' :
                 kycStatus === 'rejected' ? 'Your documents were rejected. Please re-upload with clearer images.' :
                 'Complete identity verification to unlock transfers and higher limits.'}
              </Text>
            </View>
            <StatusBadge status={kycStatus} />
          </View>
        </GlassCard>

        {/* Benefits */}
        {kycStatus !== 'verified' && (
          <GlassCard darkMode={darkMode} style={styles.benefitsCard}>
            <Text style={[styles.benefitsTitle, darkMode && { color: COLORS.white }]}>Why verify?</Text>
            {[
              { icon: '💸', text: 'Send up to $50,000/day' },
              { icon: '🌍', text: 'International wire transfers' },
              { icon: '📈', text: 'Investment features' },
              { icon: '🔐', text: 'Enhanced account security' },
            ].map((b) => (
              <View key={b.text} style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>{b.icon}</Text>
                <Text style={[styles.benefitText, darkMode && { color: COLORS.gray[300] }]}>{b.text}</Text>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Steps */}
        <Text style={[styles.stepsTitle, darkMode && { color: COLORS.white }]}>Required Documents</Text>
        {STEPS.map((step, idx) => {
          const stepSt = stepStatuses[step.id];
          const isUploaded = stepSt?.status === 'uploaded' || stepSt?.status === 'verified';
          const isUploading = stepSt?.status === 'uploading';

          return (
            <GlassCard key={step.id} darkMode={darkMode} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={[
                  styles.stepNumber,
                  isUploaded ? styles.stepNumberDone : undefined,
                ]}>
                  <Text style={styles.stepNumberText}>{isUploaded ? '✓' : String(idx + 1)}</Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepTitle, darkMode && { color: COLORS.white }]}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>

              {stepSt?.fileUri && (
                <View style={styles.filePreview}>
                  <Text style={styles.filePreviewIcon}>📎</Text>
                  <Text style={styles.filePreviewName} numberOfLines={1}>
                    {stepSt.fileName ?? 'Document uploaded'}
                  </Text>
                  <StatusBadge status={isUploaded ? 'active' : 'pending'} />
                </View>
              )}

              <TouchableOpacity
                onPress={() => pickDocument(step)}
                disabled={isUploading || kycStatus === 'verified'}
                style={[
                  styles.uploadBtn,
                  isUploaded ? styles.uploadBtnDone : undefined,
                  darkMode && styles.uploadBtnDark,
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.uploadBtnText, isUploaded && { color: COLORS.primary[700] }]}>
                  {isUploading ? '⏳ Uploading...' :
                   isUploaded ? '✓ Uploaded — Tap to replace' :
                   `📤 Upload ${step.title}`}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          );
        })}

        {/* Tips */}
        <GlassCard darkMode={darkMode} style={styles.tipsCard}>
          <Text style={[styles.tipsTitle, darkMode && { color: COLORS.white }]}>📋 Tips for Success</Text>
          {[
            'Ensure documents are clear and not blurry',
            'All four corners must be visible',
            'Use good lighting and avoid glare',
            'Documents must be valid and not expired',
            'Selfie must clearly show your face',
          ].map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, darkMode && { color: COLORS.gray[300] }]}>{tip}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Submit */}
        {kycStatus !== 'verified' && (
          <GradientButton
            label={submitting ? 'Submitting...' : 'Submit for Review'}
            onPress={handleSubmit}
            loading={submitting}
            disabled={!allUploaded}
            style={{ marginTop: SPACING[4] }}
          />
        )}

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
  scrollContent: { padding: SPACING[5] },
  statusBanner:  { marginBottom: SPACING[4] },
  statusBannerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING[3] },
  statusBannerIcon: { fontSize: 28 },
  statusBannerText: { flex: 1 },
  statusBannerTitle: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.gray[800] },
  statusBannerDesc: { fontSize: FONT_SIZES.sm, color: COLORS.gray[500], marginTop: 4, lineHeight: 20 },
  benefitsCard: { marginBottom: SPACING[5] },
  benefitsTitle: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.gray[800], marginBottom: SPACING[3] },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING[3], marginBottom: SPACING[2] },
  benefitIcon:  { fontSize: 20 },
  benefitText:  { fontSize: FONT_SIZES.base, color: COLORS.gray[700] },
  stepsTitle: {
    fontSize:     FONT_SIZES.lg,
    fontWeight:   '700',
    color:        COLORS.gray[900],
    marginBottom: SPACING[3],
  },
  stepCard:    { marginBottom: SPACING[3] },
  stepHeader:  { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING[3], marginBottom: SPACING[4] },
  stepNumber: {
    width:          32,
    height:         32,
    borderRadius:   16,
    backgroundColor: COLORS.gray[200],
    alignItems:     'center',
    justifyContent: 'center',
  },
  stepNumberDone: { backgroundColor: COLORS.primary[500] },
  stepNumberText: { fontSize: FONT_SIZES.sm, fontWeight: '700', color: COLORS.white },
  stepInfo:    { flex: 1 },
  stepTitle: { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.gray[800] },
  stepDesc:  { fontSize: FONT_SIZES.xs, color: COLORS.gray[500], marginTop: 2, lineHeight: 18 },
  stepIcon:  { fontSize: 28 },
  filePreview: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING[2],
    backgroundColor: COLORS.primary[50],
    borderRadius:   RADIUS.md,
    padding:        SPACING[3],
    marginBottom:   SPACING[3],
  },
  filePreviewIcon: { fontSize: 18 },
  filePreviewName: { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.gray[700] },
  uploadBtn: {
    borderWidth:     1.5,
    borderColor:     COLORS.primary[300],
    borderStyle:     'dashed',
    borderRadius:    RADIUS.lg,
    paddingVertical: SPACING[3],
    alignItems:      'center',
    backgroundColor: COLORS.primary[50],
  },
  uploadBtnDone: { borderStyle: 'solid', backgroundColor: COLORS.primary[100], borderColor: COLORS.primary[500] },
  uploadBtnDark: { backgroundColor: COLORS.gray[700], borderColor: COLORS.primary[600] },
  uploadBtnText: { fontSize: FONT_SIZES.base, color: COLORS.primary[600], fontWeight: '500' },
  tipsCard:    { marginTop: SPACING[4] },
  tipsTitle:   { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.gray[800], marginBottom: SPACING[3] },
  tipRow:      { flexDirection: 'row', gap: SPACING[2], marginBottom: SPACING[1] },
  tipBullet:   { fontSize: FONT_SIZES.base, color: COLORS.primary[500], fontWeight: '700' },
  tipText:     { flex: 1, fontSize: FONT_SIZES.sm, color: COLORS.gray[600], lineHeight: 20 },
});

export default KycScreen;
