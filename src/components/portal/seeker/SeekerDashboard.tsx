'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  UserCheck,
  CalendarCheck,
  Award,
  XCircle,
  ChevronRight,
  Clock,
  MapPin,
  TrendingUp,
  FileText,
  AlertCircle,
  Star,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'

interface DashboardData {
  profileComplete: number
  applicationCounts: { pending: number; shortlisted: number; interviewing: number; offered: number; rejected: number; withdrawn: number; placed: number }
  recentJobs: { id: string; title: string; location: string; salary_min: number; salary_max: number; job_type: string; sector: string; created_at: string }[]
}

function CircularProgress({ percentage, size = 100, strokeWidth = 8 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} stroke="#C4942A" strokeWidth={strokeWidth} fill="none"
        strokeLinecap="round" strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
      />
    </svg>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full max-w-md rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 lg:col-span-2 rounded-xl" />
      </div>
    </div>
  )
}

export default function SeekerDashboard() {
  const user = useAppStore((s) => s.user)
  const navigate = useAppStore((s) => s.navigate)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function fetchDashboard() {
      const supabase = createClient()
      try {
        const [profileRes, appsRes, jobsRes] = await Promise.all([
          supabase.from('candidate_profiles').select('profile_complete').eq('id', user.id).single(),
          supabase.from('applications').select('status').eq('candidate_id', user.id),
          supabase.from('jobs').select('id, title, location, salary_min, salary_max, job_type, sector, created_at').eq('status', 'active').order('created_at', { ascending: false }).limit(4),
        ])

        const profile = profileRes.data
        const apps = appsRes.data || []
        const jobs = jobsRes.data || []

        const counts = { pending: 0, shortlisted: 0, interviewing: 0, offered: 0, rejected: 0, withdrawn: 0, placed: 0 }
        apps.forEach(a => {
          const s = a.status as keyof typeof counts
          if (s in counts) counts[s]++
        })

        setData({
          profileComplete: profile?.profile_complete || 0,
          applicationCounts: counts,
          recentJobs: jobs,
        })
      } catch (err) {
        console.error('Failed to fetch seeker dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [user])

  if (loading || !data) return <DashboardSkeleton />

  const pipelineStages = [
    { key: 'pending', label: 'Applied', count: data.applicationCounts.pending, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { key: 'shortlisted', label: 'Shortlisted', count: data.applicationCounts.shortlisted, icon: UserCheck, color: 'text-[#C4942A]', bg: 'bg-amber-50', border: 'border-amber-200' },
    { key: 'interviewing', label: 'Interview', count: data.applicationCounts.interviewing, icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { key: 'offered', label: 'Offer', count: data.applicationCounts.offered, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { key: 'rejected', label: 'Rejected', count: data.applicationCounts.rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  ]

  const missingItems = data.profileComplete < 100
    ? ['Complete your skills profile', 'Upload your CV', 'Add professional references']
    : []

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Welcome back, {firstName}</h1>
        <p className="text-[#5A6B7F] mt-1">Here's an overview of your job search activity.</p>
      </motion.div>

      {/* Pipeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {pipelineStages.map((stage, i) => {
          const Icon = stage.icon
          return (
            <motion.div key={stage.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }} className="cursor-pointer" onClick={() => navigate('seeker-applications')}>
              <Card className={`${stage.bg} ${stage.border} border hover:shadow-md transition-shadow h-full`}>
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${stage.color} shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className={`text-2xl font-bold ${stage.color}`}>{stage.count}</p>
                  <p className="text-xs font-medium text-[#5A6B7F]">{stage.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Profile Completion + Recent Jobs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Completion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                <Star className="w-4 h-4 text-[#C4942A]" /> Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <CircularProgress percentage={data.profileComplete} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#0B1D33]">{data.profileComplete}%</span>
                  </div>
                </div>
              </div>
              {missingItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#5A6B7F]">To complete your profile:</p>
                  {missingItems.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-[#0B1D33]">{item}</p>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white"
                onClick={() => navigate('seeker-profile')}>
                {data.profileComplete >= 100 ? 'View Profile' : 'Complete Profile'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }} className="lg:col-span-2">
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C4942A]" /> Latest Jobs
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-[#C4942A] hover:text-[#C4942A] hover:bg-amber-50 text-xs" onClick={() => navigate('seeker-jobs')}>
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {data.recentJobs.length === 0 ? (
                <div className="text-center py-8 text-[#5A6B7F] text-sm">No active jobs posted yet. Check back soon!</div>
              ) : (
                data.recentJobs.map((job) => (
                  <div key={job.id} className="flex items-start gap-3 p-3 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                    onClick={() => navigate('seeker-jobs')}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0B1D33] leading-tight">{job.title}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        {job.location && (
                          <span className="flex items-center gap-1 text-[11px] text-[#5A6B7F]">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                        )}
                        {(job.salary_min > 0 || job.salary_max > 0) && (
                          <span className="text-[11px] text-[#5A6B7F] font-medium">
                            {job.salary_min > 0 ? `£${job.salary_min.toLocaleString()}` : ''}{job.salary_min > 0 && job.salary_max > 0 ? ' - ' : ''}{job.salary_max > 0 ? `£${job.salary_max.toLocaleString()}` : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {job.job_type && (
                          <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 text-[10px] capitalize">{job.job_type}</Badge>
                        )}
                        <span className="text-[10px] text-[#5A6B7F]">
                          {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C4942A]" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" className="border-[#D1D9E6] text-[#0B1D33] hover:bg-[#F7F9FC]" onClick={() => navigate('seeker-jobs')}>
                <Briefcase className="w-4 h-4 mr-2" /> Browse Jobs
              </Button>
              <Button variant="outline" className="border-[#D1D9E6] text-[#0B1D33] hover:bg-[#F7F9FC]" onClick={() => navigate('seeker-applications')}>
                <FileText className="w-4 h-4 mr-2" /> My Applications
              </Button>
              <Button variant="outline" className="border-[#D1D9E6] text-[#0B1D33] hover:bg-[#F7F9FC]" onClick={() => navigate('seeker-cv')}>
                <Award className="w-4 h-4 mr-2" /> Upload CV
              </Button>
              <Button variant="outline" className="border-[#D1D9E6] text-[#0B1D33] hover:bg-[#F7F9FC]" onClick={() => navigate('seeker-profile')}>
                <UserCheck className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
