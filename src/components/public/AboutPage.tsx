'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, Shield, Award, Users, Lightbulb, Globe, Building2, Heart } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

export default function AboutPage() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0B1D33] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.nav variants={fadeInUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <button onClick={() => navigate('home')} className="hover:text-white transition-colors">Home</button>
              <ChevronRight className="size-4" />
              <span className="text-white">About RAY</span>
            </motion.nav>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              About <span className="text-[#C4942A]">RAY</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl leading-relaxed">
              A UK-focused professional services company built on integrity, expertise, and a genuine commitment to the people and communities we serve.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our Story</motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-6 leading-tight">
                Built to Serve the UK&rsquo;s Growing Professional Needs
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-4 text-[#5A6B7F] leading-relaxed">
                <p>
                  RAY Staffing Consulting Ltd was founded with a clear purpose: to provide the UK market with integrated professional services that genuinely improve outcomes for individuals, businesses, and communities. Operating across England and Wales, we bring together housing management, HR consultancy, and specialist recruitment under one trusted brand.
                </p>
                <p>
                  Our founders recognised that many organisations — particularly SMEs, housing providers, and healthcare operators — were struggling to access reliable, compliant, and affordable professional services. RAY was established to bridge that gap, offering a single point of contact for multiple essential business functions.
                </p>
                <p>
                  Today, RAY serves a growing portfolio of clients across the housing, healthcare, and professional services sectors. Our digital-first approach means we deliver services efficiently while maintaining the personal touch that our clients value. From managing tenancies and processing rent payments to sourcing and placing healthcare professionals, every aspect of our operation is designed to be transparent, compliant, and user-friendly.
                </p>
                <p>
                  We are proud to be a UK-licensed company, committed to upholding the highest standards of regulatory compliance and professional conduct in everything we do.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {[
                { icon: Globe, stat: 'England & Wales', label: 'Geographic Coverage' },
                { icon: Building2, stat: '3 Core Services', label: 'Housing, HR & Recruitment' },
                { icon: Users, stat: '1000+', label: 'Candidates in Our Network' },
                { icon: Heart, stat: '100+', label: 'Organisations Served' },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeInUp} transition={{ duration: 0.4 }}
                  className="flex items-center gap-4 bg-[#F7F9FC] rounded-xl p-5"
                >
                  <div className="shrink-0 size-12 rounded-lg bg-[#0B1D33] flex items-center justify-center">
                    <item.icon className="size-6 text-[#C4942A]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#0B1D33]">{item.stat}</p>
                    <p className="text-[#5A6B7F] text-sm">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Separator className="bg-[#D1D9E6]" />

      {/* Values Section */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our Values</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              The Principles That Guide Us
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
              Our values are not just words on a page — they shape every decision, every interaction, and every service we deliver.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Shield, title: 'Integrity', description: 'We operate with complete transparency and honesty. Our clients and candidates trust us because we do what we say we will do — every time.' },
              { icon: Award, title: 'Excellence', description: 'We set high standards for ourselves and our services. Continuous improvement is embedded in our culture, from candidate screening to client delivery.' },
              { icon: Users, title: 'Partnership', description: 'We see every engagement as a long-term partnership. By understanding our clients\' goals and challenges, we deliver solutions that create lasting value.' },
              { icon: Lightbulb, title: 'Innovation', description: 'We embrace technology and new ways of working to make our services more efficient, accessible, and effective for everyone we serve.' },
            ].map((value) => (
              <motion.div key={value.title} variants={fadeInUp} transition={{ duration: 0.4 }}>
                <Card className="h-full bg-white border-[#D1D9E6]">
                  <CardHeader>
                    <div className="size-12 rounded-xl bg-[#0B1D33] flex items-center justify-center mb-3">
                      <value.icon className="size-6 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-lg text-[#0B1D33]">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#5A6B7F] leading-relaxed">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team & Diversity Section */}
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
              <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our People</motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-6 leading-tight">
                A Diverse Team United by Purpose
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-4 text-[#5A6B7F] leading-relaxed">
                <p>
                  At RAY, we believe that diversity drives innovation and better outcomes. Our team brings together professionals with varied backgrounds, experiences, and perspectives — all united by a shared commitment to excellence and service.
                </p>
                <p>
                  From housing management specialists and HR consultants to recruitment experts and compliance professionals, our people are the foundation of everything we do. We invest in training, professional development, and a supportive working environment because we know that empowered teams deliver exceptional results.
                </p>
                <p>
                  We are an equal opportunities employer and are committed to creating an inclusive workplace where everyone can thrive, regardless of background, identity, or circumstance.
                </p>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="bg-[#F7F9FC] rounded-2xl p-8 sm:p-10">
              <h3 className="text-xl font-bold text-[#0B1D33] mb-6">Our Commitment to Diversity</h3>
              <ul className="space-y-4">
                {[
                  'Equal opportunities in recruitment and promotion',
                  'Inclusive policies that respect all backgrounds and identities',
                  'Ongoing diversity and inclusion training for all team members',
                  'Accessible services and communications for all users',
                  'Community engagement and social responsibility initiatives',
                  'Regular review and reporting on diversity metrics',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Shield className="size-5 text-[#C4942A] shrink-0 mt-0.5" />
                    <span className="text-[#5A6B7F] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
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
              Get in Touch with RAY
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              We would love to hear from you. Whether you have a question about our services or want to discuss how we can support your organisation, our team is ready to help.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => navigate('contact')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base"
              >
                Contact Our Team
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
