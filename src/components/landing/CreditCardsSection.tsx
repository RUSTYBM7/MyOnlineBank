import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CreditCard, Sparkles, Plane, Gift } from 'lucide-react'

const CreditCardsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const cards = [
    {
      icon: Sparkles,
      name: "OrbitPay Rewards",
      description: "Earn unlimited 2% cash back on everything",
      annualFee: "$0",
      apr: "13.99-23.99%",
      highlight: "Best for Everyday Spending",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: Plane,
      name: "OrbitPay Travel",
      description: "3X points on travel and dining worldwide",
      annualFee: "$95",
      apr: "15.99-24.99%",
      highlight: "Best for Travelers",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Gift,
      name: "OrbitPay Platinum",
      description: "Premium benefits with no annual fee",
      annualFee: "$0",
      apr: "14.99-24.99%",
      highlight: "Best for Balance Transfers",
      color: "from-purple-400 to-pink-500"
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            Credit Cards
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Perfect Card
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover credit cards designed to fit your lifestyle. Earn rewards, enjoy premium
            benefits, and build your credit with OrbitPay.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`} />
              <div className="relative glass-card p-8 rounded-3xl h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-emerald-600 mb-2">{card.highlight}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.name}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Annual Fee</span>
                    <span className="font-bold text-gray-900">{card.annualFee}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">APR Range</span>
                    <span className="font-bold text-gray-900">{card.apr}</span>
                  </div>
                </div>

                <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${card.color} text-white font-semibold hover:opacity-90 transition-opacity`}>
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CreditCardsSection
