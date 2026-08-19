'use client'

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
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts'
import { useAppStore } from '@/store/app-store'

const metrics = [
  { label: 'Total Users', value: 247, icon: Users, trend: '+12%', trendUp: true, color: 'text-[#1A3A5C]' },
  { label: 'Active Customers', value: 89, icon: UserCheck, trend: '+5%', trendUp: true, color: 'text-[#C4942A]' },
  { label: 'Active Job Seekers', value: 156, icon: Briefcase, trend: '+8%', trendUp: true, color: 'text-[#1A3A5C]' },
  { label: 'Employers', value: 42, icon: Building2, trend: '+3%', trendUp: true, color: 'text-[#C4942A]' },
  { label: 'Open Jobs', value: 28, icon: FileText, trend: '-2%', trendUp: false, color: 'text-[#1A3A5C]' },
  { label: 'Applications', value: 342, icon: ClipboardList, trend: '+15%', trendUp: true, color: 'text-[#C4942A]' },
  { label: 'Housing Cases', value: 67, icon: Home, trend: '+4%', trendUp: true, color: 'text-[#1A3A5C]' },
  { label: 'Pending Requests', value: 23, icon: AlertCircle, trend: '-8%', trendUp: true, color: 'text-red-500' },
]

const recruitmentData = [
  { month: 'Jan', newJobs: 5, applications: 42 },
  { month: 'Feb', newJobs: 8, applications: 56 },
  { month: 'Mar', newJobs: 6, applications: 48 },
  { month: 'Apr', newJobs: 10, applications: 72 },
  { month: 'May', newJobs: 7, applications: 61 },
  { month: 'Jun', newJobs: 12, applications: 63 },
]

const housingData = [
  { month: 'Jan', newCases: 8, resolved: 5 },
  { month: 'Feb', newCases: 10, resolved: 7 },
  { month: 'Mar', newCases: 12, resolved: 9 },
  { month: 'Apr', newCases: 9, resolved: 11 },
  { month: 'May', newCases: 14, resolved: 10 },
  { month: 'Jun', newCases: 11, resolved: 13 },
]

const userGrowthData = [
  { month: 'Jan', users: 165 },
  { month: 'Feb', users: 178 },
  { month: 'Mar', users: 192 },
  { month: 'Apr', users: 210 },
  { month: 'May', users: 228 },
  { month: 'Jun', users: 247 },
]

const auditLog = [
  { admin: 'Sarah Mitchell', action: 'Updated user role', entity: 'john.doe@email.com', time: '2 minutes ago' },
  { admin: 'James Carter', action: 'Approved housing application', entity: 'HSG-2024-089', time: '15 minutes ago' },
  { admin: 'Sarah Mitchell', action: 'Created new job posting', entity: 'Senior Care Nurse', time: '1 hour ago' },
  { admin: 'David Chen', action: 'Exported compliance report', entity: 'Q2 2024 Report', time: '2 hours ago' },
  { admin: 'James Carter', action: 'Deactivated user account', entity: 'mike.wilson@email.com', time: '3 hours ago' },
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

export default function AdminDashboard() {
  const navigate = useAppStore((s) => s.navigate)

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
        {metrics.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.label}
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
                      <p className="text-2xl font-bold text-[#0B1D33] mt-1">{m.value}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F0F4F8]">
                      <Icon className={`h-5 w-5 ${m.color}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {m.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${m.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                      {m.trend}
                    </span>
                    <span className="text-xs text-[#5A6B7F]">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Recruitment Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={recruitmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D1D9E6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5A6B7F' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#5A6B7F' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #D1D9E6',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Bar dataKey="newJobs" name="New Jobs" fill="#1A3A5C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="applications" name="Applications" fill="#C4942A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Housing Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Housing Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={housingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D1D9E6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5A6B7F' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#5A6B7F' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #D1D9E6',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Bar dataKey="newCases" name="New Cases" fill="#0B1D33" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#C4942A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D1D9E6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5A6B7F' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#5A6B7F' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #D1D9E6',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Total Users"
                    stroke="#1A3A5C"
                    strokeWidth={3}
                    dot={{ fill: '#1A3A5C', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Audit Log & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Log */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Recent Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#D1D9E6]">
                      <TableHead className="text-[#5A6B7F]">Admin</TableHead>
                      <TableHead className="text-[#5A6B7F]">Action</TableHead>
                      <TableHead className="text-[#5A6B7F]">Entity</TableHead>
                      <TableHead className="text-[#5A6B7F]">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((log, i) => (
                      <TableRow key={i} className="border-[#D1D9E6]">
                        <TableCell className="font-medium text-[#0B1D33]">{log.admin}</TableCell>
                        <TableCell className="text-[#5A6B7F]">{log.action}</TableCell>
                        <TableCell className="text-[#C4942A] font-medium">{log.entity}</TableCell>
                        <TableCell className="text-[#5A6B7F] text-sm">{log.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
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
