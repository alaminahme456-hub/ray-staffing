'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, FileText, Scale, ClipboardCheck, Eye, Compass, UserCheck, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const services = [
  {
    icon: BookOpen,
    title: 'HR Policy Support',
    description: 'Development, review, and implementation of HR policies and procedures that comply with current UK employment legislation. We help you create clear, fair, and legally sound policies covering everything from attendance and disciplinary matters to data protection and flexible working.',
  },
  {
    icon: FileText,
    title: 'Employment Documentation',
    description: 'Professional drafting and review of employment contracts, staff handbooks, offer letters, variation letters, settlement agreements, and other employment-related documentation. All documents are prepared in line with the Employment Rights Act 1996, Equality Act 2010, and other relevant legislation.',
  },
  {
    icon: ClipboardCheck,
    title: 'Workplace Processes',
    description: 'Design and implementation of robust workplace processes including recruitment procedures, induction programmes, appraisal systems, grievance and disciplinary frameworks, and absence management protocols that meet both legal requirements and best practice standards.',
  },
  {
    icon: Eye,
    title: 'Compliance Monitoring',
    description: 'Regular compliance audits and monitoring to ensure your HR practices, policies, and documentation remain up to date with evolving UK employment law. We identify gaps, recommend remedial actions, and help you implement changes to maintain ongoing compliance.',
  },
  {
    icon: Compass,
    title: 'HR Guidance',
    description: 'Practical, commercially-aware HR guidance on day-to-day people management issues. From handling difficult conversations and managing performance to navigating workplace conflicts and change management, our experienced advisors provide clear, actionable recommendations.',
  },
  {
    icon: UserCheck,
    title: 'Employee Lifecycle Processes',
    description: 'End-to-end support for key employee lifecycle milestones including onboarding, probation management, maternity/paternity leave, return to work, variation of terms, and exit processes — all designed to minimise legal risk and ensure a positive employee experience.',
  },
]

export default function CompliancePage() {
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
              <span className="text-white">Compliance</span>
            </motion.nav>
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
              <div className="size-14 rounded-xl bg-[#C4942A]/20 flex items-center justify-center">
                <Scale className="size-7 text-[#C4942A]" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">UK Employment Law <span className="text-[#C4942A]">Compliance</span></h1>
              </div>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              Navigating UK employment law can be complex and time-consuming. RAY provides expert HR compliance services to help your business meet its legal obligations, manage risk, and create a fair, well-documented workplace.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-[#C4942A]/5 border-b border-[#C4942A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Alert className="border-[#C4942A]/30 bg-[#C4942A]/5">
                <AlertTriangle className="size-5 text-[#C4942A] shrink-0" />
                <AlertDescription className="text-[#5A6B7F]">
                  <strong className="text-[#0B1D33]">Important Legal Disclaimer:</strong> The information, guidance, and services provided by RAY Staffing Consulting Ltd on this platform are for general informational and HR support purposes only. They do <strong>not</strong> constitute legal advice and should <strong>not</strong> be relied upon as a substitute for qualified legal advice from a solicitor or other authorised legal practitioner. Employment law is complex and subject to change. We strongly recommend that you obtain independent professional legal advice where appropriate, particularly for matters involving litigation, complex disputes, or significant business decisions. RAY accepts no liability for any loss or damage arising from reliance on information provided through our platform.
                </AlertDescription>
              </Alert>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our Compliance Services</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Expert Support for UK Employment Compliance
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              Our compliance services are designed to help UK businesses of all sizes understand and meet their employment law obligations.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={fadeInUp} transition={{ duration: 0.4 }}>
                <Card className="h-full bg-white border-[#D1D9E6] hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="size-11 rounded-lg bg-[#0B1D33] flex items-center justify-center mb-3">
                      <service.icon className="size-5 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-lg text-[#0B1D33]">{service.title}</CardTitle>
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

      {/* Key Legislation Reference */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div>
              <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Knowledge Base</motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-6 leading-tight">
                Key UK Employment Legislation
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#5A6B7F] leading-relaxed mb-6">
                Our compliance services are informed by current UK employment legislation. Below are some of the key legislative frameworks that shape our guidance. This list is for reference only and is not exhaustive.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button
                  onClick={() => navigate('contact')}
                  className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white font-semibold"
                >
                  Discuss Your Compliance Needs
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="space-y-3">
              {[
                'Employment Rights Act 1996',
                'Equality Act 2010',
                'Data Protection Act 2018 & UK GDPR',
                'Working Time Regulations 1998',
                'National Minimum Wage Act 1998',
                'Employment Tribunals Act 1996',
                'Health and Safety at Work etc. Act 1974',
                'Maternity and Parental Leave etc. Regulations 1999',
                'Transfer of Undertakings (TUPE) Regulations 2006',
                'Flexible Working Regulations 2014',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-[#F7F9FC] rounded-lg px-4 py-3">
                  <Scale className="size-4 text-[#C4942A] shrink-0" />
                  <span className="text-[#0B1D33] text-sm font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Disclaimer */}
      <section className="bg-[#F7F9FC] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#5A6B7F] text-sm text-center leading-relaxed max-w-4xl mx-auto">
            RAY Staffing Consulting Ltd is not a law firm and does not hold itself out as providing legal services. Our HR compliance services are designed to support businesses in understanding their obligations and implementing best practices. For legal advice on specific matters, please consult a qualified solicitor or legal practitioner. The presence of legislative references on this page does not imply legal expertise or authority to practise law.
          </p>
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
              Need Compliance Support?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Get in touch with our HR compliance team to discuss your requirements. We are here to help you navigate UK employment law with confidence.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => navigate('contact')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12"
              >
                Speak to Our Team
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
