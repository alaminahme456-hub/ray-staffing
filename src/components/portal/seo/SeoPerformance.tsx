'use client'

import { motion } from 'framer-motion'
import {
  ExternalLink, AlertCircle, BarChart3, TrendingUp, Eye, MousePointerClick,
  Search, Globe, ArrowUpRight, Plug, FileText, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const topQueries = [
  { query: 'healthcare staffing UK', clicks: 245, impressions: 3200, ctr: '7.7%', position: 4.2 },
  { query: 'nursing jobs Birmingham', clicks: 189, impressions: 2100, ctr: '9.0%', position: 3.1 },
  { query: 'healthcare housing', clicks: 156, impressions: 1800, ctr: '8.7%', position: 5.4 },
  { query: 'staffing agency UK', clicks: 134, impressions: 4500, ctr: '3.0%', position: 8.2 },
  { query: 'care home nurse jobs', clicks: 112, impressions: 1600, ctr: '7.0%', position: 4.8 },
]

const topPages = [
  { page: '/', clicks: 456, impressions: 8200, ctr: '5.6%', position: 5.1 },
  { page: '/housing-services', clicks: 234, impressions: 3100, ctr: '7.5%', position: 4.3 },
  { page: '/job-seekers', clicks: 198, impressions: 2800, ctr: '7.1%', position: 3.9 },
  { page: '/hr-solutions', clicks: 167, impressions: 2400, ctr: '7.0%', position: 4.5 },
  { page: '/employers', clicks: 145, impressions: 1900, ctr: '7.6%', position: 3.7 },
]

function OverlayCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardContent className="p-6 opacity-40 pointer-events-none select-none">
        {children}
      </CardContent>
      <div className="absolute inset-0 bg-[#F7F9FC]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6">
        <div className="h-12 w-12 rounded-full bg-[#F0F4F8] flex items-center justify-center">
          <AlertCircle className="h-6 w-6 text-[#5A6B7F]" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#0B1D33] text-sm">Connect Google Search Console</p>
          <p className="text-xs text-[#5A6B7F] mt-1">to view data</p>
        </div>
      </div>
    </Card>
  )
}

export default function SeoPerformance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">Search Performance</h1>
          <p className="text-[#5A6B7F] mt-1">Monitor your search engine visibility and performance metrics</p>
        </div>
      </div>

      {/* Connection Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-[#C4942A]/30 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-[#C4942A]/10 flex items-center justify-center shrink-0">
                  <Plug className="h-6 w-6 text-[#C4942A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1D33] text-lg">Google Search Console not connected.</h3>
                  <p className="text-sm text-[#5A6B7F] mt-1">
                    Connect your Google Search Console account to view search performance data including
                    clicks, impressions, CTR, and average position.
                  </p>
                  <div className="mt-3 space-y-2 text-xs text-[#5A6B7F]">
                    <p className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-[#0B1D33] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      Sign in to Google Search Console and verify your domain ownership
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-[#0B1D33] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                      Authorize RAY Staffing to access your Search Console data
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-[#0B1D33] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                      Performance data will appear automatically once connected
                    </p>
                  </div>
                </div>
              </div>
              <Button className="bg-[#C4942A] hover:bg-[#C4942A]/90 text-white shrink-0 self-start">
                <ExternalLink className="h-4 w-4 mr-2" /> Connect Google Search Console
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overview Stats (overlay) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <OverlayCard>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50"><MousePointerClick className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-[#5A6B7F]">Total Clicks</p>
              <p className="text-2xl font-bold text-[#0B1D33]">1,203</p>
            </div>
          </div>
        </OverlayCard>
        <OverlayCard>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50"><Eye className="h-5 w-5 text-purple-600" /></div>
            <div>
              <p className="text-xs text-[#5A6B7F]">Total Impressions</p>
              <p className="text-2xl font-bold text-[#0B1D33]">18,400</p>
            </div>
          </div>
        </OverlayCard>
        <OverlayCard>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50"><TrendingUp className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-[#5A6B7F]">Average CTR</p>
              <p className="text-2xl font-bold text-[#0B1D33]">6.5%</p>
            </div>
          </div>
        </OverlayCard>
        <OverlayCard>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C4942A]/10"><BarChart3 className="h-5 w-5 text-[#C4942A]" /></div>
            <div>
              <p className="text-xs text-[#5A6B7F]">Avg. Position</p>
              <p className="text-2xl font-bold text-[#0B1D33]">4.5</p>
            </div>
          </div>
        </OverlayCard>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverlayCard className="h-[280px]">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5A6B7F]">Clicks Over Time</p>
            <div className="h-[200px] bg-[#F0F4F8] rounded-lg" />
          </div>
        </OverlayCard>
        <OverlayCard className="h-[280px]">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5A6B7F]">Impressions Over Time</p>
            <div className="h-[200px] bg-[#F0F4F8] rounded-lg" />
          </div>
        </OverlayCard>
      </div>

      {/* Top Queries (overlay) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Search className="h-4 w-4 text-[#C4942A]" /> Top Queries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 opacity-40 pointer-events-none select-none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D1D9E6] bg-[#F7F9FC]">
                    <th className="text-left text-xs font-medium text-[#5A6B7F] px-4 py-3">Query</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">Clicks</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">Impressions</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">CTR</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {topQueries.map((q) => (
                    <tr key={q.query} className="border-b border-[#D1D9E6]">
                      <td className="px-4 py-3 text-sm font-medium text-[#0B1D33]">{q.query}</td>
                      <td className="px-4 py-3 text-sm text-center text-[#0B1D33]">{q.clicks}</td>
                      <td className="px-4 py-3 text-sm text-center text-[#5A6B7F]">{q.impressions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">{q.ctr}</td>
                      <td className="px-4 py-3 text-sm text-center text-[#0B1D33]">{q.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <div className="absolute inset-0 bg-[#F7F9FC]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-6 w-6 text-[#5A6B7F] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#0B1D33]">Connect Google Search Console to view data</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Top Pages (overlay) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#C4942A]" /> Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 opacity-40 pointer-events-none select-none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D1D9E6] bg-[#F7F9FC]">
                    <th className="text-left text-xs font-medium text-[#5A6B7F] px-4 py-3">Page</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">Clicks</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">Impressions</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">CTR</th>
                    <th className="text-center text-xs font-medium text-[#5A6B7F] px-4 py-3">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((p) => (
                    <tr key={p.page} className="border-b border-[#D1D9E6]">
                      <td className="px-4 py-3 text-sm font-medium text-[#C4942A]">{p.page}</td>
                      <td className="px-4 py-3 text-sm text-center text-[#0B1D33]">{p.clicks}</td>
                      <td className="px-4 py-3 text-sm text-center text-[#5A6B7F]">{p.impressions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">{p.ctr}</td>
                      <td className="px-4 py-3 text-sm text-center text-[#0B1D33]">{p.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <div className="absolute inset-0 bg-[#F7F9FC]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-6 w-6 text-[#5A6B7F] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#0B1D33]">Connect Google Search Console to view data</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
