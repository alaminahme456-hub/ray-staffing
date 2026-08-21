'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase, Users, UserCheck, CalendarClock, UserPlus,
  ArrowRight, Clock, Video, Phone, MapPin, TrendingUp, TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'

interface EmployerData {
 companyName: string
  openJobs: number
  totalApplications: number
  shortlisted: number
  upcomingInterviews: number
  recentApplications: { id: string; candidate_name: string; job_title: string; status: string; created_at: string }[]
  interviews: { id: string; candidate_name: string; job_title: string; scheduled_at: string; meeting_link: string; location: string; status: string }[]
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

const statusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-amber-100 text-amber-700',
  interviewing: 'bg-purple-100 text-purple-700',
  offered: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function EmployerDashboard() {
  const user = useAppStore((s) => s.user)
  const navigate = useAppStore((s) => s.navigate)
  const [data, setData] = useState<EmployerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    async function fetchData() {
      const supabase = createClient()
      try {
        // Get employer profile
        const { data: profile } = await supabase.from('employer_profiles').select('company_name').eq('id', user.id).single()
        const companyName = profile?.company_name || 'Your Company'

        // Get jobs and applications
        const { data: jobs } = await supabase.from('jobs').select('id, title, status').eq('employer_id', user.id)
        const jobIds = (jobs || []).map(j => j.id)
        const openJobs = (jobs || []).filter(j => j.status === 'active').length

        let applications: any[] = []
        let interviews: any[] = []

        if (jobIds.length > 0) {
          const [appsRes, intRes] = await Promise.all([
            supabase.from('applications').select('id, candidate_id, job_id, status, created_at').in('job_id', jobIds).order('created_at', { ascending: false }).limit(10),
            supabase.from('interviews').select('id, application_id, scheduled_at, meeting_link, location, status').in('application_id', (await supabase.from('applications').select('id').in('job_id', jobIds)).data?.map(a => a.id) || []).order('scheduled_at', { ascending: true }).limit(5),
          ])
          applications = appsRes.data || []
          interviews = intRes.data || []

          // Get candidate names and job titles
          const candidateIds = [...new Set(applications.map(a => a.candidate_id))]
          const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', candidateIds)
          const nameMap = Object.fromEntries((profiles || []).map(p => [p.id, p.name || 'Candidate']))
          const jobMap = Object.fromEntries((jobs || []).map(j => [j.id, j.title]))

          const shortlisted = applications.filter(a => a.status === 'shortlisted').length

          setData({
            companyName,
            openJobs,
            totalApplications: applications.length,
            shortlisted,
            upcomingInterviews: interviews.filter(i => i.status === 'scheduled').length,
            recentApplications: applications.slice(0, 5).map(a => ({
              id: a.id, candidate_name: nameMap[a.candidate_id] || 'Candidate',
              job_title: jobMap[a.job_id] || 'Unknown Job', status: a.status,
              created_at: a.created_at,
            })),
            interviews: interviews.slice(0, 5).map(i => ({
              id: i.id, candidate_name: 'Candidate', job_title: 'Job',
              scheduled_at: i.scheduled_at, meeting_link: i.meeting_link,
              location: i.location, status: i.status,
            })),
          })
        } else {
          setData({ companyName, openJobs: 0, totalApplications: 0, shortlisted: 0, upcomingInterviews: 0, recentApplications: [], interviews: [] })
        }
      } catch (err) {
        console.error('Failed to fetch employer dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading || !data) return <PageSkeleton />

  const metrics = [
    { label: 'Open Vacancies', value: data.openJobs, icon: Briefcase, trend: data.openJobs > 0 ? `${data.openJobs} active` : 'None', up: true, color: 'bg-[#1A3A5C]/10 text-[#1A3A5C]' },
    { label: 'Total Applications', value: data.totalApplications, icon: Users, trend: `${data.totalApplications} total`, up: true, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Shortlisted', value: data.shortlisted, icon: UserCheck, trend: `${data.shortlisted} candidates`, up: true, color: 'bg-[#C4942A]/10 text-[#C4942A]' },
    { label: 'Upcoming Interviews', value: data.upcomingInterviews, icon: CalendarClock, trend: `${data.upcomingInterviews} scheduled`, up: true, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">
          Welcome back, <span className="text-[#C4942A]">{data.companyName}</span>
        </h1>
        <p className="text-[#5A6B7F] mt-1">Here's an overview of your recruitment activity.</p>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <motion.div key={m.label} variants={item}>
            <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${m.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.trend}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-[#0B1D33]">{m.value}</p>
                  <p className="text-xs text-[#5A6B7F] mt-0.5">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Applications Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0B1D33]">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" className="text-[#C4942A] hover:text-[#B3861F]" onClick={() => navigate('employer-applications')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentApplications.length === 0 ? (
              <div className="text-center py-8 text-[#5A6B7F] text-sm">No applications yet. Post a job to start receiving applications.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#D1D9E6] bg-[#F7F9FC]">
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F]">Candidate</th>
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden sm:table-cell">Job Title</th>
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden md:table-cell">Applied</th>
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F]">Status</th>
                      <th className="text-right py-2.5 px-4 font-medium text-[#5A6B7F]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentApplications.map((app) => (
                      <tr key={app.id} className="border-b border-[#D1D9E6] last:border-0 hover:bg-[#F7F9FC] transition-colors">
                        <td className="py-3 px-4 font-medium text-[#0B1D33]">
                          <span className="sm:hidden block text-xs text-[#5A6B7F]">{app.job_title}</span>
                          {app.candidate_name}
                        </td>
                        <td className="py-3 px-4 text-[#5A6B7F] hidden sm:table-cell">{app.job_title}</td>
                        <td className="py-3 px-4 text-[#5A6B7F] hidden md:table-cell">
                          {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className={statusColors[app.status] || 'bg-gray-100 text-gray-700'}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="text-[#1A3A5C] hover:text-[#C4942A]" onClick={() => navigate('employer-applications')}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Interviews */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0B1D33]">Upcoming Interviews</CardTitle>
            <Button variant="ghost" size="sm" className="text-[#C4942A] hover:text-[#B3861F]" onClick={() => navigate('employer-interviews')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {data.interviews.length === 0 ? (
              <div className="text-center py-8 text-[#5A6B7F] text-sm">No upcoming interviews scheduled.</div>
            ) : (
              <div className="space-y-3">
                {data.interviews.map((intv) => {
                  const d = new Date(intv.scheduled_at)
                  const type = intv.meeting_link ? 'Video' : intv.location ? 'In-person' : 'Phone'
                  const TypeIcon = type === 'Video' ? Video : type === 'Phone' ? Phone : MapPin
                  const typeColor = type === 'Video' ? 'bg-purple-100 text-purple-700' : type === 'Phone' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  return (
                    <div key={intv.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F7F9FC] hover:bg-[#F0F4F8] transition-colors">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium text-[#0B1D33] truncate">{intv.candidate_name}</p>
                        <p className="text-xs text-[#5A6B7F] truncate">{intv.job_title}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#5A6B7F]">
                          <Clock className="w-3 h-3" />
                          {d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className={typeColor}>
                          <span className="flex items-center gap-1"><TypeIcon className="w-3.5 h-3.5" /> {type}</span>
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
