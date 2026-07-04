import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { User, Home, Car, GraduationCap } from 'lucide-react'

const PersonalBankingSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const loans = [
    {
      icon: Home,
      title: "Mortgage Loans",
      description: "Dream home financing with competitive rates",
      rate: "As low as 5.99%",
      term: "Up to 30 years"
    },
    {
      icon: Car,
      title: "Auto Loans",
      description: "Get behind the wheel with great rates",
      rate: "As low as 4.49%",
      term: "Up to 84 months"
    },
    {
      icon: GraduationCap,
      title: "Student Loans",
      description: "Invest in your future education",
      rate: "As low as 3.99%",
      term: "Flexible repayment"
    },
    {
      icon: User,
      title: "Personal Loans",
      description: "For any life goal or unexpected expense",
      rate: "As low as 7.99%",
      term: "Up to 60 months"
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
            Personal Banking
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loans for Every Need
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Whether you're buying a home, a car, or investing in your education,
            we have flexible loan options with competitive rates.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {loans.map((loan, index) => (
            <motion.div
              key={loan.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <loan.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{loan.title}</h3>
                    <p className="text-gray-600 mb-4">{loan.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-emerald-50 rounded-xl px-4 py-2">
                        <div className="text-sm text-gray-500">Rate</div>
                        <div className="font-bold text-emerald-600">{loan.rate}</div>
                      </div>
                      <div className="bg-emerald-50 rounded-xl px-4 py-2">
                        <div className="text-sm text-gray-500">Term</div>
                        <div className="font-bold text-emerald-600">{loan.term}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PersonalBankingSection
