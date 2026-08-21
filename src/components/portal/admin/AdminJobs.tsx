'use client'

import { Suspense, use, useMemo, useState, useCallback, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, Edit, Trash2, MoreHorizontal, MapPin, Users, Skeleton,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'

const statusColors: Record<string, string> = {
  active: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  closed: 'bg-zinc-800/60 text-zinc-400 border-zinc-600/50',
  draft: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  paused: 'bg-orange-900/40 text-orange-300 border-orange-700/50',
}

const statusDotColors: Record<string, string> = {
  active: 'bg-emerald-400',
  closed: 'bg-zinc-500',
  draft: 'bg-amber-400',
  paused: 'bg-orange-400',
}

const statuses = ['All', 'active', 'closed', 'draft', 'paused'] as const

type StatusFilter = (typeof statuses)[number]

interface JobWithEmployer {
  id: string
  title: string
  location: string | null
  status: string
  created_at: string
  job_type: string | null
  sector: string | null
  employer_profiles: {
    company_name: string | null
  } | null
  application_count: number
}

async function fetchJobs(): Promise<JobWithEmployer[]> {
  const supabase = createClient()

  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      location,
      status,
      created_at,
      job_type,
      sector,
      employer_id,
      employer_profiles (
        company_name
      )
    `)
    .order('created_at', { ascending: false })

  if (jobsError) throw jobsError
  if (!jobs) return []

  const jobIds = jobs.map((j) => j.id)

  let appCounts: Record<string, number> = {}
  if (jobIds.length > 0) {
    const { data: apps } = await supabase
      .from('applications')
      .select('job_id')
      .in('job_id', jobIds)

    if (apps) {
      appCounts = apps.reduce<Record<string, number>>((acc, a) => {
        acc[a.job_id] = (acc[a.job_id] || 0) + 1
        return acc
      }, {})
    }
  }

  return jobs.map((job) => ({
    ...job,
    application_count: appCounts[job.id] || 0,
  }))
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-[#1a2e1e]" />
          <Skeleton className="h-4 w-80 bg-[#1a2e1e]" />
        </div>
        <Skeleton className="h-10 w-32 bg-[#1a2e1e]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 w-full max-w-md bg-[#1a2e1e]" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-16 bg-[#1a2e1e]" />
          ))}
        </div>
      </div>
      <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2e1e]">
                  {[...Array(7)].map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-16 bg-[#1a2e1e]" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1a2e1e]/60">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <Skeleton
                          className="h-4 bg-[#1a2e1e]"
                          style={{ width: j === 0 ? '140px' : j === 4 ? '40px' : '80px' }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Inner content that consumes the promise via use()                   */
/* ------------------------------------------------------------------ */
function AdminJobsContent() {
  const jobsPromise = useMemo(() => fetchJobs(), [])
  const jobs = use(jobsPromise)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  const handleSearch = useCallback((value: string) => {
    startTransition(() => {
      setSearch(value)
    })
  }, [])

  const handleStatusFilter = useCallback((value: StatusFilter) => {
    startTransition(() => {
      setStatusFilter(value)
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return jobs.filter((job) => {
      const title = job.title.toLowerCase()
      const employer = (job.employer_profiles?.company_name ?? '').toLowerCase()
      const matchesSearch = title.includes(q) || employer.includes(q)
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [jobs, search, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#FAF8F5]">Job Management</h1>
          <p className="text-[#8A9B8E] mt-1">Monitor and manage all job postings across the platform</p>
        </div>
        <Button className="bg-[#1a3d24] hover:bg-[#245232] text-[#FAF8F5] border border-[#2a4e32]">
          + Create Job
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9B8E]" />
          <Input
            placeholder="Search jobs or employers..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-[#0a1a0e] border-[#1a2e1e] text-[#FAF8F5] placeholder:text-[#8A9B8E]/60 focus-visible:ring-[#2a4e32] focus-visible:border-[#2a4e32]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              className={
                statusFilter === status
                  ? 'bg-[#1a3d24] text-[#FAF8F5] hover:bg-[#245232] border-[#2a4e32]'
                  : 'border-[#1a2e1e] text-[#8A9B8E] hover:bg-[#0f2214] hover:text-[#FAF8F5]'
              }
              onClick={() => handleStatusFilter(status)}
            >
              {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1a2e1e] hover:bg-transparent">
                    <TableHead className="text-[#8A9B8E] font-medium">Title</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Employer</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Location</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Status</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium text-center">Applications</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Posted</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                      <TableRow className="border-[#1a2e1e]/60 hover:bg-transparent">
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 text-[#8A9B8E]/40" />
                            <p className="text-[#8A9B8E]">No jobs found</p>
                            <p className="text-sm text-[#8A9B8E]/60">Try adjusting your search or filter criteria</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((job) => (
                        <motion.tr
                          key={job.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-[#1a2e1e]/60 hover:bg-[#0f2214] transition-colors group"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-[#FAF8F5] whitespace-nowrap">
                                {job.title}
                              </p>
                              <p className="text-xs text-[#8A9B8E]/60 mt-0.5">
                                {job.job_type ? job.job_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''}
                                {job.job_type && job.sector ? ' · ' : ''}
                                {job.sector ? job.sector.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#8A9B8E] whitespace-nowrap">
                            {job.employer_profiles?.company_name ?? '—'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-[#8A9B8E] whitespace-nowrap">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                              {job.location ?? '—'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`gap-1.5 capitalize ${statusColors[job.status] ?? 'bg-zinc-800/60 text-zinc-400 border-zinc-600/50'}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${statusDotColors[job.status] ?? 'bg-zinc-500'}`} />
                              {job.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-[#8A9B8E]" />
                              <span className="text-[#FAF8F5] font-medium tabular-nums">
                                {job.application_count}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#8A9B8E] text-sm whitespace-nowrap">
                            {formatDate(job.created_at)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#8A9B8E] hover:text-[#FAF8F5] hover:bg-[#1a2e1e]"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[#0a1a0e] border-[#1a2e1e] text-[#FAF8F5]"
                              >
                                <DropdownMenuItem className="text-[#FAF8F5] focus:bg-[#1a2e1e] focus:text-[#FAF8F5] cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-[#FAF8F5] focus:bg-[#1a2e1e] focus:text-[#FAF8F5] cursor-pointer">
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 focus:bg-red-900/20 focus:text-red-300 cursor-pointer">
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results summary */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-[#8A9B8E]/60 text-right"
      >
        Showing {filtered.length} of {jobs.length} jobs
      </motion.p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Exported wrapper with Suspense boundary                            */
/* ------------------------------------------------------------------ */
export default function AdminJobs() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminJobsContent />
    </Suspense>
  )
}
