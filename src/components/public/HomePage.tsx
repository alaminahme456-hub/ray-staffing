'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { House, Shield, Users, ArrowRight, Heart, CheckCircle, Headphones, Cpu, Handshake } from 'lucide-react'

const House3DHero = lazy(() => import('./House3DHero'))

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
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center" style={{ background: 'linear-gradient(160deg, #050E07 0%, #0A1F0D 40%, #0F2B18 100%)' }}>
        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(196,148,42,0.07),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-0 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[85vh] lg:min-h-[88vh]">
            {/* ── Mobile: 3D first (order-1), Desktop: 3D second (order-2) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="order-1 lg:order-2 h-[260px] sm:h-[340px] lg:h-[520px] xl:h-[580px] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/30"
              aria-hidden="true"
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#050E07]">
                    <div className="w-6 h-6 border-2 border-[#C4942A]/20 rounded-full" />
                    <div className="absolute w-6 h-6 border-2 border-transparent border-t-[#C4942A] rounded-full animate-spin" />
                    <p className="text-[#8A9B8E] text-sm mt-4">Building your experience...</p>
                  </div>
                }
              >
                <House3DHero />
              </Suspense>
            </motion.div>

            {/* ── Mobile: Text second (order-2), Desktop: Text first (order-1) ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="order-2 lg:order-1 max-w-xl"
            >
              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C4942A]/30 bg-[#C4942A]/10">
                  <span className="text-xl font-bold text-[#C4942A]">R</span>
                </div>
                <span className="text-sm font-semibold tracking-widest uppercase text-[#8A9B8E]">RAY Staffing Consulting</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} transition={{ duration: 0.6 }} className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] mb-6">
                <span className="text-[#FAF8F5]">Quality Housing.</span>
                <br />
                <span className="text-[#C4942A]">Smarter HR.</span>{' '}
                <span className="text-[#FAF8F5]">Exceptional Talent.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} transition={{ duration: 0.5 }} className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: '#9BADA0' }}>
                RAY is a UK-licensed professional services company delivering trusted housing management, expert HR &amp; compliance support, and specialist recruitment across England and Wales.
              </motion.p>

              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button
                  onClick={() => navigate('hr-solutions')}
                  size="lg"
                  className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-7 h-12 text-base shadow-lg shadow-[#C4942A]/20"
                >
                  Explore Our Services
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  onClick={() => navigate('contact')}
                  variant="outline"
                  size="lg"
                  className="border-[#C4942A]/40 text-[#FAF8F5] hover:bg-[#C4942A]/10 hover:text-[#FAF8F5] hover:border-[#C4942A]/60 font-semibold px-7 h-12 text-base"
                >
                  Talk to RAY
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex flex-wrap gap-2.5">
                {['UK Licensed & Compliant', 'Housing Services', 'HR Consultancy', 'Specialist Recruitment', 'Health & Care Staffing'].map((item) => (
                  <Badge
                    key={item}
                    className="bg-white/5 text-[#9BADA0] border-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    <CheckCircle className="size-3 mr-1.5 text-[#C4942A]" />
                    {item}
                  </Badge>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF8F5] to-transparent" />
      </section>

      {/* ═══════ SERVICES ═══════ */}
      <section className="bg-[#FAF8F5] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our Services</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0A1F0D] mb-4">
              Three Pillars of Excellence
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5C7362] text-lg max-w-2xl mx-auto">
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
                  className="group h-full bg-white border-[#D1DDD4]/60 hover:shadow-lg hover:shadow-[#0A1F0D]/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(service.link as any)}
                >
                  <CardHeader>
                    <div className="size-14 rounded-xl bg-[#0A1F0D] flex items-center justify-center mb-3">
                      <service.icon className="size-7 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-xl text-[#0A1F0D]">{service.title}</CardTitle>
                    <CardDescription className="text-[#5C7362] leading-relaxed">{service.description}</CardDescription>
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

      {/* ═══════ WHY RAY ═══════ */}
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
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0A1F0D] mb-4">
              Built on Trust, Driven by Results
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5C7362] text-lg max-w-2xl mx-auto">
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
                <div className="shrink-0 size-12 rounded-lg bg-[#E8EDE9] flex items-center justify-center">
                  <feature.icon className="size-6 text-[#0A1F0D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1F0D] mb-1.5">{feature.title}</h3>
                  <p className="text-[#5C7362] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ HEALTHCARE ═══════ */}
      <section className="bg-[#E8EDE9] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #050E07 0%, #0A1F0D 60%, #0F2B18 100%)' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,148,42,0.12),transparent_60%)]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.div variants={fadeInUp} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-6">
                  <div className="size-12 rounded-xl bg-[#C4942A]/15 flex items-center justify-center">
                    <Heart className="size-6 text-[#C4942A]" />
                  </div>
                  <Badge className="bg-[#C4942A]/15 text-[#C4942A] border-[#C4942A]/25">Healthcare &amp; Care Staffing</Badge>
                </motion.div>
                <motion.h2 variants={fadeInUp} transition={{ duration: 0.5 }} className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] mb-4 leading-tight">
                  Specialist Staffing for Health &amp; Social Care
                </motion.h2>
                <motion.p variants={fadeInUp} transition={{ duration: 0.5 }} className="text-[#9BADA0] leading-relaxed mb-8">
                  The UK healthcare sector faces unprecedented demand for skilled professionals. RAY provides specialist recruitment services for NHS trusts, private healthcare providers, care homes, and supported living services. Our rigorous screening, compliance checks, and candidate matching ensure you get the right people — first time.
                </motion.p>
                <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                  <Button
                    onClick={() => navigate('healthcare')}
                    className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 shadow-lg shadow-[#C4942A]/20"
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
                    <p className="text-[#8A9B8E] text-sm mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(160deg, #050E07 0%, #0A1F0D 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] mb-4">
              Ready to Work with RAY?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#9BADA0] text-lg max-w-2xl mx-auto mb-10">
              Whether you are an employer seeking exceptional talent or a professional looking for your next opportunity, RAY is here to help you succeed.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('employers')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base shadow-lg shadow-[#C4942A]/20"
              >
                <Users className="mr-2 size-5" />
                For Employers
              </Button>
              <Button
                onClick={() => navigate('job-seekers')}
                variant="outline"
                size="lg"
                className="border-[#C4942A]/40 text-[#FAF8F5] hover:bg-[#C4942A]/10 hover:text-[#FAF8F5] hover:border-[#C4942A]/60 font-semibold px-8 h-12 text-base"
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
