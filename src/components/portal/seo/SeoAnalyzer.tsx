'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, CheckCircle2, XCircle, AlertTriangle, FileText, Image,
  Link2, Type, Heading, Hash, Code, Eye, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface AnalysisItem {
  label: string
  icon: React.ElementType
  status: 'pass' | 'fail' | 'warning'
  title: string
  details: string
  extra?: string
}

const sampleAnalysis: AnalysisItem[] = [
  {
    label: 'Page Title',
    icon: Type,
    status: 'pass',
    title: 'RAY Staffing Consulting | Healthcare Staffing & Housing Solutions',
    details: 'Title length: 67 characters — slightly over recommended 60',
    extra: 'Score: 85/100',
  },
  {
    label: 'Meta Description',
    icon: FileText,
    status: 'pass',
    title: 'RAY Staffing Consulting — Expert healthcare staffing, housing solutions, and HR services across the UK.',
    details: 'Description length: 112 characters — within recommended 150-160 range',
    extra: 'Score: 92/100',
  },
  {
    label: 'H1 Tag',
    icon: Heading,
    status: 'pass',
    title: 'Your Trusted Partner in Healthcare Staffing',
    details: 'Exactly 1 H1 tag found — correct structure',
    extra: 'Score: 100/100',
  },
  {
    label: 'Heading Structure',
    icon: Heading,
    status: 'pass',
    title: 'Proper hierarchy detected',
    details: '1× H1, 4× H2, 8× H3, 2× H4 — well-structured content',
    extra: 'Score: 95/100',
  },
  {
    label: 'Content Analysis',
    icon: FileText,
    status: 'pass',
    title: 'Content quality: Good',
    details: 'Word count: 1,245 words — Readability: Grade 8 (good)',
    extra: 'Score: 88/100',
  },
  {
    label: 'Internal Links',
    icon: Link2,
    status: 'pass',
    title: 'Internal linking: Strong',
    details: '18 internal links found across the page',
    extra: 'Score: 90/100',
  },
  {
    label: 'Image Alt Text',
    icon: Image,
    status: 'warning',
    title: '2 images missing alt text',
    details: '12 images total — 10 with alt text, 2 without',
    extra: 'Score: 72/100',
  },
  {
    label: 'Canonical URL',
    icon: Link2,
    status: 'pass',
    title: 'Canonical tag present',
    details: 'https://raystaffing.co.uk/ — correctly set',
    extra: 'Score: 100/100',
  },
  {
    label: 'Structured Data',
    icon: Code,
    status: 'pass',
    title: 'Schema markup detected',
    details: 'Organization, WebSite, BreadcrumbList schemas found',
    extra: 'Score: 100/100',
  },
  {
    label: 'Indexability',
    icon: Eye,
    status: 'pass',
    title: 'Page is indexable',
    details: 'No meta robots tag blocking, no X-Robots-Tag header',
    extra: 'Score: 100/100',
  },
]

function getStatusIcon(status: 'pass' | 'fail' | 'warning') {
  if (status === 'pass') return <CheckCircle2 className="h-5 w-5 text-green-500" />
  if (status === 'fail') return <XCircle className="h-5 w-5 text-red-500" />
  return <AlertTriangle className="h-5 w-5 text-yellow-500" />
}

function getStatusBg(status: 'pass' | 'fail' | 'warning') {
  if (status === 'pass') return 'border-l-green-500'
  if (status === 'fail') return 'border-l-red-500'
  return 'border-l-yellow-500'
}

export default function SeoAnalyzer() {
  const [url, setUrl] = useState('https://raystaffing.co.uk/')
  const [analyzed, setAnalyzed] = useState(true)

  const passCount = sampleAnalysis.filter((a) => a.status === 'pass').length
  const warningCount = sampleAnalysis.filter((a) => a.status === 'warning').length
  const failCount = sampleAnalysis.filter((a) => a.status === 'fail').length
  const overallScore = Math.round(
    (sampleAnalysis.reduce((sum, a) => {
      const score = parseInt(a.extra?.match(/\d+(?=\/100)/)?.[0] || '0')
      return sum + score
    }, 0) / sampleAnalysis.length)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1D33]">SEO Page Analyzer</h1>
        <p className="text-[#5A6B7F] mt-1">Analyze individual pages for SEO issues and recommendations</p>
      </div>

      {/* URL Input */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-[#F7F9FC]">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://raystaffing.co.uk/page"
                  className="pl-9"
                  onKeyDown={(e) => e.key === 'Enter' && setAnalyzed(true)}
                />
              </div>
              <Button
                className="bg-[#C4942A] hover:bg-[#C4942A]/90 text-white"
                onClick={() => setAnalyzed(true)}
              >
                <BarChart3 className="h-4 w-4 mr-2" /> Analyze
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Results */}
      {analyzed && (
        <>
          {/* Summary Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${overallScore > 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {overallScore}
                      </p>
                      <p className="text-xs text-[#5A6B7F]">Score</p>
                    </div>
                    <div className="h-10 w-px bg-[#D1D9E6]" />
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700">{passCount} Passed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-700">{warningCount} Warnings</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-600">{failCount} Failed</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#5A6B7F] truncate max-w-[300px]">{url}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleAnalysis.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                >
                  <Card className={`border-l-4 ${getStatusBg(item.status)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4 text-[#5A6B7F]" />
                            <p className="text-sm font-semibold text-[#0B1D33]">{item.label}</p>
                            {item.extra && (
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  item.status === 'pass'
                                    ? 'bg-green-100 text-green-700'
                                    : item.status === 'warning'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {item.extra}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#0B1D33] font-medium truncate">{item.title}</p>
                          <p className="text-xs text-[#5A6B7F] mt-1">{item.details}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
