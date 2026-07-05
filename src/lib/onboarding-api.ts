// OrbitPay — Onboarding API client + validation
// STUB: Returns local validation results. In production, wire each
// function to Supabase or a backend microservice.

import { getSupabase, isSupabaseConfigured } from './supabase';

// ----- Types -----------------------------------------------------------------

export type AccountType = 'savings' | 'checking' | 'student' | 'business' | 'joint' | 'youth' | 'premium' | 'retirement';

export interface OnboardingData {
  accountType: AccountType;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;          // YYYY-MM-DD
    ssn: string;                  // already masked before storage
    citizenship: string;
  };
  contact: {
    email: string;
    phone: string;                // E.164
    preferredChannel: 'email' | 'sms' | 'push';
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  idVerification: {
    documentType: 'passport' | 'drivers_license' | 'national_id' | 'state_id';
    documentNumber: string;
    expiryDate: string;           // YYYY-MM-DD
    selfieDataUrl?: string;       // base64 selfie
    documentFrontUrl?: string;
    documentBackUrl?: string;
  };
  business?: {
    legalName: string;
    ein: string;
    entityType: 'llc' | 'corp' | 'partnership' | 'sole_prop' | 'nonprofit';
    industry: string;
    annualRevenue?: number;
  };
  jointPartner?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    relationship: 'spouse' | 'partner' | 'family' | 'business';
  };
  consent: {
    terms: boolean;
    privacy: boolean;
    eSign: boolean;
    creditCheck: boolean;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// ----- Validation helpers ----------------------------------------------------

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Invalid email format';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone is required';
  if (!/^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) return 'Invalid phone format (use E.164)';
  return null;
};

export const validateDateOfBirth = (dob: string): string | null => {
  if (!dob) return 'Date of birth is required';
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 'Invalid date';
  const ageYears = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (ageYears < 13) return 'Must be at least 13 years old';
  if (ageYears > 130) return 'Invalid date of birth';
  return null;
};

export const validateSSN = (ssn: string): string | null => {
  const cleaned = ssn.replace(/\D/g, '');
  if (!cleaned) return 'SSN is required';
  if (cleaned.length !== 9) return 'SSN must be 9 digits';
  if (/^000|^666|^\d{3}00/.test(cleaned)) return 'Invalid SSN';
  return null;
};

export const validateAddress = (a: OnboardingData['address']): string | null => {
  if (!a.line1) return 'Street address required';
  if (!a.city) return 'City required';
  if (!a.state) return 'State required';
  if (!a.country) return 'Country required';
  return null;
};

export const validateZipCode = (zip: string): string | null => {
  if (!zip) return 'ZIP code required';
  if (!/^\d{5}(-\d{4})?$/.test(zip)) return 'Invalid US ZIP code';
  return null;
};

const makeValidator = (checks: Array<[string, (v: any) => string | null]>) =>
  (data: any): ValidationResult => {
    const errors: Record<string, string> = {};
    for (const [field, fn] of checks) {
      const value = field.split('.').reduce((o, k) => o?.[k], data);
      const err = fn(value);
      if (err) errors[field] = err;
    }
    return { valid: Object.keys(errors).length === 0, errors };
  };

export const validateStepWelcome = makeValidator([]);

export const validateStepPersonalInfo = (d: OnboardingData): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!d.personalInfo.firstName) errors['personalInfo.firstName'] = 'First name required';
  if (!d.personalInfo.lastName) errors['personalInfo.lastName'] = 'Last name required';
  const dob = validateDateOfBirth(d.personalInfo.dateOfBirth);
  if (dob) errors['personalInfo.dateOfBirth'] = dob;
  const ssn = validateSSN(d.personalInfo.ssn);
  if (ssn) errors['personalInfo.ssn'] = ssn;
  if (!d.personalInfo.citizenship) errors['personalInfo.citizenship'] = 'Citizenship required';
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateStepContact = (d: OnboardingData): ValidationResult => {
  const errors: Record<string, string> = {};
  const e = validateEmail(d.contact.email);
  if (e) errors['contact.email'] = e;
  const p = validatePhone(d.contact.phone);
  if (p) errors['contact.phone'] = p;
  if (!d.contact.preferredChannel) errors['contact.preferredChannel'] = 'Choose a contact method';
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateStepAddress = (d: OnboardingData): ValidationResult => {
  const errors: Record<string, string> = {};
  const a = validateAddress(d.address);
  if (a) errors['address'] = a;
  const z = validateZipCode(d.address.zip);
  if (z) errors['address.zip'] = z;
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateStepIDVerification = (d: OnboardingData): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!d.idVerification.documentType) errors['idVerification.documentType'] = 'Choose ID type';
  if (!d.idVerification.documentNumber) errors['idVerification.documentNumber'] = 'ID number required';
  if (!d.idVerification.expiryDate) errors['idVerification.expiryDate'] = 'Expiry required';
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateStepBusiness = (d: OnboardingData): ValidationResult => {
  if (!d.business) return { valid: true, errors: {} };
  const errors: Record<string, string> = {};
  if (!d.business.legalName) errors['business.legalName'] = 'Business name required';
  if (!d.business.ein || d.business.ein.length !== 9) errors['business.ein'] = 'Valid 9-digit EIN required';
  if (!d.business.entityType) errors['business.entityType'] = 'Choose entity type';
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateStepJointPartner = (d: OnboardingData): ValidationResult => {
  if (!d.jointPartner) return { valid: true, errors: {} };
  const errors: Record<string, string> = {};
  if (!d.jointPartner.firstName) errors['jointPartner.firstName'] = 'First name required';
  if (!d.jointPartner.lastName) errors['jointPartner.lastName'] = 'Last name required';
  const dob = validateDateOfBirth(d.jointPartner.dateOfBirth);
  if (dob) errors['jointPartner.dateOfBirth'] = dob;
  const ssn = validateSSN(d.jointPartner.ssn);
  if (ssn) errors['jointPartner.ssn'] = ssn;
  return { valid: Object.keys(errors).length === 0, errors };
};

// ----- Masking helpers -------------------------------------------------------

export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  const [u, d] = email.split('@');
  const visible = u.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(u.length - 2, 1))}@${d}`;
};

export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  return `***-***-${cleaned.slice(-4)}`;
};

export const formatPhoneNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// ----- API client ------------------------------------------------------------

export const onboardingAPI = {
  async createApplication(data: OnboardingData): Promise<{ id: string; status: string }> {
    if (!isSupabaseConfigured) {
      // Local stub: return a synthetic id.
      return { id: 'app_' + Date.now(), status: 'draft' };
    }
    const supabase = getSupabase();
    const { data: result, error } = await supabase
      .from('onboarding_applications')
      .insert({
        account_type: data.accountType,
        personal_info: data.personalInfo,
        contact: data.contact,
        address: data.address,
        id_verification: data.idVerification,
        business: data.business,
        joint_partner: data.jointPartner,
        consent: data.consent,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select('id, status')
      .single();
    if (error) throw new Error(error.message);
    return result;
  },

  async uploadIDDocument(file: File, applicationId: string): Promise<string> {
    if (!isSupabaseConfigured) {
      return `local://${applicationId}/${file.name}`;
    }
    const supabase = getSupabase();
    const path = `onboarding/${applicationId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('id-documents').upload(path, file);
    if (error) throw new Error(error.message);
    return path;
  },

  async checkApplicationStatus(applicationId: string): Promise<{ status: string; kycRequired: boolean }> {
    if (!isSupabaseConfigured) {
      return { status: 'pending', kycRequired: true };
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('onboarding_applications')
      .select('status, kyc_required')
      .eq('id', applicationId)
      .single();
    if (error) throw new Error(error.message);
    return { status: data?.status ?? 'pending', kycRequired: data?.kyc_required ?? true };
  },

  async submitForReview(applicationId: string): Promise<{ status: string }> {
    if (!isSupabaseConfigured) {
      return { status: 'review' };
    }
    const supabase = getSupabase();
    const { error } = await supabase
      .from('onboarding_applications')
      .update({ status: 'review', submitted_at: new Date().toISOString() })
      .eq('id', applicationId);
    if (error) throw new Error(error.message);
    return { status: 'review' };
  },
};

// ----- Account type catalog --------------------------------------------------

export interface AccountTypeConfig {
  id: AccountType;
  name: string;
  description: string;
  minDeposit: number;
  minAge: number;
  monthlyFee: number;
  apyRange: [number, number];
  icon: string;
  features: string[];
}

export const accountTypeConfigs: Record<AccountType, AccountTypeConfig> = {
  savings: {
    id: 'savings',
    name: 'Premier Savings',
    description: 'High-yield savings with up to 5.25% APY',
    minDeposit: 100,
    minAge: 18,
    monthlyFee: 0,
    apyRange: [4.5, 5.25],
    icon: 'PiggyBank',
    features: ['FDIC insured', 'No minimum balance', 'Free transfers', 'Mobile deposits'],
  },
  checking: {
    id: 'checking',
    name: 'Smart Checking',
    description: 'Everyday banking with zero hidden fees',
    minDeposit: 25,
    minAge: 18,
    monthlyFee: 0,
    apyRange: [0.05, 0.5],
    icon: 'Wallet',
    features: ['No monthly fees', 'Free ATM withdrawals', 'Debit card', 'Bill pay'],
  },
  student: {
    id: 'student',
    name: 'Student Account',
    description: 'Built for students ages 13-24',
    minDeposit: 0,
    minAge: 13,
    monthlyFee: 0,
    apyRange: [2.0, 3.0],
    icon: 'GraduationCap',
    features: ['No minimum balance', 'No monthly fees', 'Free financial education', 'Student discounts'],
  },
  business: {
    id: 'business',
    name: 'Business Banking',
    description: 'For LLCs, corps, and sole proprietors',
    minDeposit: 500,
    minAge: 18,
    monthlyFee: 15,
    apyRange: [1.0, 2.5],
    icon: 'Briefcase',
    features: ['Multi-user access', 'ACH & wire transfers', 'Tax tools', 'Merchant services'],
  },
  joint: {
    id: 'joint',
    name: 'Joint Account',
    description: 'Shared account for two people',
    minDeposit: 100,
    minAge: 18,
    monthlyFee: 0,
    apyRange: [4.0, 5.0],
    icon: 'Users',
    features: ['Two equal owners', 'Either party can transact', 'Joint statements', 'Survivor benefits'],
  },
  youth: {
    id: 'youth',
    name: 'Youth Account',
    description: 'For ages 0-12, with parental oversight',
    minDeposit: 0,
    minAge: 0,
    monthlyFee: 0,
    apyRange: [2.5, 3.5],
    icon: 'Star',
    features: ['Parental controls', 'Educational content', 'No fees', 'Auto-savings'],
  },
  premium: {
    id: 'premium',
    name: 'Premium Wealth',
    description: 'Exclusive benefits for high-balance customers',
    minDeposit: 50000,
    minAge: 18,
    monthlyFee: 50,
    apyRange: [5.0, 5.5],
    icon: 'Crown',
    features: ['Dedicated advisor', 'Concierge service', 'Premium cards', 'Investment platform'],
  },
  retirement: {
    id: 'retirement',
    name: 'Retirement IRA',
    description: 'Tax-advantaged retirement savings',
    minDeposit: 1000,
    minAge: 18,
    monthlyFee: 0,
    apyRange: [3.0, 4.5],
    icon: 'Heart',
    features: ['Tax-deferred growth', 'Catch-up contributions', 'Roth or Traditional', 'Required minimum distributions'],
  },
};