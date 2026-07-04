import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ShieldCheck, Sparkles, Globe, Heart, Lock, Star } from 'lucide-react'

const WhyChooseSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: ShieldCheck,
      title: "FDIC Insured",
      description: "Your deposits are protected up to $250,000, giving you complete peace of mind."
    },
    {
      icon: Sparkles,
      title: "Digital-First",
      description: "Experience seamless online banking with our award-winning mobile app."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your funds worldwide with zero foreign transaction fees."
    },
    {
      icon: Heart,
      title: "Community Focus",
      description: "As a credit union, we're owned by members, not shareholders."
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "256-bit encryption and multi-factor authentication protect your accounts."
    },
    {
      icon: Star,
      title: "Award Winning",
      description: "Recognized as the #1 credit union for customer satisfaction."
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            Why OrbitPay
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Credit Union?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            For over 75 years, we've been committed to providing our members with
            exceptional financial services, competitive rates, and personalized care.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
