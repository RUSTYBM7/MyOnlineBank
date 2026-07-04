import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { BarChart, Wallet, Building, Sparkles } from 'lucide-react'

const InvestmentsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const services = [
    {
      icon: BarChart,
      title: "Wealth Management",
      description: "Personalized investment strategies tailored to your goals"
    },
    {
      icon: Wallet,
      title: "Retirement Planning",
      description: "IRA, 401(k) rollovers, and comprehensive retirement strategies"
    },
    {
      icon: Building,
      title: "College Planning",
      description: "529 plans and education savings for your family's future"
    },
    {
      icon: Sparkles,
      title: "Robo-Advisory",
      description: "Automated, low-cost investing with professional management"
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
          >
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              Investments & Wealth
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Wealth
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Secure Your Future
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our experienced financial advisors help you create a comprehensive wealth
              management strategy. Whether you're planning for retirement, your children's
              education, or building generational wealth, we're here to guide you.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {services.map((service) => (
                <div key={service.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{service.title}</h4>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity">
              Schedule a Consultation
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-8 rounded-3xl">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">$15B+</div>
                <div className="text-gray-500">Assets Under Management</div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Stocks & ETFs", value: 45, color: "bg-emerald-500" },
                  { label: "Bonds", value: 30, color: "bg-teal-500" },
                  { label: "Cash", value: 15, color: "bg-cyan-500" },
                  { label: "Alternatives", value: 10, color: "bg-blue-500" }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.value}%` } : {}}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Average Portfolio Return</span>
                  <span className="font-bold text-emerald-600">+12.5%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default InvestmentsSection
