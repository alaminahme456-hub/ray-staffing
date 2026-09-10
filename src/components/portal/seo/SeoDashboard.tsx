'use client'

import { motion } from 'framer-motion'
import {
  Search, FileText, FileCheck, FileX, AlertTriangle, Copy, Link,
  Activity, Zap, Clock, ArrowRight, CheckCircle2, XCircle, Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/store/app-store'

const seoMetrics = [
  { label: 'Indexed Pages', value: 12, icon: FileCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
  { label: 'Pages Not Indexed', value: 3, icon: FileX, color: 'text-red-500', bgColor: 'bg-red-50' },
  { label: 'Sitemap Status', value: 'Active', icon: Link, color: 'text-green-600', bgColor: 'bg-green-50', isBadge: true },
  { label: 'Robots.txt Status', value: 'Active', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50', isBadge: true },
  { label: 'Broken Pages', value: 1, icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { label: 'Missing Metadata', value: 2, icon: Copy, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { label: 'Duplicate Metadata', value: 0, icon: Copy, color: 'text-green-600', bgColor: 'bg-green-50' },
]

const recentActivity = [
  { action: 'SEO audit completed', page: 'Full site audit', time: '1 hour ago', status: 'success' },
  { action: 'Sitemap regenerated', page: '/sitemap.xml', time: '3 hours ago', status: 'success' },
  { action: 'Meta description updated', page: '/housing-services', time: '1 day ago', status: 'success' },
  { action: 'Broken link detected', page: '/old-careers-page', time: '2 days ago', status: 'warning' },
  { action: 'Schema markup added', page: '/hr-solutions', time: '3 days ago', status: 'success' },
  { action: 'Robots.txt updated', page: '/robots.txt', time: '5 days ago', status: 'success' },
]

function SeoScoreCircle({ score }: { score: number }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score > 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          stroke="#E5E7EB"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="70" cy="70" r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-[#5A6B7F]">/ 100</span>
      </div>
    </div>
  )
}

export default function SeoDashboard() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">RAY SEO Control Room</h1>
          <p className="text-[#5A6B7F] mt-1">Monitor and improve your search engine optimization</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F0F4F8]"
            onClick={() => navigate('seo-analyzer')}
          >
            <Zap className="h-4 w-4 mr-2" /> Run Full Audit
          </Button>
          <Button
            className="bg-[#C4942A] hover:bg-[#C4942A]/90 text-white"
            onClick={() => navigate('seo-sitemap')}
          >
            <Link className="h-4 w-4 mr-2" /> Generate Sitemap
          </Button>
        </div>
      </div>

      {/* Score + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SEO Health Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full flex flex-col items-center justify-center p-6">
            <p className="text-sm font-medium text-[#5A6B7F] mb-4">SEO Health Score</p>
            <SeoScoreCircle score={78} />
            <p className="text-sm text-[#5A6B7F] mt-3 text-center">
              Needs improvement — fix missing metadata and broken links
            </p>
          </Card>
        </motion.div>

        {/* Metric Cards Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {seoMetrics.map((m, i) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className={`p-2 rounded-lg ${m.bgColor} w-fit mb-3`}>
                      <Icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                    <p className="text-xs text-[#5A6B7F]">{m.label}</p>
                    {m.isBadge ? (
                      <Badge variant="outline" className="mt-1 bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> {m.value}
                      </Badge>
                    ) : (
                      <p className={`text-xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Manage Page SEO', view: 'seo-pages' as const, icon: FileText },
                { label: 'Edit Sitemap', view: 'seo-sitemap' as const, icon: Link },
                { label: 'Edit Robots.txt', view: 'seo-robots' as const, icon: FileCheck },
                { label: 'Analyze Page', view: 'seo-analyzer' as const, icon: Search },
                { label: 'Search Performance', view: 'seo-performance' as const, icon: Activity },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.view}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-[#0B1D33] hover:bg-[#F0F4F8]"
                    onClick={() => navigate(action.view)}
                  >
                    <Icon className="h-4 w-4 text-[#C4942A]" />
                    <span className="flex-1 text-left text-sm">{action.label}</span>
                    <ArrowRight className="h-4 w-4 text-[#5A6B7F]" />
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[#0B1D33]">Recent SEO Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 pb-3 border-b border-[#D1D9E6] last:border-0 last:pb-0"
                  >
                    <div className={`mt-0.5 ${activity.status === 'success' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {activity.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0B1D33]">{activity.action}</p>
                      <p className="text-xs text-[#C4942A] truncate">{activity.page}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#5A6B7F] shrink-0">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
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
