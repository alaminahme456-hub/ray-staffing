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

interface Doc {
  id: number
  name: string
  type: string
  size: string
  uploadDate: string
  typeLabel: string
}

const initialDocs: Doc[] = [
  {
    id: 1,
    name: 'NMC_Registration_Certificate.pdf',
    type: 'registration',
    size: '542 KB',
    uploadDate: '15 Jun 2025',
    typeLabel: 'Registration',
  },
  {
    id: 2,
    name: 'BLS_ACLS_Certificate_2024.pdf',
    type: 'certification',
    size: '318 KB',
    uploadDate: '22 May 2025',
    typeLabel: 'Certification',
  },
  {
    id: 3,
    name: 'DBS_Certificate_Jan2025.pdf',
    type: 'verification',
    size: '289 KB',
    uploadDate: '10 Jan 2025',
    typeLabel: 'Verification',
  },
  {
    id: 4,
    name: 'Right_to_Work_Share_Code.pdf',
    type: 'verification',
    size: '156 KB',
    uploadDate: '8 Jan 2025',
    typeLabel: 'Verification',
  },
]

const typeIcons: Record<string, React.ReactNode> = {
  registration: <Award className="w-4 h-4 text-blue-600" />,
  certification: <Shield className="w-4 h-4 text-emerald-600" />,
  verification: <ClipboardList className="w-4 h-4 text-purple-600" />,
  other: <FileText className="w-4 h-4 text-[#5A6B7F]" />,
}

const typeBadgeColors: Record<string, string> = {
  registration: 'bg-blue-100 text-blue-700',
  certification: 'bg-emerald-100 text-emerald-700',
  verification: 'bg-purple-100 text-purple-700',
  other: 'bg-[#F0F4F8] text-[#5A6B7F]',
}

export default function SeekerDocuments() {
  const [docs, setDocs] = useState<Doc[]>(initialDocs)
  const [filter, setFilter] = useState('all')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocs = filter === 'all' ? docs : docs.filter((d) => d.type === filter)

  const handleFile = useCallback((file: File) => {
    setError(null)
    setUploadSuccess(false)
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'].includes(ext)) {
      setError('Invalid file type. Please upload a PDF, DOC, DOCX, JPG, or PNG file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum file size is 10MB.')
      return
    }
    setUploading(true)
    setTimeout(() => {
      const sizeKB = Math.round(file.size / 1024)
      const newDoc: Doc = {
        id: Date.now(),
        name: file.name,
        type: 'other',
        size: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        typeLabel: 'Other',
      }
      setDocs((prev) => [newDoc, ...prev])
      setUploading(false)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    }, 1200)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = (id: number) => {
    setDocs(docs.filter((d) => d.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My Documents</h1>
        <p className="text-[#5A6B7F] mt-1">Upload and manage your supporting documents.</p>
      </motion.div>

      {/* Upload Success */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <AlertTitle className="text-emerald-800 text-sm font-semibold">Document uploaded</AlertTitle>
              <AlertDescription className="text-emerald-700 text-xs mt-1">Your document has been uploaded successfully.</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertTitle className="text-red-800 text-sm font-semibold">Upload failed</AlertTitle>
              <AlertDescription className="text-red-700 text-xs mt-1 flex items-center justify-between">
                {error}
                <button onClick={() => setError(null)} className="ml-2"><X className="w-3.5 h-3.5" /></button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-[#D1D9E6]">
          <CardContent className="p-4">
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragOver ? 'border-[#C4942A] bg-amber-50' : 'border-[#D1D9E6] hover:border-[#C4942A] hover:bg-[#F7F9FC]'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="space-y-2">
                  <RefreshCw className="w-8 h-8 text-[#C4942A] mx-auto animate-spin" />
                  <p className="text-sm font-medium text-[#0B1D33]">Uploading document...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-[#D1D9E6] mx-auto" />
                  <div>
                    <p className="text-sm font-semibold text-[#0B1D33]">Drag and drop documents here</p>
                    <p className="text-xs text-[#5A6B7F] mt-0.5">or click to browse</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Document
                  </Button>
                  <p className="text-[11px] text-[#5A6B7F]">PDF, DOC, DOCX, JPG, PNG · Max 10MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleInputChange} className="hidden" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter + List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C4942A]" />
                Documents
                <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 text-[10px]">{docs.length}</Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#5A6B7F]" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-36 border-[#D1D9E6] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#F0F4F8] flex items-center justify-center shrink-0">
                      {typeIcons[doc.type] || typeIcons.other}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0B1D33] truncate">{doc.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <Badge className={`${typeBadgeColors[doc.type] || typeBadgeColors.other} hover:${typeBadgeColors[doc.type] || typeBadgeColors.other} border-0 text-[10px]`}>
                          {doc.typeLabel}
                        </Badge>
                        <span className="text-[11px] text-[#5A6B7F]">{doc.size}</span>
                        <span className="text-[11px] text-[#5A6B7F]">{doc.uploadDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#5A6B7F] hover:text-[#0B1D33]">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
