import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Smartphone, QrCode, ArrowUpDown, Bell } from 'lucide-react'

const MobileBankingSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    { icon: Smartphone, title: "Deposit Checks", description: "Snap a photo to deposit" },
    { icon: QrCode, title: "Pay Bills", description: "One-tap payments" },
    { icon: ArrowUpDown, title: "Transfer Money", description: "Instant transfers" },
    { icon: Bell, title: "Alerts", description: "Real-time notifications" }
  ]

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              Mobile Banking
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Bank Anywhere,
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Anytime
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Take your banking to go with our powerful mobile app. Available on iOS and Android,
              with all the features you need to manage your finances on the move.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                <span className="text-2xl">🍎</span>
                <span className="font-medium text-gray-700">iOS App</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                <span className="text-2xl">🤖</span>
                <span className="font-medium text-gray-700">Android App</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{feature.title}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[3rem] blur-2xl opacity-20" />
              <div className="relative glass-card p-4 rounded-[2.5rem]">
                <div className="bg-gray-900 rounded-[2rem] overflow-hidden w-64">
                  <div className="bg-emerald-500 p-4 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">OrbitPay</span>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold">$45,892.50</div>
                    <div className="text-sm opacity-80">Available Balance</div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-emerald-500" />
                      <div>
                        <div className="text-white text-sm font-medium">Sent to John</div>
                        <div className="text-gray-400 text-xs">$250.00</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-teal-500" />
                      <div>
                        <div className="text-white text-sm font-medium">Received from Sarah</div>
                        <div className="text-gray-400 text-xs">$500.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MobileBankingSection
