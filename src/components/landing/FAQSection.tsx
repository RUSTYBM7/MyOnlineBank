import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I open an account with OrbitPay?",
      answer: "Opening an account is easy! Click the 'Get Started' button, select your account type, and follow our simple online application. The process takes just 5-10 minutes."
    },
    {
      question: "What are the benefits of a credit union vs. a bank?",
      answer: "Credit unions are not-for-profit cooperatives owned by their members. This means we can offer better rates, lower fees, and personalized service that big banks often can't match."
    },
    {
      question: "Is my money FDIC insured?",
      answer: "Yes! Your deposits are FDIC insured up to $250,000 through the National Credit Union Administration (NCUA), just like banks."
    },
    {
      question: "How do I access mobile banking?",
      answer: "Download our app from the App Store or Google Play Store. Use your online banking credentials to log in, and set up biometric authentication for quick access."
    },
    {
      question: "What types of accounts can I open?",
      answer: "We offer savings accounts, checking accounts, money market accounts, certificates of deposit, IRAs, and more. Business accounts are also available."
    },
    {
      question: "Are there any monthly fees?",
      answer: "We believe in transparent banking. Many of our accounts have no monthly fees, and those that do offer ways to waive them through simple requirements like maintaining a minimum balance."
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
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Got questions? We've got answers. Here are some of the most common questions
            we receive from our members.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FAQSection
