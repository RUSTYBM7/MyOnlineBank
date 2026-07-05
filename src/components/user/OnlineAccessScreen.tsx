import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Shield,
  Smartphone,
  User
} from 'lucide-react';;

export default function OnlineAccessScreen() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    memberId: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.memberId.trim()) newErrors.memberId = 'Member ID is required';
      else if (formData.memberId.length < 6) newErrors.memberId = 'Member ID must be at least 6 characters';

      if (!formData.username.trim()) newErrors.username = 'Username is required';
      else if (formData.username.length < 4) newErrors.username = 'Username must be at least 4 characters';
    }

    if (step === 2) {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone format';
    }

    if (step === 3) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      // Simulate account creation
      setStep(5);
    }
  };

  const securityRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(formData.password), text: 'One number' },
    { met: /[^A-Za-z0-9]/.test(formData.password), text: 'One special character' },
  ];

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6 text-emerald-800" />
        </button>
        <div>
          <h1 className="text-2xl font-medium text-emerald-800">Online Access</h1>
          <p className="text-sm text-emerald-800/50">Create your online banking account</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step >= s
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-emerald-100 text-emerald-800/40'
            }`}>
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-12 h-0.5 mx-1 ${
                step > s ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-emerald-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between px-1 text-xs text-emerald-800/50">
        <span>Member ID</span>
        <span>Contact</span>
        <span>Security</span>
        <span>Confirm</span>
      </div>

      {/* Step 1: Member Verification */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <GlassCard className="p-5 space-y-4" intensity="high">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-emerald-800">Verify Your Membership</p>
                <p className="text-xs text-emerald-800/50">Enter your credit union member information</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-2">Member ID</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/40" />
                <input
                  type="text"
                  value={formData.memberId}
                  onChange={(e) => handleInputChange('memberId', e.target.value)}
                  placeholder="Enter your member ID"
                  className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-emerald-800 placeholder:text-emerald-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.memberId && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.memberId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/40" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-emerald-800 placeholder:text-emerald-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.username}
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Step 2: Contact Information */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <GlassCard className="p-5 space-y-4" intensity="high">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-emerald-800">Contact Information</p>
                <p className="text-xs text-emerald-800/50">We'll use this for verification and alerts</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-emerald-800 placeholder:text-emerald-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/40" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-emerald-800 placeholder:text-emerald-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Step 3: Security Setup */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <GlassCard className="p-5 space-y-4" intensity="high">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-emerald-800">Create Your Password</p>
                <p className="text-xs text-emerald-800/50">Use a strong password to protect your account</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3 glass-card rounded-xl text-emerald-800 placeholder:text-emerald-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-800/40 hover:text-emerald-800"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="space-y-2 p-3 bg-emerald-50/30 rounded-xl">
              <p className="text-xs font-medium text-emerald-800/60 mb-2">Password Requirements:</p>
              {securityRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    req.met ? 'bg-emerald-500' : 'bg-emerald-200'
                  }`}>
                    {req.met && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-xs ${req.met ? 'text-emerald-800' : 'text-emerald-800/40'}`}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-800 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-4 py-3 glass-card rounded-xl text-emerald-800 placeholder:text-emerald-800/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 p-3 bg-emerald-50/30 rounded-xl">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-emerald-300 text-emerald-500 focus:ring-emerald-500"
              />
              <p className="text-xs text-emerald-800/70">
                I agree to the <span className="text-emerald-600 underline">Terms of Service</span> and <span className="text-emerald-600 underline">Privacy Policy</span>, and consent to electronic communications.
              </p>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.acceptTerms}
              </p>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <GlassCard className="p-5 space-y-4" intensity="high">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-emerald-800">Review Your Information</p>
                <p className="text-xs text-emerald-800/50">Please verify all details before submitting</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-emerald-100/30">
                <span className="text-sm text-emerald-800/50">Member ID</span>
                <span className="text-sm text-emerald-800 font-medium">{formData.memberId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-100/30">
                <span className="text-sm text-emerald-800/50">Username</span>
                <span className="text-sm text-emerald-800 font-medium">{formData.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-100/30">
                <span className="text-sm text-emerald-800/50">Email</span>
                <span className="text-sm text-emerald-800 font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-emerald-800/50">Phone</span>
                <span className="text-sm text-emerald-800 font-medium">{formData.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                A verification code will be sent to your email and phone to complete the registration process.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <GlassCard intensity="high" className="p-8 text-center bg-gradient-to-b from-emerald-50/80 to-teal-50/80">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">Account Created!</h2>
            <p className="text-emerald-800/60 mb-6">
              Welcome to OrbitPay Credit Union Online Banking, {formData.username}!
            </p>
            <GlassBadge variant="green" size="md">Verification Email Sent</GlassBadge>
          </GlassCard>

          <GlassCard className="p-5 space-y-3" intensity="medium">
            <p className="text-sm font-medium text-emerald-800">Next Steps:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">1</div>
                <p className="text-sm text-emerald-800/70">Check your email to verify your account</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">2</div>
                <p className="text-sm text-emerald-800/70">Set up two-factor authentication</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">3</div>
                <p className="text-sm text-emerald-800/70">Start exploring your dashboard</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      {step < 5 && (
        <div className="flex gap-3">
          {step > 1 && (
            <GlassButton variant="secondary" onClick={() => setStep(prev => prev - 1)} className="flex-1">
              Back
            </GlassButton>
          )}
          <GlassButton variant="primary" onClick={step === 4 ? handleSubmit : handleNext} className="flex-1">
            {step === 4 ? 'Create Account' : 'Continue'}
          </GlassButton>
        </div>
      )}

      {step === 5 && (
        <GlassButton variant="primary" onClick={() => navigate('/app')} className="w-full">
          Go to Dashboard
        </GlassButton>
      )}

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-emerald-800/30">
          Need help? Call 1-800-ORBITPAY or visit a branch
        </p>
      </div>
    </div>
  );
}
