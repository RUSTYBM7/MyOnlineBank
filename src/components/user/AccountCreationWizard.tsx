import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassSurface, GlassCard, GlassBadge, GlassButton, GlassInput } from '@/components/glass';
import { useStore } from '@/store';
import {
  Smartphone, MessageSquare, User, CreditCard, MapPin, Check,
  ChevronLeft, ChevronRight, Fingerprint, Shield, Building2, PiggyBank,
  Camera, Upload, FileText, Star, Briefcase, GraduationCap, Users,
  Crown, Heart, Wallet, TrendingUp, Lock, Eye, EyeOff, Calendar,
  Mail, Phone, Home, DollarSign, AlertCircle, Sparkles,
  Car, Plane, GraduationCap as StudentIcon, Gift, Umbrella
} from 'lucide-react';

// Account type definitions with icons and colors
export type AccountType = 'savings' | 'checking' | 'student' | 'business' | 'joint' | 'youth' | 'premium' | 'retirement';

interface AccountTypeConfig {
  id: AccountType;
  name: string;
  icon: React.ElementType;
  tagline: string;
  color: string;
  bgGradient: string;
  minAge?: number;
  features: string[];
}

export const accountTypeConfigs: Record<AccountType, AccountTypeConfig> = {
  savings: {
    id: 'savings',
    name: 'Savings Account',
    icon: PiggyBank,
    tagline: 'Grow your wealth with competitive interest rates',
    color: 'from-green-500 to-emerald-500',
    bgGradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
    features: ['4.50% APY', 'No minimum balance', 'FDIC insured', 'Easy transfers', 'Goal tracking'],
  },
  checking: {
    id: 'checking',
    name: 'Checking Account',
    icon: Wallet,
    tagline: 'Daily banking with unlimited flexibility',
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    features: ['Free debit card', 'No monthly fees', 'Mobile deposits', '24/7 access', 'Overdraft protection'],
  },
  student: {
    id: 'student',
    name: 'Student Account',
    icon: GraduationCap,
    tagline: 'Designed for your education journey',
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    minAge: 13,
    features: ['Zero fees', 'Financial education', 'Credit building', 'No cosigner required', 'Low limits'],
  },
  business: {
    id: 'business',
    name: 'Business Account',
    icon: Briefcase,
    tagline: 'Fuel your business growth',
    color: 'from-amber-500 to-orange-500',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    features: ['Multi-user access', 'Merchant services', 'Tax tools', 'Payroll support', 'API access'],
  },
  joint: {
    id: 'joint',
    name: 'Joint Account',
    icon: Users,
    tagline: 'Shared banking for couples & partners',
    color: 'from-rose-500 to-red-500',
    bgGradient: 'bg-gradient-to-br from-rose-50 to-red-50',
    features: ['Equal access', 'Combined funds', 'Individual cards', 'Shared goals', 'Transparent'],
  },
  youth: {
    id: 'youth',
    name: 'Youth Account',
    icon: Heart,
    tagline: 'Teaching smart money habits early',
    color: 'from-indigo-500 to-violet-500',
    bgGradient: 'bg-gradient-to-br from-indigo-50 to-violet-50',
    minAge: 13,
    features: ['Parental controls', 'Spending insights', 'Savings goals', 'No fees', 'Educational tools'],
  },
  premium: {
    id: 'premium',
    name: 'Premium Membership',
    icon: Crown,
    tagline: 'Exclusive benefits & premium service',
    color: 'from-yellow-500 to-amber-500',
    bgGradient: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    features: ['5.00% APY', 'Priority support', 'Concierge service', 'Travel perks', 'Premium card'],
  },
  retirement: {
    id: 'retirement',
    name: 'Retirement Account',
    icon: TrendingUp,
    tagline: 'Secure your future today',
    color: 'from-teal-500 to-cyan-500',
    bgGradient: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    features: ['Tax advantages', 'IRA options', 'Investment tools', 'Financial planning', 'Compound growth'],
  },
};

// Step definitions for each account type
interface Step {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const getStepsForAccountType = (type: AccountType): Step[] => {
  const commonSteps: Step[] = [
    { id: 'welcome', title: 'Welcome', subtitle: 'Get started', icon: Star },
    { id: 'personal_info', title: 'Personal Info', subtitle: 'Your details', icon: User },
    { id: 'contact', title: 'Contact', subtitle: 'Reach you', icon: Phone },
    { id: 'address', title: 'Address', subtitle: 'Your location', icon: Home },
  ];

  const verificationSteps: Step[] = [
    { id: 'verification', title: 'Verify', subtitle: 'Identity check', icon: Shield },
    { id: 'id_upload', title: 'ID Upload', subtitle: 'Document check', icon: CreditCard },
  ];

  const finalSteps: Step[] = [
    { id: 'review', title: 'Review', subtitle: 'Confirm details', icon: FileText },
    { id: 'complete', title: 'Complete', subtitle: 'All done', icon: Check },
  ];

  switch (type) {
    case 'business':
      return [
        ...commonSteps,
        { id: 'business_info', title: 'Business', subtitle: 'Company details', icon: Briefcase },
        ...verificationSteps,
        { id: 'business_docs', title: 'Documents', subtitle: 'Business docs', icon: FileText },
        ...finalSteps,
      ];
    case 'joint':
      return [
        ...commonSteps,
        { id: 'joint_partner', title: 'Partner', subtitle: 'Second holder', icon: Users },
        ...verificationSteps,
        { id: 'selfie', title: 'Selfie', subtitle: 'Verify identity', icon: Camera },
        ...finalSteps,
      ];
    case 'student':
      return [
        ...commonSteps,
        { id: 'student_info', title: 'Student', subtitle: 'Education details', icon: GraduationCap },
        { id: 'parent_info', title: 'Parent', subtitle: 'Guardian info', icon: Users },
        ...verificationSteps,
        { id: 'selfie', title: 'Selfie', subtitle: 'Verify identity', icon: Camera },
        ...finalSteps,
      ];
    case 'youth':
      return [
        ...commonSteps,
        { id: 'youth_info', title: 'Guardian', subtitle: 'Parent consent', icon: Users },
        { id: 'guardian_verify', title: 'Verify', subtitle: 'Guardian ID', icon: Shield },
        ...finalSteps,
      ];
    case 'premium':
      return [
        ...commonSteps,
        { id: 'premium_info', title: 'Premium', subtitle: 'Membership tier', icon: Crown },
        { id: 'income_verify', title: 'Income', subtitle: 'Verification', icon: DollarSign },
        ...verificationSteps,
        { id: 'selfie', title: 'Selfie', subtitle: 'Verify identity', icon: Camera },
        ...finalSteps,
      ];
    case 'retirement':
      return [
        ...commonSteps,
        { id: 'retirement_info', title: 'Retirement', subtitle: 'Plan details', icon: TrendingUp },
        { id: 'employment', title: 'Employment', subtitle: 'Work status', icon: Briefcase },
        ...verificationSteps,
        { id: 'selfie', title: 'Selfie', subtitle: 'Verify identity', icon: Camera },
        ...finalSteps,
      ];
    default:
      return [
        ...commonSteps,
        ...verificationSteps,
        { id: 'selfie', title: 'Selfie', subtitle: 'Verify identity', icon: Camera },
        ...finalSteps,
      ];
  }
};

interface AccountCreationWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function AccountCreationWizard({ onComplete, onCancel }: AccountCreationWizardProps) {
  const { updateOnboardingData, resetOnboarding } = useStore();
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = selectedType ? getStepsForAccountType(selectedType) : [];
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const config = selectedType ? accountTypeConfigs[selectedType] : null;

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = (): boolean => {
    if (!currentStep) return false;

    switch (currentStep.id) {
      case 'welcome':
        return agreedToTerms;
      case 'personal_info':
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.ssn;
      case 'contact':
        return formData.email && formData.phone;
      case 'address':
        return formData.streetAddress && formData.city && formData.state && formData.zipCode;
      case 'business_info':
        return formData.businessName && formData.businessType && formData.ein;
      case 'student_info':
        return formData.schoolName && formData.studentId;
      case 'parent_info':
        return formData.parentName && formData.parentPhone;
      case 'youth_info':
        return formData.parentName && formData.parentPhone;
      case 'guardian_verify':
        return true; // ID verification
      case 'verification':
        return otp.join('').length === 6;
      case 'id_upload':
        return formData.idType && formData.idNumber;
      case 'joint_partner':
        return formData.partnerFirstName && formData.partnerLastName && formData.partnerEmail;
      case 'selfie':
        return true; // Selfie is optional for now
      case 'premium_info':
        return true;
      case 'income_verify':
        return true;
      case 'retirement_info':
        return true;
      case 'employment':
        return true;
      case 'business_docs':
        return true;
      case 'review':
        return agreedToTerms;
      case 'complete':
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleComplete = () => {
    resetOnboarding();
    if (onComplete) onComplete();
  };

  // Account Type Selection Screen
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-[#F7F9F4]">
        <div className="max-w-lg mx-auto px-5 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669] to-[#10B981] mx-auto mb-4 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Choose Your Account</h1>
            <p className="text-[#0A0A0A]/60">Select the account type that best fits your needs</p>
          </div>

          {/* Account Types Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.values(accountTypeConfigs).map((typeConfig) => {
              const Icon = typeConfig.icon;
              return (
                <motion.button
                  key={typeConfig.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedType(typeConfig.id)}
                  className={`p-4 rounded-2xl border-2 border-gray-200 text-left transition-all hover:border-[#059669] ${typeConfig.bgGradient}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-[#0A0A0A] mb-1">{typeConfig.name}</h3>
                  <p className="text-xs text-[#0A0A0A]/60 line-clamp-2">{typeConfig.tagline}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Cancel Button */}
          <GlassButton variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </GlassButton>
        </div>
      </div>
    );
  }

  // Render current step content
  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config?.color} mx-auto mb-6 flex items-center justify-center`}>
              {config && <config.icon className="w-10 h-10 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">{config?.name}</h2>
            <p className="text-[#0A0A0A]/60 mb-6">{config?.tagline}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {config?.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
                  <Check className="w-4 h-4 text-[#059669]" />
                  <span className="text-sm text-[#0A0A0A]">{feature}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 p-4 bg-white rounded-xl cursor-pointer border border-gray-200">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-[#059669]"
              />
              <span className="text-sm text-[#0A0A0A]/70 text-left">
                I agree to the <span className="text-[#059669] font-medium">Terms of Service</span>,{' '}
                <span className="text-[#059669] font-medium">Privacy Policy</span>, and{' '}
                <span className="text-[#059669] font-medium">Membership Agreement</span>
              </span>
            </label>
          </motion.div>
        );

      case 'personal_info':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Personal Information</h2>
              <p className="text-[#0A0A0A]/60">Enter your legal name as it appears on your ID</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="First Name *"
                  placeholder="John"
                  value={formData.firstName || ''}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                />
                <GlassInput
                  label="Last Name *"
                  placeholder="Doe"
                  value={formData.lastName || ''}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                />
              </div>
              <GlassInput
                label="Date of Birth *"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              />
              <div className="relative">
                <GlassInput
                  label="SSN (Last 4) *"
                  type="text"
                  placeholder="1234"
                  maxLength={4}
                  value={formData.ssn || ''}
                  onChange={(e) => updateFormData('ssn', e.target.value)}
                />
                <Lock className="absolute right-3 top-9 w-4 h-4 text-[#0A0A0A]/30" />
              </div>
            </div>
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <Phone className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Contact Information</h2>
              <p className="text-[#0A0A0A]/60">How can we reach you?</p>
            </div>

            <div className="space-y-4">
              <GlassInput
                label="Email Address *"
                type="email"
                placeholder="john@example.com"
                value={formData.email || ''}
                onChange={(e) => updateFormData('email', e.target.value)}
              />
              <GlassInput
                label="Phone Number *"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone || ''}
                onChange={(e) => updateFormData('phone', e.target.value)}
              />
            </div>
          </motion.div>
        );

      case 'address':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <Home className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Residential Address</h2>
              <p className="text-[#0A0A0A]/60">Your current address for verification</p>
            </div>

            <div className="space-y-4">
              <GlassInput
                label="Street Address *"
                placeholder="123 Main St"
                value={formData.streetAddress || ''}
                onChange={(e) => updateFormData('streetAddress', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="City *"
                  placeholder="San Francisco"
                  value={formData.city || ''}
                  onChange={(e) => updateFormData('city', e.target.value)}
                />
                <GlassInput
                  label="State *"
                  placeholder="CA"
                  value={formData.state || ''}
                  onChange={(e) => updateFormData('state', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="ZIP Code *"
                  placeholder="94105"
                  value={formData.zipCode || ''}
                  onChange={(e) => updateFormData('zipCode', e.target.value)}
                />
                <GlassInput
                  label="Country"
                  placeholder="United States"
                  value={formData.country || 'United States'}
                  onChange={(e) => updateFormData('country', e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'business_info':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Business Information</h2>
              <p className="text-[#0A0A0A]/60">Tell us about your business</p>
            </div>

            <div className="space-y-4">
              <GlassInput
                label="Business Name *"
                placeholder="Acme Corporation"
                value={formData.businessName || ''}
                onChange={(e) => updateFormData('businessName', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Business Type *</label>
                <select
                  className="w-full px-4 py-3 bg-[#F7F9F4] rounded-xl text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#059669]/30"
                  value={formData.businessType || ''}
                  onChange={(e) => updateFormData('businessType', e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                </select>
              </div>
              <GlassInput
                label="EIN *"
                placeholder="12-3456789"
                value={formData.ein || ''}
                onChange={(e) => updateFormData('ein', e.target.value)}
              />
              <GlassInput
                label="Industry"
                placeholder="Technology, Healthcare, etc."
                value={formData.industry || ''}
                onChange={(e) => updateFormData('industry', e.target.value)}
              />
            </div>
          </motion.div>
        );

      case 'verification':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-[#059669]/20 rounded-full animate-ping" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#059669] to-[#10B981] rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Verify Your Identity</h2>
              <p className="text-[#0A0A0A]/60">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-[#0A0A0A]">{formData.phone || formData.email}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-14 text-center text-xl font-bold bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 transition-all"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-[#0A0A0A]/60 mb-4">
                Code expires in <span className="font-semibold text-[#059669]">10:00</span>
              </p>
              <button className="text-[#059669] font-medium text-sm">Didn't receive a code? Resend</button>
            </div>
          </motion.div>
        );

      case 'id_upload':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Upload Your ID</h2>
              <p className="text-[#0A0A0A]/60">We accept government-issued photo IDs</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">ID Type</label>
                <select
                  className="w-full px-4 py-3 bg-[#F7F9F4] rounded-xl text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#059669]/30"
                  value={formData.idType || ''}
                  onChange={(e) => updateFormData('idType', e.target.value)}
                >
                  <option value="">Select ID type</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="state_id">State ID</option>
                  <option value="military_id">Military ID</option>
                </select>
              </div>
              <GlassInput
                label="ID Number *"
                placeholder="Enter your ID number"
                value={formData.idNumber || ''}
                onChange={(e) => updateFormData('idNumber', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#059669] hover:bg-[#059669]/5 transition-all bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Front</span>
              </div>
              <div
                className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#059669] hover:bg-[#059669]/5 transition-all bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Back</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Review Your Application</h2>
              <p className="text-[#0A0A0A]/60">Please verify all information is correct</p>
            </div>

            <div className="space-y-4">
              {/* Account Type */}
              <div className="p-4 bg-[#059669]/5 rounded-xl border border-[#059669]/20">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config?.color} flex items-center justify-center`}>
                    {config && <config.icon className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-[#0A0A0A]">{config?.name}</p>
                    <p className="text-sm text-[#0A0A0A]/60">{config?.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-[#0A0A0A]/60 mb-2">Personal Information</h4>
                <p className="text-sm text-[#0A0A0A]">{formData.firstName} {formData.lastName}</p>
                <p className="text-xs text-[#0A0A0A]/50">DOB: {formData.dateOfBirth}</p>
              </div>

              {/* Contact */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-[#0A0A0A]/60 mb-2">Contact Information</h4>
                <p className="text-sm text-[#0A0A0A]">{formData.email}</p>
                <p className="text-xs text-[#0A0A0A]/50">{formData.phone}</p>
              </div>

              {/* Address */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-[#0A0A0A]/60 mb-2">Address</h4>
                <p className="text-sm text-[#0A0A0A]">{formData.streetAddress}</p>
                <p className="text-xs text-[#0A0A0A]/50">{formData.city}, {formData.state} {formData.zipCode}</p>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-[#F7F9F4] rounded-xl cursor-pointer border border-gray-200 mt-6">
              <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded border-gray-300 text-[#059669]" />
              <span className="text-sm text-[#0A0A0A]/70 text-left">
                I confirm that all information provided is accurate and complete.
              </span>
            </label>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#059669] to-[#10B981] mx-auto mb-6 flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-3">Application Submitted!</h2>
            <p className="text-[#0A0A0A]/60 mb-6 max-w-sm mx-auto">
              Thank you for choosing OrbitPay Credit Union. Your application is being reviewed.
            </p>

            <div className="p-4 bg-[#059669]/10 rounded-xl border border-[#059669]/20 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[#059669]" />
                <span className="font-medium text-[#0A0A0A]">Processing Time</span>
              </div>
              <p className="text-sm text-[#0A0A0A]/70">24-48 hours for standard applications</p>
            </div>

            <div className="p-4 bg-[#F7F9F4] rounded-xl">
              <p className="text-sm text-[#0A0A0A]">
                <strong>Application ID:</strong> <span className="font-mono">OP-{Date.now().toString().slice(-8)}</span>
              </p>
            </div>
          </motion.div>
        );

      // Additional steps based on account type
      case 'joint_partner':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <Users className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Joint Account Holder</h2>
              <p className="text-[#0A0A0A]/60">Enter the second account holder's information</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="First Name"
                  placeholder="Jane"
                  value={formData.partnerFirstName || ''}
                  onChange={(e) => updateFormData('partnerFirstName', e.target.value)}
                />
                <GlassInput
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.partnerLastName || ''}
                  onChange={(e) => updateFormData('partnerLastName', e.target.value)}
                />
              </div>
              <GlassInput
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                value={formData.partnerEmail || ''}
                onChange={(e) => updateFormData('partnerEmail', e.target.value)}
              />
              <GlassInput
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.partnerPhone || ''}
                onChange={(e) => updateFormData('partnerPhone', e.target.value)}
              />
            </div>
          </motion.div>
        );

      case 'student_info':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <GraduationCap className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Student Information</h2>
              <p className="text-[#0A0A0A]/60">Tell us about your education</p>
            </div>
            <div className="space-y-4">
              <GlassInput
                label="School/University Name"
                placeholder="Stanford University"
                value={formData.schoolName || ''}
                onChange={(e) => updateFormData('schoolName', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Student ID"
                  placeholder="12345678"
                  value={formData.studentId || ''}
                  onChange={(e) => updateFormData('studentId', e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Expected Graduation</label>
                  <select
                    className="w-full px-4 py-3 bg-[#F7F9F4] rounded-xl text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#059669]/30"
                    value={formData.graduationYear || ''}
                    onChange={(e) => updateFormData('graduationYear', e.target.value)}
                  >
                    <option value="">Select year</option>
                    {[2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'selfie':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-6">
              <Camera className="w-12 h-12 mx-auto text-[#059669] mb-3" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-1">Take a Selfie</h2>
              <p className="text-[#0A0A0A]/60">We'll compare your selfie with your ID</p>
            </div>
            <div
              className="aspect-[3/4] rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#059669] hover:bg-[#059669]/5 transition-all bg-gray-50 mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-16 h-16 text-gray-400 mb-4" />
              <span className="text-sm text-gray-500 mb-2">Tap to take a photo</span>
              <span className="text-xs text-gray-400">Make sure your face is clearly visible</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" />
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669] to-[#10B981] mx-auto mb-6 flex items-center justify-center">
              <currentStep.icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">{currentStep.title}</h2>
            <p className="text-[#0A0A0A]/60">{currentStep.subtitle}</p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4]">
      {/* Header */}
      {currentStep.id !== 'welcome' && currentStep.id !== 'complete' && (
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
          <div className="max-w-lg mx-auto px-5 py-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={currentStepIndex === 0 ? () => setSelectedType(null) : handleBack}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-[#0A0A0A]" />
              </button>

              {/* Account Type Badge */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config?.color} flex items-center justify-center`}>
                  {config && <config.icon className="w-4 h-4 text-white" />}
                </div>
                <span className="font-medium text-[#0A0A0A] text-sm">{config?.name}</span>
              </div>

              <span className="text-sm text-[#0A0A0A]/50">
                {currentStepIndex + 1}/{steps.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-[#059669] to-[#10B981]"
              />
            </div>

            {/* Step Label */}
            <p className="text-center text-xs text-[#0A0A0A]/50 mt-2">
              {currentStep.title}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-lg mx-auto px-5 py-6 pb-32">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation */}
      {currentStep.id !== 'complete' ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50">
          <div className="max-w-lg mx-auto px-5 py-4">
            <GlassButton
              className="w-full"
              disabled={!canProceed()}
              onClick={currentStep.id === 'review' ? handleComplete : handleNext}
              size="lg"
            >
              {currentStep.id === 'review' ? 'Submit Application' : 'Continue'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </GlassButton>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50">
          <div className="max-w-lg mx-auto px-5 py-4">
            <GlassButton
              className="w-full"
              onClick={handleComplete}
              size="lg"
            >
              Go to Login
              <ChevronRight className="w-5 h-5 ml-2" />
            </GlassButton>
          </div>
        </div>
      )}
    </div>
  );
}
