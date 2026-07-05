import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  ShieldCheck,
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'

interface EnhancedOnboardingFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step =
  | 'welcome'
  | 'account_selection'
  | 'personal_info'
  | 'contact_info'
  | 'address'
  | 'employment'
  | 'identity_verification'
  | 'document_upload'
  | 'selfie_verification'
  | 'terms_conditions'
  | 'review'
  | 'submission'

interface FormData {
  accountType: string
  firstName: string
  lastName: string
  dateOfBirth: string
  ssn: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  employmentStatus: string
  employer: string
  annualIncome: string
  agreeToTerms: boolean
  agreeToPrivacy: boolean
}

const STEPS: Step[] = [
  'welcome',
  'account_selection',
  'personal_info',
  'contact_info',
  'address',
  'employment',
  'identity_verification',
  'document_upload',
  'selfie_verification',
  'terms_conditions',
  'review',
  'submission'
]

const ACCOUNT_TYPES = [
  { id: 'savings', name: 'Savings Account', icon: '💰', description: 'Perfect for growing your wealth' },
  { id: 'checking', name: 'Checking Account', icon: '💳', description: 'Easy access to your funds' },
  { id: 'student', name: 'Student Account', icon: '🎓', description: 'Designed for students' },
  { id: 'business', name: 'Business Account', icon: '🏢', description: 'For business owners' },
  { id: 'joint', name: 'Joint Account', icon: '👥', description: 'Shared with a partner' },
  { id: 'youth', name: 'Youth Account', icon: '🌟', description: 'For members under 18' },
  { id: 'premium', name: 'Premium Membership', icon: '👑', description: 'Enhanced benefits' },
  { id: 'retirement', name: 'Retirement Account', icon: '🏖️', description: 'IRA & 401k options' }
]

const EnhancedOnboardingFlow = ({ open, onOpenChange }: EnhancedOnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    accountType: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: '',
    employer: '',
    annualIncome: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { login } = useStore()

  const currentStepIndex = STEPS.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 'account_selection':
        if (!formData.accountType) {
          newErrors.accountType = 'Please select an account type'
        }
        break
      case 'personal_info':
        if (!formData.firstName) newErrors.firstName = 'First name is required'
        if (!formData.lastName) newErrors.lastName = 'Last name is required'
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
        if (!formData.ssn) newErrors.ssn = 'SSN is required'
        break
      case 'contact_info':
        if (!formData.email) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
        if (!formData.phone) newErrors.phone = 'Phone is required'
        break
      case 'address':
        if (!formData.address) newErrors.address = 'Address is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.state) newErrors.state = 'State is required'
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
        break
      case 'employment':
        if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required'
        break
      case 'terms_conditions':
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms'
        if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = 'You must agree to privacy policy'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return

    const nextIndex = currentStepIndex + 1
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex])
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex])
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockUser = {
      id: 'user_' + Date.now(),
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      avatar: null,
      accountStatus: 'active' as const,
      balanceUSD: 0,
      balanceEUR: 0,
      balanceGBP: 0,
      balanceBTC: 0,
      kycStatus: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    login(mockUser)
    setIsLoading(false)
    onOpenChange(false)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-5xl">🏦</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to OrbitPay!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Let's get you started with your new account. This quick process takes just 5-10 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['Secure', 'Fast', 'Easy'].map((item) => (
                <div key={item} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  ✓ {item}
                </div>
              ))}
            </div>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-12"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )

      case 'account_selection':
        return (
          <div className="py-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Select Account Type</h2>
            <p className="text-gray-600 mb-6 text-center">Choose the account that best fits your needs</p>
            <div className="grid grid-cols-2 gap-4">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleInputChange('accountType', type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.accountType === type.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
            {errors.accountType && (
              <p className="mt-4 text-sm text-red-500 text-center">{errors.accountType}</p>
            )}
          </div>
        )

      case 'personal_info':
        return (
          <div className="py-4 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                  placeholder="John"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
              />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Security Number</label>
              <input
                type="password"
                value={formData.ssn}
                onChange={(e) => handleInputChange('ssn', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.ssn ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                placeholder="XXX-XX-XXXX"
              />
              {errors.ssn && <p className="mt-1 text-sm text-red-500">{errors.ssn}</p>}
            </div>
          </div>
        )

      case 'contact_info':
        return (
          <div className="py-4 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-600">How can we reach you?</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                placeholder="john.doe@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                placeholder="(555) 123-4567"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>
        )

      case 'address':
        return (
          <div className="py-4 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Residential Address</h2>
              <p className="text-gray-600">Where do you live?</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                placeholder="123 Main Street"
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                  placeholder="New York"
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.state ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                  placeholder="NY"
                />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.zipCode ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                placeholder="10001"
              />
              {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
            </div>
          </div>
        )

      case 'employment':
        return (
          <div className="py-4 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Employment Details</h2>
              <p className="text-gray-600">Tell us about your work</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.employmentStatus ? 'border-red-500' : 'border-gray-200'} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
              >
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
                <option value="unemployed">Unemployed</option>
              </select>
              {errors.employmentStatus && <p className="mt-1 text-sm text-red-500">{errors.employmentStatus}</p>}
            </div>
            {formData.employmentStatus === 'employed' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employer Name</label>
                  <input
                    type="text"
                    value={formData.employer}
                    onChange={(e) => handleInputChange('employer', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                  <select
                    value={formData.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Select range</option>
                    <option value="0-25000">$0 - $25,000</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000-100000">$50,000 - $100,000</option>
                    <option value="100000+">$100,000+</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )

      case 'identity_verification':
        return (
          <div className="py-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              To keep your account secure, we'll need to verify your identity using your government-issued ID.
            </p>
            <div className="space-y-4 text-left max-w-sm mx-auto">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Driver's License or State ID</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Passport</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <Check className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Military ID</span>
              </div>
            </div>
          </div>
        )

      case 'document_upload':
        return (
          <div className="py-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
            <p className="text-gray-600 mb-8">Upload a clear photo of your ID (front and back)</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Front of ID</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Back of ID</p>
              </div>
            </div>
          </div>
        )

      case 'selfie_verification':
        return (
          <div className="py-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selfie Verification</h2>
            <p className="text-gray-600 mb-8">Take a selfie to verify it's really you</p>
            <div className="w-48 h-48 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 mx-auto mb-6 flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Position your face within the circle and ensure good lighting for best results.
            </p>
          </div>
        )

      case 'terms_conditions':
        return (
          <div className="py-4 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
              <p className="text-gray-600">Please review and accept to continue</p>
            </div>
            <div className="h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
              <p className="mb-4">By opening an account with OrbitPay Credit Union, you agree to the following terms:</p>
              <p className="mb-4">1. You are at least 18 years of age and a legal resident of the United States.</p>
              <p className="mb-4">2. All information provided is accurate and complete to the best of your knowledge.</p>
              <p className="mb-4">3. You authorize us to verify your identity and check your credit history.</p>
              <p className="mb-4">4. You agree to maintain adequate funds to cover any transactions.</p>
              <p>5. You accept our fee schedule and will be notified of any changes.</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="w-5 h-5 mt-0.5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-600">I agree to the Terms and Conditions and Privacy Policy</span>
            </label>
            {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToPrivacy}
                onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                className="w-5 h-5 mt-0.5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-600">I consent to electronic communications and marketing</span>
            </label>
            {errors.agreeToPrivacy && <p className="text-sm text-red-500">{errors.agreeToPrivacy}</p>}
          </div>
        )

      case 'review':
        return (
          <div className="py-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
              <p className="text-gray-600">Please verify all details are correct</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="glass-card p-4 rounded-xl">
                <h4 className="text-sm text-gray-500 mb-1">Account Type</h4>
                <p className="font-semibold text-gray-900">{ACCOUNT_TYPES.find(t => t.id === formData.accountType)?.name}</p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <h4 className="text-sm text-gray-500 mb-1">Name</h4>
                <p className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <h4 className="text-sm text-gray-500 mb-1">Email</h4>
                <p className="font-semibold text-gray-900">{formData.email}</p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <h4 className="text-sm text-gray-500 mb-1">Phone</h4>
                <p className="font-semibold text-gray-900">{formData.phone}</p>
              </div>
            </div>
          </div>
        )

      case 'submission':
        return (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your application has been received. You'll receive an email confirmation shortly.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 text-emerald-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">Redirecting to your account...</span>
            </div>
          </div>
        )
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-100">
          {currentStep !== 'welcome' && currentStep !== 'submission' && (
            <>
              {/* Progress Bar */}
              <div className="h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </>
          )}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        {currentStep !== 'welcome' && currentStep !== 'submission' && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
              <Button
                onClick={currentStep === 'review' ? handleSubmit : handleNext}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : currentStep === 'review' ? (
                  <>
                    Submit Application
                    <Check className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default EnhancedOnboardingFlow
