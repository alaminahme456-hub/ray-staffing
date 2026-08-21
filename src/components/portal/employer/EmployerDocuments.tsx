'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
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
  X,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DocumentRow {
  id: string
  name: string
  file_type: string | null
  category: string | null
  file_size: number | null
  file_path: string | null
  created_at: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const typeIcon = (type: string | null) => {
  switch (type) {
    case 'pdf': return <FileText className="w-5 h-5 text-red-500" />
    case 'docx': case 'doc': return <FileCheck className="w-5 h-5 text-blue-500" />
    case 'xlsx': case 'xls': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
    case 'png': case 'jpg': case 'jpeg': return <FileImage className="w-5 h-5 text-purple-500" />
    default: return <FileText className="w-5 h-5 text-[#5A6B7F]" />
  }
}

const typeLabel = (type: string | null): string => {
  if (!type) return 'FILE'
  return type.toUpperCase()
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 rounded-xl" />
      <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerDocuments() {
  const supabase = useMemo(() => createClient(), [])
  const user = useAppStore((s) => s.user)

  const [documents, setDocuments] = useState<DocumentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasFetched = useRef(false)

  async function fetchDocuments() {
    if (!user?.id) return
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, name, file_type, category, file_size, file_path, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setDocuments((data || []) as DocumentRow[])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  if (!hasFetched.current && user?.id) {
    hasFetched.current = true
    fetchDocuments()
  }

  /* ---- handlers ---- */

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !user?.id) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()?.toLowerCase() || ''
        const { error } = await supabase.from('documents').insert({
          user_id: user.id,
          name: file.name,
          file_type: ext,
          category: 'General',
          file_size: file.size,
        })
        if (error) throw error
      }
      toast.success(`${files.length} document${files.length !== 1 ? 's' : ''} uploaded`)
      fetchDocuments()
    } catch {
      toast.error('Failed to upload documents')
    } finally {
      setUploading(false)
    }
  }, [supabase, user?.id])

  const handleDelete = useCallback(async (docId: string) => {
    setDeleting(docId)
    try {
      const { error } = await supabase.from('documents').delete().eq('id', docId)
      if (error) throw error
      setDocuments((prev) => prev.filter((d) => d.id !== docId))
      toast.success('Document deleted')
    } catch {
      toast.error('Failed to delete document')
    } finally {
      setDeleting(null)
    }
  }, [supabase])

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
    handleUpload(e.dataTransfer.files)
  }, [handleUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleUpload])

  /* ---- derived ---- */

  const categories = useMemo(
    () => Array.from(new Set(documents.map((d) => d.category || 'Uncategorised').filter(Boolean))),
    [documents]
  )

  const filtered = useMemo(
    () => documents.filter((d) => categoryFilter === 'all' || (d.category || 'Uncategorised') === categoryFilter),
    [documents, categoryFilter]
  )

  /* ---- early returns ---- */

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#5A6B7F]">Please log in to view documents.</p>
      </div>
    )
  }

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
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-[#C4942A] bg-[#C4942A]/5'
              : 'border-[#D1D9E6] bg-[#F7F9FC] hover:bg-[#F0F4F8]'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-10 h-10 mx-auto mb-3 text-[#C4942A] animate-spin" />
          ) : (
            <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-[#C4942A]' : 'text-[#5A6B7F]'}`} />
          )}
          <p className="text-sm font-medium text-[#0B1D33]">
            {uploading ? 'Uploading…' : isDragging ? 'Drop files here' : 'Drag and drop files here, or click to browse'}
          </p>
          <p className="text-xs text-[#5A6B7F] mt-1">PDF, DOCX, XLSX, PNG, JPG up to 25 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
            onChange={handleFileInput}
          />
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
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
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
                    {typeIcon(doc.file_type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0B1D33] truncate">{doc.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-[#5A6B7F]">
                        <Badge variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C] text-[10px]">{doc.category || 'General'}</Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-500 text-[10px]">{typeLabel(doc.file_type)}</Badge>
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>·</span>
                        <span>Uploaded {formatDate(doc.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {doc.file_path && (
                        <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="text-[#5A6B7F] hover:text-[#1A3A5C] h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#5A6B7F] hover:text-red-500 h-8 w-8"
                        disabled={deleting === doc.id}
                        onClick={() => handleDelete(doc.id)}
                      >
                        {deleting === doc.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
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
