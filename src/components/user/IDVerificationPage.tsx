import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GlassButton } from '@/components/glass';
import IDVerification from './IDVerification';

export default function IDVerificationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-emerald-100">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-emerald-800 rotate-180" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-emerald-800">Identity Verification</h1>
            <p className="text-xs text-emerald-800/60">Secure your account</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-5 py-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-lg shadow-emerald-500/10"
        >
          <IDVerification
            onComplete={() => {
              // Navigate to dashboard after successful verification
              setTimeout(() => navigate('/app'), 1500);
            }}
            onSkip={() => navigate(-1)}
          />
        </motion.div>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-emerald-100 z-50">
        <div className="max-w-lg mx-auto px-5 py-4">
          <GlassButton
            variant="ghost"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Skip for Now
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
