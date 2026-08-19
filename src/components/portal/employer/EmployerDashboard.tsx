'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Users,
  UserCheck,
  CalendarClock,
  UserPlus,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Video,
  Phone,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'

const metrics = [
  { label: 'Open Vacancies', value: 12, icon: Briefcase, trend: '+3 this week', up: true, color: 'bg-[#1A3A5C]/10 text-[#1A3A5C]' },
  { label: 'Total Applications', value: 147, icon: Users, trend: '+28 this week', up: true, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Shortlisted', value: 34, icon: UserCheck, trend: '+5 this week', up: true, color: 'bg-[#C4942A]/10 text-[#C4942A]' },
  { label: 'Upcoming Interviews', value: 8, icon: CalendarClock, trend: '+2 this week', up: true, color: 'bg-purple-50 text-purple-600' },
  { label: 'Active Placements', value: 23, icon: UserPlus, trend: '-1 this week', up: false, color: 'bg-orange-50 text-orange-600' },
]

const recentApplications = [
  { id: '1', candidate: 'Aisha Patel', job: 'Staff Nurse – ICU', applied: '18 Aug 2026', status: 'New' },
  { id: '2', candidate: 'James Okafor', job: 'Senior Physiotherapist', applied: '17 Aug 2026', status: 'Reviewing' },
  { id: '3', candidate: 'Emma Worthington', job: 'Radiographer', applied: '17 Aug 2026', status: 'Shortlisted' },
  { id: '4', candidate: 'Kwame Asante', job: 'Mental Health Nurse', applied: '16 Aug 2026', status: 'Interview' },
  { id: '5', candidate: 'Sophie Chambers', job: 'Occupational Therapist', applied: '16 Aug 2026', status: 'New' },
]

const upcomingInterviews = [
  { id: '1', candidate: 'Emma Worthington', job: 'Radiographer', date: '20 Aug 2026', time: '10:00 AM', type: 'Video' },
  { id: '2', candidate: 'Kwame Asante', job: 'Mental Health Nurse', date: '20 Aug 2026', time: '2:00 PM', type: 'Phone' },
  { id: '3', candidate: 'Aisha Patel', job: 'Staff Nurse – ICU', date: '21 Aug 2026', time: '11:30 AM', type: 'In-person' },
]

const funnelStages = [
  { stage: 'Applications', count: 147, width: '100%' },
  { stage: 'Screening', count: 89, width: '60%' },
  { stage: 'Shortlisted', count: 34, width: '23%' },
  { stage: 'Interviews', count: 18, width: '12%' },
  { stage: 'Offers', count: 8, width: '5%' },
]

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Reviewing: 'bg-amber-100 text-amber-700',
  Shortlisted: 'bg-emerald-100 text-emerald-700',
  Interview: 'bg-purple-100 text-purple-700',
  Rejected: 'bg-red-100 text-red-700',
}

const interviewTypeIcon = (type: string) => {
  switch (type) {
    case 'Video': return <Video className="w-3.5 h-3.5" />
    case 'Phone': return <Phone className="w-3.5 h-3.5" />
    default: return <MapPin className="w-3.5 h-3.5" />
  }
}

const interviewTypeColor: Record<string, string> = {
  Video: 'bg-purple-100 text-purple-700',
  Phone: 'bg-blue-100 text-blue-700',
  'In-person': 'bg-emerald-100 text-emerald-700',
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <div className="grid md:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function EmployerDashboard() {
  const [loading, setLoading] = useState(true)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">
          Welcome back, <span className="text-[#C4942A]">Barts Health NHS Trust</span>
        </h1>
        <p className="text-[#5A6B7F] mt-1">Here’s an overview of your recruitment activity.</p>
      </motion.div>

      {/* Metric Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0B1D33]">Recent Applications</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#C4942A] hover:text-[#B3861F]"
              onClick={() => navigate('employer-applications')}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
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
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-[#D1D9E6] last:border-0 hover:bg-[#F7F9FC] transition-colors">
                      <td className="py-3 px-4 font-medium text-[#0B1D33]">
                        <span className="sm:hidden block text-xs text-[#5A6B7F]">{app.job}</span>
                        {app.candidate}
                      </td>
                      <td className="py-3 px-4 text-[#5A6B7F] hidden sm:table-cell">{app.job}</td>
                      <td className="py-3 px-4 text-[#5A6B7F] hidden md:table-cell">{app.applied}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={statusColors[app.status] || ''}>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#1A3A5C] hover:text-[#C4942A]"
                          onClick={() => navigate('employer-applications')}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Grid: Interviews + Funnel */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Upcoming Interviews */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Upcoming Interviews</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#C4942A] hover:text-[#B3861F]"
                onClick={() => navigate('employer-interviews')}
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingInterviews.map((intv) => (
                <div
                  key={intv.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F7F9FC] hover:bg-[#F0F4F8] transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-[#0B1D33] truncate">{intv.candidate}</p>
                    <p className="text-xs text-[#5A6B7F] truncate">{intv.job}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#5A6B7F]">
                      <Clock className="w-3 h-3" />
                      {intv.date} · {intv.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={interviewTypeColor[intv.type] || ''}>
                      <span className="flex items-center gap-1">{interviewTypeIcon(intv.type)} {intv.type}</span>
                    </Badge>
                    <Button
                      size="sm"
                      className="bg-[#C4942A] hover:bg-[#B3861F] text-white text-xs"
                    >
                      {intv.type === 'In-person' ? 'View' : 'Join'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recruitment Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Recruitment Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-52 justify-center">
                {funnelStages.map((s, i) => (
                  <div key={s.stage} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-sm font-bold text-[#0B1D33]">{s.count}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(i + 1) * 20}%` }}
                      transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                      className="w-full rounded-t-md min-h-[8px]"
                      style={{
                        backgroundColor: ['#1A3A5C', '#2A5A8C', '#C4942A', '#D4A43A', '#E4C46A'][i],
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2 justify-center">
                {funnelStages.map((s) => (
                  <div key={s.stage} className="flex-1 text-center">
                    <span className="text-[10px] text-[#5A6B7F] leading-tight block">{s.stage}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
