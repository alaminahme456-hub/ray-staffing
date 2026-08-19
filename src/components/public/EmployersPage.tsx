'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ChevronRight, UserPlus, FileEdit, Search, Sparkles, LayoutList, Calendar, GitBranch, Upload, MessageSquare, BarChart3, ArrowRight } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const features = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Register your organisation on the RAY platform and set up your employer profile. Specify your industry, company size, and recruitment needs to receive tailored support from our team.',
  },
  {
    icon: FileEdit,
    title: 'Create Vacancies',
    description: 'Post job vacancies with detailed descriptions, requirements, salary information, and contract terms. Our structured vacancy creation process ensures your roles attract the right candidates.',
  },
  {
    icon: Search,
    title: 'Search Candidates',
    description: 'Access our database of registered professionals and search by skills, qualifications, experience, location, and availability. Advanced filtering helps you identify the best matches quickly.',
  },
  {
    icon: Sparkles,
    title: 'Receive Recommendations',
    description: 'Our matching technology analyses your vacancies and recommends suitable candidates from our pool. Receive curated shortlists that save you time and improve hiring quality.',
  },
  {
    icon: LayoutList,
    title: 'Manage Applications',
    description: 'Review, shortlist, and manage all applications for your vacancies from one central dashboard. Communicate with candidates, share feedback with your team, and progress candidates through your pipeline.',
  },
  {
    icon: Calendar,
    title: 'Schedule Interviews',
    description: 'Coordinate interviews directly through the platform. Send interview invitations, manage availability, and keep all scheduling communications in one place for a seamless candidate experience.',
  },
  {
    icon: GitBranch,
    title: 'Manage Recruitment Stages',
    description: 'Define and manage your recruitment workflow stages — from initial screening and assessment to final offer and onboarding. Customisable pipelines that fit your organisation\'s process.',
  },
  {
    icon: Upload,
    title: 'Upload Documents',
    description: 'Store and manage recruitment-related documents including job descriptions, person specifications, assessment criteria, and offer templates. Centralised document management for your hiring team.',
  },
  {
    icon: MessageSquare,
    title: 'Communicate',
    description: 'Message candidates and your RAY recruitment consultant directly through the platform. Keep all recruitment communications organised, searchable, and accessible to authorised team members.',
  },
  {
    icon: BarChart3,
    title: 'Track Activity',
    description: 'Monitor your recruitment performance with comprehensive activity tracking and reporting. Understand your hiring metrics, identify bottlenecks, and make data-driven improvements to your recruitment process.',
  },
]

export default function EmployersPage() {
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
              <span className="text-white">Employers</span>
            </motion.nav>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              For <span className="text-[#C4942A]">Professional Employers</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              RAY\'s employer platform gives you everything you need to attract, evaluate, and hire exceptional talent. From vacancy creation and candidate sourcing to interview scheduling and placement management — all in one powerful, easy-to-use system.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Employer Platform</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Complete Recruitment Management
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              Our platform provides all the tools you need to manage your entire recruitment process efficiently, from posting vacancies to making offers.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp} transition={{ duration: 0.3 }}>
                <Card className="h-full bg-white border-[#D1D9E6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <CardHeader>
                    <div className="size-10 rounded-lg bg-[#0B1D33] flex items-center justify-center mb-2">
                      <feature.icon className="size-5 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-sm text-[#0B1D33] leading-snug">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#5A6B7F] text-xs leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1D33] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start Hiring with RAY
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Create your employer account today and gain access to our full suite of recruitment tools and our network of qualified professionals.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => navigate('register-employer')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base"
              >
                Create Employer Account
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
