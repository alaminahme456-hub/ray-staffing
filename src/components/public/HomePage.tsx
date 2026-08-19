'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { House, Shield, Users, ArrowRight, Heart, CheckCircle, Clock, Headphones, Cpu, Handshake } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

export default function HomePage() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D33] via-[#122B4D] to-[#1A3A5C]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,148,42,0.12),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} transition={{ duration: 0.5 }} className="text-[#C4942A] font-semibold text-sm sm:text-base tracking-wider uppercase mb-4">
              RAY Staffing Consulting Ltd
            </motion.p>
            <motion.h1 variants={fadeInUp} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Quality Housing.{' '}
              <span className="text-[#C4942A]">Smarter HR.</span>{' '}
              Exceptional Talent.
            </motion.h1>
            <motion.p variants={fadeInUp} transition={{ duration: 0.5 }} className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              RAY is a UK-licensed professional services company delivering trusted housing management, expert HR &amp; compliance support, and specialist recruitment across England and Wales.
            </motion.p>
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 mb-14">
              <Button
                onClick={() => navigate('hr-solutions')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base"
              >
                Explore Our Services
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12 text-base"
              >
                Talk to RAY
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex flex-wrap gap-3">
              {['UK Licensed & Compliant', 'Housing Services', 'HR Consultancy', 'Specialist Recruitment', 'Health & Care Staffing'].map((item) => (
                <Badge key={item} className="bg-white/10 text-white/90 border-white/20 px-3 py-1.5 text-xs sm:text-sm font-medium">
                  <CheckCircle className="size-3.5 mr-1.5 text-[#C4942A]" />
                  {item}
                </Badge>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our Services</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Three Pillars of Excellence
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              From housing management to HR compliance and specialist recruitment, RAY delivers integrated professional services under one trusted brand.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                icon: House,
                title: 'Housing Services',
                description: 'Comprehensive housing management for social housing tenants, private renters, estate & leaseholders, and supported housing. Digital rent statements, repair tracking, and tenancy support — all in one platform.',
                link: 'housing',
              },
              {
                icon: Shield,
                title: 'HR & Compliance',
                description: 'Expert HR consultancy, employment law guidance, policy development, and compliance monitoring. We help UK businesses navigate complex employment regulations with confidence and clarity.',
                link: 'compliance',
              },
              {
                icon: Users,
                title: 'Recruitment & Talent',
                description: 'Specialist recruitment across healthcare, social care, and professional sectors. From candidate sourcing to placement, we connect exceptional talent with outstanding opportunities.',
                link: 'healthcare',
              },
            ].map((service) => (
              <motion.div key={service.title} variants={fadeInUp} transition={{ duration: 0.4 }}>
                <Card
                  className="group h-full bg-white border-[#D1D9E6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(service.link as any)}
                >
                  <CardHeader>
                    <div className="size-14 rounded-xl bg-[#0B1D33] flex items-center justify-center mb-3">
                      <service.icon className="size-7 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-xl text-[#0B1D33]">{service.title}</CardTitle>
                    <CardDescription className="text-[#5A6B7F] leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <span className="text-[#C4942A] font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Learn More <ArrowRight className="size-4" />
                    </span>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why RAY Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Why Choose RAY</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Built on Trust, Driven by Results
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              We combine deep UK market knowledge with modern technology to deliver services that genuinely make a difference.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: CheckCircle, title: 'Trusted UK Company', description: 'Licensed and operating across England and Wales, we maintain the highest standards of professional conduct and regulatory compliance.' },
              { icon: Shield, title: 'Compliance Focus', description: 'Every service we deliver is underpinned by rigorous compliance frameworks, ensuring your business stays on the right side of UK employment and housing law.' },
              { icon: Heart, title: 'Specialist Sectors', description: 'From healthcare and social care to housing management, our teams specialise in the sectors that matter most to communities across the UK.' },
              { icon: Handshake, title: 'Personal Service', description: 'We believe in building lasting relationships. Every client is assigned a dedicated point of contact who understands their unique needs.' },
              { icon: Cpu, title: 'Technology-Enabled', description: 'Our digital platform streamlines housing management, HR processes, and recruitment — saving you time and reducing administrative burden.' },
              { icon: Headphones, title: 'Dedicated Support', description: 'Our support teams are available to assist with enquiries, resolve issues promptly, and ensure a smooth experience at every stage.' },
            ].map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp} transition={{ duration: 0.4 }} className="flex gap-4">
                <div className="shrink-0 size-12 rounded-lg bg-[#F0F4F8] flex items-center justify-center">
                  <feature.icon className="size-6 text-[#0B1D33]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1D33] mb-1.5">{feature.title}</h3>
                  <p className="text-[#5A6B7F] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Healthcare Section */}
      <section className="bg-[#F0F4F8] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="bg-[#0B1D33] rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,148,42,0.15),transparent_60%)]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
                  <div className="size-12 rounded-xl bg-[#C4942A]/20 flex items-center justify-center">
                    <Heart className="size-6 text-[#C4942A]" />
                  </div>
                  <Badge className="bg-[#C4942A]/20 text-[#C4942A] border-[#C4942A]/30">Healthcare & Care Staffing</Badge>
                </motion.div>
                <motion.h2 variants={fadeInUp} transition={{ duration: 0.5 }} className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                  Specialist Staffing for Health &amp; Social Care
                </motion.h2>
                <motion.p variants={fadeInUp} transition={{ duration: 0.5 }} className="text-gray-300 leading-relaxed mb-8">
                  The UK healthcare sector faces unprecedented demand for skilled professionals. RAY provides specialist recruitment services for NHS trusts, private healthcare providers, care homes, and supported living services. Our rigorous screening, compliance checks, and candidate matching ensure you get the right people — first time.
                </motion.p>
                <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Button
                    onClick={() => navigate('healthcare')}
                    className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12"
                  >
                    Find Healthcare Talent
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </motion.div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Candidates Placed', value: '500+' },
                  { label: 'Healthcare Partners', value: '120+' },
                  { label: 'Compliance Rate', value: '99.5%' },
                  { label: 'Avg. Fill Time', value: '< 5 Days' },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={fadeInUp} transition={{ duration: 0.4 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-[#C4942A]">{stat.value}</p>
                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0B1D33] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Work with RAY?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Whether you are an employer seeking exceptional talent or a professional looking for your next opportunity, RAY is here to help you succeed.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('employers')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base"
              >
                <Users className="mr-2 size-5" />
                For Employers
              </Button>
              <Button
                onClick={() => navigate('job-seekers')}
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12 text-base"
              >
                <ArrowRight className="mr-2 size-5" />
                For Job Seekers
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
