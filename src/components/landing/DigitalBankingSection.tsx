import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Globe,
  Lock,
  Monitor,
  Send,
  Smartphone,
  Sparkles
} from 'lucide-react';

const DigitalBankingSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: Smartphone,
      title: "Mobile Banking App",
      description: "Bank on the go with our award-winning mobile app"
    },
    {
      icon: Monitor,
      title: "Online Banking",
      description: "Full-featured online banking from any browser"
    },
    {
      icon: Sparkles,
      title: "Instant Transfers",
      description: "Send money instantly to anyone, anywhere"
    },
    {
      icon: Lock,
      title: "Biometric Login",
      description: "Face ID and fingerprint authentication"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your accounts worldwide"
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="glass-card p-8 rounded-3xl">
                <div className="bg-gray-900 rounded-2xl p-4 mb-6">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-emerald-500/20 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">S</div>
                      <div>
                        <div className="text-white text-sm font-medium">Sarah M.</div>
                        <div className="text-emerald-400 text-xs">Just paid $250 to John</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">J</div>
                      <div>
                        <div className="text-white text-sm font-medium">John D.</div>
                        <div className="text-gray-400 text-xs">Received $250 from Sarah</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Total Balance</div>
                    <div className="text-3xl font-bold text-gray-900">$45,892.50</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-gray-900">Instant Transfer!</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              Digital Banking
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Banking That
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Moves With You
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Experience the future of banking with our cutting-edge digital platform.
              Access your accounts, transfer funds, pay bills, and more - all from
              the palm of your hand.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DigitalBankingSection
