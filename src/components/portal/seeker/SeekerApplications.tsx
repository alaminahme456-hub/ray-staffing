'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Status = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEW' | 'DECISION' | 'OFFER' | 'REJECTED'

const pipelineOrder: Status[] = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEW', 'DECISION']

const statusConfig: Record<Status, { label: string; color: string; dotColor: string }> = {
  APPLIED: { label: 'Applied', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' },
  REVIEWING: { label: 'Reviewing', color: 'bg-sky-100 text-sky-700', dotColor: 'bg-sky-500' },
  SHORTLISTED: { label: 'Shortlisted', color: 'bg-amber-100 text-amber-700', dotColor: 'bg-[#C4942A]' },
  INTERVIEW: { label: 'Interview', color: 'bg-purple-100 text-purple-700', dotColor: 'bg-purple-500' },
  DECISION: { label: 'Decision', color: 'bg-indigo-100 text-indigo-700', dotColor: 'bg-indigo-500' },
  OFFER: { label: 'Offer', color: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
}

interface Application {
  id: number
  jobTitle: string
  company: string
  location: string
  dateApplied: string
  status: Status
  notes: string
  timeline: { date: string; event: string; by: string }[]
}

const applications: Application[] = [
  {
    id: 1,
    jobTitle: 'Senior Staff Nurse - Intensive Care Unit',
    company: 'Barts Health NHS Trust',
    location: 'London, EC1A',
    dateApplied: '12 July 2025',
    status: 'SHORTLISTED',
    notes: 'Application highlighted relevant ICU experience and BLS/ACLS certifications. Consultant interview scheduled for next week.',
    timeline: [
      { date: '12 Jul 2025', event: 'Application submitted', by: 'You' },
      { date: '15 Jul 2025', event: 'Application acknowledged by HR', by: 'Sarah Thompson' },
      { date: '18 Jul 2025', event: 'CV reviewed by hiring manager', by: 'Dr James Patel' },
      { date: '22 Jul 2025', event: 'Shortlisted for interview', by: 'Sarah Thompson' },
    ],
  },
  {
    id: 2,
    jobTitle: 'Charge Nurse - Accident & Emergency',
    company: 'Imperial College Healthcare NHS Trust',
    location: 'London, W2',
    dateApplied: '8 July 2025',
    status: 'INTERVIEW',
    notes: 'First round interview completed. Panel interview with Matron and Ward Manager scheduled for 28th July.',
    timeline: [
      { date: '8 Jul 2025', event: 'Application submitted', by: 'You' },
      { date: '11 Jul 2025', event: 'Application under review', by: 'HR Team' },
      { date: '16 Jul 2025', event: 'Shortlisted for interview', by: 'Claire Redmond' },
      { date: '21 Jul 2025', event: 'First round interview completed', by: 'Interview Panel' },
      { date: '23 Jul 2025', event: 'Panel interview scheduled', by: 'Claire Redmond' },
    ],
  },
  {
    id: 3,
    jobTitle: 'Nurse Practitioner - Primary Care',
    company: "Guy's and St Thomas' NHS Foundation Trust",
    location: 'London, SE1',
    dateApplied: '5 July 2025',
    status: 'OFFER',
    notes: 'Received conditional offer subject to DBS and occupational health clearance. Offer deadline: 10th August.',
    timeline: [
      { date: '5 Jul 2025', event: 'Application submitted', by: 'You' },
      { date: '9 Jul 2025', event: 'Application acknowledged', by: 'David Okonkwo' },
      { date: '14 Jul 2025', event: 'Shortlisted for interview', by: 'David Okonkwo' },
      { date: '18 Jul 2025', event: 'Interview completed successfully', by: 'Interview Panel' },
      { date: '22 Jul 2025', event: 'Offer received (£45,000 p.a.)', by: 'David Okonkwo' },
    ],
  },
  {
    id: 4,
    jobTitle: 'Community Mental Health Nurse',
    company: 'South London and Maudsley NHS FT',
    location: 'London, SE5',
    dateApplied: '1 July 2025',
    status: 'REVIEWING',
    notes: 'Application being reviewed by the community nursing team lead. Awaiting feedback.',
    timeline: [
      { date: '1 Jul 2025', event: 'Application submitted', by: 'You' },
      { date: '4 Jul 2025', event: 'Application acknowledged', by: 'HR Team' },
      { date: '10 Jul 2025', event: 'Application under review by clinical lead', by: 'Dr Patricia Mensah' },
    ],
  },
  {
    id: 5,
    jobTitle: 'Theatre Nurse - Operating Department',
    company: 'University College London Hospitals',
    location: 'London, NW1',
    dateApplied: '25 June 2025',
    status: 'REJECTED',
    notes: 'Application unsuccessful. Feedback: strong clinical skills but theatre experience below the required 12 months minimum.',
    timeline: [
      { date: '25 Jun 2025', event: 'Application submitted', by: 'You' },
      { date: '28 Jun 2025', event: 'Application acknowledged', by: 'HR Team' },
      { date: '8 Jul 2025', event: 'Application reviewed', by: 'Anna Kowalski' },
      { date: '12 Jul 2025', event: 'Application unsuccessful', by: 'Anna Kowalski' },
    ],
  },
]

type FilterTab = 'all' | Status | 'OFFER' | 'REJECTED'

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'APPLIED', label: 'Applied' },
  { key: 'REVIEWING', label: 'Reviewing' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'DECISION', label: 'Decision' },
  { key: 'OFFER', label: 'Offer' },
  { key: 'REJECTED', label: 'Rejected' },
]

function PipelineIndicator({ status }: { status: Status }) {
  const currentIdx = status === 'OFFER'
    ? pipelineOrder.length
    : status === 'REJECTED'
      ? -1
      : pipelineOrder.indexOf(status)

  return (
    <div className="flex items-center gap-0.5">
      {pipelineOrder.map((step, i) => {
        const isComplete = currentIdx > i
        const isCurrent = currentIdx === i
        const isRejected = status === 'REJECTED'
        const stepStatus = isRejected
          ? i <= 2
            ? 'rejected-half'
            : 'inactive'
          : isComplete
            ? 'complete'
            : isCurrent
              ? 'current'
              : 'inactive'

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                'w-2 h-2 rounded-full shrink-0 transition-colors',
                stepStatus === 'complete' && 'bg-emerald-500',
                stepStatus === 'current' && 'bg-[#C4942A] ring-2 ring-[#C4942A]/30',
                stepStatus === 'inactive' && 'bg-[#D1D9E6]',
                stepStatus === 'rejected-half' && 'bg-red-400',
              )}
              title={step}
            />
            {i < pipelineOrder.length - 1 && (
              <div
                className={cn(
                  'w-4 h-0.5 shrink-0',
                  stepStatus === 'complete' ? 'bg-emerald-500' : stepStatus === 'rejected-half' ? 'bg-red-400' : 'bg-[#D1D9E6]',
                  isComplete && stepStatus !== 'complete' && 'bg-emerald-500',
                )}
              />
            )}
          </div>
        )
      })}
      {status === 'OFFER' && (
        <>
          <div className="w-4 h-0.5 bg-emerald-500 shrink-0" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Offer" />
        </>
      )}
    </div>
  )
}

export default function SeekerApplications() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = activeTab === 'all'
    ? applications
    : applications.filter((a) => a.status === activeTab)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My Applications</h1>
        <p className="text-[#5A6B7F] mt-1">Track the progress of all your job applications.</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const count = tab.key === 'all'
              ? applications.length
              : applications.filter((a) => a.status === tab.key).length
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0',
                  activeTab === tab.key
                    ? 'bg-[#C4942A] text-white'
                    : 'bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#E2E8F0]',
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#D1D9E6] text-[#5A6B7F]',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Application Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-[#D1D9E6]">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-10 h-10 text-[#D1D9E6] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#0B1D33]">No applications found</p>
                  <p className="text-xs text-[#5A6B7F] mt-1">Applications matching this filter will appear here.</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filtered.map((app, i) => {
              const config = statusConfig[app.status]
              const isExpanded = expandedId === app.id
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="border-[#D1D9E6] hover:shadow-sm transition-shadow">
                    <CardContent className="p-0">
                      {/* Main Row */}
                      <button
                        className="w-full text-left p-4 sm:p-5"
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm sm:text-base font-semibold text-[#0B1D33]">{app.jobTitle}</h3>
                              <Badge className={`${config.color} border-0 text-[11px] shrink-0`}>{config.label}</Badge>
                            </div>
                            <p className="text-xs text-[#5A6B7F] mt-1 flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {app.company}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                                <Clock className="w-3 h-3" /> Applied {app.dateApplied}
                              </span>
                            </div>
                            <div className="mt-2">
                              <PipelineIndicator status={app.status} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-[#5A6B7F]" /> : <ChevronDown className="w-4 h-4 text-[#5A6B7F]" />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                              <div className="border-t border-[#D1D9E6] pt-4 space-y-4">
                                {/* Notes */}
                                <div>
                                  <h4 className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5" /> Notes
                                  </h4>
                                  <p className="text-sm text-[#0B1D33] bg-[#F7F9FC] rounded-lg p-3">{app.notes}</p>
                                </div>

                                {/* Timeline */}
                                <div>
                                  <h4 className="text-xs font-semibold text-[#5A6B7F] uppercase tracking-wider mb-2">Application Timeline</h4>
                                  <div className="space-y-0">
                                    {app.timeline.map((entry, ti) => (
                                      <div key={ti} className="flex gap-3 pb-3 last:pb-0">
                                        <div className="flex flex-col items-center">
                                          <div className="w-2 h-2 rounded-full bg-[#C4942A] mt-1.5 shrink-0" />
                                          {ti < app.timeline.length - 1 && (
                                            <div className="w-px flex-1 bg-[#D1D9E6] mt-1" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm text-[#0B1D33]">{entry.event}</p>
                                          <p className="text-[11px] text-[#5A6B7F]">{entry.date} · {entry.by}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
