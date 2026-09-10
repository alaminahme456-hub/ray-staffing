'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ChevronRight, Search, Upload, UserCircle, Star, LayoutList, Bell, FolderOpen, MessageSquare, Sparkles, ArrowRight } from 'lucide-react'

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
    icon: Search,
    title: 'Search Jobs',
    description: 'Browse our comprehensive job board with powerful filtering by sector, location, salary range, contract type, and more. Find roles that match your skills, experience, and career aspirations across healthcare, social care, and professional services.',
  },
  {
    icon: Upload,
    title: 'Upload CV',
    description: 'Upload your CV in multiple formats and let employers find you. Our system parses your CV to extract key information, making it easier for recruiters to match you with relevant opportunities.',
  },
  {
    icon: UserCircle,
    title: 'Create Profile',
    description: 'Build a comprehensive professional profile that showcases your experience, qualifications, and career objectives. A well-completed profile significantly increases your visibility to employers and recruiters.',
  },
  {
    icon: Star,
    title: 'Build Skills Profile',
    description: 'Detail your professional skills, competencies, and certifications. Our skills framework helps employers understand your capabilities at a glance and improves the relevance of job recommendations you receive.',
  },
  {
    icon: LayoutList,
    title: 'Track Applications',
    description: 'Monitor the status of all your job applications from one central dashboard. See when your application has been viewed, shortlisted, or progressed to interview stage, and receive updates at every step.',
  },
  {
    icon: Bell,
    title: 'Job Alerts',
    description: 'Set up custom job alerts based on your preferred criteria and receive notifications when matching roles are posted. Never miss an opportunity that is right for you.',
  },
  {
    icon: FolderOpen,
    title: 'Manage Documents',
    description: 'Upload, store, and manage your professional documents securely. From CVs and cover letters to certificates and references, keep everything organised and readily accessible for applications.',
  },
  {
    icon: MessageSquare,
    title: 'Communicate with RAY',
    description: 'Message your RAY recruitment consultant directly through the platform. Ask questions, receive guidance, and get support throughout your job search — all from your personal dashboard.',
  },
  {
    icon: Sparkles,
    title: 'Recommended Opportunities',
    description: 'Receive personalised job recommendations based on your profile, skills, and search history. Our matching technology helps surface roles you might not have found on your own.',
  },
]

export default function JobSeekersPage() {
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
              <span className="text-white">Job Seekers</span>
            </motion.nav>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              For <span className="text-[#C4942A]">Job Seekers</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              Your career journey starts here. RAY provides the tools, support, and connections you need to find the right role and take the next step in your professional life. Whether you are a healthcare professional, a care worker, or seeking opportunities in other sectors, we are here to help.
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
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Platform Features</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Everything You Need to Succeed
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              Our job seeker platform gives you complete control over your job search, with powerful tools designed to connect you with the right opportunities.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp} transition={{ duration: 0.35 }}>
                <Card className="h-full bg-white border-[#D1D9E6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <CardHeader>
                    <div className="size-11 rounded-lg bg-[#0B1D33] flex items-center justify-center mb-3">
                      <feature.icon className="size-5 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-base text-[#0B1D33]">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#5A6B7F] text-sm leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Getting Started</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { step: '01', title: 'Create Your Profile', description: 'Register and build your professional profile with your experience, skills, and career preferences.' },
              { step: '02', title: 'Explore Opportunities', description: 'Search jobs, receive recommendations, and apply for roles that match your profile and aspirations.' },
              { step: '03', title: 'Get Placed', description: 'Work with our team through interviews, offers, and onboarding to start your new role with confidence.' },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="text-center">
                <div className="size-16 rounded-2xl bg-[#C4942A]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-[#C4942A]">{item.step}</span>
                </div>
                <h3 className="font-bold text-[#0B1D33] text-lg mb-2">{item.title}</h3>
                <p className="text-[#5A6B7F] text-sm leading-relaxed">{item.description}</p>
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
              Create Your Job Seeker Profile
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Join thousands of professionals who trust RAY to support their career journey. Registration is free and takes just a few minutes.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => navigate('register-candidate')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base"
              >
                Create Your Profile
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
