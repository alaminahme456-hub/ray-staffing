'use client'

import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  TrendingUp,
  Briefcase,
  FileText,
  UserCheck,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StatusCount {
  status: string
  count: number
}

interface ReportData {
  totalJobs: number
  totalApplications: number
  totalPlaced: number
  activeJobs: number
  statusBreakdown: StatusCount[]
  applicationsByMonth: { month: string; count: number }[]
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:     { label: 'Pending',     color: 'bg-amber-100 text-amber-700' },
  shortlisted: { label: 'Shortlisted', color: 'bg-emerald-100 text-emerald-700' },
  interviewing:{ label: 'Interviewing',color: 'bg-purple-100 text-purple-700' },
  offered:     { label: 'Offered',     color: 'bg-cyan-100 text-cyan-700' },
  rejected:    { label: 'Rejected',    color: 'bg-red-100 text-red-700' },
  withdrawn:   { label: 'Withdrawn',   color: 'bg-gray-100 text-gray-600' },
  placed:      { label: 'Placed',      color: 'bg-green-100 text-green-700' },
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerReports() {
  const supabase = useMemo(() => createClient(), [])
  const user = useAppStore((s) => s.user)

  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState<ReportData>({
    totalJobs: 0,
    totalApplications: 0,
    totalPlaced: 0,
    activeJobs: 0,
    statusBreakdown: [],
    applicationsByMonth: [],
  })

  const hasFetched = useRef(false)

  async function fetchReport() {
    if (!user?.id) return
    try {
      /* Get all jobs for this employer */
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, status')
        .eq('employer_id', user.id)
      if (jobsErr) throw jobsErr

      const allJobs = jobs || []
      const jobIds = allJobs.map((j) => j.id)

      /* Get all applications for these jobs */
      let applications: { status: string; created_at: string }[] = []
      if (jobIds.length > 0) {
        const { data: apps, error: appErr } = await supabase
          .from('applications')
          .select('status, created_at')
          .in('job_id', jobIds)
        if (appErr) throw appErr
        applications = (apps || []) as { status: string; created_at: string }[]
      }

      /* Status breakdown */
      const statusMap = new Map<string, number>()
      for (const app of applications) {
        statusMap.set(app.status, (statusMap.get(app.status) || 0) + 1)
      }
      const statusBreakdown: StatusCount[] = Array.from(statusMap.entries()).map(
        ([status, count]) => ({ status, count })
      )

      /* Applications by month (last 6 months) */
      const now = new Date()
      const monthKeys: string[] = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        monthKeys.push(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        )
      }

      const monthCounts = new Map<string, number>()
      for (const app of applications) {
        const m = app.created_at.slice(0, 7) /* YYYY-MM */
        if (monthKeys.includes(m)) {
          monthCounts.set(m, (monthCounts.get(m) || 0) + 1)
        }
      }

      const applicationsByMonth = monthKeys.map((mk) => {
        const d = new Date(parseInt(mk), parseInt(mk.split('-')[1]) - 1, 1)
        return {
          month: formatMonth(d.toISOString()),
          count: monthCounts.get(mk) || 0,
        }
      })

      setReport({
        totalJobs: allJobs.length,
        totalApplications: applications.length,
        totalPlaced: statusMap.get('placed') || 0,
        activeJobs: allJobs.filter((j) => j.status === 'active').length,
        statusBreakdown,
        applicationsByMonth,
      })
    } catch (err) {
      console.error(err)
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  if (!hasFetched.current && user?.id) {
    hasFetched.current = true
    fetchReport()
  }

  /* ---- derived ---- */

  const maxAppCount = Math.max(
    1,
    ...report.applicationsByMonth.map((m) => m.count)
  )

  const maxStatusCount = Math.max(
    1,
    ...report.statusBreakdown.map((s) => s.count)
  )

  /* ---- early returns ---- */

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#5A6B7F]">Please log in to view reports.</p>
      </div>
    )
  }

  /* ---- render ---- */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Reports</h1>
        <p className="text-[#5A6B7F] mt-0.5">Recruitment analytics and statistics</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Vacancies', value: report.totalJobs, icon: Briefcase, color: 'text-[#1A3A5C] bg-[#1A3A5C]/10' },
          { label: 'Active Vacancies', value: report.activeJobs, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Applications', value: report.totalApplications, icon: FileText, color: 'text-[#C4942A] bg-[#C4942A]/10' },
          { label: 'Placements', value: report.totalPlaced, icon: UserCheck, color: 'text-purple-600 bg-purple-50' },
        ].map((s) => (
          <Card key={s.label} className="border-[#D1D9E6]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1D33]">{s.value}</p>
                <p className="text-xs text-[#5A6B7F]">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Applications Over Time Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C4942A]" /> Applications Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.applicationsByMonth.length > 0 ? (
              <div className="space-y-3">
                {report.applicationsByMonth.map((row) => (
                  <div key={row.month} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5A6B7F] w-20 shrink-0">{row.month}</span>
                      <div className="flex-1 mx-3">
                        <div
                          className="h-6 rounded-sm bg-[#1A3A5C] transition-all duration-500"
                          style={{
                            width: `${(row.count / maxAppCount) * 100}%`,
                            minWidth: row.count > 0 ? '24px' : '0',
                            opacity: 0.85,
                          }}
                        >
                          {row.count > 0 && (
                            <span className="text-white text-[10px] font-medium px-2 leading-6">{row.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#5A6B7F]">
                <p className="text-sm">No application data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Applications by Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C4942A]" /> Applications by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.statusBreakdown.length > 0 ? (
              <div className="space-y-3">
                {report.statusBreakdown
                  .sort((a, b) => b.count - a.count)
                  .map((row) => {
                    const cfg = STATUS_CONFIG[row.status] || { label: row.status, color: 'bg-gray-100 text-gray-600' }
                    return (
                      <div key={row.status} className="flex items-center gap-3">
                        <Badge variant="secondary" className={`text-[10px] font-medium shrink-0 w-24 justify-center ${cfg.color}`}>
                          {cfg.label}
                        </Badge>
                        <div className="flex-1">
                          <div
                            className="h-6 rounded-sm bg-[#C4942A] transition-all duration-500"
                            style={{
                              width: `${(row.count / maxStatusCount) * 100}%`,
                              minWidth: row.count > 0 ? '32px' : '0',
                              opacity: 0.85,
                            }}
                          >
                            {row.count > 0 && (
                              <span className="text-white text-[10px] font-medium px-2 leading-6">{row.count}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-[#5A6B7F]">
                <p className="text-sm">No applications recorded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C4942A]" /> Summary Table
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#D1D9E6] bg-[#F7F9FC]">
                    <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F]">Status</th>
                    <th className="text-right py-2.5 px-4 font-medium text-[#5A6B7F]">Count</th>
                    <th className="text-right py-2.5 px-4 font-medium text-[#5A6B7F]">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {report.statusBreakdown
                    .sort((a, b) => b.count - a.count)
                    .map((row) => {
                      const cfg = STATUS_CONFIG[row.status] || { label: row.status, color: 'bg-gray-100 text-gray-600' }
                      const pct = report.totalApplications > 0
                        ? ((row.count / report.totalApplications) * 100).toFixed(1)
                        : '0.0'
                      return (
                        <tr key={row.status} className="border-b border-[#D1D9E6] last:border-0 hover:bg-[#F7F9FC]">
                          <td className="py-2.5 px-4">
                            <Badge variant="secondary" className={`text-[10px] font-medium ${cfg.color}`}>
                              {cfg.label}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-4 text-right text-[#0B1D33] font-medium">{row.count}</td>
                          <td className="py-2.5 px-4 text-right text-[#5A6B7F]">{pct}%</td>
                        </tr>
                      )
                    })}
                  {report.statusBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-[#5A6B7F]">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
