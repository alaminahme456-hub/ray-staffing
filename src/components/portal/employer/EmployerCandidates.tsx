'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Eye,
  MessageSquare,
  UserCheck,
  Briefcase,
  Mail,
  FileText,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CandidateRow {
  candidate_id: string
  candidate_name: string
  candidate_email: string | null
  candidate_phone: string | null
  candidate_role: string | null
  application_count: number
  latest_status: string
  applied_job_titles: string[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function statusColor(status: string): string {
  switch (status) {
    case 'shortlisted': return 'bg-emerald-100 text-emerald-700'
    case 'interviewing': return 'bg-purple-100 text-purple-700'
    case 'offered': return 'bg-cyan-100 text-cyan-700'
    case 'placed': return 'bg-green-100 text-green-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    case 'withdrawn': return 'bg-gray-100 text-gray-600'
    default: return 'bg-amber-100 text-amber-700'
  }
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerCandidates() {
  const supabase = useMemo(() => createClient(), [])
  const user = useAppStore((s) => s.user)

  const [candidates, setCandidates] = useState<CandidateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRow | null>(null)

  const hasFetched = useRef(false)

  async function fetchCandidates() {
    if (!user?.id) return
    try {
      /* Get all jobs for this employer */
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('employer_id', user.id)
      if (jobsErr) throw jobsErr

      if (!jobs || jobs.length === 0) {
        setCandidates([])
        return
      }

      const jobMap = new Map(jobs.map((j) => [j.id, j.title]))
      const jobIds = jobs.map((j) => j.id)

      /* Get all applications for those jobs */
      const { data: applications, error: appErr } = await supabase
        .from('applications')
        .select('id, candidate_id, job_id, status')
        .in('job_id', jobIds)
      if (appErr) throw appErr

      if (!applications || applications.length === 0) {
        setCandidates([])
        return
      }

      /* Group by candidate */
      const candidateMap = new Map<string, { jobIds: string[]; statuses: string[] }>()
      for (const app of applications) {
        if (!candidateMap.has(app.candidate_id)) {
          candidateMap.set(app.candidate_id, { jobIds: [], statuses: [] })
        }
        const entry = candidateMap.get(app.candidate_id)!
        entry.jobIds.push(app.job_id)
        entry.statuses.push(app.status)
      }

      /* Get profiles for all candidates */
      const candidateIds = [...candidateMap.keys()]
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, name, email, phone, role')
        .in('id', candidateIds)
      if (profErr) throw profErr

      const profileMap = new Map((profiles || []).map((p) => [p.id, p]))

      /* Build rows */
      const rows: CandidateRow[] = candidateIds.map((cid) => {
        const prof = profileMap.get(cid)
        const entry = candidateMap.get(cid)!
        const jobTitles = entry.jobIds.map((jid) => jobMap.get(jid) || 'Unknown').filter((v, i, a) => a.indexOf(v) === i)
        /* Get latest status by most recent application */
        const latestStatus = entry.statuses[entry.statuses.length - 1] || 'pending'
        return {
          candidate_id: cid,
          candidate_name: prof?.name || 'Unknown Candidate',
          candidate_email: prof?.email || null,
          candidate_phone: prof?.phone || null,
          candidate_role: prof?.role || null,
          application_count: entry.jobIds.length,
          latest_status: latestStatus,
          applied_job_titles: jobTitles,
        }
      })

      /* Sort by application count desc, then name */
      rows.sort((a, b) => b.application_count - a.application_count || a.candidate_name.localeCompare(b.candidate_name))

      setCandidates(rows)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  if (!hasFetched.current && user?.id) {
    hasFetched.current = true
    fetchCandidates()
  }

  /* ---- derived ---- */

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return candidates
    return candidates.filter(
      (c) =>
        c.candidate_name.toLowerCase().includes(q) ||
        (c.candidate_role || '').toLowerCase().includes(q) ||
        c.applied_job_titles.some((t) => t.toLowerCase().includes(q))
    )
  }, [candidates, search])

  /* ---- early returns ---- */

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#5A6B7F]">Please log in to view candidates.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Candidates</h1>
        <p className="text-[#5A6B7F] mt-0.5">Browse candidates who have applied to your vacancies</p>
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
          placeholder="Search by name, role, or job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
        />
      </motion.div>

      {/* Candidate Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((c, i) => (
            <motion.div
              key={c.candidate_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow h-full flex flex-col">
                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-11 h-11 bg-[#1A3A5C] text-white shrink-0">
                      <AvatarFallback className="text-xs font-semibold">{getInitials(c.candidate_name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#0B1D33] text-sm truncate">{c.candidate_name}</h3>
                      <p className="text-xs text-[#5A6B7F]">{c.candidate_role || 'Candidate'}</p>
                      <p className="text-xs text-[#5A6B7F] flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3" /> {c.application_count} application{c.application_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] font-medium shrink-0 ${statusColor(c.latest_status)}`}>
                      {c.latest_status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.applied_job_titles.slice(0, 3).map((t) => (
                      <Badge key={t} variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C] text-[10px] font-medium">
                        {t}
                      </Badge>
                    ))}
                    {c.applied_job_titles.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-100 text-[#5A6B7F] text-[10px]">
                        +{c.applied_job_titles.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-auto pt-3">
                    <Button
                      variant="outline"
                      className="w-full border-[#D1D9E6] text-[#1A3A5C] hover:bg-[#F0F4F8] text-sm"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#5A6B7F]">
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm mt-1">
            {search
              ? 'Try adjusting your search'
              : 'Candidates will appear here when they apply to your jobs'}
          </p>
        </div>
      )}

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#0B1D33] flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-[#1A3A5C] text-white">
                    <AvatarFallback className="text-sm font-semibold">{getInitials(selectedCandidate.candidate_name)}</AvatarFallback>
                  </Avatar>
                  {selectedCandidate.candidate_name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C]">{selectedCandidate.candidate_role || 'Candidate'}</Badge>
                  <Badge variant="secondary" className={`text-[10px] font-medium ${statusColor(selectedCandidate.latest_status)}`}>
                    {selectedCandidate.latest_status}
                  </Badge>
                </div>

                <Separator className="bg-[#D1D9E6]" />

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#0B1D33] flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#C4942A]" /> Applications</h4>
                    <p className="text-[#5A6B7F]">{selectedCandidate.application_count} application{selectedCandidate.application_count !== 1 ? 's' : ''} to your vacancies</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#0B1D33] flex items-center gap-2"><FileText className="w-4 h-4 text-[#C4942A]" /> Contact</h4>
                    <div className="space-y-1">
                      <p className="text-[#5A6B7F] flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 shrink-0" /> {selectedCandidate.candidate_email || '—'}
                      </p>
                      {selectedCandidate.candidate_phone && (
                        <p className="text-[#5A6B7F] flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" /> {selectedCandidate.candidate_phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#0B1D33] text-sm mb-2">Applied Jobs</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.applied_job_titles.map((t) => (
                      <Badge key={t} variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C]">{t}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="bg-[#C4942A] hover:bg-[#B3861F] text-white flex-1 sm:flex-none"
                    onClick={() => {
                      setSelectedCandidate(null)
                      toast.info('Navigate to Applications to manage this candidate')
                    }}
                  >
                    <UserCheck className="w-4 h-4 mr-2" /> View Applications
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
