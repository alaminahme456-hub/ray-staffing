'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Link, Plus, Trash2, RefreshCw, Globe, CheckCircle2, Code
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SitemapEntry {
  id: string
  url: string
  lastModified: string
  changeFreq: string
  priority: string
}

const sampleEntries: SitemapEntry[] = [
  { id: '1', url: 'https://raystaffing.co.uk/', lastModified: '2024-06-15', changeFreq: 'weekly', priority: '1.0' },
  { id: '2', url: 'https://raystaffing.co.uk/about', lastModified: '2024-06-12', changeFreq: 'monthly', priority: '0.8' },
  { id: '3', url: 'https://raystaffing.co.uk/housing-services', lastModified: '2024-06-10', changeFreq: 'weekly', priority: '0.9' },
  { id: '4', url: 'https://raystaffing.co.uk/hr-solutions', lastModified: '2024-06-08', changeFreq: 'monthly', priority: '0.8' },
  { id: '5', url: 'https://raystaffing.co.uk/job-seekers', lastModified: '2024-06-05', changeFreq: 'weekly', priority: '0.9' },
  { id: '6', url: 'https://raystaffing.co.uk/employers', lastModified: '2024-06-13', changeFreq: 'weekly', priority: '0.9' },
  { id: '7', url: 'https://raystaffing.co.uk/compliance', lastModified: '2024-05-20', changeFreq: 'monthly', priority: '0.7' },
  { id: '8', url: 'https://raystaffing.co.uk/healthcare', lastModified: '2024-06-11', changeFreq: 'weekly', priority: '0.9' },
  { id: '9', url: 'https://raystaffing.co.uk/contact', lastModified: '2024-05-15', changeFreq: 'yearly', priority: '0.5' },
  { id: '10', url: 'https://raystaffing.co.uk/resources', lastModified: '2024-06-01', changeFreq: 'weekly', priority: '0.7' },
]

function generateSitemapXml(entries: SitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  for (const entry of entries) {
    xml += '  <url>\n'
    xml += '    <loc>' + entry.url + '</loc>\n'
    xml += '    <lastmod>' + entry.lastModified + '</lastmod>\n'
    xml += '    <changefreq>' + entry.changeFreq + '</changefreq>\n'
    xml += '    <priority>' + entry.priority + '</priority>\n'
    xml += '  </url>\n'
  }
  xml += '</urlset>'
  return xml
}

export default function SeoSitemap() {
  const [entries, setEntries] = useState<SitemapEntry[]>(sampleEntries)
  const [showPreview, setShowPreview] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newFreq, setNewFreq] = useState('weekly')
  const [newPriority, setNewPriority] = useState('0.8')

  const addEntry = () => {
    if (!newUrl.trim()) return
    const entry: SitemapEntry = {
      id: String(Date.now()),
      url: newUrl,
      lastModified: new Date().toISOString().split('T')[0],
      changeFreq: newFreq,
      priority: newPriority,
    }
    setEntries([...entries, entry])
    setNewUrl('')
    setShowAdd(false)
  }

  const removeEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">Sitemap Management</h1>
          <p className="text-[#5A6B7F] mt-1">Manage your XML sitemap and URL entries</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F0F4F8]"
            onClick={() => setShowPreview(true)}
          >
            <Code className="h-4 w-4 mr-2" /> Preview XML
          </Button>
          <Button
            className="bg-[#C4942A] hover:bg-[#C4942A]/90 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Generate Sitemap
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-[#F7F9FC]">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-[#0B1D33]">Sitemap is Active</p>
                  <p className="text-sm text-[#5A6B7F]">Last generated: June 15, 2024 at 14:30 UTC</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  {entries.length} URLs
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Entry Button */}
      <div className="flex justify-end">
        <Button
          className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add URL Entry
        </Button>
      </div>

      {/* Entries Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#D1D9E6] bg-[#F7F9FC]">
                    <TableHead className="text-[#5A6B7F]">URL</TableHead>
                    <TableHead className="text-[#5A6B7F]">Last Modified</TableHead>
                    <TableHead className="text-[#5A6B7F]">Change Frequency</TableHead>
                    <TableHead className="text-[#5A6B7F] text-center">Priority</TableHead>
                    <TableHead className="text-[#5A6B7F]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => {
                    return (
                      <TableRow key={entry.id} className="border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-[#C4942A] font-medium max-w-[300px]">
                            <Globe className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{entry.url}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#5A6B7F] text-sm whitespace-nowrap">{entry.lastModified}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-[#F0F4F8] text-[#5A6B7F]">
                            {entry.changeFreq}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium text-[#0B1D33]">{entry.priority}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Entry Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">Add Sitemap Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://raystaffing.co.uk/page"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Change Frequency</Label>
                <Select value={newFreq} onValueChange={setNewFreq}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0 (Highest)</SelectItem>
                    <SelectItem value="0.9">0.9</SelectItem>
                    <SelectItem value="0.8">0.8</SelectItem>
                    <SelectItem value="0.7">0.7</SelectItem>
                    <SelectItem value="0.6">0.6</SelectItem>
                    <SelectItem value="0.5">0.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#D1D9E6] text-[#5A6B7F]" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white" onClick={addEntry}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview XML Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">Sitemap XML Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <pre className="bg-[#F7F9FC] p-4 rounded-lg text-sm font-mono text-[#1A3A5C] overflow-x-auto whitespace-pre-wrap">
              {generateSitemapXml(entries)}
            </pre>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" className="border-[#D1D9E6] text-[#5A6B7F]" onClick={() => setShowPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
