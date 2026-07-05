import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Car,
  Heart,
  Home,
  ShieldCheck,
  Umbrella
} from 'lucide-react';

const InsuranceSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const insuranceTypes = [
    {
      icon: Heart,
      title: "Life Insurance",
      description: "Protect your loved ones with comprehensive life coverage",
      coverage: "Up to $10M"
    },
    {
      icon: Car,
      title: "Auto Insurance",
      description: "Coverage that goes where you go, with great rates",
      coverage: "Starting at $30/mo"
    },
    {
      icon: Home,
      title: "Home Insurance",
      description: "Safeguard your home and everything in it",
      coverage: "Starting at $50/mo"
    },
    {
      icon: ShieldCheck,
      title: "Umbrella Insurance",
      description: "Extra liability protection for peace of mind",
      coverage: "Up to $5M"
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
            Insurance Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Protect What Matters Most
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive insurance solutions to protect your family, home, vehicle,
            and future. Bundled with your credit union accounts for maximum savings.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insuranceTypes.map((insurance, index) => (
            <motion.div
              key={insurance.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full rounded-3xl text-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <insurance.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{insurance.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{insurance.description}</p>
                <div className="text-emerald-600 font-bold">{insurance.coverage}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InsuranceSection
