'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Pencil,
  UserCircle,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/store/app-store'

const vacancies = [
  { id: 'V-001', title: 'Staff Nurse – ICU', location: 'London, EC1A', applications: 24, status: 'Open', posted: '01 Aug 2026' },
  { id: 'V-002', title: 'Senior Physiotherapist', location: 'Manchester, M1', applications: 18, status: 'Open', posted: '05 Aug 2026' },
  { id: 'V-003', title: 'Radiographer', location: 'Birmingham, B1', applications: 15, status: 'Closed', posted: '20 Jul 2026' },
  { id: 'V-004', title: 'Mental Health Nurse', location: 'Leeds, LS1', applications: 31, status: 'Open', posted: '10 Aug 2026' },
  { id: 'V-005', title: 'Occupational Therapist', location: 'Bristol, BS1', applications: 9, status: 'Draft', posted: '—' },
  { id: 'V-006', title: 'Healthcare Assistant', location: 'Liverpool, L1', applications: 42, status: 'Filled', posted: '15 Jun 2026' },
]

const statusColors: Record<string, string> = {
  Open: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-red-100 text-red-700',
  Filled: 'bg-blue-100 text-blue-700',
  Draft: 'bg-gray-100 text-gray-600',
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
    </div>
  )
}

export default function EmployerVacancies() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const filtered = vacancies.filter((v) => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Vacancies</h1>
          <p className="text-[#5A6B7F] mt-0.5">Manage your job listings and create new ones</p>
        </div>
        <Button
          className="bg-[#C4942A] hover:bg-[#B3861F] text-white self-start"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Create Vacancy
        </Button>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search vacancies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 border-[#D1D9E6]">
            <Filter className="w-4 h-4 mr-2 text-[#5A6B7F]" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Filled">Filled</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Vacancy List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[#0B1D33]">{v.title}</h3>
                        <Badge variant="secondary" className={statusColors[v.status]}>{v.status}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-[#5A6B7F]">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {v.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {v.applications} applications</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {v.posted}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#D1D9E6] text-[#1A3A5C] hover:bg-[#F0F4F8]"
                        onClick={() => navigate('employer-applications')}
                      >
                        <UserCircle className="w-3.5 h-3.5 mr-1" /> Applicants
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-[#5A6B7F]">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem><UserCircle className="w-4 h-4 mr-2" /> View Applicants</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#5A6B7F]">
            <p className="text-lg font-medium">No vacancies found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Create Vacancy Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#C4942A]" /> Create Vacancy
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input placeholder="e.g. Staff Nurse – ICU" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea placeholder="Describe the role, responsibilities, and what makes it unique..." rows={4} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="space-y-2">
              <Label>Requirements</Label>
              <Textarea placeholder="Essential and desirable qualifications, skills, and experience..." rows={3} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="space-y-2">
              <Label>Benefits</Label>
              <Input placeholder="e.g. NHS Pension, CPD allowance, relocation support" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input placeholder="Trust / Site" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input placeholder="e.g. London" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>Postcode</Label>
                <Input placeholder="e.g. EC1A 7BE" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Salary Min (£)</Label>
                <Input placeholder="28000" type="number" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>Salary Max (£)</Label>
                <Input placeholder="35000" type="number" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>Salary Type</Label>
                <Select>
                  <SelectTrigger className="border-[#D1D9E6]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="pro-rata">Pro-rata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select>
                  <SelectTrigger className="border-[#D1D9E6]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="bank">Bank / Bank Staff</SelectItem>
                    <SelectItem value="locum">Locum</SelectItem>
                    <SelectItem value="contract">Fixed-term Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select>
                  <SelectTrigger className="border-[#D1D9E6]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead / Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Remote Type</Label>
                <Select>
                  <SelectTrigger className="border-[#D1D9E6]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input defaultValue="Healthcare" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger className="border-[#D1D9E6]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nursing">Nursing</SelectItem>
                    <SelectItem value="allied">Allied Health</SelectItem>
                    <SelectItem value="medical">Medical / Doctors</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="social">Social Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white">
                Save as Draft
              </Button>
              <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
                Publish Vacancy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
