import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/modals'
import { useStore } from '@/store'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type LoginType = 'email' | 'memberId' | 'username'

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [loginType, setLoginType] = useState<LoginType>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    memberId: '',
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { login } = useStore()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (loginType === 'email' && !formData.email) {
      newErrors.email = 'Email is required'
    } else if (loginType === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (loginType === 'memberId' && !formData.memberId) {
      newErrors.memberId = 'Member ID is required'
    }

    if (loginType === 'username' && !formData.username) {
      newErrors.username = 'Username is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock successful login
    const mockUser = {
      id: 'user_' + Date.now(),
      fullName: 'Demo User',
      email: formData.email || 'demo@orbitpay.com',
      phone: '+1 (555) 123-4567',
      avatar: null,
      accountStatus: 'active' as const,
      balanceUSD: 5000,
      balanceEUR: 0,
      balanceGBP: 0,
      balanceBTC: 0,
      kycStatus: 'verified' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    login(mockUser)
    setIsLoading(false)
    onOpenChange(false)
  }

  const inputValue = loginType === 'email' ? formData.email :
    loginType === 'memberId' ? formData.memberId : formData.username

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      className="w-full max-w-lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <ModalTitle className="text-2xl">Welcome Back</ModalTitle>
          <ModalDescription>Sign in to your OrbitPay account to continue</ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Login Type Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1">
            {(['email', 'memberId', 'username'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLoginType(type)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  loginType === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {type === 'email' ? 'Email' : type === 'memberId' ? 'Member ID' : 'Username'}
              </button>
            ))}
          </div>

          {/* Login Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {loginType === 'email' ? 'Email Address' : loginType === 'memberId' ? 'Member ID' : 'Username'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={loginType === 'email' ? 'email' : 'text'}
                value={inputValue}
                onChange={(e) => handleInputChange(loginType, e.target.value)}
                placeholder={loginType === 'email' ? 'name@example.com' : `Enter your ${loginType}`}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors[loginType] ? 'border-red-500' : 'border-gray-200'
                } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all`}
              />
            </div>
            {errors[loginType] && (
              <p className="mt-1 text-sm text-red-500">{errors[loginType]}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Forgot password?
            </a>
          </div>

          {/* MFA Placeholder */}
          <div className="glass-card p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Available for enhanced security</p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default LoginModal
