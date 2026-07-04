import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, Users, BarChart, Briefcase } from 'lucide-react'

const BusinessBankingSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const services = [
    {
      icon: Building2,
      title: "Business Checking",
      description: "Powerful account management for your business with unlimited transactions and integrated tools.",
      features: ["Unlimited transactions", "Merchant services", "Payroll integration"]
    },
    {
      icon: Users,
      title: "Business Loans",
      description: "Flexible financing solutions to help your business grow and thrive.",
      features: ["SBA loans", "Lines of credit", "Equipment financing"]
    },
    {
      icon: BarChart,
      title: "Cash Management",
      description: "Maximize your cash flow with sophisticated treasury management tools.",
      features: ["Cash flow analysis", "Wire transfers", "Treasury services"]
    },
    {
      icon: Briefcase,
      title: "Merchant Services",
      description: "Accept payments anywhere with our comprehensive merchant solutions.",
      features: ["POS systems", "Online payments", "Mobile payments"]
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            Business Banking
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering Business Growth
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From startups to established enterprises, our business banking solutions
            are designed to support your success at every stage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BusinessBankingSection
