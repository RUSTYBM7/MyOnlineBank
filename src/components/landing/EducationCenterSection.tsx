import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { BookOpen, GraduationCap, Calculator, Video } from 'lucide-react'

const EducationCenterSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const resources = [
    {
      icon: BookOpen,
      title: "Financial Literacy Articles",
      count: "200+",
      description: "Expert-written articles on money management"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      count: "50+",
      description: "Step-by-step guides for banking tasks"
    },
    {
      icon: Calculator,
      title: "Calculators",
      count: "30+",
      description: "Tools for planning your financial future"
    },
    {
      icon: GraduationCap,
      title: "Webinars",
      count: "Monthly",
      description: "Live and recorded educational sessions"
    }
  ]

  const articles = [
    { title: "Building Your Emergency Fund", category: "Savings", readTime: "5 min" },
    { title: "Understanding Credit Scores", category: "Credit", readTime: "8 min" },
    { title: "Retirement Planning 101", category: "Investing", readTime: "12 min" }
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
            Financial Education
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Knowledge is Power
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Empower yourself with financial knowledge. Our comprehensive education center
            provides tools and resources to help you make informed decisions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-6 h-full rounded-3xl text-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <resource.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">{resource.count}</div>
                <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-500">{resource.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-8 rounded-3xl"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h3>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div
                key={article.title}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-emerald-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{article.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{article.category}</span>
                      <span>{article.readTime} read</span>
                    </div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default EducationCenterSection
