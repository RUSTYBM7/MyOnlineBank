import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Building2, Users, Calendar, Trophy } from 'lucide-react'

const AboutSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const milestones = [
    { year: "1948", title: "Founded", description: "Established by 12 community members" },
    { year: "1975", title: "1K Members", description: "Reached our first thousand members" },
    { year: "1998", title: "Digital Era", description: "Launched online banking services" },
    { year: "2024", title: "Today", description: "Serving 2M+ members nationwide" }
  ]

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
              About OrbitPay
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              A Legacy of Trust
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Since 1948
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              OrbitPay Credit Union was founded on the principle that financial services should
              benefit everyone, not just shareholders. For over 75 years, we've remained committed
              to our members, offering better rates, lower fees, and exceptional service.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              As a not-for-profit cooperative, any profits we make are returned to our members
              through better savings rates, lower loan rates, and reduced fees. That's the
              credit union difference.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Users, value: "2M+", label: "Members" },
                { icon: Building2, value: "350+", label: "Branches" },
                { icon: Calendar, value: "75+", label: "Years" },
                { icon: Trophy, value: "50+", label: "Awards" }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-teal-500" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-4 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="text-sm font-bold text-emerald-600 mb-1">{milestone.year}</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
