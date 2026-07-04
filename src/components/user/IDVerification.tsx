import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Check, AlertCircle, Loader2, Image, Shield, Fingerprint, User } from 'lucide-react'
import { cn } from '@/lib/utils'

// Company Logo SVGs
const COMPANY_LOGOS = {
  visa: (
    <svg viewBox="0 0 48 32" className="w-full h-full">
      <rect fill="#1A1F71" width="48" height="32" rx="4"/>
      <text x="24" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">VISA</text>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 48 32" className="w-full h-full">
      <rect fill="#000" width="48" height="32" rx="4"/>
      <circle cx="18" cy="16" r="10" fill="#EB001B"/>
      <circle cx="30" cy="16" r="10" fill="#F79E1B"/>
      <path d="M24 8.5c2.5 2 4 5 4 7.5s-1.5 5.5-4 7.5c-2.5-2-4-5-4-7.5s1.5-5.5 4-7.5" fill="#FF5F00"/>
    </svg>
  ),
  swift: (
    <svg viewBox="0 0 48 32" className="w-full h-full">
      <rect fill="#003366" width="48" height="32" rx="4"/>
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">SWIFT</text>
    </svg>
  ),
  fednow: (
    <svg viewBox="0 0 48 32" className="w-full h-full">
      <rect fill="#003087" width="48" height="32" rx="4"/>
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">FedNow</text>
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 48 32" className="w-full h-full">
      <rect fill="#635BFF" width="48" height="32" rx="4"/>
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">stripe</text>
    </svg>
  ),
  plaid: (
    <svg viewBox="0 0 48 32" className="w-full h-full">
      <rect fill="#111" width="48" height="32" rx="4"/>
      <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">Plaid</text>
    </svg>
  )
}

interface IDVerificationProps {
  onComplete?: (data: { idImage: string; selfieImage: string; livenessCheck: boolean }) => void
  onSkip?: () => void
  isAdmin?: boolean
  userData?: {
    idImage?: string
    selfieImage?: string
    livenessCheck?: boolean
    verificationStatus?: 'pending' | 'verified' | 'rejected'
  }
}

export function IDVerification({
  onComplete,
  onSkip,
  isAdmin = false,
  userData
}: IDVerificationProps) {
  const [step, setStep] = useState<'id' | 'selfie' | 'liveness' | 'review'>('id')
  const [idImage, setIdImage] = useState<string | null>(userData?.idImage || null)
  const [selfieImage, setSelfieImage] = useState<string | null>(userData?.selfieImage || null)
  const [livenessComplete, setLivenessComplete] = useState(userData?.livenessCheck || false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((type: 'id' | 'selfie') => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (type === 'id') {
          setIdImage(result)
          setStep('selfie')
        } else {
          setSelfieImage(result)
          setStep('liveness')
        }
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Camera access denied. Please upload an image instead.')
      setIsCapturing(false)
    }
  }, [])

  const capturePhoto = useCallback((type: 'id' | 'selfie') => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg', 0.9)
        if (type === 'id') {
          setIdImage(imageData)
          setStep('selfie')
        } else {
          setSelfieImage(imageData)
          setStep('liveness')
        }
      }
      stopCamera()
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setIsCapturing(false)
    }
  }, [])

  const performLivenessCheck = useCallback(() => {
    setIsProcessing(true)
    // Simulate liveness check with animation
    setTimeout(() => {
      setLivenessComplete(true)
      setIsProcessing(false)
      setStep('review')
    }, 2000)
  }, [])

  const handleSubmit = useCallback(() => {
    onComplete?.({
      idImage: idImage || '',
      selfieImage: selfieImage || '',
      livenessCheck: livenessComplete
    })
  }, [idImage, selfieImage, livenessComplete, onComplete])

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {['ID', 'Selfie', 'Verify', 'Review'].map((label, idx) => {
          const stepKey = ['id', 'selfie', 'liveness', 'review'][idx] as typeof step
          const isActive = step === stepKey
          const isComplete = ['id', 'selfie', 'liveness', 'review'].indexOf(step) > idx

          return (
            <div key={label} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                isComplete && "bg-emerald-500 text-white",
                isActive && !isComplete && "bg-emerald-500 text-white ring-4 ring-emerald-100",
                !isActive && !isComplete && "bg-gray-200 text-gray-500"
              )}>
                {isComplete ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              {idx < 3 && (
                <div className={cn(
                  "w-8 h-0.5 mx-1",
                  isComplete ? "bg-emerald-500" : "bg-gray-200"
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ID Card Capture */}
      {step === 'id' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Image className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Upload ID Document</h3>
            <p className="text-sm text-gray-500 mt-1">
              Take a clear photo of your government-issued ID
            </p>
          </div>

          {isCapturing ? (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-2 border-emerald-400 rounded-lg h-[60%] pointer-events-none" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-white/90 rounded-full font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => capturePhoto('id')}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-full font-medium flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleFileUpload('id')}
              className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all"
            >
              <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="font-medium text-gray-700">Tap to upload ID</p>
              <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-4">Supports: JPG, PNG, PDF</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startCamera}
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Use Camera
            </button>
            <button
              onClick={() => handleFileUpload('id')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload File
            </button>
          </div>

          {idImage && (
            <button
              onClick={() => setStep('selfie')}
              className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium"
            >
              Continue with ID
            </button>
          )}
        </motion.div>
      )}

      {/* Selfie Capture */}
      {step === 'selfie' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Take a Selfie</h3>
            <p className="text-sm text-gray-500 mt-1">
              Position your face within the oval
            </p>
          </div>

          {isCapturing ? (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-64 border-4 border-emerald-400 rounded-full" />
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-white/90 rounded-full font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => capturePhoto('selfie')}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-full font-medium flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleFileUpload('selfie')}
              className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all"
            >
              <User className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
              <p className="font-medium text-gray-700">Tap to take selfie</p>
              <p className="text-sm text-gray-400 mt-1">Ensure good lighting</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startCamera}
              className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Use Camera
            </button>
            <button
              onClick={() => handleFileUpload('selfie')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Photo
            </button>
          </div>
        </motion.div>
      )}

      {/* Liveness Check */}
      {step === 'liveness' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Liveness Check</h3>
            <p className="text-sm text-gray-500 mt-1">
              Verify you're a real person
            </p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 text-center">
            {isProcessing ? (
              <div className="py-8">
                <Loader2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-spin" />
                <p className="font-medium text-gray-700">Verifying...</p>
              </div>
            ) : (
              <>
                <Fingerprint className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-medium text-gray-700 mb-2">Tap to verify</p>
                <p className="text-sm text-gray-500">
                  This helps us ensure your identity is protected
                </p>
                <button
                  onClick={performLivenessCheck}
                  className="mt-4 px-8 py-3 bg-emerald-500 text-white rounded-xl font-medium"
                >
                  Verify Now
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Review */}
      {step === 'review' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Verification Complete</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your documents have been submitted
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {idImage ? (
                <img src={idImage} alt="ID" className="w-16 h-12 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-700">ID Document</p>
                <p className="text-sm text-gray-500">{idImage ? 'Uploaded' : 'Not provided'}</p>
              </div>
              {idImage && <Check className="w-5 h-5 text-emerald-500" />}
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {selfieImage ? (
                <img src={selfieImage} alt="Selfie" className="w-12 h-12 object-cover rounded-full" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-700">Selfie</p>
                <p className="text-sm text-gray-500">{selfieImage ? 'Captured' : 'Not provided'}</p>
              </div>
              {selfieImage && <Check className="w-5 h-5 text-emerald-500" />}
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-700">Liveness Check</p>
                <p className="text-sm text-gray-500">{livenessComplete ? 'Verified' : 'Pending'}</p>
              </div>
              {livenessComplete && <Check className="w-5 h-5 text-emerald-500" />}
            </div>
          </div>

          {!isAdmin && (
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium"
            >
              Submit for Verification
            </button>
          )}
        </motion.div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const currentStep = step
          if (currentStep === 'id' || currentStep === 'selfie') {
            handleFileChange(e, currentStep)
          }
        }}
      />

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default IDVerification
