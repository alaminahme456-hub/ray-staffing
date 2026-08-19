'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, Heart, Search, UserCheck, MapPin, Building2, FileCheck, CalendarClock, ArrowRight, Stethoscope, Activity, ClipboardList, ShieldCheck, Users, BarChart3 } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const sections = [
  {
    icon: Stethoscope,
    title: 'Healthcare Staffing',
    description: 'RAY provides specialist staffing solutions for the UK healthcare sector. We work with NHS trusts, private hospitals, care homes, domiciliary care agencies, and supported living providers to deliver qualified, compliant professionals who are ready to make an immediate impact.',
    details: ['Registered Nurses (RGN, RMN, RNLD)', 'Healthcare Assistants & Support Workers', 'Allied Health Professionals', 'Social Care Workers', 'Senior Care & Management Staff'],
  },
  {
    icon: Search,
    title: 'Candidate Sourcing',
    description: 'Our multi-channel sourcing approach ensures we reach the widest possible pool of qualified healthcare candidates. We combine digital advertising, professional networks, referral programmes, and direct outreach to identify the right professionals for every role.',
    details: ['Targeted job advertising across multiple platforms', 'Active candidate engagement and headhunting', 'Referral and recommendation programmes', 'Partnerships with training providers', 'International candidate sourcing (where eligible)'],
  },
  {
    icon: UserCheck,
    title: 'Candidate Screening',
    description: 'Every healthcare candidate undergoes a thorough screening process designed to verify qualifications, assess competency, and ensure full compliance with sector-specific requirements. Our screening protocols are robust, consistent, and aligned with industry best practice.',
    details: ['Identity verification and right to work checks', 'Professional registration verification (NMC, HCPC)', 'Enhanced DBS checks and disclosure management', 'Employment history and reference verification', 'Mandatory training compliance review'],
  },
  {
    icon: MapPin,
    title: 'Placement',
    description: 'Our placement service goes beyond simple matching. We consider clinical requirements, team dynamics, location preferences, and career development goals to ensure placements that are successful for both the professional and the employer.',
    details: ['Role-matched placements based on skills and preferences', 'Temporary, contract, and permanent placement options', 'Competitive pay rate negotiation', 'Orientation and induction support', 'Ongoing placement monitoring and feedback'],
  },
  {
    icon: Building2,
    title: 'Employer Support',
    description: 'We provide comprehensive support to healthcare employers throughout the recruitment and staffing process. From workforce planning and role specification to onboarding and retention strategies, our team acts as an extension of your HR function.',
    details: ['Workforce planning and needs assessment', 'Role specification and job description development', 'Salary benchmarking and market intelligence', 'Onboarding programme design and support', 'Retention strategy consultation'],
  },
  {
    icon: FileCheck,
    title: 'Compliance & Document Management',
    description: 'Healthcare staffing compliance is non-negotiable. RAY maintains rigorous document management systems to ensure every placement meets regulatory requirements and that all compliance documentation is current, accessible, and audit-ready.',
    details: ['Centralised compliance document storage', 'Automated expiry alerts and renewal tracking', 'Audit-ready compliance reporting', 'Regulatory requirement monitoring and updates', 'Secure document sharing with employers'],
  },
  {
    icon: CalendarClock,
    title: 'Workforce Management',
    description: 'For healthcare providers needing ongoing staffing support, our workforce management services help you maintain optimal staffing levels, manage rotas, handle last-minute cover requirements, and ensure continuity of care for your service users.',
    details: ['Shift and rota management support', 'Last-minute and emergency cover', 'Bank and agency worker coordination', 'Staffing level monitoring and reporting', 'Cost management and budget tracking'],
  },
]

export default function HealthcarePage() {
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
              <span className="text-white">Healthcare Staffing</span>
            </motion.nav>
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
              <div className="size-14 rounded-xl bg-[#C4942A]/20 flex items-center justify-center">
                <Heart className="size-7 text-[#C4942A]" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Specialist Health &amp; <span className="text-[#C4942A]">Care Staffing</span></h1>
              </div>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              RAY delivers specialist recruitment and staffing solutions for the UK healthcare and social care sectors. From NHS trusts to private care providers, we connect skilled professionals with meaningful roles that make a real difference to people&rsquo;s lives.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-[#1A3A5C] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: '500+', label: 'Healthcare Professionals Placed' },
              { value: '120+', label: 'Healthcare Organisations Served' },
              { value: '99.5%', label: 'Compliance Check Rate' },
              { value: '< 5 Days', label: 'Average Time to Fill' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <p className="text-3xl sm:text-4xl font-bold text-[#C4942A]">{stat.value}</p>
                <p className="text-gray-300 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Sections */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our Approach</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              End-to-End Healthcare Staffing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              From initial candidate sourcing through to ongoing workforce management, RAY provides comprehensive support at every stage of the healthcare staffing journey.
            </motion.p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={staggerContainer}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 items-start ${index % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                  <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-lg bg-[#0B1D33] flex items-center justify-center">
                        <section.icon className="size-5 text-[#C4942A]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0B1D33]">{section.title}</h3>
                    </motion.div>
                    <motion.p variants={fadeInUp} className="text-[#5A6B7F] leading-relaxed">
                      {section.description}
                    </motion.p>
                  </div>
                  <motion.div variants={fadeInUp} className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="bg-white rounded-xl p-5 border border-[#D1D9E6]">
                      <h4 className="font-semibold text-[#0B1D33] text-sm mb-3">Key Capabilities</h4>
                      <ul className="space-y-2">
                        {section.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-sm text-[#5A6B7F]">
                            <ShieldCheck className="size-4 text-[#C4942A] shrink-0 mt-0.5" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
                {index < sections.length - 1 && <Separator className="mt-12 bg-[#D1D9E6]" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-[#0B1D33] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 text-center">
              <Building2 className="size-10 text-[#C4942A] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Looking for Healthcare Talent?</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Access our network of vetted healthcare professionals. Let RAY find the right people for your organisation.
              </p>
              <Button
                onClick={() => navigate('employers')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 w-full sm:w-auto"
              >
                Find Healthcare Talent
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 text-center">
              <Users className="size-10 text-[#C4942A] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Looking for Healthcare Jobs?</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Browse available positions, create your profile, and take the next step in your healthcare career.
              </p>
              <Button
                onClick={() => navigate('seeker-jobs')}
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12 w-full sm:w-auto"
              >
                Find Healthcare Jobs
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
