import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const TrustedBySection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const companies = [
    { name: "Fortune 500", logo: "🏢" },
    { name: "Tech Giants", logo: "💻" },
    { name: "Healthcare", logo: "🏥" },
    { name: "Education", logo: "🎓" },
    { name: "Government", logo: "🏛️" },
    { name: "Retail", logo: "🛒" },
    { name: "Manufacturing", logo: "🏭" },
    { name: "Finance", logo: "💰" }
  ]

  return (
    <section ref={ref} className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <motion.p variants={itemVariants} className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-4">
            Trusted by Industry Leaders
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Businesses
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 max-w-2xl mx-auto">
            From startups to Fortune 500 companies, businesses choose OrbitPay Credit Union
            for their financial needs.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              variants={itemVariants}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50/50 hover:bg-emerald-50/50 transition-colors duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{company.logo}</div>
              <p className="text-sm font-medium text-gray-700">{company.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TrustedBySection
