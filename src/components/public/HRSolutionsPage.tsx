'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, Shield, Users, FileText, Briefcase, HeartPulse, ClipboardList, Settings, LifeBuoy, ArrowRight } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const services = [
  {
    icon: Briefcase,
    title: 'HR Consultancy',
    description: 'Strategic HR advice and support for businesses of all sizes. We help you build effective people strategies, develop your HR function, and navigate complex workforce challenges with confidence.',
  },
  {
    icon: Settings,
    title: 'SME HR Support',
    description: 'Dedicated HR support for small and medium-sized enterprises that may not have an in-house HR team. From day-to-day queries to policy development, we act as your external HR department.',
  },
  {
    icon: Users,
    title: 'Recruitment',
    description: 'End-to-end recruitment services including job advertising, candidate sourcing, screening, interviewing support, and offer management. We find the right people for your organisation.',
  },
  {
    icon: HeartPulse,
    title: 'Talent Placement',
    description: 'Specialist talent placement for healthcare, social care, and professional sectors. Our deep sector knowledge ensures we match candidates not just on skills, but on culture and long-term fit.',
  },
  {
    icon: LifeBuoy,
    title: 'Workforce Support',
    description: 'Ongoing workforce management support including staff scheduling, absence management, performance guidance, and employee relations assistance to keep your operations running smoothly.',
  },
  {
    icon: ClipboardList,
    title: 'Employee Lifecycle',
    description: 'Comprehensive support across the entire employee journey — from recruitment and onboarding through to performance management, development, and offboarding — ensuring a positive experience at every stage.',
  },
  {
    icon: FileText,
    title: 'HR Documentation',
    description: 'Professional preparation and review of employment contracts, handbooks, policies, letters, and procedural documents. All documentation is drafted in accordance with current UK employment legislation.',
  },
  {
    icon: Shield,
    title: 'HR Process Support',
    description: 'Guidance and support for critical HR processes including disciplinary and grievance procedures, restructuring, redundancy consultations, and workplace investigations.',
  },
]

export default function HRSolutionsPage() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0B1D33] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.nav variants={fadeInUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <button onClick={() => navigate('home')} className="hover:text-white transition-colors">Home</button>
              <ChevronRight className="size-4" />
              <span className="text-white">HR Solutions & Recruitment</span>
            </motion.nav>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              HR Solutions &amp; <span className="text-[#C4942A]">Recruitment</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              Comprehensive HR consultancy and recruitment services designed for UK businesses. From strategic people management to specialist talent placement, RAY provides the expertise you need to build and manage a high-performing workforce.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">What We Offer</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Full-Spectrum HR & Recruitment Services
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              Whether you need day-to-day HR support, help with a specific challenge, or a complete recruitment solution, our experienced team is ready to assist.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={fadeInUp} transition={{ duration: 0.35 }}>
                <Card className="h-full bg-white border-[#D1D9E6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <CardHeader>
                    <div className="size-11 rounded-lg bg-[#0B1D33] flex items-center justify-center mb-3">
                      <service.icon className="size-5 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-base text-[#0B1D33]">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#5A6B7F] text-sm leading-relaxed">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Separator className="bg-[#D1D9E6]" />

      {/* Employer CTA */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="bg-[#0B1D33] rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,148,42,0.1),transparent_60%)]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">For Employers</motion.p>
                <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                  Are You an Employer?
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-gray-300 leading-relaxed mb-8">
                  Access our full suite of HR and recruitment tools. Create vacancies, search our candidate database, manage applications, and track your entire recruitment pipeline from one intuitive dashboard.
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Button
                    onClick={() => navigate('employers')}
                    size="lg"
                    className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12"
                  >
                    Create Employer Account
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </motion.div>
              </div>
              <div>
                <ul className="space-y-3">
                  {[
                    'Post and manage vacancies',
                    'Search and shortlist candidates',
                    'Receive AI-matched recommendations',
                    'Schedule interviews seamlessly',
                    'Track recruitment stages',
                    'Access HR documentation templates',
                  ].map((item) => (
                    <motion.li key={item} variants={fadeInUp} className="flex items-center gap-3 text-gray-300">
                      <div className="size-6 rounded-full bg-[#C4942A]/20 flex items-center justify-center shrink-0">
                        <span className="size-2 rounded-full bg-[#C4942A]" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Job Seeker CTA */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="bg-white border border-[#D1D9E6] rounded-2xl p-8 sm:p-12 lg:p-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">For Job Seekers</motion.p>
                <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4 leading-tight">
                  Are You Looking for Work?
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-[#5A6B7F] leading-relaxed mb-8">
                  Create your profile, upload your CV, and let RAY connect you with the right opportunities. Our platform makes it easy to search jobs, track applications, and manage your career journey.
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Button
                    onClick={() => navigate('job-seekers')}
                    size="lg"
                    className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white font-semibold px-8 h-12"
                  >
                    Explore Job Seeker Services
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </motion.div>
              </div>
              <div>
                <ul className="space-y-3">
                  {[
                    'Search and apply for jobs',
                    'Upload and manage your CV',
                    'Build a comprehensive skills profile',
                    'Receive recommended opportunities',
                    'Track all your applications',
                    'Set up custom job alerts',
                  ].map((item) => (
                    <motion.li key={item} variants={fadeInUp} className="flex items-center gap-3 text-[#5A6B7F]">
                      <div className="size-6 rounded-full bg-[#0B1D33]/10 flex items-center justify-center shrink-0">
                        <span className="size-2 rounded-full bg-[#0B1D33]" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
