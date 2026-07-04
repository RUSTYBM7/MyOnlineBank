import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Wallet, Building, CreditCard, BarChart, ShieldCheck, Smartphone } from 'lucide-react'

const ProductsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const products = [
    {
      icon: Wallet,
      title: "Savings Accounts",
      description: "Grow your wealth with competitive rates and no minimum balance requirements.",
      features: ["High-yield savings", "Automatic savings", "Goal tracking"]
    },
    {
      icon: Building,
      title: "Checking Accounts",
      description: "Easy access to your money with free checking and overdraft protection.",
      features: ["Free ATM access", "Direct deposit", "Online bill pay"]
    },
    {
      icon: CreditCard,
      title: "Credit Cards",
      description: "Earn rewards, build credit, and enjoy premium benefits.",
      features: ["Cash back", "Travel rewards", "Zero liability"]
    },
    {
      icon: BarChart,
      title: "Investments",
      description: "Build your portfolio with our expert guidance and diverse options.",
      features: ["Robo-advisory", "Managed portfolios", "Retirement planning"]
    },
    {
      icon: ShieldCheck,
      title: "Insurance",
      description: "Protect what matters most with comprehensive coverage.",
      features: ["Life insurance", "Auto insurance", "Home insurance"]
    },
    {
      icon: Smartphone,
      title: "Digital Banking",
      description: "Bank anytime, anywhere with our award-winning mobile app.",
      features: ["Mobile deposit", "Instant transfers", "Budget tools"]
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
            Our Products
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Financial Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From everyday banking to long-term wealth building, we offer a comprehensive suite of
            financial products designed to help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <product.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{product.title}</h3>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-500">
                      <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
