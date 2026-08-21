'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Filter,
  File,
  Shield,
  Award,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

interface DocumentRow {
  id: string
  user_id: string
  doc_type: string
  file_name: string | null
  file_url: string | null
  file_size: number | null
  created_at: string
}

const DOC_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  cv: {
    label: 'CV',
    icon: <FileText className="w-4 h-4 text-blue-600" />,
    badge: 'bg-blue-100 text-blue-700',
  },
  certificate: {
    label: 'Certificate',
    icon: <Award className="w-4 h-4 text-emerald-600" />,
    badge: 'bg-emerald-100 text-emerald-700',
  },
  id: {
    label: 'ID Document',
    icon: <Shield className="w-4 h-4 text-purple-600" />,
    badge: 'bg-purple-100 text-purple-700',
  },
  reference: {
    label: 'Reference',
    icon: <ClipboardList className="w-4 h-4 text-orange-600" />,
    badge: 'bg-orange-100 text-orange-700',
  },
  contract: {
    label: 'Contract',
    icon: <FileText className="w-4 h-4 text-indigo-600" />,
    badge: 'bg-indigo-100 text-indigo-700',
  },
  other: {
    label: 'Other',
    icon: <File className="w-4 h-4 text-[#5A6B7F]" />,
    badge: 'bg-[#F0F4F8] text-[#5A6B7F]',
  },
}

const DEFAULT_CONFIG = DOC_TYPE_CONFIG['other']

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—'
  const kb = Math.round(bytes / 1024)
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
}

function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-44 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

export default function SeekerDocuments() {
  const user = useAppStore((s) => s.user)

  const [docs, setDocs] = useState<DocumentRow[]>([])
  const [filter, setFilter] = useState('all')
  const [uploadType, setUploadType] = useState('other')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!user)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const initialized = useRef(false)

  const loadDocs = useCallback(async (userId: string) => {
    const supabase = createClient()
    setLoading(true)
    try {
      const { data, error: queryErr } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (queryErr) throw queryErr
      setDocs((data as DocumentRow[]) || [])
    } catch (err) {
      console.error('Failed to load documents:', err)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [])

  if (!initialized.current && user?.id) {
    initialized.current = true
    loadDocs(user.id)
  }

  if (!user) return null
  if (loading) return <PageSkeleton />

  const filteredDocs =
    filter === 'all' ? docs : docs.filter((d) => d.doc_type === filter)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setUploadSuccess(false)
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'].includes(ext)) {
        setError(
          'Invalid file type. Please upload a PDF, DOC, DOCX, JPG, or PNG file.'
        )
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File is too large. Maximum file size is 10MB.')
        return
      }

      setUploading(true)
      try {
        const supabase = createClient()
        const { error: insertErr } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            doc_type: uploadType,
            file_name: file.name,
            file_url: `pending_upload://${file.name}`,
            file_size: file.size,
          })

        if (insertErr) {
          console.error('Upload failed:', insertErr)
          setError('Failed to upload document. Please try again.')
          toast.error('Upload failed')
        } else {
          setUploadSuccess(true)
          toast.success('Document uploaded')
          loadDocs(user.id)
          setTimeout(() => setUploadSuccess(false), 3000)
        }
      } catch (uploadErr) {
        console.error('Upload error:', uploadErr)
        toast.error('Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [user.id, uploadType, loadDocs]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (docId: string) => {
    setDeleting(docId)
    try {
      const supabase = createClient()
      const { error: delErr } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)
      if (delErr) throw delErr
      setDocs((prev) => prev.filter((d) => d.id !== docId))
      toast.success('Document deleted')
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Failed to delete document')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">
          My Documents
        </h1>
        <p className="text-[#5A6B7F] mt-1">
          Upload and manage your supporting documents.
        </p>
      </motion.div>

      {/* Upload Success */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <AlertTitle className="text-emerald-800 text-sm font-semibold">
                Document uploaded
              </AlertTitle>
              <AlertDescription className="text-emerald-700 text-xs mt-1">
                Your document has been uploaded successfully.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertTitle className="text-red-800 text-sm font-semibold">
                Upload failed
              </AlertTitle>
              <AlertDescription className="text-red-700 text-xs mt-1 flex items-center justify-between">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardContent className="p-4">
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragOver
                  ? 'border-[#C4942A] bg-amber-50'
                  : 'border-[#D1D9E6] hover:border-[#C4942A] hover:bg-[#F7F9FC]'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="space-y-2">
                  <RefreshCw className="w-8 h-8 text-[#C4942A] mx-auto animate-spin" />
                  <p className="text-sm font-medium text-[#0B1D33]">
                    Uploading document...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-[#D1D9E6] mx-auto" />
                  <div>
                    <p className="text-sm font-semibold text-[#0B1D33]">
                      Drag and drop documents here
                    </p>
                    <p className="text-xs text-[#5A6B7F] mt-0.5">
                      or click to browse
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Select
                      value={uploadType}
                      onValueChange={setUploadType}
                    >
                      <SelectTrigger className="w-36 border-[#D1D9E6] h-8 text-xs">
                        <SelectValue placeholder="Document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DOC_TYPE_CONFIG).map(
                          ([key, cfg]) => (
                            <SelectItem key={key} value={key}>
                              {cfg.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload
                      Document
                    </Button>
                  </div>
                  <p className="text-[11px] text-[#5A6B7F]">
                    PDF, DOC, DOCX, JPG, PNG · Max 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleInputChange}
              className="hidden"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter + List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C4942A]" />
                Documents
                <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 text-[10px]">
                  {docs.length}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#5A6B7F]" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-36 border-[#D1D9E6] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(DOC_TYPE_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>
                        {cfg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDocs.length === 0 ? (
              <div className="py-8 text-center">
                <File className="w-8 h-8 text-[#D1D9E6] mx-auto mb-2" />
                <p className="text-sm text-[#5A6B7F]">No documents found.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredDocs.map((doc) => {
                  const cfg = DOC_TYPE_CONFIG[doc.doc_type] || DEFAULT_CONFIG
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F0F4F8] flex items-center justify-center shrink-0">
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0B1D33] truncate">
                          {doc.file_name || 'Untitled Document'}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <Badge
                            className={`${cfg.badge} hover:${cfg.badge} border-0 text-[10px]`}
                          >
                            {cfg.label}
                          </Badge>
                          <span className="text-[11px] text-[#5A6B7F]">
                            {formatFileSize(doc.file_size)}
                          </span>
                          <span className="text-[11px] text-[#5A6B7F]">
                            {formatDate(doc.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-[#5A6B7F] hover:text-[#0B1D33]"
                          disabled
                          title="Download coming soon"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleting === doc.id}
                        >
                          {deleting === doc.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
