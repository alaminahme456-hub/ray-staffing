'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  List,
  Video,
  Phone,
  MapPin,
  Clock,
  Plus,
  ExternalLink,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Save,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

type InterviewType = 'Video' | 'Phone' | 'In-person'

interface InterviewRow {
  id: string
  application_id: string
  candidate_name: string
  job_title: string
  candidate_id: string
  scheduled_at: string
  duration_min: number | null
  location: string | null
  meeting_link: string | null
  status: InterviewStatus
  interviewer_notes: string | null
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<InterviewStatus, { label: string; bg: string }> = {
  scheduled: { label: 'Scheduled', bg: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', bg: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100 text-red-700' },
  no_show: { label: 'No Show', bg: 'bg-amber-100 text-amber-700' },
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; icon: typeof Video }> = {
  Video: { label: 'Video', bg: 'bg-purple-100 text-purple-700', icon: Video },
  Phone: { label: 'Phone', bg: 'bg-blue-100 text-blue-700', icon: Phone },
  'In-person': { label: 'In-person', bg: 'bg-emerald-100 text-emerald-700', icon: MapPin },
}

const TYPE_FROM_LOCATION = (location: string | null, link: string | null): InterviewType => {
  if (link) return 'Video'
  if (!location) return 'Phone'
  return 'In-person'
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(min: number | null): string {
  if (!min) return '—'
  return `${min} min`
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerInterviews() {
  const supabase = useMemo(() => createClient(), [])
  const user = useAppStore((s) => s.user)

  const [interviews, setInterviews] = useState<InterviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [showSchedule, setShowSchedule] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<InterviewRow | null>(null)
  const [notesDraft, setNotesDraft] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  /* Schedule form state */
  const [schedApplicationId, setSchedApplicationId] = useState('')
  const [schedDate, setSchedDate] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [schedDuration, setSchedDuration] = useState('30')
  const [schedLocation, setSchedLocation] = useState('')
  const [schedNotes, setSchedNotes] = useState('')
  const [scheduling, setScheduling] = useState(false)

  /* Available applications for scheduling */
  const [availableApps, setAvailableApps] = useState<{ id: string; candidate_name: string; job_title: string }[]>([])

  const hasFetched = useRef(false)

  async function fetchInterviews() {
    if (!user?.id) return
    try {
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('employer_id', user.id)
      if (jobsErr) throw jobsErr

      if (!jobs || jobs.length === 0) {
        setInterviews([])
        setAvailableApps([])
        return
      }

      const jobMap = new Map(jobs.map((j) => [j.id, j.title]))
      const jobIds = jobs.map((j) => j.id)

      const { data: applications, error: appErr } = await supabase
        .from('applications')
        .select('id, candidate_id, job_id, status')
        .in('job_id', jobIds)
      if (appErr) throw appErr

      const apps = applications || []
      const appMap = new Map(apps.map((a) => [a.id, a]))
      const appIds = apps.map((a) => a.id)

      /* Fetch available applications for scheduling (shortlisted/interviewing) */
      const schedulable = apps
        .filter((a) => a.status === 'shortlisted' || a.status === 'interviewing')
      const schedCandidateIds = [...new Set(schedulable.map((a) => a.candidate_id))]
      const { data: schedProfiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', schedCandidateIds)
      const schedProfileMap = new Map((schedProfiles || []).map((p) => [p.id, p.name]))
      setAvailableApps(
        schedulable.map((a) => ({
          id: a.id,
          candidate_name: schedProfileMap.get(a.candidate_id) || 'Unknown',
          job_title: jobMap.get(a.job_id) || 'Unknown',
        }))
      )

      if (appIds.length === 0) {
        setInterviews([])
        return
      }

      const { data: interviewsData, error: intErr } = await supabase
        .from('interviews')
        .select('id, application_id, scheduled_at, duration_min, location, meeting_link, status, interviewer_notes')
        .in('application_id', appIds)
        .order('scheduled_at', { ascending: false })
      if (intErr) throw intErr

      if (!interviewsData || interviewsData.length === 0) {
        setInterviews([])
        return
      }

      const candidateIds = [
        ...new Set(
          interviewsData
            .map((inv) => appMap.get(inv.application_id)?.candidate_id)
            .filter(Boolean) as string[]
        ),
      ]
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', candidateIds)
      if (profErr) throw profErr

      const profileMap = new Map((profiles || []).map((p) => [p.id, p.name]))

      const rows: InterviewRow[] = interviewsData.map((inv) => {
        const app = appMap.get(inv.application_id)
        return {
          ...inv,
          candidate_name: app ? (profileMap.get(app.candidate_id) || 'Unknown Candidate') : 'Unknown Candidate',
          job_title: app ? (jobMap.get(app.job_id) || 'Unknown Job') : 'Unknown Job',
          candidate_id: app?.candidate_id || '',
        }
      })

      setInterviews(rows)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
    }
  }

  if (!hasFetched.current && user?.id) {
    hasFetched.current = true
    fetchInterviews()
  }

  /* ---- handlers ---- */

  const updateInterviewStatus = useCallback(
    async (interviewId: string, newStatus: InterviewStatus) => {
      setUpdatingStatus(interviewId)
      try {
        const { error } = await supabase
          .from('interviews')
          .update({ status: newStatus })
          .eq('id', interviewId)
        if (error) throw error
        setInterviews((prev) =>
          prev.map((inv) =>
            inv.id === interviewId ? { ...inv, status: newStatus } : inv
          )
        )
        toast.success(`Interview marked as ${STATUS_CONFIG[newStatus].label}`)
      } catch {
        toast.error('Failed to update interview status')
      } finally {
        setUpdatingStatus(null)
      }
    },
    [supabase]
  )

  const openNotes = useCallback((intv: InterviewRow) => {
    setSelectedInterview(intv)
    setNotesDraft(intv.interviewer_notes || '')
    setShowNotes(true)
  }, [])

  const saveNotes = useCallback(async () => {
    if (!selectedInterview) return
    setSavingNotes(true)
    try {
      const { error } = await supabase
        .from('interviews')
        .update({ interviewer_notes: notesDraft || null })
        .eq('id', selectedInterview.id)
      if (error) throw error
      setInterviews((prev) =>
        prev.map((inv) =>
          inv.id === selectedInterview.id
            ? { ...inv, interviewer_notes: notesDraft || null }
            : inv
        )
      )
      toast.success('Notes saved successfully')
      setShowNotes(false)
    } catch {
      toast.error('Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }, [supabase, selectedInterview, notesDraft])

  const handleSchedule = useCallback(async () => {
    if (!schedApplicationId || !schedDate || !schedTime || !user?.id) return
    setScheduling(true)
    try {
      const scheduledAt = new Date(`${schedDate}T${schedTime}`).toISOString()
      const isVideo = schedLocation.startsWith('http')
      const { error } = await supabase.from('interviews').insert({
        application_id: schedApplicationId,
        scheduled_at: scheduledAt,
        duration_min: parseInt(schedDuration) || 30,
        location: isVideo ? null : schedLocation || null,
        meeting_link: isVideo ? schedLocation : null,
        status: 'scheduled',
        interviewer_notes: schedNotes || null,
      })
      if (error) throw error
      toast.success('Interview scheduled successfully')
      setShowSchedule(false)
      setSchedApplicationId('')
      setSchedDate('')
      setSchedTime('')
      setSchedDuration('30')
      setSchedLocation('')
      setSchedNotes('')
      /* Re-fetch */
      hasFetched.current = false
      fetchInterviews()
    } catch {
      toast.error('Failed to schedule interview')
    } finally {
      setScheduling(false)
    }
  }, [supabase, schedApplicationId, schedDate, schedTime, schedDuration, schedLocation, schedNotes, user?.id])

  /* ---- derived ---- */

  const scheduled = interviews.filter((i) => i.status === 'scheduled')
  const completed = interviews.filter((i) => i.status === 'completed')
  const cancelled = interviews.filter((i) => i.status === 'cancelled')
  const noShows = interviews.filter((i) => i.status === 'no_show')

  /* ---- early returns ---- */

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#5A6B7F]">Please log in to view interviews.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Interviews</h1>
          <p className="text-[#5A6B7F] mt-0.5">Schedule and manage candidate interviews</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#F0F4F8] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white shadow text-[#0B1D33]' : 'text-[#5A6B7F] hover:text-[#0B1D33]'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white shadow text-[#0B1D33]' : 'text-[#5A6B7F] hover:text-[#0B1D33]'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Calendar
            </button>
          </div>
          <Button
            className="bg-[#C4942A] hover:bg-[#B3861F] text-white"
            onClick={() => setShowSchedule(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Schedule
          </Button>
        </div>
      </motion.div>

      {viewMode === 'list' ? (
        <div className="space-y-5">
          {/* Scheduled */}
          {scheduled.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-sm font-semibold text-[#5A6B7F] uppercase tracking-wider mb-3">Upcoming ({scheduled.length})</h2>
              <div className="space-y-3">
                {scheduled.map((intv, i) => {
                  const intvType = TYPE_FROM_LOCATION(intv.location, intv.meeting_link)
                  const typeCfg = TYPE_CONFIG[intvType]
                  const TypeIcon = typeCfg.icon
                  const isUpdating = updatingStatus === intv.id
                  return (
                    <motion.div
                      key={intv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.04 }}
                    >
                      <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-[#0B1D33] text-sm">{intv.candidate_name}</h3>
                                <Badge variant="secondary" className={typeCfg.bg}>
                                  <TypeIcon className="w-3 h-3 mr-1" /> {typeCfg.label}
                                </Badge>
                                <Badge variant="secondary" className={STATUS_CONFIG[intv.status].bg}>{STATUS_CONFIG[intv.status].label}</Badge>
                              </div>
                              <p className="text-xs text-[#5A6B7F] mt-1">{intv.job_title}</p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#5A6B7F]">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(intv.scheduled_at)} · {formatTime(intv.scheduled_at)}</span>
                                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{formatDuration(intv.duration_min)}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{intv.meeting_link || intv.location || '—'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {(intv.meeting_link) && (
                                <a href={intv.meeting_link} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" className="bg-[#C4942A] hover:bg-[#B3861F] text-white text-xs">
                                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Join
                                  </Button>
                                </a>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#D1D9E6] text-[#1A3A5C] text-xs"
                                onClick={() => openNotes(intv)}
                              >
                                <MessageSquare className="w-3.5 h-3.5 mr-1" /> Notes
                              </Button>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-emerald-200 text-emerald-700 text-xs hover:bg-emerald-50"
                                  disabled={isUpdating}
                                  onClick={() => updateInterviewStatus(intv.id, 'completed')}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Done
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 text-xs hover:bg-red-50"
                                  disabled={isUpdating}
                                  onClick={() => updateInterviewStatus(intv.id, 'cancelled')}
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="text-sm font-semibold text-[#5A6B7F] uppercase tracking-wider mb-3">Completed ({completed.length})</h2>
              <div className="space-y-3">
                {completed.map((intv) => {
                  const intvType = TYPE_FROM_LOCATION(intv.location, intv.meeting_link)
                  const typeCfg = TYPE_CONFIG[intvType]
                  const TypeIcon = typeCfg.icon
                  return (
                    <Card key={intv.id} className="border-[#D1D9E6]">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-[#0B1D33] text-sm">{intv.candidate_name}</h3>
                              <Badge variant="secondary" className={typeCfg.bg}>
                                <TypeIcon className="w-3 h-3 mr-1" /> {typeCfg.label}
                              </Badge>
                              <Badge variant="secondary" className={STATUS_CONFIG[intv.status].bg}>{STATUS_CONFIG[intv.status].label}</Badge>
                            </div>
                            <p className="text-xs text-[#5A6B7F] mt-1">{intv.job_title} · {formatDate(intv.scheduled_at)} at {formatTime(intv.scheduled_at)}</p>
                            {intv.interviewer_notes && (
                              <p className="text-xs text-[#5A6B7F] mt-1 italic">"{intv.interviewer_notes.slice(0, 100)}{intv.interviewer_notes.length > 100 ? '…' : ''}"</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#D1D9E6] text-[#1A3A5C] text-xs"
                            onClick={() => openNotes(intv)}
                          >
                            <Star className="w-3.5 h-3.5 mr-1" /> View Notes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Cancelled / No Show */}
          {(cancelled.length > 0 || noShows.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="text-sm font-semibold text-[#5A6B7F] uppercase tracking-wider mb-3">Cancelled / No Show ({cancelled.length + noShows.length})</h2>
              <div className="space-y-3">
                {[...cancelled, ...noShows].map((intv) => (
                  <Card key={intv.id} className="border-[#D1D9E6] opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#0B1D33] text-sm line-through">{intv.candidate_name}</h3>
                            <Badge variant="secondary" className={STATUS_CONFIG[intv.status].bg}>{STATUS_CONFIG[intv.status].label}</Badge>
                          </div>
                          <p className="text-xs text-[#5A6B7F] mt-1">{intv.job_title} · {formatDate(intv.scheduled_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {interviews.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#F7F9FC] border border-[#D1D9E6] flex items-center justify-center mb-4">
                <CalendarDays className="w-6 h-6 text-[#5A6B7F]" />
              </div>
              <p className="text-lg font-semibold text-[#0B1D33]">No interviews yet</p>
              <p className="text-sm text-[#5A6B7F] mt-1">Schedule your first interview using the button above</p>
            </motion.div>
          )}
        </div>
      ) : (
        /* Calendar View - Simple monthly view */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-[#D1D9E6]">
            <CardHeader>
              <CardTitle className="text-base text-[#0B1D33]">Interview Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarGrid interviews={scheduled} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Schedule Interview Dialog */}
      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#C4942A]" /> Schedule Interview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Application / Candidate *</Label>
              <Select value={schedApplicationId} onValueChange={setSchedApplicationId}>
                <SelectTrigger className="border-[#D1D9E6]"><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {availableApps.map((app) => (
                    <SelectItem key={app.id} value={app.id}>{app.candidate_name} – {app.job_title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration *</Label>
                <Select value={schedDuration} onValueChange={setSchedDuration}>
                  <SelectTrigger className="border-[#D1D9E6]"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location / Meeting Link *</Label>
                <Input
                  placeholder="e.g. Zoom link or room number"
                  value={schedLocation}
                  onChange={(e) => setSchedLocation(e.target.value)}
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                />
              </div>
              <div className="space-y-2">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any additional notes for the interviewer or candidate..."
                rows={3}
                value={schedNotes}
                onChange={(e) => setSchedNotes(e.target.value)}
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowSchedule(false)}>Cancel</Button>
              <Button
                className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white"
                disabled={scheduling || !schedApplicationId || !schedDate || !schedTime}
                onClick={handleSchedule}
              >
                {scheduling ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling…</> : 'Schedule Interview'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={showNotes} onOpenChange={setShowNotes}>
        <DialogContent className="max-w-lg border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">Interview Notes</DialogTitle>
          </DialogHeader>
          {selectedInterview && (
            <div className="space-y-5 pt-2">
              <div className="bg-[#F7F9FC] rounded-lg p-3 text-sm">
                <p className="font-medium text-[#0B1D33]">{selectedInterview.candidate_name}</p>
                <p className="text-xs text-[#5A6B7F]">{selectedInterview.job_title} · {formatDate(selectedInterview.scheduled_at)} at {formatTime(selectedInterview.scheduled_at)}</p>
              </div>

              <div className="space-y-2">
                <Label>Interviewer Notes</Label>
                <Textarea
                  placeholder="Add your interview notes here..."
                  rows={5}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowNotes(false)}>Cancel</Button>
                <Button
                  className="bg-[#C4942A] hover:bg-[#B3861F] text-white"
                  disabled={savingNotes}
                  onClick={saveNotes}
                >
                  {savingNotes ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Save className="w-4 h-4 mr-2" /> Save Notes</>}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Calendar Grid (local component)                                     */
/* ------------------------------------------------------------------ */

function CalendarGrid({ interviews }: { interviews: InterviewRow[] }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthName = new Date(year, month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 /* Monday start */

  const interviewDays = new Set(
    interviews.map((inv) => new Date(inv.scheduled_at).getDate())
  )

  const today = now.getDate()
  const isCurrentMonth = true

  return (
    <div className="grid grid-cols-7 gap-px bg-[#D1D9E6] rounded-lg overflow-hidden">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
        <div key={d} className="bg-[#F7F9FC] p-2 text-center text-xs font-medium text-[#5A6B7F]">{d}</div>
      ))}
      {Array.from({ length: startOffset }).map((_, i) => (
        <div key={`empty-${i}`} className="bg-white p-2 min-h-[60px]" />
      ))}
      {Array.from({ length: daysInMonth }).map((_, d) => {
        const dayNum = d + 1
        const hasInterview = interviewDays.has(dayNum)
        const isToday = isCurrentMonth && dayNum === today
        return (
          <div
            key={dayNum}
            className={`bg-white p-2 min-h-[60px] ${isToday ? 'bg-[#C4942A]/5' : ''}`}
          >
            <span className={`text-xs ${isToday ? 'font-bold text-[#C4942A]' : 'text-[#5A6B7F]'}`}>{dayNum}</span>
            {hasInterview && (
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#C4942A] mx-auto" />
            )}
          </div>
        )
      })}
    </div>
  )
}
