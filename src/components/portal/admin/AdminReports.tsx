'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Briefcase, Home, DollarSign, Shield, FileText,
  Download, Calendar, TrendingUp, BarChart3, Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'

const reports = [
  {
    id: 'users',
    title: 'User Statistics',
    description: 'Comprehensive breakdown of user registrations, activity levels, and role distribution',
    icon: Users,
    color: 'bg-[#1A3A5C] text-white',
  },
  {
    id: 'recruitment',
    title: 'Recruitment Metrics',
    description: 'Job posting performance, application rates, time-to-hire, and placement statistics',
    icon: Briefcase,
    color: 'bg-[#C4942A] text-white',
  },
  {
    id: 'housing',
    title: 'Housing Analytics',
    description: 'Property occupancy rates, tenancy durations, maintenance requests, and allocations',
    icon: Home,
    color: 'bg-[#0B1D33] text-white',
  },
  {
    id: 'financial',
    title: 'Financial Summary',
    description: 'Revenue streams, payment collection, outstanding invoices, and financial trends',
    icon: DollarSign,
    color: 'bg-green-600 text-white',
  },
  {
    id: 'compliance',
    title: 'Compliance Report',
    description: 'Regulatory compliance status, document expiry alerts, and audit trail summary',
    icon: Shield,
    color: 'bg-purple-600 text-white',
  },
]

const userStatsData = [
  { role: 'Super Admin', count: 2, percentage: '0.8%', active: 2 },
  { role: 'Housing Admin', count: 5, percentage: '2.0%', active: 4 },
  { role: 'Recruitment Admin', count: 8, percentage: '3.2%', active: 7 },
  { role: 'HR Admin', count: 6, percentage: '2.4%', active: 5 },
  { role: 'Local Admin', count: 12, percentage: '4.9%', active: 10 },
  { role: 'Support Staff', count: 15, percentage: '6.1%', active: 12 },
  { role: 'Customer Users', count: 89, percentage: '36.0%', active: 76 },
  { role: 'Job Seekers', count: 156, percentage: '63.2%', active: 142 },
]

const dateRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months', 'Custom']

export default function AdminReports() {
  const [selectedReport, setSelectedReport] = useState<string | null>('users')
  const [dateRange, setDateRange] = useState('Last 30 days')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1D33]">Reports & Analytics</h1>
        <p className="text-[#5A6B7F] mt-1">Generate and view platform reports</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, i) => {
          const Icon = report.icon
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReport === report.id ? 'ring-2 ring-[#C4942A] border-[#C4942A]' : ''
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${report.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#0B1D33]">{report.title}</h3>
                      <p className="text-xs text-[#5A6B7F] mt-1 line-clamp-2">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#D1D9E6]">
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dateRanges.map((d) => (
                          <SelectItem key={d} value={d} className="text-xs">
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="h-8 bg-[#0B1D33] hover:bg-[#1A3A5C] text-white text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" /> Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Sample Data Preview (User Statistics) */}
      {selectedReport === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0B1D33]">
                  User Statistics Preview
                </CardTitle>
                <Badge variant="outline" className="border-[#D1D9E6] text-[#5A6B7F]">
                  <Clock className="h-3 w-3 mr-1" /> {dateRange}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#D1D9E6] bg-[#F7F9FC]">
                      <TableHead className="text-[#5A6B7F]">Role</TableHead>
                      <TableHead className="text-[#5A6B7F] text-center">Count</TableHead>
                      <TableHead className="text-[#5A6B7F] text-center">% of Total</TableHead>
                      <TableHead className="text-[#5A6B7F] text-center">Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userStatsData.map((row) => (
                      <TableRow key={row.role} className="border-[#D1D9E6]">
                        <TableCell className="font-medium text-[#0B1D33]">{row.role}</TableCell>
                        <TableCell className="text-center text-[#0B1D33]">{row.count}</TableCell>
                        <TableCell className="text-center text-[#5A6B7F]">{row.percentage}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-600 font-medium">{row.active}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
