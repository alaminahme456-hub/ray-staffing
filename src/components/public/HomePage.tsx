'use client'

import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  House,
  Shield,
  Users,
  ArrowRight,
  Heart,
  CheckCircle,
  Headphones,
  Cpu,
  Handshake,
  Briefcase,
  Clock,
  Phone,
} from 'lucide-react'

export default function HomePage() {
  const { navigate, user } = useAppStore()

  const handleDashboardClick = () => {
    if (user) {
      if (
        user.role === 'SUPER_ADMIN' ||
        user.role === 'HOUSING_ADMIN' ||
        user.role === 'RECRUITMENT_ADMIN' ||
        user.role === 'HR_ADMIN' ||
        user.role === 'LOCAL_ADMIN' ||
        user.role === 'SUPPORT_STAFF'
      ) {
        navigate('admin-dashboard')
      } else if (user.role === 'customer') {
        navigate('customer-dashboard')
      } else if (user.role === 'candidate') {
        navigate('seeker-dashboard')
      } else if (user.role === 'employer') {
        navigate('employer-dashboard')
      } else {
        navigate('admin-dashboard')
      }
    } else {
      navigate('register')
    }
  }

  return (
    <main className="min-h-screen">
      {/* ═══════ HERO ═══════ */}
      <section
        id="hero-section"
        className="relative overflow-hidden min-h-[92vh] flex items-center"
        style={{
          background: 'linear-gradient(160deg, #050E07 0%, #0A1F0D 60%, #0F2B18 100%)',
        }}
      >
        {/* Mobile: Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover lg:hidden opacity-25"
          aria-hidden="true"
        >
          <source src="/videos/hero-mobile.mp4" type="video/mp4" />
        </video>

        {/* Mobile: Dark gradient overlay for optimal text contrast */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-[#050E07]/90 via-[#0A1F0D]/75 to-[#050E07]" />

        {/* Subtle radial accent glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(196,148,42,0.14),transparent_55%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[75vh] lg:min-h-[80vh]">
            {/* ── Text Content (Left side on desktop, full width on mobile) ── */}
            <div className="lg:col-span-7 max-w-2xl">
              {/* Gold Subheading from Reference */}
              <div className="mb-4">
                <span className="text-[#C4942A] font-bold text-xs sm:text-sm tracking-[0.24em] uppercase block">
                  RAY STAFFING CONSULTING LTD
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.12] mb-6 tracking-tight">
                <span className="text-[#FAF8F5]">Quality Housing.</span>
                <br />
                <span className="text-[#C4942A]">Smarter HR.</span>{' '}
                <span className="text-[#FAF8F5]">Exceptional Talent.</span>
              </h1>

              {/* Descriptive Paragraph */}
              <p className="text-base sm:text-lg leading-relaxed mb-8 text-[#CAD6CE] max-w-xl">
                RAY is a UK-licensed professional services company delivering trusted housing management,
                expert HR &amp; compliance support, and specialist recruitment across England and Wales.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5">
                <Button
                  id="hero-explore-cta"
                  onClick={() => navigate('services')}
                  size="lg"
                  className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-7 h-12 text-base shadow-lg shadow-[#C4942A]/20 cursor-pointer transition-all duration-200"
                >
                  Explore Our Services
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  id="hero-dashboard-cta"
                  onClick={handleDashboardClick}
                  size="lg"
                  className="bg-[#0F2B18] hover:bg-[#163D23] text-[#FAF8F5] font-semibold px-7 h-12 text-base border border-[#C4942A]/30 cursor-pointer transition-all duration-200"
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* ── Desktop Feature Card (Right side) ── */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-gradient-to-br from-[#0A1F0D] to-[#050E07]">
                <div className="h-[460px] xl:h-[500px] overflow-hidden relative">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/videos/hero-house.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050E07] via-transparent to-transparent" />
                </div>
                <div className="p-6 border-t border-white/10 bg-[#061509]/90">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#C4942A] text-xs font-semibold uppercase tracking-wider">Trusted Operations</p>
                      <p className="text-white text-sm font-medium mt-0.5">England &amp; Wales Nationwide Coverage</p>
                    </div>
                    <Button
                      id="hero-quick-contact-btn"
                      onClick={() => navigate('contact')}
                      size="sm"
                      variant="outline"
                      className="border-[#C4942A]/40 text-[#FAF8F5] hover:bg-[#C4942A]/10 text-xs"
                    >
                      <Phone className="size-3.5 mr-1.5" />
                      Contact Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAF8F5] to-transparent pointer-events-none" />
      </section>

      {/* ═══════ THREE PILLARS / SERVICES ═══════ */}
      <section id="services-section" className="bg-[#FAF8F5] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Our Services</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1F0D] mb-4">
              Three Pillars of Integrated Excellence
            </h2>
            <p className="text-[#5C7362] text-lg max-w-2xl mx-auto">
              From housing management to HR compliance and specialist recruitment, RAY delivers comprehensive professional services under one trusted brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: House,
                title: 'Housing Services',
                subtitle: 'Tenancy & Property Management',
                description:
                  'Comprehensive housing management for social housing tenants, private renters, estate & leaseholders, and supported housing. Featuring digital rent statements, repair tracking, and dedicated tenancy support — all in one platform.',
                highlights: [
                  'Full tenancy management & onboarding',
                  'Online rent tracking & balance statements',
                  'Emergency & routine repair requests',
                  'Supported living & estate services',
                ],
                link: 'housing',
              },
              {
                icon: Shield,
                title: 'HR & Compliance',
                subtitle: 'UK Employment Law & Advisory',
                description:
                  'Expert HR consultancy, UK employment law guidance, policy drafting, and regulatory compliance monitoring. We help organizations navigate complex employment standards with confidence, precision, and clarity.',
                highlights: [
                  'Contracts, handbooks & policies',
                  'Disciplinary & grievance management',
                  'Right to Work & statutory compliance',
                  'Bespoke SME HR advisory retainers',
                ],
                link: 'compliance',
              },
              {
                icon: Users,
                title: 'Recruitment & Talent',
                subtitle: 'Specialist Staffing Solutions',
                description:
                  'Specialist recruitment across healthcare, social care, and professional sectors. From candidate sourcing to verified placement, we connect exceptional talent with outstanding opportunities across the UK.',
                highlights: [
                  'NHS & private healthcare placements',
                  'Social care & support worker staffing',
                  'Rigorous DBS, NMC & vetting checks',
                  'Fast, reliable talent matching',
                ],
                link: 'healthcare',
              },
            ].map((service) => (
              <Card
                key={service.title}
                className="group h-full bg-white border-[#D1DDD4]/70 hover:shadow-xl hover:shadow-[#0A1F0D]/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                onClick={() => navigate(service.link as any)}
              >
                <CardHeader>
                  <div className="size-14 rounded-xl bg-[#0A1F0D] flex items-center justify-center mb-3">
                    <service.icon className="size-7 text-[#C4942A]" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#0A1F0D]">{service.title}</CardTitle>
                  <p className="text-xs font-semibold text-[#C4942A] tracking-wide uppercase mt-0.5">
                    {service.subtitle}
                  </p>
                  <CardDescription className="text-[#5C7362] leading-relaxed mt-2 text-sm">
                    {service.description}
                  </CardDescription>

                  <div className="mt-4 pt-4 border-t border-[#E8EDE9] space-y-2">
                    {service.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-[#425848]">
                        <CheckCircle className="size-3.5 text-[#C4942A] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>

                <CardFooter className="pt-2">
                  <span className="text-[#C4942A] font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Learn More <ArrowRight className="size-4" />
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY RAY ═══════ */}
      <section id="why-ray-section" className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Why Choose RAY</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1F0D] mb-4">
              Built on Trust, Driven by Results
            </h2>
            <p className="text-[#5C7362] text-lg max-w-2xl mx-auto">
              We combine deep UK market knowledge with modern technology to deliver services that genuinely make a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Trusted UK Company',
                description:
                  'Licensed and operating across England and Wales, we maintain the highest standards of professional conduct, data privacy, and regulatory compliance.',
              },
              {
                icon: Shield,
                title: 'Compliance Focus',
                description:
                  'Every service we deliver is underpinned by rigorous compliance frameworks, ensuring your business stays on the right side of UK employment and housing law.',
              },
              {
                icon: Heart,
                title: 'Specialist Sectors',
                description:
                  'From healthcare and social care to housing management, our teams specialise in the sectors that matter most to communities across the UK.',
              },
              {
                icon: Handshake,
                title: 'Personal Service',
                description:
                  'We believe in building lasting relationships. Every client is assigned a dedicated point of contact who understands their unique operational requirements.',
              },
              {
                icon: Cpu,
                title: 'Technology-Enabled',
                description:
                  'Our digital platform streamlines housing management, HR processes, and recruitment — saving you time and reducing administrative burden.',
              },
              {
                icon: Headphones,
                title: 'Dedicated Support',
                description:
                  'Our support teams are available to assist with enquiries, resolve issues promptly, and ensure a smooth experience at every stage.',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="shrink-0 size-12 rounded-lg bg-[#E8EDE9] flex items-center justify-center">
                  <feature.icon className="size-6 text-[#0A1F0D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1F0D] mb-1.5">{feature.title}</h3>
                  <p className="text-[#5C7362] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HEALTHCARE SECTOR ═══════ */}
      <section id="healthcare-section" className="bg-[#E8EDE9] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #050E07 0%, #0A1F0D 60%, #0F2B18 100%)' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,148,42,0.14),transparent_60%)] pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-12 rounded-xl bg-[#C4942A]/15 flex items-center justify-center">
                    <Heart className="size-6 text-[#C4942A]" />
                  </div>
                  <Badge className="bg-[#C4942A]/15 text-[#C4942A] border-[#C4942A]/25 text-xs font-semibold uppercase tracking-wider">
                    Healthcare &amp; Care Staffing
                  </Badge>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] mb-4 leading-tight">
                  Specialist Staffing for Health &amp; Social Care
                </h2>
                <p className="text-[#9BADA0] leading-relaxed mb-8 text-base">
                  The UK healthcare sector faces unprecedented demand for skilled professionals. RAY provides specialist recruitment services for NHS trusts, private healthcare providers, care homes, and supported living services. Our rigorous screening, compliance checks, and candidate matching ensure you get the right people — first time.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    id="find-healthcare-talent-btn"
                    onClick={() => navigate('healthcare')}
                    className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 shadow-lg shadow-[#C4942A]/20 cursor-pointer"
                  >
                    Find Healthcare Talent
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                  <Button
                    id="browse-healthcare-jobs-btn"
                    onClick={() => navigate('job-seekers')}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-6 h-12 cursor-pointer"
                  >
                    Browse Healthcare Jobs
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Candidates Placed', value: '500+' },
                  { label: 'Healthcare Partners', value: '120+' },
                  { label: 'Compliance Rate', value: '99.5%' },
                  { label: 'Avg. Fill Time', value: '< 5 Days' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 text-center transition-all hover:bg-white/10"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-[#C4942A]">{stat.value}</p>
                    <p className="text-[#CAD6CE] text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section
        id="cta-section"
        className="py-16 lg:py-24 text-center"
        style={{ background: 'linear-gradient(160deg, #050E07 0%, #0A1F0D 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#FAF8F5] mb-4">
              Ready to Work with RAY?
            </h2>
            <p className="text-[#9BADA0] text-lg max-w-2xl mx-auto mb-10">
              Whether you are an employer seeking exceptional talent, a landlord or tenant looking for housing support, or a professional looking for your next opportunity, RAY is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                id="cta-for-employers"
                onClick={() => navigate('employers')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base shadow-lg shadow-[#C4942A]/20 cursor-pointer"
              >
                <Users className="mr-2 size-5" />
                For Employers
              </Button>
              <Button
                id="cta-for-job-seekers"
                onClick={() => navigate('job-seekers')}
                variant="outline"
                size="lg"
                className="border-[#C4942A]/40 text-[#FAF8F5] hover:bg-[#C4942A]/10 hover:text-[#FAF8F5] hover:border-[#C4942A]/60 font-semibold px-8 h-12 text-base cursor-pointer"
              >
                <Briefcase className="mr-2 size-5" />
                For Job Seekers
              </Button>
              <Button
                id="cta-contact-team"
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="border-white/20 text-[#CAD6CE] hover:bg-white/10 hover:text-white font-medium px-8 h-12 text-base cursor-pointer"
              >
                <Phone className="mr-2 size-5" />
                Contact Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
