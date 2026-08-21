'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, UserCheck, Briefcase, Building2, FileText,
  ClipboardList, Home, AlertCircle, TrendingUp, TrendingDown,
  ArrowRight, Shield, Activity, BarChart3, Settings, Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'

interface MetricData {
  totalUsers: number
  activeCustomers: number
  activeSeekers: number
  employers: number
  openJobs: number
  applications: number
  housingCases: number
  pendingRequests: number
}

const metricConfig = [
  { key: 'totalUsers' as const, label: 'Total Users', icon: Users, color: 'text-[#1A3A5C]' },
  { key: 'activeSeekers' as const, label: 'Active Job Seekers', icon: Briefcase, color: 'text-[#1A3A5C]' },
  { key: 'employers' as const, label: 'Employers', icon: Building2, color: 'text-[#C4942A]' },
  { key: 'activeCustomers' as const, label: 'Active Customers', icon: UserCheck, color: 'text-[#C4942A]' },
  { key: 'openJobs' as const, label: 'Open Jobs', icon: FileText, color: 'text-[#1A3A5C]' },
  { key: 'applications' as const, label: 'Applications', icon: ClipboardList, color: 'text-[#C4942A]' },
  { key: 'housingCases' as const, label: 'Housing Cases', icon: Home, color: 'text-[#1A3A5C]' },
  { key: 'pendingRequests' as const, label: 'Pending Requests', icon: AlertCircle, color: 'text-red-500' },
]

const quickLinks = [
  { label: 'User Management', icon: Users, view: 'admin-users' as const },
  { label: 'Job Management', icon: Briefcase, view: 'admin-jobs' as const },
  { label: 'Housing Management', icon: Home, view: 'admin-housing' as const },
  { label: 'Reports & Analytics', icon: BarChart3, view: 'admin-reports' as const },
  { label: 'SEO Control Room', icon: Search, view: 'seo-dashboard' as const },
  { label: 'Platform Settings', icon: Settings, view: 'admin-settings' as const },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.3 }
  })
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useAppStore((s) => s.navigate)
  const [metrics, setMetrics] = useState<MetricData | null>(null)
  const [recentUsers, setRecentUsers] = useState<{ email: string; role: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      try {
        const [usersRes, jobsRes, applicationsRes, housingRes] = await Promise.all([
          supabase.from('profiles').select('role, created_at, is_active'),
          supabase.from('jobs').select('status'),
          supabase.from('applications').select('status, created_at'),
          supabase.from('housing_requests').select('status'),
        ])

        const users = usersRes.data || []
        const jobs = jobsRes.data || []
        const applications = applicationsRes.data || []
        const housing = housingRes.data || []

        setMetrics({
          totalUsers: users.length,
          activeCustomers: users.filter(u => u.role === 'customer' && u.is_active).length,
          activeSeekers: users.filter(u => u.role === 'candidate' && u.is_active).length,
          employers: users.filter(u => u.role === 'employer').length,
          openJobs: jobs.filter(j => j.status === 'active').length,
          applications: applications.length,
          housingCases: housing.length,
          pendingRequests: housing.filter(h => h.status === 'pending').length,
        })

        setRecentUsers(
          users
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)
            .map(u => ({ email: u.role, role: u.role, created_at: u.created_at }))
        )
      } catch (err) {
        console.error('Failed to fetch admin metrics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !metrics) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">RAY Command Center</h1>
          <p className="text-[#5A6B7F] mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-500" />
          <span className="text-sm text-[#5A6B7F]">System operational</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricConfig.map((m, i) => {
          const Icon = m.icon
          const value = metrics[m.key]
          return (
            <motion.div
              key={m.key}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#5A6B7F]">{m.label}</p>
                      <p className="text-2xl font-bold text-[#0B1D33] mt-1">{value}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F0F4F8]">
                      <Icon className={`h-5 w-5 ${m.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Users & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <div className="text-center py-8 text-[#5A6B7F] text-sm">No users yet. Users will appear here once they sign up.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#D1D9E6]">
                        <TableHead className="text-[#5A6B7F]">Role</TableHead>
                        <TableHead className="text-[#5A6B7F]">Status</TableHead>
                        <TableHead className="text-[#5A6B7F]">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((u, i) => (
                        <TableRow key={i} className="border-[#D1D9E6]">
                          <TableCell className="font-medium text-[#0B1D33] capitalize">{u.role.replace('_', ' ')}</TableCell>
                          <TableCell>
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">Active</span>
                          </TableCell>
                          <TableCell className="text-[#5A6B7F] text-sm">
                            {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Button
                    key={link.view}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-[#0B1D33] hover:bg-[#F0F4F8] hover:text-[#1A3A5C]"
                    onClick={() => navigate(link.view)}
                  >
                    <Icon className="h-4 w-4 text-[#C4942A]" />
                    <span className="flex-1 text-left text-sm">{link.label}</span>
                    <ArrowRight className="h-4 w-4 text-[#5A6B7F]" />
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
