'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Calendar,
  Star,
  Eye,
  UserCheck,
  XCircle,
  CalendarClock,
  MoreHorizontal,
  CheckSquare,
  Filter,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { useAppStore } from '@/store/app-store'

interface Application {
  id: string
  candidate: string
  job: string
  applied: string
  matchScore: number
  status: string
  jobId: string
}

const applications: Application[] = [
  { id: 'A-001', candidate: 'Aisha Patel', job: 'Staff Nurse – ICU', applied: '18 Aug 2026', matchScore: 94, status: 'Applied', jobId: 'V-001' },
  { id: 'A-002', candidate: 'James Okafor', job: 'Senior Physiotherapist', applied: '17 Aug 2026', matchScore: 87, status: 'Reviewing', jobId: 'V-002' },
  { id: 'A-003', candidate: 'Emma Worthington', job: 'Radiographer', applied: '17 Aug 2026', matchScore: 91, status: 'Shortlisted', jobId: 'V-003' },
  { id: 'A-004', candidate: 'Kwame Asante', job: 'Mental Health Nurse', applied: '16 Aug 2026', matchScore: 82, status: 'Interview', jobId: 'V-004' },
  { id: 'A-005', candidate: 'Sophie Chambers', job: 'Occupational Therapist', applied: '16 Aug 2026', matchScore: 78, status: 'Applied', jobId: 'V-005' },
  { id: 'A-006', candidate: 'Raj Mehta', job: 'Staff Nurse – ICU', applied: '15 Aug 2026', matchScore: 85, status: 'Reviewing', jobId: 'V-001' },
]

const pipelineStages = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Decision']

const statusColors: Record<string, string> = {
  Applied: 'bg-blue-100 text-blue-700',
  Reviewing: 'bg-amber-100 text-amber-700',
  Shortlisted: 'bg-emerald-100 text-emerald-700',
  Interview: 'bg-purple-100 text-purple-700',
  Decision: 'bg-[#C4942A]/10 text-[#C4942A]',
  Rejected: 'bg-red-100 text-red-700',
}

const matchBadgeColor = (s: number) => {
  if (s >= 90) return 'bg-emerald-100 text-emerald-700'
  if (s >= 80) return 'bg-[#C4942A]/10 text-[#C4942A]'
  return 'bg-gray-100 text-[#5A6B7F]'
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
    </div>
  )
}

export default function EmployerApplications() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [jobFilter, setJobFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const uniqueJobs = Array.from(new Set(applications.map(a => a.job)))

  const filtered = applications.filter((a) => {
    const matchSearch = a.candidate.toLowerCase().includes(search.toLowerCase()) ||
      a.job.toLowerCase().includes(search.toLowerCase())
    const matchJob = jobFilter === 'all' || a.job === jobFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchJob && matchStatus
  })

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(a => a.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const pipelineCounts = pipelineStages.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length
    return acc
  }, {} as Record<string, number>)

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Applications</h1>
        <p className="text-[#5A6B7F] mt-0.5">Review and manage candidate applications across all vacancies</p>
      </motion.div>

      {/* Pipeline Visual */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {pipelineStages.map((stage, i) => (
          <div
            key={stage}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
            onClick={() => setStatusFilter(statusFilter === stage ? 'all' : stage)}
          >
            <div className={`px-3 py-2 rounded-lg border transition-colors ${
              statusFilter === stage
                ? 'border-[#C4942A] bg-[#C4942A]/10'
                : 'border-[#D1D9E6] bg-white hover:bg-[#F7F9FC]'
            }`}>
              <p className="text-xs font-medium text-[#5A6B7F] whitespace-nowrap">{stage}</p>
              <p className="text-lg font-bold text-[#0B1D33]">{pipelineCounts[stage] || 0}</p>
            </div>
            {i < pipelineStages.length - 1 && (
              <div className="w-6 h-px bg-[#D1D9E6] shrink-0" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
          />
        </div>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full sm:w-52 border-[#D1D9E6]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {uniqueJobs.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 border-[#D1D9E6]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {pipelineStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-[#F0F4F8] rounded-lg"
        >
          <span className="text-sm font-medium text-[#0B1D33]">{selected.size} selected</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#1A3A5C]">
                <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem><UserCheck className="w-4 h-4 mr-2" /> Shortlist Selected</DropdownMenuItem>
              <DropdownMenuItem><CalendarClock className="w-4 h-4 mr-2" /> Schedule Interviews</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600"><XCircle className="w-4 h-4 mr-2" /> Reject Selected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="ml-auto text-[#5A6B7F]" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </motion.div>
      )}

      {/* Application List */}
      <div className="space-y-3">
        {filtered.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selected.has(a.id)}
                    onCheckedChange={() => toggleOne(a.id)}
                    className="border-[#D1D9E6]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <h3 className="font-semibold text-[#0B1D33] text-sm">{a.candidate}</h3>
                      <span className="text-xs text-[#5A6B7F] sm:hidden">{a.job}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#5A6B7F]">
                      <span className="hidden sm:inline">{a.job}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.applied}</span>
                      <Badge variant="secondary" className={`text-[10px] ${matchBadgeColor(a.matchScore)}`}>
                        <Star className="w-3 h-3 mr-0.5" />{a.matchScore}%
                      </Badge>
                      <Badge variant="secondary" className={statusColors[a.status] || ''}>{a.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button variant="ghost" size="sm" className="text-[#1A3A5C] hover:text-[#C4942A]"><Eye className="w-4 h-4" /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#5A6B7F]"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Application</DropdownMenuItem>
                        <DropdownMenuItem><UserCheck className="w-4 h-4 mr-2" /> Shortlist</DropdownMenuItem>
                        <DropdownMenuItem><CalendarClock className="w-4 h-4 mr-2" /> Schedule Interview</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"><XCircle className="w-4 h-4 mr-2" /> Reject</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#5A6B7F]">
            <p className="text-lg font-medium">No applications found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
