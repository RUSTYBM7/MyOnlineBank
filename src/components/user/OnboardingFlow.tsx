import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassSurface, GlassCard, GlassBadge, GlassButton, GlassInput } from '@/components/glass';
import { useStore } from '@/store';
import {
  Building2,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Fingerprint,
  Info,
  MapPin,
  MessageSquare,
  Phone,
  PiggyBank,
  Shield,
  Smartphone,
  Star,
  Upload,
  User
} from 'lucide-react';;

export default function OnboardingFlow() {
  const { onboardingData, updateOnboardingData, nextOnboardingStep, prevOnboardingStep, resetOnboarding } = useStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!onboardingData) {
    updateOnboardingData({ step: 'welcome', agreedToTerms: false });
  }

  const currentStep = onboardingData?.step || 'welcome';

  const steps = [
    { key: 'welcome', label: 'Welcome', icon: Star },
    { key: 'phone', label: 'Phone', icon: Smartphone },
    { key: 'otp', label: 'Verify', icon: MessageSquare },
    { key: 'personal_info', label: 'Info', icon: User },
    { key: 'id_verification', label: 'ID', icon: CreditCard },
    { key: 'selfie', label: 'Selfie', icon: Camera },
    { key: 'address', label: 'Address', icon: MapPin },
    { key: 'account_type', label: 'Account', icon: Building2 },
    { key: 'review', label: 'Review', icon: FileText },
    { key: 'complete', label: 'Done', icon: Check },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

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

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A8E6CF] to-[#88D4AB] mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Welcome to Glass Bank</h2>
            <p className="text-[#0A0A0A]/60 mb-8">
              Join thousands of users who trust us with their financial journey. Get started in just a few minutes.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Smartphone, text: 'Quick mobile onboarding' },
                { icon: Shield, text: 'Bank-grade security' },
                { icon: Star, text: 'Premium banking features' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-[#F7F9F4] rounded-xl">
                  <item.icon className="w-5 h-5 text-[#2ECC71]" />
                  <span className="text-sm text-[#0A0A0A]">{item.text}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 p-4 bg-[#F7F9F4] rounded-xl mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  updateOnboardingData({ agreedToTerms: e.target.checked });
                }}
                className="mt-1 w-5 h-5 rounded border-[#0A0A0A]/20 text-[#2ECC71] focus:ring-[#A8E6CF]"
              />
              <span className="text-sm text-[#0A0A0A]/60 text-left">
                I agree to the <span className="text-[#0A0A0A] underline">Terms of Service</span> and{' '}
                <span className="text-[#0A0A0A] underline">Privacy Policy</span>
              </span>
            </label>
          </motion.div>
        );

      case 'phone':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-8">
              <Smartphone className="w-16 h-16 mx-auto text-[#A8E6CF] mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Enter Your Phone Number</h2>
              <p className="text-[#0A0A0A]/60">We'll send you a verification code</p>
            </div>

            <GlassInput
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={onboardingData?.phone || ''}
              onChange={(e) => updateOnboardingData({ phone: e.target.value })}
            />

            <p className="text-xs text-[#0A0A0A]/50 mt-4 text-center">
              By continuing, you agree to receive SMS messages for verification
            </p>
          </motion.div>
        );

      case 'otp':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-[#A8E6CF]/20 rounded-full animate-ping" />
                <div className="relative w-16 h-16 bg-[#A8E6CF] rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Verify Your Phone</h2>
              <p className="text-[#0A0A0A]/60">
                Enter the 6-digit code sent to<br />
                <span className="font-medium text-[#0A0A0A]">{onboardingData?.phone || '+1 (555) 000-0000'}</span>
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
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
                  className="w-12 h-14 text-center text-xl font-bold bg-[#F7F9F4] border border-[#0A0A0A]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A8E6CF] focus:border-transparent"
                />
              ))}
            </div>

            <p className="text-center text-sm text-[#0A0A0A]/60">
              Didn't receive a code?{' '}
              <button className="text-[#2ECC71] font-medium">Resend</button>
            </p>
          </motion.div>
        );

      case 'personal_info':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <User className="w-16 h-16 mx-auto text-[#A8E6CF] mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Personal Information</h2>
              <p className="text-[#0A0A0A]/60">Let's get to know you better</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="First Name"
                  placeholder="John"
                  value={onboardingData?.firstName || ''}
                  onChange={(e) => updateOnboardingData({ firstName: e.target.value })}
                />
                <GlassInput
                  label="Last Name"
                  placeholder="Doe"
                  value={onboardingData?.lastName || ''}
                  onChange={(e) => updateOnboardingData({ lastName: e.target.value })}
                />
              </div>
              <GlassInput
                label="Date of Birth"
                type="date"
                value={onboardingData?.dateOfBirth || ''}
                onChange={(e) => updateOnboardingData({ dateOfBirth: e.target.value })}
              />
              <GlassInput
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={onboardingData?.email || ''}
                onChange={(e) => updateOnboardingData({ email: e.target.value })}
              />
            </div>
          </motion.div>
        );

      case 'id_verification':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <CreditCard className="w-16 h-16 mx-auto text-[#A8E6CF] mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Verify Your ID</h2>
              <p className="text-[#0A0A0A]/60">Upload a clear photo of your government-issued ID</p>
            </div>

            <div className="space-y-4 mb-6">
              <GlassInput
                label="ID Type"
                placeholder="Select ID type"
              />
              <GlassInput
                label="ID Number"
                placeholder="Enter ID number"
                value={onboardingData?.idNumber || ''}
                onChange={(e) => updateOnboardingData({ idNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="aspect-square rounded-xl border-2 border-dashed border-[#0A0A0A]/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#A8E6CF] transition-colors bg-[#F7F9F4]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-[#0A0A0A]/40 mb-2" />
                <span className="text-sm text-[#0A0A0A]/60">Front Side</span>
              </div>
              <div
                className="aspect-square rounded-xl border-2 border-dashed border-[#0A0A0A]/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#A8E6CF] transition-colors bg-[#F7F9F4]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-[#0A0A0A]/40 mb-2" />
                <span className="text-sm text-[#0A0A0A]/60">Back Side</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </motion.div>
        );

      case 'selfie':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <Fingerprint className="w-16 h-16 mx-auto text-[#A8E6CF] mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Take a Selfie</h2>
              <p className="text-[#0A0A0A]/60">We'll compare your selfie with your ID</p>
            </div>

            <div
              className="aspect-[3/4] rounded-3xl border-2 border-dashed border-[#0A0A0A]/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#A8E6CF] transition-colors bg-[#F7F9F4] mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-16 h-16 text-[#0A0A0A]/40 mb-4" />
              <span className="text-sm text-[#0A0A0A]/60">Tap to take a photo</span>
              <span className="text-xs text-[#0A0A0A]/40 mt-2">Make sure your face is clearly visible</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" />
          </motion.div>
        );

      case 'address':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <MapPin className="w-16 h-16 mx-auto text-[#A8E6CF] mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Your Address</h2>
              <p className="text-[#0A0A0A]/60">This will be used for KYC verification</p>
            </div>

            <div className="space-y-4">
              <GlassInput
                label="Street Address"
                placeholder="123 Main St"
                value={onboardingData?.address || ''}
                onChange={(e) => updateOnboardingData({ address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="City"
                  placeholder="San Francisco"
                  value={onboardingData?.city || ''}
                  onChange={(e) => updateOnboardingData({ city: e.target.value })}
                />
                <GlassInput
                  label="State"
                  placeholder="CA"
                  value={onboardingData?.state || ''}
                  onChange={(e) => updateOnboardingData({ state: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="ZIP Code"
                  placeholder="94105"
                  value={onboardingData?.zipCode || ''}
                  onChange={(e) => updateOnboardingData({ zipCode: e.target.value })}
                />
                <GlassInput
                  label="Country"
                  placeholder="United States"
                  value={onboardingData?.country || ''}
                  onChange={(e) => updateOnboardingData({ country: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );

      case 'account_type':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <Building2 className="w-16 h-16 mx-auto text-[#A8E6CF] mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Choose Account Type</h2>
              <p className="text-[#0A0A0A]/60">Select the type of account you'd like to open</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'checking',
                  name: 'Checking Account',
                  icon: Building2,
                  desc: 'Perfect for daily transactions',
                  rate: '0.5% APY',
                },
                {
                  id: 'savings',
                  name: 'Savings Account',
                  icon: PiggyBank,
                  desc: 'Grow your money over time',
                  rate: '4.5% APY',
                },
              ].map((type) => (
                <motion.button
                  key={type.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateOnboardingData({ selectedAccountType: type.id as 'checking' | 'savings' })}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                    onboardingData?.selectedAccountType === type.id
                      ? 'border-[#A8E6CF] bg-[#A8E6CF]/10'
                      : 'border-[#0A0A0A]/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      onboardingData?.selectedAccountType === type.id ? 'bg-[#A8E6CF]' : 'bg-[#0A0A0A]/10'
                    }`}>
                      <type.icon className={`w-7 h-7 ${onboardingData?.selectedAccountType === type.id ? 'text-white' : 'text-[#0A0A0A]/60'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#0A0A0A]">{type.name}</h3>
                      <p className="text-sm text-[#0A0A0A]/50">{type.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#2ECC71]">{type.rate}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center mb-6">
              <FileText className="w-16 h-16 mx-auto text-[#A8E6CF] mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-2">Review Your Application</h2>
              <p className="text-[#0A0A0A]/60">Please verify all information is correct</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F7F9F4] rounded-xl">
                <h4 className="text-sm font-medium text-[#0A0A0A]/60 mb-2">Personal Information</h4>
                <p className="text-sm text-[#0A0A0A]">
                  {onboardingData?.firstName} {onboardingData?.lastName}
                </p>
                <p className="text-sm text-[#0A0A0A]/60">{onboardingData?.email}</p>
              </div>

              <div className="p-4 bg-[#F7F9F4] rounded-xl">
                <h4 className="text-sm font-medium text-[#0A0A0A]/60 mb-2">Contact</h4>
                <p className="text-sm text-[#0A0A0A]">{onboardingData?.phone}</p>
                <p className="text-sm text-[#0A0A0A]/60">
                  {onboardingData?.address}, {onboardingData?.city}, {onboardingData?.state} {onboardingData?.zipCode}
                </p>
              </div>

              <div className="p-4 bg-[#F7F9F4] rounded-xl">
                <h4 className="text-sm font-medium text-[#0A0A0A]/60 mb-2">Account Type</h4>
                <p className="text-sm text-[#0A0A0A] capitalize">{onboardingData?.selectedAccountType} Account</p>
              </div>
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-24 h-24 rounded-full bg-[#2ECC71] mx-auto mb-6 flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Application Submitted!</h2>
            <p className="text-[#0A0A0A]/60 mb-8">
              Your application is being reviewed. We'll notify you via email and SMS once approved.
            </p>

            <div className="p-4 bg-[#A8E6CF]/20 rounded-xl mb-6">
              <p className="text-sm text-[#0A0A0A]">
                <strong>Expected processing time:</strong> 24-48 hours
              </p>
            </div>

            <GlassButton onClick={() => resetOnboarding()}>
              Go to Login
            </GlassButton>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'welcome':
        return agreedToTerms;
      case 'phone':
        return onboardingData?.phone?.length === 10;
      case 'otp':
        return otp.join('').length === 6;
      case 'personal_info':
        return onboardingData?.firstName && onboardingData?.lastName && onboardingData?.dateOfBirth;
      case 'id_verification':
        return onboardingData?.idNumber;
      case 'address':
        return onboardingData?.address && onboardingData?.city && onboardingData?.state;
      case 'account_type':
        return onboardingData?.selectedAccountType;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] p-5">
      {/* Header */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => prevOnboardingStep()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-[#0A0A0A]" />
          </button>
          <span className="text-sm text-[#0A0A0A]/60">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <div className="w-10" />
        </div>
      )}

      {/* Progress Bar */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="mb-8">
          <div className="h-1 bg-[#0A0A0A]/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-[#A8E6CF] to-[#2ECC71]"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'complete' && (
        <div className="flex gap-3">
          {currentStep === 'welcome' ? (
            <GlassButton
              className="flex-1"
              disabled={!canProceed()}
              onClick={() => nextOnboardingStep()}
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </GlassButton>
          ) : (
            <>
              {currentStep !== 'otp' && (
                <GlassButton
                  variant="outline"
                  className="flex-1"
                  onClick={() => prevOnboardingStep()}
                >
                  Back
                </GlassButton>
              )}
              <GlassButton
                className="flex-1"
                disabled={!canProceed()}
                onClick={() => nextOnboardingStep()}
              >
                {currentStep === 'review' ? 'Submit Application' : 'Continue'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </GlassButton>
            </>
          )}
        </div>
      )}

      {/* Step Indicators */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="flex justify-center gap-2 mt-6">
          {steps.slice(1, -1).map((step, index) => (
            <div
              key={step.key}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < currentIndex - 1
                  ? 'bg-[#A8E6CF]'
                  : index === currentIndex - 1
                  ? 'bg-[#0A0A0A]'
                  : 'bg-[#0A0A0A]/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
