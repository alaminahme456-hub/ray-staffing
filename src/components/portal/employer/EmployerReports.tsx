'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Clock,
  PoundSterling,
  Target,
  Users,
  Download,
  CalendarDays,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const reportTypes = [
  { id: 'recruitment', title: 'Recruitment Summary', description: 'Overview of vacancies, applications, and placements across a selected period.', icon: BarChart3, color: 'bg-[#1A3A5C]/10 text-[#1A3A5C]' },
  { id: 'timetohire', title: 'Time to Hire', description: 'Average days from vacancy creation to candidate placement by department and role.', icon: Clock, color: 'bg-purple-50 text-purple-600' },
  { id: 'costperhire', title: 'Cost per Hire', description: 'Breakdown of recruitment costs including advertising, agency fees, and onboarding.', icon: PoundSterling, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'source', title: 'Source Analysis', description: 'Effectiveness of different candidate sourcing channels and platforms.', icon: Target, color: 'bg-[#C4942A]/10 text-[#C4942A]' },
  { id: 'diversity', title: 'Diversity Report', description: 'Workforce diversity metrics including gender, ethnicity, and disability data.', icon: Users, color: 'bg-orange-50 text-orange-600' },
]

const monthlyData = [
  { month: 'Mar 2026', vacancies: 8, applications: 72, interviews: 14, offers: 5, placements: 3 },
  { month: 'Apr 2026', vacancies: 10, applications: 95, interviews: 19, offers: 7, placements: 5 },
  { month: 'May 2026', vacancies: 9, applications: 88, interviews: 16, offers: 6, placements: 4 },
  { month: 'Jun 2026', vacancies: 12, applications: 110, interviews: 22, offers: 8, placements: 6 },
  { month: 'Jul 2026', vacancies: 11, applications: 102, interviews: 20, offers: 7, placements: 5 },
  { month: 'Aug 2026', vacancies: 12, applications: 147, interviews: 24, offers: 9, placements: 6 },
]

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
    </div>
  )
}

export default function EmployerReports() {
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [dateRange, setDateRange] = useState('6m')
  const [selectedReport, setSelectedReport] = useState(reportTypes[0])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const maxValues = {
    applications: Math.max(...monthlyData.map(d => d.applications)),
    interviews: Math.max(...monthlyData.map(d => d.interviews)),
    offers: Math.max(...monthlyData.map(d => d.offers)),
    placements: Math.max(...monthlyData.map(d => d.placements)),
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Reports</h1>
        <p className="text-[#5A6B7F] mt-0.5">Generate and download recruitment analytics</p>
      </motion.div>

      {/* Report Type Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.05 }}
          >
            <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${r.color}`}>
                    <r.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#0B1D33] text-sm">{r.title}</h3>
                    <p className="text-xs text-[#5A6B7F] mt-1 leading-relaxed">{r.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-28 h-7 text-[10px] border-[#D1D9E6]">
                          <CalendarDays className="w-3 h-3 mr-1" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1m">Last Month</SelectItem>
                          <SelectItem value="3m">Last 3 Months</SelectItem>
                          <SelectItem value="6m">Last 6 Months</SelectItem>
                          <SelectItem value="12m">Last 12 Months</SelectItem>
                          <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        className="bg-[#C4942A] hover:bg-[#B3861F] text-white text-xs h-7"
                        onClick={() => { setSelectedReport(r); setShowPreview(true) }}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recruitment Summary Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[#0B1D33] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C4942A]" /> {selectedReport.title}
              </DialogTitle>
              <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#1A3A5C]">
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Vacancies', value: '62', change: '+18%' },
                { label: 'Total Applications', value: '614', change: '+32%' },
                { label: 'Interviews', value: '115', change: '+24%' },
                { label: 'Placements', value: '29', change: '+20%' },
              ].map((s) => (
                <div key={s.label} className="bg-[#F7F9FC] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-[#0B1D33]">{s.value}</p>
                  <p className="text-[10px] text-[#5A6B7F]">{s.label}</p>
                  <Badge variant="secondary" className="mt-1 text-[9px] bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />{s.change}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Bar Chart - CSS based */}
            <div>
              <h3 className="text-sm font-semibold text-[#0B1D33] mb-3">Monthly Breakdown</h3>
              <div className="space-y-3">
                {monthlyData.map((row) => (
                  <div key={row.month} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5A6B7F] w-20 shrink-0">{row.month}</span>
                      <div className="flex-1 mx-3 flex items-center gap-1">
                        {[['applications', '#1A3A5C'], ['interviews', '#C4942A'], ['offers', '#8B5CF6'], ['placements', '#10B981']].map(([key, color]) => {
                          const val = row[key as keyof typeof row] as number
                          const max = maxValues[key as keyof typeof maxValues] as number
                          return (
                            <div
                              key={key as string}
                              className="h-5 rounded-sm transition-all duration-500"
                              style={{
                                width: `${(val / max) * 100}%`,
                                backgroundColor: color,
                                minWidth: val > 0 ? '4px' : '0',
                                opacity: 0.85,
                              }}
                              title={`${key}: ${val}`}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-3">
                {[['Applications', '#1A3A5C'], ['Interviews', '#C4942A'], ['Offers', '#8B5CF6'], ['Placements', '#10B981']].map(([label, color]) => (
                  <div key={label as string} className="flex items-center gap-1.5 text-xs text-[#5A6B7F]">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                    {label as string}
                  </div>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#D1D9E6] bg-[#F7F9FC]">
                    <th className="text-left py-2.5 px-3 font-medium text-[#5A6B7F]">Month</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#5A6B7F]">Vacancies</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#5A6B7F]">Applications</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#5A6B7F]">Interviews</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#5A6B7F]">Offers</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#5A6B7F]">Placements</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row) => (
                    <tr key={row.month} className="border-b border-[#D1D9E6] last:border-0 hover:bg-[#F7F9FC]">
                      <td className="py-2.5 px-3 font-medium text-[#0B1D33]">{row.month}</td>
                      <td className="py-2.5 px-3 text-right text-[#5A6B7F]">{row.vacancies}</td>
                      <td className="py-2.5 px-3 text-right text-[#5A6B7F]">{row.applications}</td>
                      <td className="py-2.5 px-3 text-right text-[#5A6B7F]">{row.interviews}</td>
                      <td className="py-2.5 px-3 text-right text-[#5A6B7F]">{row.offers}</td>
                      <td className="py-2.5 px-3 text-right text-[#5A6B7F]">{row.placements}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
