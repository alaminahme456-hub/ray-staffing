'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, MapPin, Clock, Heart, Zap, GraduationCap, Shield, Home, ArrowRight, Gift, Users, Laptop } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const positions = [
  {
    title: 'Senior Healthcare Recruitment Consultant',
    department: 'Recruitment',
    location: 'London (Hybrid)',
    type: 'Full-time',
    description: 'Join our healthcare recruitment team to source, screen, and place nursing and care professionals across NHS and private sector clients. Requires proven healthcare recruitment experience and strong compliance knowledge.',
  },
  {
    title: 'HR Compliance Advisor',
    department: 'HR & Compliance',
    location: 'London (Hybrid)',
    type: 'Full-time',
    description: 'Provide expert HR compliance guidance to our client base, supporting policy development, employment documentation, and workplace process design. CIPD qualification preferred.',
  },
  {
    title: 'Housing Services Coordinator',
    department: 'Housing',
    location: 'London',
    type: 'Full-time',
    description: 'Coordinate housing management services for our tenant base, managing rent accounting, repair requests, and tenant communications. Experience in social or private housing management essential.',
  },
  {
    title: 'Full-Stack Developer',
    department: 'Technology',
    location: 'Remote (UK)',
    type: 'Full-time',
    description: 'Help build and improve our digital platform across housing, HR, and recruitment products. Strong TypeScript/React skills required. Experience with Next.js, Node.js, and relational databases advantageous.',
  },
]

const benefits = [
  { icon: Heart, title: 'Competitive Salary', description: 'Market-competitive pay with regular reviews and performance-based bonuses.' },
  { icon: Home, title: 'Flexible Working', description: 'Hybrid and remote working options available for many roles.' },
  { icon: GraduationCap, title: 'Professional Development', description: 'Funded training, qualifications, and conference attendance.' },
  { icon: Gift, title: 'Generous Leave', description: '25 days annual leave plus bank holidays, increasing with service.' },
  { icon: Shield, title: 'Health & Wellbeing', description: 'Private health insurance, employee assistance programme, and wellbeing initiatives.' },
  { icon: Laptop, title: 'Technology Package', description: 'Modern equipment and tools provided for all team members.' },
]

export default function CareersPage() {
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
              <span className="text-white">Careers</span>
            </motion.nav>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Careers at <span className="text-[#C4942A]">RAY</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              Join a growing, mission-driven company that is making a real difference. At RAY, you will work alongside talented professionals, develop your skills, and contribute to services that improve lives across the UK.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Why Work at RAY */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Why RAY</motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-6 leading-tight">
                Why Work at RAY?
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-4 text-[#5A6B7F] leading-relaxed">
                <p>
                  RAY is more than a workplace — it is a place where your contributions have meaning. We are building something important: an integrated platform that supports housing management, HR compliance, and specialist recruitment across the UK.
                </p>
                <p>
                  Our team is our greatest asset. We foster a culture of collaboration, respect, and continuous improvement. Every team member has a voice, and we believe that the best ideas come from diverse perspectives working together toward a common goal.
                </p>
                <p>
                  As a growing company, we offer genuine opportunities for career progression. Whether you join us in recruitment, HR, housing, or technology, you will have the chance to develop your expertise, take on new challenges, and shape the future of RAY.
                </p>
              </motion.div>
            </div>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className="bg-[#F7F9FC] rounded-xl p-4">
                  <b.icon className="size-6 text-[#C4942A] mb-2" />
                  <h4 className="font-semibold text-[#0B1D33] text-sm mb-1">{b.title}</h4>
                  <p className="text-[#5A6B7F] text-xs leading-relaxed">{b.description}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator className="bg-[#D1D9E6]" />

      {/* Open Positions */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Open Positions</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Current Vacancies
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              We are always looking for talented, motivated individuals to join our team. Explore our current openings below.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="space-y-4 max-w-4xl mx-auto"
          >
            {positions.map((pos) => (
              <motion.div key={pos.title} variants={fadeInUp} transition={{ duration: 0.35 }}>
                <Card className="bg-white border-[#D1D9E6] hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg text-[#0B1D33]">{pos.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Badge variant="secondary" className="bg-[#0B1D33]/5 text-[#5A6B7F] border-0 text-xs">{pos.department}</Badge>
                          <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                            <MapPin className="size-3" /> {pos.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                            <Clock className="size-3" /> {pos.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#5A6B7F] text-sm leading-relaxed">{pos.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button
                      onClick={() => navigate('contact')}
                      variant="outline"
                      size="sm"
                      className="border-[#0B1D33] text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white"
                    >
                      Apply Now <ArrowRight className="ml-1 size-3" />
                    </Button>
                  </CardFooter>
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
              Don&rsquo;t See the Right Role?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              We are always interested in hearing from talented professionals. Send us your CV and let us know how you could contribute to the RAY team.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => navigate('contact')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base"
              >
                Send Your CV
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
