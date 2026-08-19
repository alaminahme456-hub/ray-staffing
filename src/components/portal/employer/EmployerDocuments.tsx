'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  FileCheck,
  FileSpreadsheet,
  FileImage,
  Download,
  Trash2,
  Eye,
  Filter,
  Plus,
  X,
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

interface Document {
  id: string
  name: string
  type: string
  category: string
  size: string
  uploaded: string
  uploadedBy: string
}

const documents: Document[] = [
  { id: 'D-001', name: 'Barts_Health_Brochure_2026.pdf', type: 'PDF', category: 'Marketing', size: '2.4 MB', uploaded: '10 Aug 2026', uploadedBy: 'Claire Whitfield' },
  { id: 'D-002', name: 'NHS_Standard_Contract_Template.docx', type: 'DOCX', category: 'Contracts', size: '156 KB', uploaded: '05 Aug 2026', uploadedBy: 'Claire Whitfield' },
  { id: 'D-003', name: 'Trust_Governance_Framework.pdf', type: 'PDF', category: 'Policy', size: '1.1 MB', uploaded: '28 Jul 2026', uploadedBy: 'HR Team' },
  { id: 'D-004', name: 'International_Recruitment_Onboarding_Guide.pdf', type: 'PDF', category: 'Policy', size: '3.8 MB', uploaded: '15 Jul 2026', uploadedBy: 'Claire Whitfield' },
]

const typeIcon = (type: string) => {
  switch (type) {
    case 'PDF': return <FileText className="w-5 h-5 text-red-500" />
    case 'DOCX': return <FileCheck className="w-5 h-5 text-blue-500" />
    case 'XLSX': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
    case 'PNG': case 'JPG': return <FileImage className="w-5 h-5 text-purple-500" />
    default: return <FileText className="w-5 h-5 text-[#5A6B7F]" />
  }
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 rounded-xl" />
      <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
    </div>
  )
}

export default function EmployerDocuments() {
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const categories = Array.from(new Set(documents.map(d => d.category)))

  const filtered = documents.filter(d =>
    categoryFilter === 'all' || d.category === categoryFilter
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Documents</h1>
        <p className="text-[#5A6B7F] mt-0.5">Upload and manage company documents</p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-[#C4942A] bg-[#C4942A]/5'
              : 'border-[#D1D9E6] bg-[#F7F9FC] hover:bg-[#F0F4F8]'
          }`}
        >
          <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-[#C4942A]' : 'text-[#5A6B7F]'}`} />
          <p className="text-sm font-medium text-[#0B1D33]">
            {isDragging ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
          </p>
          <p className="text-xs text-[#5A6B7F] mt-1">PDF, DOCX, XLSX, PNG, JPG up to 25 MB</p>
          <input type="file" className="hidden" multiple accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg" />
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5A6B7F]" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 border-[#D1D9E6]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-[#5A6B7F]">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {/* Document List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-[#D1D9E6] hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {typeIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0B1D33] truncate">{doc.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#5A6B7F]">
                        <Badge variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C] text-[10px]">{doc.category}</Badge>
                        <span>{doc.size}</span>
                        <span>·</span>
                        <span>Uploaded {doc.uploaded} by {doc.uploadedBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="text-[#5A6B7F] hover:text-[#1A3A5C] h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[#5A6B7F] hover:text-[#1A3A5C] h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[#5A6B7F] hover:text-red-500 h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#5A6B7F]">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm mt-1">Upload your first document using the area above</p>
          </div>
        )}
      </div>
    </div>
  )
}
