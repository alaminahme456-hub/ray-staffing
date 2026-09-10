'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  MapPin,
  Building2,
  Bed,
  Calendar,
  CreditCard,
  FileText,
  Download,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store/app-store'

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5">
      <span className="text-sm text-[#5A6B7F] flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-[#0B1D33] text-right max-w-[60%]">{value}</span>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )
}

export default function CustomerHome() {
  const [loading, setLoading] = useState(true)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <PageSkeleton />

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  }

  const propertyDocuments = [
    { name: 'Tenancy Agreement - 14 Oakwood Crescent', type: 'Agreement', date: '12 Mar 2026', size: '2.4 MB' },
    { name: 'Gas Safety Certificate - 2026', type: 'Certificate', date: '15 Jul 2026', size: '1.1 MB' },
    { name: 'EPC Certificate', type: 'Certificate', date: '12 Mar 2026', size: '856 KB' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div {...fadeIn} className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('customer-dashboard')}
          className="text-[#5A6B7F] hover:text-[#0B1D33]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My Home</h1>
          <p className="text-[#5A6B7F] mt-0.5">Property and tenancy details</p>
        </div>
      </motion.div>

      {/* Property & Tenancy Info - Side by side on desktop */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Info */}
        <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                  <Home className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-[#0B1D33]">Property Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Property Name" value="14 Oakwood Crescent" icon={<Building2 className="w-3.5 h-3.5" />} />
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="Address" value="14 Oakwood Crescent, Longsight" icon={<MapPin className="w-3.5 h-3.5" />} />
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="City" value="Manchester" />
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="Postcode" value="M14 5QW" />
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="Property Type" value="2-Bed Flat" icon={<Building2 className="w-3.5 h-3.5" />} />
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="Bedrooms" value="2" icon={<Bed className="w-3.5 h-3.5" />} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tenancy Info */}
        <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                  <FileText className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-[#0B1D33]">Tenancy Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Tenancy Type" value="Assured Shorthold" />
              <Separator className="bg-[#D1D9E6]" />
              <div className="flex items-start justify-between py-2.5">
                <span className="text-sm text-[#5A6B7F]">Status</span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">
                  Active
                </Badge>
              </div>
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="Start Date" value="12 March 2026" icon={<Calendar className="w-3.5 h-3.5" />} />
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="End Date" value="11 March 2027 (12 months)" icon={<Calendar className="w-3.5 h-3.5" />} />
              <Separator className="bg-[#D1D9E6]" />
              <InfoRow label="Tenancy Ref" value="TEN-2026-0447" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Financial Summary */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <CreditCard className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-[#0B1D33]">Financial Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-[#F7F9FC] rounded-lg p-4">
                <p className="text-xs text-[#5A6B7F]">Monthly Rent</p>
                <p className="text-xl font-bold text-[#0B1D33] mt-1">£850.00</p>
              </div>
              <div className="bg-[#F7F9FC] rounded-lg p-4">
                <p className="text-xs text-[#5A6B7F]">Service Charge</p>
                <p className="text-xl font-bold text-[#0B1D33] mt-1">£45.00</p>
              </div>
              <div className="bg-[#F7F9FC] rounded-lg p-4">
                <p className="text-xs text-[#5A6B7F]">Other Charges</p>
                <p className="text-xl font-bold text-[#0B1D33] mt-1">£15.00</p>
              </div>
              <div className="bg-[#0B1D33] rounded-lg p-4">
                <p className="text-xs text-gray-400">Total Monthly</p>
                <p className="text-xl font-bold text-white mt-1">£910.00</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#5A6B7F]">
              <Clock className="w-4 h-4" />
              <span>Payment Frequency: Monthly on the 1st</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Important Dates */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600">
                <Calendar className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-[#0B1D33]">Important Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#D1D9E6]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C4942A]" />
                  <span className="text-sm text-[#0B1D33]">Next Rent Payment</span>
                </div>
                <span className="text-sm font-medium text-[#0B1D33]">1 September 2026</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#D1D9E6]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-[#0B1D33]">Gas Safety Check Due</span>
                </div>
                <span className="text-sm font-medium text-[#0B1D33]">15 February 2027</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#D1D9E6]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm text-[#0B1D33]">Tenancy Renewal Date</span>
                </div>
                <span className="text-sm font-medium text-[#0B1D33]">12 March 2027</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-[#0B1D33]">Insurance Renewal</span>
                </div>
                <span className="text-sm font-medium text-[#0B1D33]">1 April 2027</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Property Documents */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-[#0B1D33]">Property Documents</CardTitle>
                <p className="text-xs text-[#5A6B7F] mt-1">Key documents related to your property</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {propertyDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-5 h-5 text-[#1A3A5C] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0B1D33] truncate">{doc.name}</p>
                      <p className="text-xs text-[#5A6B7F]">{doc.date} · {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-[#1A3A5C] hover:text-[#C4942A] shrink-0">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Housing Contact & Report Issue */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.35 }} className="grid gap-6 sm:grid-cols-2">
        {/* Contact Info */}
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <Phone className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-[#0B1D33]">Housing Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0B1D33] text-white flex items-center justify-center text-xs font-bold">SM</div>
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">Sarah Mitchell</p>
                <p className="text-xs text-[#5A6B7F]">Housing Officer</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#5A6B7F]">
                <Phone className="w-3.5 h-3.5" />
                <span>0161 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5A6B7F]">
                <Mail className="w-3.5 h-3.5" />
                <span>sarah.mitchell@raystaffing.co.uk</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#D1D9E6]">
              <p className="text-xs text-[#5A6B7F]">Office Hours: Mon–Fri, 9:00 AM – 5:00 PM</p>
            </div>
          </CardContent>
        </Card>

        {/* Report Issue CTA */}
        <Card className="border-[#D1D9E6] bg-gradient-to-br from-[#0B1D33] to-[#1A3A5C] text-white">
          <CardContent className="flex flex-col items-center justify-center h-full text-center gap-4 py-10">
            <div className="w-14 h-14 rounded-full bg-[#C4942A]/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-[#C4942A]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Need to Report an Issue?</h3>
              <p className="text-sm text-gray-300 mt-1">Submit a maintenance request and we'll get it sorted for you.</p>
            </div>
            <Button
              className="bg-[#C4942A] hover:bg-[#B3861F] text-white font-semibold"
              onClick={() => navigate('customer-requests')}
            >
              Report an Issue
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
