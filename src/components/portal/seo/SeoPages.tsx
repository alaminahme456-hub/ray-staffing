'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Edit, Eye, Globe, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface SeoPage {
  id: string
  url: string
  title: string
  metaDescription: string
  indexStatus: 'Indexed' | 'Not Indexed' | 'Pending'
  seoScore: number
  lastUpdated: string
  seoTitle: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  robotsDirective: string
  schemaType: string
}

const samplePages: SeoPage[] = [
  { id: '1', url: '/', title: 'Home', metaDescription: 'RAY Staffing Consulting — Expert healthcare staffing, housing solutions, and HR services across the UK.', indexStatus: 'Indexed', seoScore: 92, lastUpdated: '2024-06-14', seoTitle: 'RAY Staffing Consulting | Healthcare Staffing & Housing Solutions', canonicalUrl: 'https://raystaffing.co.uk/', ogTitle: 'RAY Staffing Consulting', ogDescription: 'Expert healthcare staffing, housing solutions, and HR services across the UK.', robotsDirective: 'index, follow', schemaType: 'Organization' },
  { id: '2', url: '/about', title: 'About Us', metaDescription: 'Learn about RAY Staffing Consulting — our mission, values, and the team behind the UK’s trusted staffing partner.', indexStatus: 'Indexed', seoScore: 88, lastUpdated: '2024-06-12', seoTitle: 'About RAY Staffing Consulting | Our Mission & Team', canonicalUrl: 'https://raystaffing.co.uk/about', ogTitle: 'About RAY Staffing Consulting', ogDescription: 'Learn about our mission, values, and the team behind the UK\'s trusted staffing partner.', robotsDirective: 'index, follow', schemaType: 'AboutPage' },
  { id: '3', url: '/housing-services', title: 'Housing Services', metaDescription: 'Professional housing management and accommodation solutions for healthcare professionals relocating across the UK.', indexStatus: 'Indexed', seoScore: 85, lastUpdated: '2024-06-10', seoTitle: 'Housing Services | RAY Staffing Consulting', canonicalUrl: 'https://raystaffing.co.uk/housing-services', ogTitle: 'Housing Services', ogDescription: 'Professional housing management and accommodation solutions for healthcare professionals.', robotsDirective: 'index, follow', schemaType: 'Service' },
  { id: '4', url: '/hr-solutions', title: 'HR Solutions', metaDescription: 'Comprehensive HR solutions including compliance, payroll, and workforce management for healthcare organisations.', indexStatus: 'Indexed', seoScore: 82, lastUpdated: '2024-06-08', seoTitle: 'HR Solutions | RAY Staffing Consulting', canonicalUrl: 'https://raystaffing.co.uk/hr-solutions', ogTitle: 'HR Solutions', ogDescription: 'Comprehensive HR solutions for healthcare organisations.', robotsDirective: 'index, follow', schemaType: 'Service' },
  { id: '5', url: '/job-seekers', title: 'Job Seekers', metaDescription: '', indexStatus: 'Not Indexed', seoScore: 45, lastUpdated: '2024-05-20', seoTitle: 'Job Seekers | RAY Staffing Consulting', canonicalUrl: '', ogTitle: '', ogDescription: '', robotsDirective: 'index, follow', schemaType: '' },
  { id: '6', url: '/employers', title: 'Employers', metaDescription: 'Partner with RAY Staffing to find qualified healthcare professionals for your organisation. Efficient recruitment solutions.', indexStatus: 'Indexed', seoScore: 90, lastUpdated: '2024-06-13', seoTitle: 'Employers | Find Healthcare Staff | RAY Staffing', canonicalUrl: 'https://raystaffing.co.uk/employers', ogTitle: 'Employers | RAY Staffing', ogDescription: 'Partner with RAY Staffing to find qualified healthcare professionals.', robotsDirective: 'index, follow', schemaType: 'Service' },
  { id: '7', url: '/compliance', title: 'Compliance', metaDescription: '', indexStatus: 'Not Indexed', seoScore: 35, lastUpdated: '2024-05-15', seoTitle: 'Compliance | RAY Staffing Consulting', canonicalUrl: '', ogTitle: '', ogDescription: '', robotsDirective: 'index, follow', schemaType: '' },
  { id: '8', url: '/healthcare', title: 'Healthcare', metaDescription: 'Healthcare staffing solutions for NHS trusts, private hospitals, and care homes across the United Kingdom.', indexStatus: 'Indexed', seoScore: 87, lastUpdated: '2024-06-11', seoTitle: 'Healthcare Staffing | RAY Staffing Consulting', canonicalUrl: 'https://raystaffing.co.uk/healthcare', ogTitle: 'Healthcare Staffing', ogDescription: 'Healthcare staffing solutions for NHS trusts and private hospitals.', robotsDirective: 'index, follow', schemaType: 'MedicalBusiness' },
]

function getScoreColor(score: number) {
  if (score > 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-500'
}

function getScoreBg(score: number) {
  if (score > 80) return 'bg-green-50'
  if (score >= 60) return 'bg-yellow-50'
  return 'bg-red-50'
}

function IndexStatusBadge({ status }: { status: SeoPage['indexStatus'] }) {
  const styles = {
    Indexed: 'bg-green-100 text-green-700 border-green-200',
    'Not Indexed': 'bg-red-100 text-red-600 border-red-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }
  return <Badge variant="outline" className={styles[status]}>{status}</Badge>
}

export default function SeoPages() {
  const [search, setSearch] = useState('')
  const [editPage, setEditPage] = useState<SeoPage | null>(null)
  const [editForm, setEditForm] = useState({
    seoTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    robotsDirective: '',
    schemaType: '',
  })

  const filtered = samplePages.filter(
    (p) =>
      p.url.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (page: SeoPage) => {
    setEditPage(page)
    setEditForm({
      seoTitle: page.seoTitle,
      metaDescription: page.metaDescription,
      canonicalUrl: page.canonicalUrl,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      robotsDirective: page.robotsDirective,
      schemaType: page.schemaType,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">SEO Pages Management</h1>
          <p className="text-[#5A6B7F] mt-1">Manage metadata, index status, and SEO scores for all pages</p>
        </div>
      </div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search by URL or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#D1D9E6] bg-[#F7F9FC]">
                    <TableHead className="text-[#5A6B7F]">URL</TableHead>
                    <TableHead className="text-[#5A6B7F]">Title</TableHead>
                    <TableHead className="text-[#5A6B7F]">Meta Description</TableHead>
                    <TableHead className="text-[#5A6B7F]">Index Status</TableHead>
                    <TableHead className="text-[#5A6B7F] text-center">SEO Score</TableHead>
                    <TableHead className="text-[#5A6B7F]">Updated</TableHead>
                    <TableHead className="text-[#5A6B7F]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((page) => (
                    <TableRow key={page.id} className="border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-[#C4942A] font-medium whitespace-nowrap">
                          <Globe className="h-3.5 w-3.5" />
                          {page.url}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-[#0B1D33] whitespace-nowrap">{page.title}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-[#5A6B7F] truncate">{page.metaDescription || <span className="text-red-400 italic">Missing</span>}</p>
                      </TableCell>
                      <TableCell><IndexStatusBadge status={page.indexStatus} /></TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${getScoreBg(page.seoScore)} ${getScoreColor(page.seoScore)}`}>
                          {page.seoScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] text-sm whitespace-nowrap">{page.lastUpdated}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#C4942A] hover:text-[#C4942A]/80"
                          onClick={() => openEdit(page)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit SEO
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit SEO Dialog */}
      <Dialog open={!!editPage} onOpenChange={() => setEditPage(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">
              Edit SEO — {editPage?.url}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={editForm.seoTitle}
                onChange={(e) => setEditForm({ ...editForm, seoTitle: e.target.value })}
                placeholder="Enter SEO title..."
              />
              <p className="text-xs text-[#5A6B7F]">Recommended: 50-60 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDesc">Meta Description</Label>
              <Textarea
                id="metaDesc"
                value={editForm.metaDescription}
                onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })}
                placeholder="Enter meta description..."
                rows={3}
              />
              <p className="text-xs text-[#5A6B7F]">Recommended: 150-160 characters ({editForm.metaDescription.length} chars)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={editForm.canonicalUrl}
                onChange={(e) => setEditForm({ ...editForm, canonicalUrl: e.target.value })}
                placeholder="https://raystaffing.co.uk/..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  value={editForm.ogTitle}
                  onChange={(e) => setEditForm({ ...editForm, ogTitle: e.target.value })}
                  placeholder="Open Graph title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogDesc">OG Description</Label>
                <Input
                  id="ogDesc"
                  value={editForm.ogDescription}
                  onChange={(e) => setEditForm({ ...editForm, ogDescription: e.target.value })}
                  placeholder="Open Graph description..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Robots Directives</Label>
                <Select
                  value={editForm.robotsDirective}
                  onValueChange={(v) => setEditForm({ ...editForm, robotsDirective: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index, follow">index, follow</SelectItem>
                    <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                    <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                    <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schema Type</Label>
                <Select
                  value={editForm.schemaType}
                  onValueChange={(v) => setEditForm({ ...editForm, schemaType: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schema type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Organization">Organization</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="AboutPage">AboutPage</SelectItem>
                    <SelectItem value="MedicalBusiness">MedicalBusiness</SelectItem>
                    <SelectItem value="WebPage">WebPage</SelectItem>
                    <SelectItem value="">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#D1D9E6] text-[#5A6B7F]" onClick={() => setEditPage(null)}>
              Cancel
            </Button>
            <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
