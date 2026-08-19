'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChevronRight, House, Users, Building2, Home, Heart, Calculator, Info, ArrowRight, Receipt, Wrench, FileText, ShieldCheck, MessageSquare } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

export default function HousingPage() {
  const navigate = useAppStore((s) => s.navigate)

  // Calculator state
  const [rent, setRent] = useState<string>('')
  const [serviceCharge, setServiceCharge] = useState<string>('')
  const [otherCharges, setOtherCharges] = useState<string>('')
  const [frequency, setFrequency] = useState<string>('monthly')

  const calculations = useMemo(() => {
    const r = parseFloat(rent) || 0
    const sc = parseFloat(serviceCharge) || 0
    const oc = parseFloat(otherCharges) || 0
    const periodTotal = r + sc + oc

    let monthly = periodTotal
    let annual = periodTotal * 12

    if (frequency === 'weekly') {
      monthly = periodTotal * 52 / 12
      annual = periodTotal * 52
    } else if (frequency === 'quarterly') {
      monthly = periodTotal * 4 / 12
      annual = periodTotal * 4
    }

    return { periodTotal, monthly, annual }
  }, [rent, serviceCharge, otherCharges, frequency])

  const fmt = (n: number) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
              <span className="text-white">Housing Services</span>
            </motion.nav>
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-4">
              <div className="size-14 rounded-xl bg-[#C4942A]/20 flex items-center justify-center">
                <House className="size-7 text-[#C4942A]" />
              </div>
              <div>
                <Badge className="bg-[#C4942A]/20 text-[#C4942A] border-[#C4942A]/30 mb-2">Housing Services</Badge>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Comprehensive Housing Management</h1>
              </div>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              From digital rent statements to repair tracking and tenancy support, RAY provides modern, compliant housing management services for tenants, landlords, and housing providers across England and Wales.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* My Home Overview */}
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
              <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Digital Housing Platform</motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-6 leading-tight">
                My Home Overview
              </motion.h2>
              <motion.div variants={fadeInUp} className="space-y-4 text-[#5A6B7F] leading-relaxed">
                <p>
                  Our digital housing platform puts tenants in control of their housing information. Access your rent statements, track repair requests, view your tenancy details, and communicate with your housing officer — all from one convenient online portal.
                </p>
                <p>
                  RAY&rsquo;s housing management system is designed to be transparent and easy to use. We believe that every tenant deserves clear, accessible information about their home, their account, and the services available to them.
                </p>
              </motion.div>
            </div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {[
                { icon: Receipt, title: 'Digital Rent Statements', desc: 'View and download statements anytime' },
                { icon: Wrench, title: 'Repair Tracking', desc: 'Report and track repairs online' },
                { icon: FileText, title: 'Tenancy Documents', desc: 'Access agreements and documents' },
                { icon: MessageSquare, title: 'Messaging', desc: 'Communicate with your housing officer' },
              ].map((item) => (
                <div key={item.title} className="bg-[#F7F9FC] rounded-xl p-4">
                  <item.icon className="size-6 text-[#C4942A] mb-2" />
                  <h4 className="font-semibold text-[#0B1D33] text-sm mb-1">{item.title}</h4>
                  <p className="text-[#5A6B7F] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator className="bg-[#D1D9E6]" />

      {/* Tenant Sections */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Tenant Services</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
              Tailored Support for Every Tenancy Type
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                icon: Home,
                title: 'Social Housing Tenants',
                description: 'We support social housing tenants with clear rent accounting, responsive repair management, and accessible tenancy information. Our platform ensures you can view your account balance, understand your charges, and communicate with your housing provider with ease.',
                features: ['Transparent rent statements', 'Online repair reporting', 'Tenancy document access', 'Direct messaging with housing officers'],
              },
              {
                icon: Building2,
                title: 'Private Rental Tenants',
                description: 'Private renters benefit from our streamlined platform for managing rental payments, tracking deposit information, and accessing tenancy documentation. We help ensure clarity and compliance throughout your tenancy.',
                features: ['Payment tracking and history', 'Deposit information management', 'Tenancy agreement access', 'Maintenance request logging'],
              },
              {
                icon: Users,
                title: 'Estate & Leaseholders',
                description: 'Leaseholders and estate residents can manage service charge accounts, access estate information, and stay informed about communal matters. Our platform provides the transparency that estate management should deliver.',
                features: ['Service charge statements', 'Estate information hub', 'Communal area updates', 'Leasehold documentation'],
              },
              {
                icon: Heart,
                title: 'Supported & Shared Housing',
                description: 'For residents in supported or shared housing arrangements, we provide tailored housing management that respects the unique needs of each household. Our approach prioritises dignity, independence, and appropriate support.',
                features: ['Personalised account views', 'Support coordinator access', 'Household management tools', 'Safeguarding-aware processes'],
              },
            ].map((section) => (
              <motion.div key={section.title} variants={fadeInUp} transition={{ duration: 0.4 }}>
                <Card className="h-full bg-white border-[#D1D9E6]">
                  <CardHeader>
                    <div className="size-12 rounded-xl bg-[#0B1D33] flex items-center justify-center mb-3">
                      <section.icon className="size-6 text-[#C4942A]" />
                    </div>
                    <CardTitle className="text-xl text-[#0B1D33]">{section.title}</CardTitle>
                    <CardDescription className="text-[#5A6B7F] leading-relaxed">{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-[#5A6B7F]">
                          <ShieldCheck className="size-4 text-[#C4942A] shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Separator className="bg-[#D1D9E6]" />

      {/* Rent & Charges Simulator */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <div className="text-center mb-12">
              <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-[#0B1D33] flex items-center justify-center">
                  <Calculator className="size-6 text-[#C4942A]" />
                </div>
              </motion.div>
              <motion.p variants={fadeInUp} className="text-[#C4942A] font-semibold text-sm tracking-wider uppercase mb-3">Interactive Tool</motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-[#0B1D33] mb-4">
                Rent &amp; Charges Simulator
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-[#5A6B7F] text-lg max-w-2xl mx-auto">
                Use this simple calculator to estimate your total housing costs. Enter your charges below and see an estimated breakdown.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp}>
              <Alert className="mb-8 border-[#C4942A]/30 bg-[#C4942A]/5 max-w-3xl mx-auto">
                <Info className="size-5 text-[#C4942A]" />
                <AlertDescription className="text-[#5A6B7F]">
                  This calculator provides <strong>estimated figures only</strong> and should not be relied upon as an accurate statement of your liabilities. Actual charges may vary depending on your tenancy agreement, local authority assessments, and other factors. Please contact your housing officer for precise figures.
                </AlertDescription>
              </Alert>

              <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="bg-[#F7F9FC] rounded-xl p-6 space-y-5">
                  <h3 className="font-semibold text-[#0B1D33] text-lg mb-2">Enter Your Charges</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rent" className="text-sm font-medium text-[#0B1D33]">Monthly Rent</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6B7F]">£</span>
                        <Input
                          id="rent"
                          type="number"
                          placeholder="0.00"
                          value={rent}
                          onChange={(e) => setRent(e.target.value)}
                          className="pl-7"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-charge" className="text-sm font-medium text-[#0B1D33]">Service Charge</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6B7F]">£</span>
                        <Input
                          id="service-charge"
                          type="number"
                          placeholder="0.00"
                          value={serviceCharge}
                          onChange={(e) => setServiceCharge(e.target.value)}
                          className="pl-7"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="other-charges" className="text-sm font-medium text-[#0B1D33]">Other Charges</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6B7F]">£</span>
                        <Input
                          id="other-charges"
                          type="number"
                          placeholder="0.00"
                          value={otherCharges}
                          onChange={(e) => setOtherCharges(e.target.value)}
                          className="pl-7"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#0B1D33]">Payment Frequency</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="bg-[#0B1D33] rounded-xl p-6 space-y-5">
                  <h3 className="font-semibold text-white text-lg mb-2">Estimated Breakdown</h3>
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Per Period Total</p>
                      <p className="text-2xl font-bold text-white">{fmt(calculations.periodTotal)}</p>
                      <p className="text-gray-500 text-xs mt-1">({frequency === 'weekly' ? 'Weekly' : frequency === 'monthly' ? 'Monthly' : 'Quarterly'})</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Monthly Breakdown</p>
                      <p className="text-2xl font-bold text-[#C4942A]">{fmt(calculations.monthly)}</p>
                      <p className="text-gray-500 text-xs mt-1">Estimated per calendar month</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Annual Estimate</p>
                      <p className="text-2xl font-bold text-white">{fmt(calculations.annual)}</p>
                      <p className="text-gray-500 text-xs mt-1">Estimated per year</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
              Need Housing Support?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
              Whether you are a tenant, landlord, or housing provider, RAY is here to help with professional, compliant housing management services.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('contact')}
                size="lg"
                className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-12 text-base"
              >
                Contact Our Housing Team
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
