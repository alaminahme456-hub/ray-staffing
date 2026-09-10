'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Calendar,
  Download,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PoundSterling,
  Receipt,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/app-store'

const payments = [
  {
    id: 'PAY-2026-0182',
    date: '01 Aug 2026',
    description: 'Rent - August 2026',
    amount: '£850.00',
    status: 'completed' as const,
    ref: 'RF-090182',
  },
  {
    id: 'PAY-2026-0179',
    date: '01 Aug 2026',
    description: 'Service Charge - Q2 2026',
    amount: '£45.00',
    status: 'completed' as const,
    ref: 'RF-090179',
  },
  {
    id: 'PAY-2026-0175',
    date: '01 Jul 2026',
    description: 'Rent - July 2026',
    amount: '£850.00',
    status: 'completed' as const,
    ref: 'RF-090175',
  },
  {
    id: 'PAY-2026-0172',
    date: '01 Jul 2026',
    description: 'Other Charges - Jul 2026',
    amount: '£15.00',
    status: 'completed' as const,
    ref: 'RF-090172',
  },
  {
    id: 'PAY-2026-0168',
    date: '01 Jun 2026',
    description: 'Rent - June 2026',
    amount: '£850.00',
    status: 'pending' as const,
    ref: 'RF-090168',
  },
  {
    id: 'PAY-2026-0160',
    date: '01 May 2026',
    description: 'Rent - May 2026',
    amount: '£850.00',
    status: 'failed' as const,
    ref: 'RF-090160',
  },
]

function StatusBadge({ status }: { status: 'completed' | 'pending' | 'failed' }) {
  const config = {
    completed: { className: 'bg-emerald-100 text-emerald-700 border-0 hover:bg-emerald-100', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Completed' },
    pending: { className: 'bg-amber-100 text-amber-700 border-0 hover:bg-amber-100', icon: <Clock className="w-3 h-3" />, label: 'Pending' },
    failed: { className: 'bg-red-100 text-red-700 border-0 hover:bg-red-100', icon: <XCircle className="w-3 h-3" />, label: 'Failed' },
  }
  const c = config[status]
  return (
    <Badge className={`${c.className} text-xs gap-1`}>
      {c.icon}
      {c.label}
    </Badge>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )
}

export default function CustomerPayments() {
  const [loading, setLoading] = useState(true)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <PageSkeleton />

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  }

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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Payments</h1>
          <p className="text-[#5A6B7F] mt-0.5">View your payment history and upcoming charges</p>
        </div>
      </motion.div>

      {/* Amount Due & Next Payment */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="border-[#C4942A] bg-gradient-to-br from-[#0B1D33] to-[#1A3A5C] text-white">
            <CardContent className="py-8">
              <div className="flex items-center gap-2 mb-2">
                <PoundSterling className="w-5 h-5 text-[#C4942A]" />
                <p className="text-sm text-gray-300">Amount Currently Due</p>
              </div>
              <p className="text-4xl font-bold">£850.00</p>
              <p className="text-sm text-gray-400 mt-2">Rent for September 2026</p>
              <div className="mt-4 flex items-center gap-2 text-amber-300">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Due in 14 days</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="border-[#D1D9E6]">
            <CardContent className="py-8">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-[#1A3A5C]" />
                <p className="text-sm text-[#5A6B7F]">Next Payment Date</p>
              </div>
              <p className="text-3xl font-bold text-[#0B1D33]">1 Sep 2026</p>
              <p className="text-sm text-[#5A6B7F] mt-2">Payment method: Direct Debit</p>
              <div className="mt-4">
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Direct Debit Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment History Table */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <Receipt className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-[#0B1D33]">Payment History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#D1D9E6] hover:bg-transparent">
                    <TableHead className="text-[#5A6B7F]">Date</TableHead>
                    <TableHead className="text-[#5A6B7F]">Description</TableHead>
                    <TableHead className="text-[#5A6B7F] text-right">Amount</TableHead>
                    <TableHead className="text-[#5A6B7F]">Status</TableHead>
                    <TableHead className="text-[#5A6B7F] hidden sm:table-cell">Reference</TableHead>
                    <TableHead className="text-[#5A6B7F] text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id} className="border-[#D1D9E6]">
                      <TableCell className="text-[#0B1D33] font-medium">{p.date}</TableCell>
                      <TableCell className="text-[#0B1D33]">{p.description}</TableCell>
                      <TableCell className="text-[#0B1D33] text-right font-medium">{p.amount}</TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] hidden sm:table-cell font-mono text-xs">{p.ref}</TableCell>
                      <TableCell className="text-right">
                        {p.status === 'completed' ? (
                          <Button variant="ghost" size="sm" className="text-[#1A3A5C] hover:text-[#C4942A] h-8 gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </Button>
                        ) : (
                          <span className="text-xs text-[#5A6B7F]">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charges Breakdown */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <CreditCard className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-[#0B1D33]">Charges Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#D1D9E6]">
                <div>
                  <p className="text-sm font-medium text-[#0B1D33]">Monthly Rent</p>
                  <p className="text-xs text-[#5A6B7F]">Fixed monthly tenancy charge</p>
                </div>
                <p className="text-sm font-semibold text-[#0B1D33]">£850.00</p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#D1D9E6]">
                <div>
                  <p className="text-sm font-medium text-[#0B1D33]">Service Charge</p>
                  <p className="text-xs text-[#5A6B7F]">Quarterly maintenance and communal area upkeep</p>
                </div>
                <p className="text-sm font-semibold text-[#0B1D33]">£45.00 <span className="text-xs font-normal text-[#5A6B7F]">/ quarter</span></p>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#D1D9E6]">
                <div>
                  <p className="text-sm font-medium text-[#0B1D33]">Utilities Surcharge</p>
                  <p className="text-xs text-[#5A6B7F]">Water and waste management contribution</p>
                </div>
                <p className="text-sm font-semibold text-[#0B1D33]">£15.00</p>
              </div>
              <div className="flex items-center justify-between py-3 bg-[#F7F9FC] rounded-lg px-4 -mx-2">
                <p className="text-sm font-semibold text-[#0B1D33]">Total Monthly</p>
                <p className="text-lg font-bold text-[#0B1D33]">£910.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
