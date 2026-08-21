'use client'

import { useState, useEffect, useSyncExternalStore, type FormEvent } from 'react'
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
  Pause,
  Play,
  XCircle,
  Loader2,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface JobRow {
  id: string
  employer_id: string
  title: string
  listing: string | null
  location: string | null
  salary_min: number | null
  salary_max: number | null
  job_type: string | null
  sector: string | null
  requirements: string | null
  description: string | null
  status: string
  created_at: string
}

interface VacancyForm {
  title: string
  listing: string
  requirements: string
  location: string
  salary_min: string
  salary_max: string
  job_type: string
  sector: string
  description: string
}

const EMPTY_FORM: VacancyForm = {
  title: '',
  listing: '',
  requirements: '',
  location: '',
  salary_min: '',
  salary_max: '',
  job_type: 'full-time',
  sector: '',
  description: '',
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
  { value: 'paused', label: 'Paused' },
]

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'bank', label: 'Bank' },
]

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-600',
  paused: 'bg-amber-100 text-amber-700',
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function jobToForm(job: JobRow): VacancyForm {
  return {
    title: job.title ?? '',
    listing: job.listing ?? '',
    requirements: job.requirements ?? '',
    location: job.location ?? '',
    salary_min: job.salary_min != null ? String(job.salary_min) : '',
    salary_max: job.salary_max != null ? String(job.salary_max) : '',
    job_type: job.job_type ?? 'full-time',
    sector: job.sector ?? '',
    description: job.description ?? '',
  }
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  External store for jobs (avoids setState in effects)               */
/* ------------------------------------------------------------------ */

type JobsSnapshot = {
  jobs: JobRow[]
  appCounts: Record<string, number>
  loading: boolean
}

let snapshot: JobsSnapshot = {
  jobs: [],
  appCounts: {},
  loading: true,
}

const storeListeners = new Set<() => void>()

function emitSnapshotChange() {
  for (const fn of storeListeners) fn()
}

function subscribeToSnapshot(listener: () => void) {
  storeListeners.add(listener)
  return () => { storeListeners.delete(listener) }
}

function getSnapshot(): JobsSnapshot {
  return snapshot
}

function getServerSnapshot(): JobsSnapshot {
  return { jobs: [], appCounts: {}, loading: true }
}

/** Fetch jobs + app counts and push into the external store */
async function fetchJobsIntoStore(employerId: string) {
  snapshot = { ...snapshot, loading: true }
  emitSnapshotChange()

  const supabase = createClient()

  const { data: jobsData, error: jobsErr } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false })

  if (jobsErr) {
    snapshot = { ...snapshot, loading: false }
    emitSnapshotChange()
    return
  }

  const rows = (jobsData as JobRow[]) ?? []

  if (rows.length === 0) {
    snapshot = { jobs: [], appCounts: {}, loading: false }
    emitSnapshotChange()
    return
  }

  const jobIds = rows.map((j) => j.id)

  const { data: appsData } = await supabase
    .from('applications')
    .select('job_id')
    .in('job_id', jobIds)

  const counts: Record<string, number> = {}
  for (const app of appsData ?? []) {
    counts[app.job_id] = (counts[app.job_id] || 0) + 1
  }

  snapshot = { jobs: rows, appCounts: counts, loading: false }
  emitSnapshotChange()
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerVacancies() {
  const user = useAppStore((s) => s.user)
  const navigate = useAppStore((s) => s.navigate)

  /* ---- external store (no setState in effects) ---- */
  const store = useSyncExternalStore(
    subscribeToSnapshot,
    getSnapshot,
    getServerSnapshot,
  )

  /* ---- ui state ---- */
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobRow | null>(null)
  const [form, setForm] = useState<VacancyForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  /* ================================================================ */
  /*  Subscribe to external store & trigger initial fetch              */
  /* ================================================================ */

  useEffect(() => {
    if (!user?.id) return
    fetchJobsIntoStore(user.id)
  }, [user])

  /* ================================================================ */
  /*  Filtered / searched list                                         */
  /* ================================================================ */

  const filtered = store.jobs.filter((v) => {
    const q = search.toLowerCase()
    const matchSearch =
      v.title.toLowerCase().includes(q) ||
      (v.location ?? '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  /* ================================================================ */
  /*  Dialog helpers                                                   */
  /* ================================================================ */

  function openCreateDialog() {
    setEditingJob(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  function openEditDialog(job: JobRow) {
    setEditingJob(job)
    setForm(jobToForm(job))
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingJob(null)
    setForm(EMPTY_FORM)
  }

  /* ================================================================ */
  /*  Submit (create / update)                                         */
  /* ================================================================ */

  async function handleSubmit(status: 'draft' | 'active') {
    if (!form.title.trim()) {
      toast.error('Job title is required')
      return
    }
    if (!form.listing.trim()) {
      toast.error('Job description (listing) is required')
      return
    }

    setSubmitting(true)
    const supabase = createClient()

    const payload = {
      employer_id: user!.id,
      title: form.title.trim(),
      listing: form.listing.trim(),
      requirements: form.requirements.trim() || null,
      location: form.location.trim() || null,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      job_type: form.job_type || null,
      sector: form.sector.trim() || null,
      description: form.listing.trim(),
      status,
    }

    if (editingJob) {
      const { error } = await supabase
        .from('jobs')
        .update(payload)
        .eq('id', editingJob.id)

      if (error) {
        toast.error('Failed to update vacancy')
        setSubmitting(false)
        return
      }
      toast.success('Vacancy updated successfully')
    } else {
      const { error } = await supabase.from('jobs').insert(payload)

      if (error) {
        toast.error('Failed to create vacancy')
        setSubmitting(false)
        return
      }
      toast.success(
        status === 'draft'
          ? 'Vacancy saved as draft'
          : 'Vacancy published successfully',
      )
    }

    setSubmitting(false)
    closeDialog()
    if (user?.id) fetchJobsIntoStore(user.id)
  }

  /* ================================================================ */
  /*  Status toggle                                                    */
  /* ================================================================ */

  async function updateStatus(jobId: string, newStatus: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId)

    if (error) {
      toast.error(
        `Failed to ${newStatus === 'active' ? 'reopen' : newStatus} vacancy`,
      )
      return
    }

    const label =
      newStatus === 'active'
        ? 'reopened'
        : newStatus === 'paused'
          ? 'paused'
          : 'closed'
    toast.success(`Vacancy ${label} successfully`)
    if (user?.id) fetchJobsIntoStore(user.id)
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  if (store.loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* ---- Header ---- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">
            Vacancies
          </h1>
          <p className="text-[#5A6B7F] mt-0.5">
            Manage your job listings and create new ones
          </p>
        </div>
        <Button
          className="bg-[#C4942A] hover:bg-[#B3861F] text-white self-start"
          onClick={openCreateDialog}
        >
          <Plus className="w-4 h-4 mr-2" /> Create Vacancy
        </Button>
      </motion.div>

      {/* ---- Filter bar ---- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search by title or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 border-[#D1D9E6] bg-[#F7F9FC]">
            <Filter className="w-4 h-4 mr-2 text-[#5A6B7F]" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* ---- Vacancy list ---- */}
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
              <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow bg-[#F7F9FC]">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-[#0B1D33]">
                          {v.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={
                            STATUS_STYLES[v.status] ??
                            'bg-gray-100 text-gray-600'
                          }
                        >
                          {v.status.charAt(0).toUpperCase() +
                            v.status.slice(1)}
                        </Badge>
                        {v.job_type && (
                          <Badge
                            variant="outline"
                            className="border-[#D1D9E6] text-[#5A6B7F]"
                          >
                            {v.job_type
                              .split('-')
                              .map(
                                (w) => w.charAt(0).toUpperCase() + w.slice(1),
                              )
                              .join('-')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-[#5A6B7F]">
                        {v.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {v.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />{' '}
                          {store.appCounts[v.id] ?? 0} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />{' '}
                          {formatDate(v.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Right actions */}
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#5A6B7F]"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate('employer-applications')}
                          >
                            <Eye className="w-4 h-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(v)}
                          >
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>

                          {/* Status toggle actions */}
                          {v.status === 'active' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => updateStatus(v.id, 'paused')}
                              >
                                <Pause className="w-4 h-4 mr-2" /> Pause
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateStatus(v.id, 'closed')}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Close
                              </DropdownMenuItem>
                            </>
                          )}
                          {v.status === 'paused' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => updateStatus(v.id, 'active')}
                              >
                                <Play className="w-4 h-4 mr-2" /> Reopen
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateStatus(v.id, 'closed')}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Close
                              </DropdownMenuItem>
                            </>
                          )}
                          {v.status === 'closed' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => updateStatus(v.id, 'active')}
                              >
                                <Play className="w-4 h-4 mr-2" /> Reopen
                              </DropdownMenuItem>
                            </>
                          )}
                          {v.status === 'draft' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => updateStatus(v.id, 'active')}
                              >
                                <Play className="w-4 h-4 mr-2" /> Publish
                              </DropdownMenuItem>
                            </>
                          )}
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
            <p className="text-sm mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/*  Create / Edit Dialog                                            */}
      {/* ================================================================ */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#D1D9E6] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33] flex items-center gap-2">
              {editingJob ? (
                <Pencil className="w-5 h-5 text-[#C4942A]" />
              ) : (
                <Plus className="w-5 h-5 text-[#C4942A]" />
              )}
              {editingJob ? 'Edit Vacancy' : 'Create Vacancy'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
            }}
            className="space-y-4 pt-2"
          >
            {/* Title */}
            <div className="space-y-2">
              <Label>
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Staff Nurse – ICU"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
              />
            </div>

            {/* Listing / Description */}
            <div className="space-y-2">
              <Label>
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Describe the role, responsibilities, and what makes it unique…"
                rows={4}
                value={form.listing}
                onChange={(e) =>
                  setForm((f) => ({ ...f, listing: e.target.value }))
                }
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label>Requirements</Label>
              <Textarea
                placeholder="Essential and desirable qualifications, skills, and experience…"
                rows={3}
                value={form.requirements}
                onChange={(e) =>
                  setForm((f) => ({ ...f, requirements: e.target.value }))
                }
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g. London, EC1A"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
              />
            </div>

            {/* Salary range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salary Min (£)</Label>
                <Input
                  placeholder="28000"
                  type="number"
                  min="0"
                  value={form.salary_min}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, salary_min: e.target.value }))
                  }
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
                />
              </div>
              <div className="space-y-2">
                <Label>Salary Max (£)</Label>
                <Input
                  placeholder="35000"
                  type="number"
                  min="0"
                  value={form.salary_max}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, salary_max: e.target.value }))
                  }
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
                />
              </div>
            </div>

            {/* Job type & Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={form.job_type}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, job_type: val }))
                  }
                >
                  <SelectTrigger className="border-[#D1D9E6] bg-[#F7F9FC]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sector</Label>
                <Input
                  placeholder="e.g. Healthcare"
                  value={form.sector}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sector: e.target.value }))
                  }
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 bg-[#F7F9FC]"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-[#D1D9E6]"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-[#C4942A] hover:bg-[#B3861F] text-white"
                disabled={submitting}
                onClick={() => handleSubmit('draft')}
              >
                {submitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save as Draft
              </Button>
              <Button
                type="button"
                className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white"
                disabled={submitting}
                onClick={() => handleSubmit('active')}
              >
                {submitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingJob ? 'Update & Publish' : 'Publish'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
