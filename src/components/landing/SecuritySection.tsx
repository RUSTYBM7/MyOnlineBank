import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ShieldCheck, Lock, Fingerprint, Server } from 'lucide-react'

const SecuritySection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const securityFeatures = [
    {
      icon: Lock,
      title: "256-bit Encryption",
      description: "Bank-grade encryption protects all your data"
    },
    {
      icon: Fingerprint,
      title: "Biometric Authentication",
      description: "Face ID and fingerprint for secure access"
    },
    {
      icon: ShieldCheck,
      title: "FDIC Insured",
      description: "Your deposits protected up to $250,000"
    },
    {
      icon: Server,
      title: "24/7 Monitoring",
      description: "Constant surveillance by security experts"
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              Security & Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your Security is Our
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Top Priority
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We employ industry-leading security measures to protect your financial data.
              From advanced encryption to multi-factor authentication, we've got you covered.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card p-4 rounded-2xl"
                >
                  <feature.icon className="w-8 h-8 text-emerald-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card-strong p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Security Score</div>
                  <div className="text-sm text-gray-500">Your account protection level</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Overall Security</span>
                  <span className="font-bold text-emerald-600">98%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "98%" } : {}}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Password Strength", score: 95 },
                  { label: "Two-Factor Auth", score: 100 },
                  { label: "Device Security", score: 98 },
                  { label: "Login Activity", score: 100 }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-emerald-600">{item.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Fully Protected</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default SecuritySection
