'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  StickyNote,
  Save,
  User,
  Briefcase,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ApplicationStatus =
  | 'pending'
  | 'shortlisted'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'withdrawn'
  | 'placed'

interface ApplicationRow {
  id: string
  job_id: string
  candidate_id: string
  cover_letter: string | null
  status: ApplicationStatus
  employer_notes: string | null
  created_at: string
  updated_at: string
  candidate_name: string | null
  job_title: string | null
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ALL_STATUSES: ApplicationStatus[] = [
  'pending',
  'shortlisted',
  'interviewing',
  'offered',
  'rejected',
  'withdrawn',
  'placed',
]

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; dot: string; bg: string }
> = {
  pending:     { label: 'Pending',     dot: 'bg-amber-500',    bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  shortlisted: { label: 'Shortlisted', dot: 'bg-emerald-500',  bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  interviewing:{ label: 'Interviewing',dot: 'bg-purple-500',   bg: 'bg-purple-100 text-purple-700 border-purple-200' },
  offered:     { label: 'Offered',     dot: 'bg-cyan-500',     bg: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  rejected:    { label: 'Rejected',    dot: 'bg-red-500',      bg: 'bg-red-100 text-red-700 border-red-200' },
  withdrawn:   { label: 'Withdrawn',   dot: 'bg-gray-400',     bg: 'bg-gray-100 text-gray-600 border-gray-200' },
  placed:      { label: 'Placed',      dot: 'bg-green-600',    bg: 'bg-green-100 text-green-700 border-green-200' },
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function truncate(str: string | null, max: number): string {
  if (!str) return 'No cover letter provided'
  return str.length > max ? str.slice(0, max) + '…' : str
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <div className="space-y-1">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="flex gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerApplications() {
  const supabase = useMemo(() => createClient(), [])
  const user = useAppStore((s) => s.user)

  /* ---- state ---- */
  const [apps, setApps] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({})
  const [savingNotes, setSavingNotes] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  /* ---- one-time fetch (ref guard, no useEffect+setState) ---- */
  const hasFetched = useRef(false)

  async function fetchApplications() {
    if (!user?.id) return
    try {
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('employer_id', user.id)
      if (jobsErr) throw jobsErr

      if (!jobs || jobs.length === 0) {
        setApps([])
        return
      }

      const jobMap = new Map(jobs.map((j) => [j.id, j.title]))
      const jobIds = jobs.map((j) => j.id)

      const { data: applications, error: appErr } = await supabase
        .from('applications')
        .select(
          'id, job_id, candidate_id, cover_letter, status, employer_notes, created_at, updated_at'
        )
        .in('job_id', jobIds)
        .order('created_at', { ascending: false })
      if (appErr) throw appErr

      if (!applications || applications.length === 0) {
        setApps([])
        return
      }

      const candidateIds = [
        ...new Set(applications.map((a) => a.candidate_id)),
      ]
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', candidateIds)
      if (profErr) throw profErr

      const profileMap = new Map(
        (profiles || []).map((p) => [p.id, p.name])
      )

      const rows: ApplicationRow[] = applications.map((a) => ({
        ...a,
        candidate_name: profileMap.get(a.candidate_id) || 'Unknown Candidate',
        job_title: jobMap.get(a.job_id) || 'Unknown Job',
      }))

      setApps(rows)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  if (!hasFetched.current && user?.id) {
    hasFetched.current = true
    fetchApplications()
  }

  /* ---- derived data ---- */

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: apps.length }
    for (const s of ALL_STATUSES) {
      counts[s] = apps.filter((a) => a.status === s).length
    }
    return counts
  }, [apps])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return apps.filter((a) => {
      const matchSearch =
        q === '' ||
        (a.candidate_name || '').toLowerCase().includes(q) ||
        (a.job_title || '').toLowerCase().includes(q)
      const matchStatus =
        statusFilter === 'all' || a.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [apps, search, statusFilter])

  /* ---- handlers ---- */

  const toggleExpand = useCallback(
    (appId: string) => {
      setExpandedId((prev) => (prev === appId ? null : appId))
      setNotesDraft((prev) => {
        if (prev[appId] !== undefined) return prev
        const app = apps.find((a) => a.id === appId)
        return { ...prev, [appId]: app?.employer_notes || '' }
      })
    },
    [apps]
  )

  const updateStatus = useCallback(
    async (appId: string, newStatus: ApplicationStatus) => {
      setUpdatingStatus(appId)
      try {
        const { error } = await supabase
          .from('applications')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', appId)
        if (error) throw error

        setApps((prev) =>
          prev.map((a) =>
            a.id === appId ? { ...a, status: newStatus } : a
          )
        )
        toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`)
      } catch {
        toast.error('Failed to update status')
      } finally {
        setUpdatingStatus(null)
      }
    },
    [supabase]
  )

  const saveNotes = useCallback(
    async (appId: string) => {
      setSavingNotes(appId)
      try {
        const notes = notesDraft[appId] || null
        const { error } = await supabase
          .from('applications')
          .update({
            employer_notes: notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', appId)
        if (error) throw error

        setApps((prev) =>
          prev.map((a) =>
            a.id === appId ? { ...a, employer_notes: notes } : a
          )
        )
        toast.success('Notes saved successfully')
      } catch {
        toast.error('Failed to save notes')
      } finally {
        setSavingNotes(null)
      }
    },
    [supabase, notesDraft]
  )

  /* ---- early returns ---- */

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#5A6B7F]">Please log in to view applications.</p>
      </div>
    )
  }

  /* ---- render ---- */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">
          Applications
        </h1>
        <p className="text-[#5A6B7F] mt-0.5">
          Review and manage candidate applications across all your vacancies
        </p>
      </motion.div>

      {/* Status filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="flex gap-2 overflow-x-auto pb-2 -mb-1"
      >
        {(['all', ...ALL_STATUSES] as const).map((s) => {
          const isActive = statusFilter === s
          const label =
            s === 'all' ? 'All' : STATUS_CONFIG[s as ApplicationStatus].label
          const count = statusCounts[s] ?? 0
          return (
            <button
              key={s}
              onClick={() =>
                setStatusFilter((prev) => (prev === s ? 'all' : s))
              }
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                isActive
                  ? 'border-[#C4942A] bg-[#C4942A]/10 text-[#C4942A]'
                  : 'border-[#D1D9E6] bg-white text-[#5A6B7F] hover:bg-[#F7F9FC]'
              }`}
            >
              {label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#C4942A]/20 text-[#C4942A]'
                    : 'bg-[#F7F9FC] text-[#5A6B7F]'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
        <Input
          placeholder="Search by candidate name or job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
        />
      </motion.div>

      {/* Results count */}
      <p className="text-sm text-[#5A6B7F]">
        Showing <span className="font-semibold text-[#0B1D33]">{filtered.length}</span>{' '}
        {filtered.length === 1 ? 'application' : 'applications'}
        {statusFilter !== 'all' && (
          <>
            {' '}
            with status{' '}
            <Badge
              variant="outline"
              className={`ml-1 text-xs ${STATUS_CONFIG[statusFilter as ApplicationStatus]?.bg || ''}`}
            >
              {STATUS_CONFIG[statusFilter as ApplicationStatus]?.label || statusFilter}
            </Badge>
          </>
        )}
      </p>

      {/* Application cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((app, i) => {
            const isExpanded = expandedId === app.id
            const cfg = STATUS_CONFIG[app.status]
            const isUpdating = updatingStatus === app.id

            return (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className={`border-[#D1D9E6] transition-shadow ${
                    isExpanded
                      ? 'shadow-md ring-1 ring-[#C4942A]/20'
                      : 'hover:shadow-sm'
                  }`}
                >
                  <CardContent className="p-4 sm:p-5">
                    {/* Collapsed row */}
                    <button
                      type="button"
                      className="w-full text-left flex items-start gap-3"
                      onClick={() => toggleExpand(app.id)}
                      aria-expanded={isExpanded}
                    >
                      {/* Avatar placeholder */}
                      <div className="shrink-0 w-10 h-10 rounded-full bg-[#F7F9FC] border border-[#D1D9E6] flex items-center justify-center">
                        <User className="w-4 h-4 text-[#5A6B7F]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <h3 className="font-semibold text-[#0B1D33] text-sm truncate">
                            {app.candidate_name}
                          </h3>
                          <span className="hidden sm:inline text-[#D1D9E6]">·</span>
                          <span className="text-xs text-[#5A6B7F] truncate flex items-center gap-1">
                            <Briefcase className="w-3 h-3 shrink-0" />
                            {app.job_title}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-2 py-0 ${cfg?.bg || ''}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${cfg?.dot} mr-1.5`}
                            />
                            {cfg?.label || app.status}
                          </Badge>

                          <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                            <Calendar className="w-3 h-3" />
                            {formatDate(app.created_at)}
                          </span>

                          <span className="hidden sm:flex items-center gap-1 text-xs text-[#5A6B7F] max-w-[280px] truncate">
                            <FileText className="w-3 h-3 shrink-0" />
                            {truncate(app.cover_letter, 60)}
                          </span>
                        </div>
                      </div>

                      {/* Expand icon */}
                      <div className="shrink-0 mt-0.5">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#5A6B7F]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#5A6B7F]" />
                        )}
                      </div>
                    </button>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-[#D1D9E6] space-y-5">
                            {/* Cover Letter */}
                            <div>
                              <h4 className="text-sm font-semibold text-[#0B1D33] flex items-center gap-1.5 mb-2">
                                <FileText className="w-4 h-4 text-[#C4942A]" />
                                Cover Letter
                              </h4>
                              <div className="bg-[#F7F9FC] border border-[#D1D9E6] rounded-lg p-4 text-sm text-[#0B1D33] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                                {app.cover_letter || (
                                  <span className="text-[#5A6B7F] italic">
                                    No cover letter provided
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Status update */}
                            <div>
                              <h4 className="text-sm font-semibold text-[#0B1D33] mb-2">
                                Update Status
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {ALL_STATUSES.map((s) => {
                                  const sc = STATUS_CONFIG[s]
                                  const isCurrent = app.status === s
                                  return (
                                    <Button
                                      key={s}
                                      size="sm"
                                      variant={isCurrent ? 'default' : 'outline'}
                                      disabled={isCurrent || isUpdating}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        updateStatus(app.id, s)
                                      }}
                                      className={
                                        isCurrent
                                          ? 'bg-[#C4942A] text-white hover:bg-[#C4942A]/90'
                                          : `border-[#D1D9E6] text-[#0B1D33] hover:bg-[#F7F9FC] ${
                                              isUpdating
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                            }`
                                      }
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full ${sc.dot} mr-1.5`}
                                      />
                                      {sc.label}
                                    </Button>
                                  )
                                })}
                              </div>
                            </div>

                            <Separator className="bg-[#D1D9E6]" />

                            {/* Employer notes */}
                            <div>
                              <h4 className="text-sm font-semibold text-[#0B1D33] flex items-center gap-1.5 mb-2">
                                <StickyNote className="w-4 h-4 text-[#C4942A]" />
                                Employer Notes
                              </h4>
                              <Textarea
                                placeholder="Add private notes about this candidate..."
                                value={notesDraft[app.id] ?? ''}
                                onChange={(e) =>
                                  setNotesDraft((prev) => ({
                                    ...prev,
                                    [app.id]: e.target.value,
                                  }))
                                }
                                className="min-h-[100px] border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 resize-y"
                              />
                              <div className="flex justify-end mt-2">
                                <Button
                                  size="sm"
                                  disabled={savingNotes === app.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    saveNotes(app.id)
                                  }}
                                  className="bg-[#C4942A] text-white hover:bg-[#C4942A]/90"
                                >
                                  {savingNotes === app.id ? (
                                    <>
                                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                                      Saving…
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-3.5 h-3.5 mr-1.5" />
                                      Save Notes
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#5A6B7F]">
                              <span>
                                Applied:{' '}
                                <span className="font-medium text-[#0B1D33]">
                                  {formatDate(app.created_at)}
                                </span>
                              </span>
                              <span>
                                Last updated:{' '}
                                <span className="font-medium text-[#0B1D33]">
                                  {formatDate(app.updated_at)}
                                </span>
                              </span>
                              <span>
                                Application ID:{' '}
                                <span className="font-medium text-[#0B1D33]">
                                  {app.id.slice(0, 8)}
                                  </span>
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-[#F7F9FC] border border-[#D1D9E6] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[#5A6B7F]" />
            </div>
            <p className="text-lg font-semibold text-[#0B1D33]">
              No applications found
            </p>
            <p className="text-sm text-[#5A6B7F] mt-1">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Applications will appear here when candidates apply to your jobs'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
