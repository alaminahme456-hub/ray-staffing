'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserCheck,
  Briefcase,
  Building2,
  Calendar,
  Phone,
  Mail,
  Clock,
  Eye,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Placement {
  id: string
  candidate: string
  jobTitle: string
  department: string
  startDate: string
  status: 'Active' | 'Probation' | 'Confirmed'
  email: string
  phone: string
  lineManager: string
  contractType: string
  salary: string
  notes: string
}

const placements: Placement[] = [
  {
    id: 'P-001', candidate: 'Dr Fiona Mbeki', jobTitle: 'Consultant Cardiologist', department: 'Cardiology',
    startDate: '01 Jun 2026', status: 'Probation', email: 'f.mbeki@bartshealth.nhs.uk', phone: '07700 123 456',
    lineManager: 'Dr Richard Hale', contractType: 'Permanent, Full-time', salary: 'Band 9 (£105,000 – £120,000)',
    notes: 'Currently in 6-month probationary period. Positive feedback from ward staff. RCPLD programme on track.',
  },
  {
    id: 'P-002', candidate: 'Maria Santos', jobTitle: 'Staff Nurse – A&E', department: 'Emergency Medicine',
    startDate: '15 Mar 2026', status: 'Active', email: 'm.santos@bartshealth.nhs.uk', phone: '07700 234 567',
    lineManager: 'Sister Janet Okonkwo', contractType: 'Permanent, Full-time', salary: 'Band 5 (£28,407 – £34,581)',
    notes: 'Relocated from Portugal under international recruitment programme. Settling in well. Completed orientation.',
  },
  {
    id: 'P-003', candidate: 'Thomas Adebayo', jobTitle: 'Biomedical Scientist', department: 'Pathology',
    startDate: '10 Jan 2026', status: 'Confirmed', email: 't.adebayo@bartshealth.nhs.uk', phone: '07700 345 678',
    lineManager: 'Dr Anne Coles', contractType: 'Permanent, Full-time', salary: 'Band 6 (£35,392 – £42,618)',
    notes: 'Successfully completed probation. HCPC registration renewed. Training on new analysers complete.',
  },
  {
    id: 'P-004', candidate: 'Lena Johansson', jobTitle: 'Midwife', department: 'Maternity',
    startDate: '20 Apr 2026', status: 'Active', email: 'l.johansson@bartshealth.nhs.uk', phone: '07700 456 789',
    lineManager: 'Midwife Sarah Clarke', contractType: 'Permanent, Full-time', salary: 'Band 6 (£35,392 – £42,618)',
    notes: 'Joined from Sweden via EEA recognition pathway. Currently undertaking supervised practice period.',
  },
]

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Probation: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-56" />
      <div className="grid sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

export default function EmployerPlacements() {
  const [loading, setLoading] = useState(true)
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const summaryStats = [
    { label: 'Active', value: placements.filter(p => p.status === 'Active').length, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Probation', value: placements.filter(p => p.status === 'Probation').length, color: 'text-amber-600 bg-amber-50' },
    { label: 'Confirmed', value: placements.filter(p => p.status === 'Confirmed').length, color: 'text-blue-600 bg-blue-50' },
  ]

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Placements</h1>
        <p className="text-[#5A6B7F] mt-0.5">Track your current employees and placement status</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-3 gap-4"
      >
        {summaryStats.map((s) => (
          <Card key={s.label} className="border-[#D1D9E6]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1D33]">{s.value}</p>
                <p className="text-xs text-[#5A6B7F]">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Placements Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33]">Active Placements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#D1D9E6] bg-[#F7F9FC]">
                    <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F]">Candidate</th>
                    <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden md:table-cell">Job Title</th>
                    <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden lg:table-cell">Department</th>
                    <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden sm:table-cell">Start Date</th>
                    <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F]">Status</th>
                    <th className="text-right py-2.5 px-4 font-medium text-[#5A6B7F]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((p) => (
                    <tr key={p.id} className="border-b border-[#D1D9E6] last:border-0 hover:bg-[#F7F9FC] transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#0B1D33]">{p.candidate}</p>
                        <p className="text-xs text-[#5A6B7F] md:hidden">{p.jobTitle}</p>
                      </td>
                      <td className="py-3 px-4 text-[#5A6B7F] hidden md:table-cell">{p.jobTitle}</td>
                      <td className="py-3 px-4 text-[#5A6B7F] hidden lg:table-cell">{p.department}</td>
                      <td className="py-3 px-4 text-[#5A6B7F] hidden sm:table-cell">{p.startDate}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={statusColors[p.status]}>{p.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#1A3A5C] hover:text-[#C4942A]"
                          onClick={() => setSelectedPlacement(p)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Placement Detail Dialog */}
      <Dialog open={!!selectedPlacement} onOpenChange={() => setSelectedPlacement(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          {selectedPlacement && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#0B1D33]">Placement Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B1D33]">{selectedPlacement.candidate}</h3>
                    <p className="text-sm text-[#5A6B7F]">{selectedPlacement.jobTitle}</p>
                  </div>
                  <Badge variant="secondary" className={statusColors[selectedPlacement.status]}>{selectedPlacement.status}</Badge>
                </div>

                <Separator className="bg-[#D1D9E6]" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#5A6B7F]">Department</p>
                      <p className="font-medium text-[#0B1D33]">{selectedPlacement.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#5A6B7F]">Start Date</p>
                      <p className="font-medium text-[#0B1D33]">{selectedPlacement.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#5A6B7F]">Email</p>
                      <p className="font-medium text-[#0B1D33] break-all">{selectedPlacement.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#5A6B7F]">Phone</p>
                      <p className="font-medium text-[#0B1D33]">{selectedPlacement.phone}</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#D1D9E6]" />

                <div className="space-y-3 text-sm">
                  <h4 className="font-semibold text-[#0B1D33] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C4942A]" /> Contract Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#F7F9FC] rounded-lg p-3">
                      <p className="text-xs text-[#5A6B7F]">Contract Type</p>
                      <p className="font-medium text-[#0B1D33]">{selectedPlacement.contractType}</p>
                    </div>
                    <div className="bg-[#F7F9FC] rounded-lg p-3">
                      <p className="text-xs text-[#5A6B7F]">Salary</p>
                      <p className="font-medium text-[#0B1D33]">{selectedPlacement.salary}</p>
                    </div>
                  </div>
                  <div className="bg-[#F7F9FC] rounded-lg p-3">
                    <p className="text-xs text-[#5A6B7F]">Line Manager</p>
                    <p className="font-medium text-[#0B1D33]">{selectedPlacement.lineManager}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold text-[#0B1D33]">Notes</h4>
                  <p className="text-[#5A6B7F] leading-relaxed">{selectedPlacement.notes}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
