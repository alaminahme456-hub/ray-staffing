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

const pipelineStages = [
  { key: 'applied', label: 'Applied', count: 12, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'shortlisted', label: 'Shortlisted', count: 5, icon: UserCheck, color: 'text-[#C4942A]', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'interview', label: 'Interview', count: 3, icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { key: 'offer', label: 'Offer', count: 1, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { key: 'rejected', label: 'Rejected', count: 3, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
]

const missingItems = [
  'Add a cover letter template',
  'Complete skills profile',
  'Add two professional references',
]

const recommendedJobs = [
  {
    id: 1,
    title: 'Senior Staff Nurse - ICU',
    employer: 'Barts Health NHS Trust',
    location: 'London, EC1A',
    salary: '£38,000 - £44,000',
    match: 95,
    type: 'Full-time',
    posted: '1 day ago',
  },
  {
    id: 2,
    title: 'Nurse Practitioner',
    employer: 'Guy’s and St Thomas’ NHS FT',
    location: 'London, SE1',
    salary: '£42,000 - £50,000',
    match: 88,
    type: 'Full-time',
    posted: '3 days ago',
  },
  {
    id: 3,
    title: 'Charge Nurse - A&E',
    employer: 'Imperial College Healthcare',
    location: 'London, W2',
    salary: '£36,000 - £41,000',
    match: 82,
    type: 'Full-time',
    posted: '5 days ago',
  },
  {
    id: 4,
    title: 'Community Mental Health Nurse',
    employer: 'South London and Maudsley',
    location: 'London, SE5',
    salary: '£34,000 - £40,000',
    match: 76,
    type: 'Full-time',
    posted: '1 week ago',
  },
]

const recentActivity = [
  { id: 1, icon: UserCheck, iconColor: 'text-[#C4942A]', text: 'Shortlisted for Senior Staff Nurse at Barts Health', time: '2 hours ago' },
  { id: 2, icon: CalendarCheck, iconColor: 'text-purple-600', text: 'Interview scheduled: Charge Nurse at Imperial College', time: '5 hours ago' },
  { id: 3, icon: FileText, iconColor: 'text-blue-600', text: 'Application submitted: Nurse Practitioner at Guy’s and St Thomas’', time: '1 day ago' },
  { id: 4, icon: Zap, iconColor: 'text-amber-500', text: 'New job match: ICU Staff Nurse at Royal Free London', time: '1 day ago' },
  { id: 5, icon: Award, iconColor: 'text-emerald-600', text: 'Offer received: Senior Healthcare Assistant at Nuffield Health', time: '2 days ago' },
]

function CircularProgress({ percentage, size = 100, strokeWidth = 8 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E2E8F0"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#C4942A"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
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
      <Skeleton className="h-16 w-full max-w-md rounded-xl" />\n      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 lg:col-span-2 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

export default function SeekerDashboard() {
  const [loading, setLoading] = useState(true)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Welcome back, Amara</h1>
        <p className="text-[#5A6B7F] mt-1">Here’s an overview of your job search activity.</p>
      </motion.div>

      {/* Pipeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {pipelineStages.map((stage, i) => {
          const Icon = stage.icon
          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="cursor-pointer"
              onClick={() => navigate('seeker-applications')}
            >
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

      {/* Profile Completion + Recommended Jobs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                <Star className="w-4 h-4 text-[#C4942A]" />
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <CircularProgress percentage={85} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#0B1D33]">85%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#5A6B7F]">To complete your profile:</p>
                {missingItems.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-[#0B1D33]">{item}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white"
                onClick={() => navigate('seeker-profile')}
              >
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card className="border-[#D1D9E6] h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#C4942A]" />
                  Recommended Jobs
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#C4942A] hover:text-[#C4942A] hover:bg-amber-50 text-xs"
                  onClick={() => navigate('seeker-jobs')}
                >
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
                  onClick={() => navigate('seeker-jobs')}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-[#0B1D33] leading-tight">{job.title}</p>
                      <Badge
                        className={`shrink-0 text-[10px] font-bold border-0 ${
                          job.match >= 90
                            ? 'bg-emerald-100 text-emerald-700'
                            : job.match >= 80
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {job.match}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-[#5A6B7F] mt-0.5">{job.employer}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-[#5A6B7F]">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className="text-[11px] text-[#5A6B7F] font-medium">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 text-[10px]">
                        {job.type}
                      </Badge>
                      <span className="text-[10px] text-[#5A6B7F]">{job.posted}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C4942A]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {recentActivity.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={item.id} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#F0F4F8] flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                      {i < recentActivity.length - 1 && (
                        <div className="w-px flex-1 bg-[#D1D9E6] mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm text-[#0B1D33]">{item.text}</p>
                      <p className="text-xs text-[#5A6B7F] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
