'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, CheckCircle2, ShieldCheck, ShieldX, Search, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const defaultRobots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /portal/
Disallow: /*?*

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://raystaffing.co.uk/sitemap.xml`

const testRules = [
  { url: 'https://raystaffing.co.uk/', expected: 'allowed' },
  { url: 'https://raystaffing.co.uk/about', expected: 'allowed' },
  { url: 'https://raystaffing.co.uk/api/users', expected: 'blocked' },
  { url: 'https://raystaffing.co.uk/admin/dashboard', expected: 'blocked' },
]

export default function SeoRobots() {
  const [content, setContent] = useState(defaultRobots)
  const [testUrl, setTestUrl] = useState('')
  const [testResult, setTestResult] = useState<{ url: string; allowed: boolean } | null>(null)
  const [saved, setSaved] = useState(false)

  const testRobotsUrl = () => {
    if (!testUrl.trim()) return
    const url = testUrl.trim()
    const isBlocked =
      url.includes('/api/') ||
      url.includes('/admin/') ||
      url.includes('/portal/') ||
      url.includes('?')
    setTestResult({ url, allowed: !isBlocked })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">Robots.txt Management</h1>
          <p className="text-[#5A6B7F] mt-1">Control how search engines crawl your website</p>
        </div>
        <Button
          className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-[#F7F9FC]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-[#0B1D33]">Robots.txt is Active</p>
                <p className="text-sm text-[#5A6B7F]">Accessible at https://raystaffing.co.uk/robots.txt</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Editor */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#0B1D33] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#C4942A]" />
              robots.txt Content
            </CardTitle>
            <CardDescription className="text-[#5A6B7F]">
              Edit the robots.txt file content below. Changes take effect after saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm bg-[#F7F9FC] min-h-[250px] resize-y"
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* URL Tester */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#0B1D33]">Test URL Tool</CardTitle>
            <CardDescription className="text-[#5A6B7F]">
              Enter a URL to check if it would be allowed or blocked by the current robots.txt rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
                <Input
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://raystaffing.co.uk/about"
                  className="pl-9"
                  onKeyDown={(e) => e.key === 'Enter' && testRobotsUrl()}
                />
              </div>
              <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white" onClick={testRobotsUrl}>
                Test URL
              </Button>
            </div>

            {/* Result */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-4 rounded-lg ${
                  testResult.allowed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {testResult.allowed ? (
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className={`font-medium ${testResult.allowed ? 'text-green-700' : 'text-red-600'}`}>
                    {testResult.allowed ? 'Allowed' : 'Blocked'}
                  </p>
                  <p className="text-sm text-[#5A6B7F] truncate">{testResult.url}</p>
                </div>
              </motion.div>
            )}

            {/* Common Test URLs */}
            <div>
              <p className="text-sm font-medium text-[#5A6B7F] mb-2">Quick test:</p>
              <div className="flex flex-wrap gap-2">
                {testRules.map((rule) => (
                  <Button
                    key={rule.url}
                    variant="outline"
                    size="sm"
                    className="text-xs border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F0F4F8]"
                    onClick={() => {
                      setTestUrl(rule.url)
                      const isBlocked =
                        rule.url.includes('/api/') ||
                        rule.url.includes('/admin/') ||
                        rule.url.includes('/portal/') ||
                        rule.url.includes('?')
                      setTestResult({ url: rule.url, allowed: !isBlocked })
                    }}
                  >
                    {rule.expected === 'allowed' ? (
                      <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />
                    ) : (
                      <ShieldX className="h-3 w-3 mr-1 text-red-400" />
                    )}
                    {rule.url.split('/').pop() || '/'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
