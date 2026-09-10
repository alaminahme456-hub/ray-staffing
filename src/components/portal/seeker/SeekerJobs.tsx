'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, SlidersHorizontal, X, Briefcase, Clock,
  Building2, Calendar, ChevronLeft, ChevronRight, Loader2, Send,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface JobRow {
  id: string
  title: string
  location: string
  salary_min: number
  salary_max: number
  job_type: string
  sector: string
  description: string
  requirements: string
  listing: string
  status: string
  created_at: string
  employer_id: string
  employer_name?: string
}

const JOBS_PER_PAGE = 6

function formatSalary(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Salary not specified'
  if (min > 0 && max > 0) return `£${min.toLocaleString()} - £${max.toLocaleString()}`
  if (min > 0) return `From £${min.toLocaleString()}`
  return `Up to £${max.toLocaleString()}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

function JobCardSkeleton() {
  return (
    <Card className="border-[#D1D9E6]">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-32" /></div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-4 w-full mt-3" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </CardContent>
    </Card>
  )
}

export default function SeekerJobs() {
  const user = useAppStore((s) => s.user)
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterSector, setFilterSector] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)

  const updateSearch = useCallback((v: string) => { setSearch(v); setCurrentPage(1) }, [])
  const updateType = useCallback((v: string) => { setFilterType(v); setCurrentPage(1) }, [])
  const updateSector = useCallback((v: string) => { setFilterSector(v); setCurrentPage(1) }, [])

  useEffect(() => {
    async function fetchJobs() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, location, salary_min, salary_max, job_type, sector, description, requirements, listing, status, created_at, employer_id')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch jobs:', error)
      } else {
        // Fetch employer names
        const employerIds = [...new Set((data || []).map(j => j.employer_id))]
        if (employerIds.length > 0) {
          const { data: employerProfiles } = await supabase
            .from('employer_profiles')
            .select('id, company_name')
            .in('id', employerIds)
          const nameMap = Object.fromEntries((employerProfiles || []).map(e => [e.id, e.company_name]))
          setJobs((data || []).map(j => ({ ...j, employer_name: nameMap[j.employer_id] || 'Employer' })))
        } else {
          setJobs(data || [])
        }
      }
      setLoading(false)
    }
    fetchJobs()
  }, [])

  const sectors = useMemo(() => [...new Set(jobs.map(j => j.sector).filter(Boolean))], [jobs])

  const filtered = useMemo(() => {
    let result = [...jobs]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.sector?.toLowerCase().includes(q) ||
        j.employer_name?.toLowerCase().includes(q)
      )
    }
    if (filterType !== 'all') result = result.filter(j => j.job_type === filterType)
    if (filterSector !== 'all') result = result.filter(j => j.sector === filterSector)

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    else if (sortBy === 'salary-high') result.sort((a, b) => b.salary_max - a.salary_max)
    else if (sortBy === 'salary-low') result.sort((a, b) => a.salary_min - b.salary_min)

    return result
  }, [jobs, search, filterType, filterSector, sortBy])

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE)

  async function handleApply() {
    if (!user || !selectedJob) return
    setApplying(true)
    const supabase = createClient()
    const { error } = await supabase.from('applications').insert({
      job_id: selectedJob.id,
      candidate_id: user.id,
      cover_letter: coverLetter,
    })
    setApplying(false)
    if (error) {
      if (error.code === '23505') toast.error('You have already applied for this job')
      else toast.error('Failed to submit application')
    } else {
      toast.success('Application submitted successfully!')
      setSelectedJob(null)
      setCoverLetter('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Browse Jobs</h1>
        <p className="text-[#5A6B7F] mt-1">Find your next opportunity from {filtered.length} active position{filtered.length !== 1 ? 's' : ''}.</p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
            <Input placeholder="Search by title, location, or sector..." value={search} onChange={e => updateSearch(e.target.value)}
              className="pl-10 border-[#D1D9E6]" />
          </div>
          <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <Card className="border-[#D1D9E6]">
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#5A6B7F]">Job Type</Label>
                    <Select value={filterType} onValueChange={updateType}>
                      <SelectTrigger className="border-[#D1D9E6]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {sectors.length > 0 && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-[#5A6B7F]">Sector</Label>
                      <Select value={filterSector} onValueChange={updateSector}>
                        <SelectTrigger className="border-[#D1D9E6]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sectors</SelectItem>
                          {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#5A6B7F]">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="border-[#D1D9E6]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                        <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Job Listings */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)
        ) : paginated.length === 0 ? (
          <Card className="border-[#D1D9E6]">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-10 h-10 text-[#D1D9E6] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#0B1D33]">No jobs found</p>
              <p className="text-xs text-[#5A6B7F] mt-1">Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
            {paginated.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
                <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedJob(job)}>
                        <h3 className="text-base font-semibold text-[#0B1D33] hover:text-[#1A3A5C] transition-colors">{job.title}</h3>
                        <p className="text-xs text-[#5A6B7F] mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {job.employer_name || 'Employer'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {job.location && (
                            <span className="flex items-center gap-1 text-xs text-[#5A6B7F]"><MapPin className="w-3 h-3" /> {job.location}</span>
                          )}
                          <span className="text-xs text-[#0B1D33] font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
                          {job.job_type && <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 text-[10px] capitalize">{job.job_type}</Badge>}
                          {job.sector && <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 text-[10px]">{job.sector}</Badge>}
                        </div>
                        <p className="text-xs text-[#5A6B7F] mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo(job.created_at)}
                        </p>
                      </div>
                      <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white shrink-0" onClick={() => setSelectedJob(job)}>View & Apply</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="border-[#D1D9E6]" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <span className="text-sm text-[#5A6B7F]">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" className="border-[#D1D9E6]" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => { setSelectedJob(null); setCoverLetter('') }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-[#0B1D33]">{selectedJob.title}</DialogTitle>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#5A6B7F]">
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {selectedJob.employer_name || 'Employer'}</span>
                  {selectedJob.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>}
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Posted {timeAgo(selectedJob.created_at)}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-[#C4942A] text-white border-0">{formatSalary(selectedJob.salary_min, selectedJob.salary_max)}</Badge>
                  {selectedJob.job_type && <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 capitalize">{selectedJob.job_type}</Badge>}
                  {selectedJob.sector && <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0">{selectedJob.sector}</Badge>}
                </div>
              </DialogHeader>

              <Separator className="my-2" />

              <div className="space-y-4">
                {selectedJob.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#0B1D33] mb-1">Description</h4>
                    <p className="text-sm text-[#5A6B7F] whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>
                )}
                {selectedJob.requirements && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#0B1D33] mb-1">Requirements</h4>
                    <p className="text-sm text-[#5A6B7F] whitespace-pre-wrap">{selectedJob.requirements}</p>
                  </div>
                )}
                {selectedJob.listing && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#0B1D33] mb-1">Listing Details</h4>
                    <p className="text-sm text-[#5A6B7F] whitespace-pre-wrap">{selectedJob.listing}</p>
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              {/* Apply Section */}
              {user ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#0B1D33]">Apply for this position</h4>
                  <Textarea placeholder="Write a cover letter (optional)..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4} className="border-[#D1D9E6]" />
                  <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white" onClick={handleApply} disabled={applying}>
                    {applying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4 mr-2" /> Submit Application</>}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 bg-[#F7F9FC] rounded-lg">
                  <p className="text-sm text-[#5A6B7F]">Sign in to apply for this job.</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
