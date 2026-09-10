'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Building2, ChevronDown, ChevronUp, Clock, MessageSquare,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'

type AppStatus = 'pending' | 'shortlisted' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn' | 'placed'

const pipelineOrder: AppStatus[] = ['pending', 'shortlisted', 'interviewing', 'offered']

const statusConfig: Record<AppStatus, { label: string; color: string; dotColor: string }> = {
  pending:    { label: 'Applied',     color: 'bg-blue-100 text-blue-700',      dotColor: 'bg-blue-500' },
  shortlisted: { label: 'Shortlisted', color: 'bg-amber-100 text-amber-700',    dotColor: 'bg-[#C4942A]' },
  interviewing:{ label: 'Interview',   color: 'bg-purple-100 text-purple-700',  dotColor: 'bg-purple-500' },
  offered:    { label: 'Offer',       color: 'bg-emerald-100 text-emerald-700',dotColor: 'bg-emerald-500' },
  rejected:   { label: 'Rejected',    color: 'bg-red-100 text-red-700',        dotColor: 'bg-red-500' },
  withdrawn:  { label: 'Withdrawn',   color: 'bg-gray-100 text-gray-700',      dotColor: 'bg-gray-400' },
  placed:     { label: 'Placed',      color: 'bg-emerald-100 text-emerald-700',dotColor: 'bg-emerald-500' },
}

interface AppRow {
  id: string
  job_id: string
  status: AppStatus
  cover_letter: string
  employer_notes: string
  created_at: string
  updated_at: string
  job_title?: string
  employer_name?: string
  job_location?: string
}

type FilterTab = 'all' | AppStatus

function getTabs(applications: AppRow[]): { key: FilterTab; label: string; count: number }[] {
  const counts: Record<string, number> = { all: applications.length }
  applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1 })
  return [
    { key: 'all', label: 'All', count: counts.all || 0 },
    { key: 'pending', label: 'Applied', count: counts.pending || 0 },
    { key: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted || 0 },
    { key: 'interviewing', label: 'Interview', count: counts.interviewing || 0 },
    { key: 'offered', label: 'Offer', count: counts.offered || 0 },
    { key: 'rejected', label: 'Rejected', count: counts.rejected || 0 },
    { key: 'withdrawn', label: 'Withdrawn', count: counts.withdrawn || 0 },
    { key: 'placed', label: 'Placed', count: counts.placed || 0 },
  ].filter(t => t.count > 0 || t.key === 'all')
}

function PipelineIndicator({ status }: { status: AppStatus }) {
  const currentIdx = status === 'placed' ? pipelineOrder.length
    : status === 'rejected' || status === 'withdrawn' ? -1
    : pipelineOrder.indexOf(status)

  return (
    <div className="flex items-center gap-0.5">
      {pipelineOrder.map((step, i) => {
        const isComplete = currentIdx > i
        const isCurrent = currentIdx === i
        const isRejected = status === 'rejected' || status === 'withdrawn'
        const stepStatus = isRejected ? (i <= 1 ? 'rejected-half' : 'inactive') : isComplete ? 'complete' : isCurrent ? 'current' : 'inactive'
        return (
          <div key={step} className="flex items-center">
            <div className={cn('w-2 h-2 rounded-full shrink-0 transition-colors',
              stepStatus === 'complete' && 'bg-emerald-500',
              stepStatus === 'current' && 'bg-[#C4942A] ring-2 ring-[#C4942A]/30',
              stepStatus === 'inactive' && 'bg-[#D1D9E6]',
              stepStatus === 'rejected-half' && 'bg-red-400',
            )} title={step} />
            {i < pipelineOrder.length - 1 && (
              <div className={cn('w-4 h-0.5 shrink-0',
                stepStatus === 'complete' ? 'bg-emerald-500' : stepStatus === 'rejected-half' ? 'bg-red-400' : 'bg-[#D1D9E6]',
              )} />
            )}
          </div>
        )
      })}
      {(status === 'placed' || status === 'offered') && (
        <><div className="w-4 h-0.5 bg-emerald-500 shrink-0" /><div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Placed" /></>
      )}
    </div>
  )
}

export default function SeekerApplications() {
  const user = useAppStore((s) => s.user)
  const [applications, setApplications] = useState<AppRow[]>([])
  const [loading, setLoading] = useState(!user)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    async function fetchApplications() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('id, job_id, status, cover_letter, employer_notes, created_at, updated_at')
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false })

      if (error) { console.error('Failed to fetch applications:', error); setLoading(false); return }

      const apps = (data || []) as AppRow[]

      // Fetch job details
      const jobIds = [...new Set(apps.map(a => a.job_id))]
      if (jobIds.length > 0) {
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('id, title, location, employer_id')
          .in('id', jobIds)

        const employerIds = [...new Set((jobsData || []).map(j => j.employer_id))]
        let nameMap: Record<string, string> = {}
        if (employerIds.length > 0) {
          const { data: employers } = await supabase
            .from('employer_profiles')
            .select('id, company_name')
            .in('id', employerIds)
          nameMap = Object.fromEntries((employers || []).map(e => [e.id, e.company_name]))
        }

        const jobMap = Object.fromEntries((jobsData || []).map(j => [j.id, { title: j.title, location: j.location, employer_name: nameMap[j.employer_id] || 'Employer' }]))
        const enriched = apps.map(a => {
          const job = jobMap[a.job_id]
          return { ...a, job_title: job?.title, job_location: job?.location, employer_name: job?.employer_name }
        })
        setApplications(enriched)
      } else {
        setApplications(apps)
      }
      setLoading(false)
    }
    fetchApplications()
  }, [user])

  const tabs = getTabs(applications)
  const filtered = activeTab === 'all' ? applications : applications.filter(a => a.status === activeTab)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My Applications</h1>
        <p className="text-[#5A6B7F] mt-1">Track the progress of all your job applications.</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                activeTab === tab.key ? 'bg-[#C4942A] text-white' : 'bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#E2E8F0]',
              )}>
              {tab.label}
              <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#D1D9E6] text-[#5A6B7F]',
              )}>{tab.count}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Application Cards */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border-[#D1D9E6]"><CardContent className="p-12 text-center">
              <Briefcase className="w-10 h-10 text-[#D1D9E6] mx-auto mb-3" />
              <p className="text-sm font-medium text-[#0B1D33]">No applications found</p>
              <p className="text-xs text-[#5A6B7F] mt-1">Applications matching this filter will appear here.</p>
            </CardContent></Card>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((app, i) => {
              const config = statusConfig[app.status]
              const isExpanded = expandedId === app.id
              return (
                <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <Card className="border-[#D1D9E6] hover:shadow-sm transition-shadow">
                    <CardContent className="p-0">
                      <button className="w-full text-left p-4 sm:p-5" onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm sm:text-base font-semibold text-[#0B1D33]">{app.job_title || 'Unknown Job'}</h3>
                              <Badge className={`${config.color} border-0 text-[11px] shrink-0`}>{config.label}</Badge>
                            </div>
                            <p className="text-xs text-[#5A6B7F] mt-1 flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {app.employer_name || 'Employer'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                                <Clock className="w-3 h-3" /> Applied {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                              {app.job_location && (
                                <span className="text-xs text-[#5A6B7F]">{app.job_location}</span>
                              )}
                            </div>
                            <div className="mt-2"><PipelineIndicator status={app.status} /></div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-[#5A6B7F]" /> : <ChevronDown className="w-4 h-4 text-[#5A6B7F]" />}
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                              <div className="border-t border-[#D1D9E6] pt-4 space-y-4">
                                {app.cover_letter && (
                                  <div>
                                    <h4 className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                      <MessageSquare className="w-3.5 h-3.5" /> My Cover Letter
                                    </h4>
                                    <p className="text-sm text-[#0B1D33] bg-[#F7F9FC] rounded-lg p-3 whitespace-pre-wrap">{app.cover_letter}</p>
                                  </div>
                                )}
                                {app.employer_notes && (
                                  <div>
                                    <h4 className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5">Employer Notes</h4>
                                    <p className="text-sm text-[#0B1D33] bg-amber-50 rounded-lg p-3 whitespace-pre-wrap">{app.employer_notes}</p>
                                  </div>
                                )}
                                {!app.cover_letter && !app.employer_notes && (
                                  <p className="text-xs text-[#5A6B7F]">No additional details available for this application.</p>
                                )}
                                <p className="text-[10px] text-[#5A6B7F]">Last updated: {new Date(app.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
        )}
      </div>
    </div>
  )
}
