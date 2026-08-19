'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Shield,
  X,
  File,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface CVFile {
  name: string
  size: string
  uploadDate: string
}

const currentCV: CVFile | null = {
  name: 'Amara_Okafor_CV_2025.pdf',
  size: '245 KB',
  uploadDate: '15 June 2025',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx']

const cvTips = [
  {
    title: 'Keep it concise',
    description: 'Aim for 2 pages maximum. NHS recruiters prefer clear, well-structured CVs that highlight relevant experience.',
  },
  {
    title: 'Include your NMC PIN',
    description: 'Always include your Nursing and Midwifery Council pin number and registration status.',
  },
  {
    title: 'Tailor to each role',
    description: 'Adjust your personal statement and key achievements to match the specific role you are applying for.',
  },
  {
    title: 'Highlight certifications',
    description: 'List all relevant certifications such as BLS, ACLS, IV cannulation, and any specialist training.',
  },
  {
    title: 'Use UK English',
    description: 'Ensure your CV uses British English spelling and formatting conventions expected by UK employers.',
  },
]

export default function SeekerCV() {
  const [cv, setCv] = useState<CVFile | null>(currentCV)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return 'Invalid file type. Please upload a PDF, DOC, or DOCX file.'
    }
    if (!ACCEPTED_TYPES.includes(file.type) && ext !== '.doc' && ext !== '.docx') {
      return 'Invalid file type. Please upload a PDF, DOC, or DOCX file.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Maximum file size is 5MB.'
    }
    return null
  }

  const handleFile = useCallback((file: File) => {
    setError(null)
    setUploadSuccess(false)
    const err = validateFile(file)
    if (err) {
      setError(err)
      return
    }
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      const sizeKB = Math.round(file.size / 1024)
      setCv({
        name: file.name,
        size: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      })
      setUploading(false)
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    }, 1500)
  }, [])

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

  const handleDelete = () => {
    setCv(null)
    setUploadSuccess(false)
    setError(null)
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    return (bytes / 1024).toFixed(1) + ' KB'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My CV</h1>
        <p className="text-[#5A6B7F] mt-1">Manage your curriculum vitae for job applications.</p>
      </motion.div>

      {/* AI Extraction Notice */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Alert className="border-amber-200 bg-amber-50">
          <Info className="w-4 h-4 text-amber-600" />
          <AlertTitle className="text-amber-800 text-sm font-semibold">AI-Powered CV Extraction</AlertTitle>
          <AlertDescription className="text-amber-700 text-xs mt-1">
            If your CV information is extracted automatically, please review the extracted information for accuracy.
            You can update your profile details in the Profile section.
          </AlertDescription>
        </Alert>
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
              <AlertTitle className="text-emerald-800 text-sm font-semibold">CV uploaded successfully</AlertTitle>
              <AlertDescription className="text-emerald-700 text-xs mt-1">
                Your CV has been uploaded and is ready to use with your applications.
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
              <AlertTitle className="text-red-800 text-sm font-semibold">Upload failed</AlertTitle>
              <AlertDescription className="text-red-700 text-xs mt-1 flex items-center justify-between">
                {error}
                <button onClick={() => setError(null)} className="ml-2"><X className="w-3.5 h-3.5" /></button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current CV or Upload Area */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        {cv ? (
          <Card className="border-[#D1D9E6]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C4942A]" />
                Current CV
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-[10px] ml-auto">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-[#F7F9FC] rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-[#1A3A5C] flex items-center justify-center shrink-0">
                  <File className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B1D33] truncate">{cv.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="text-xs text-[#5A6B7F]">Size: {cv.size}</span>
                    <span className="text-xs text-[#5A6B7F]">Uploaded: {cv.uploadDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#0B1D33] text-xs">
                  <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                </Button>
                <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#0B1D33] text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                </Button>
                <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#0B1D33] text-xs" onClick={() => fileInputRef.current?.click()}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Replace
                </Button>
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 text-xs" onClick={handleDelete}>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-[#D1D9E6]">
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragOver
                    ? 'border-[#C4942A] bg-amber-50'
                    : 'border-[#D1D9E6] hover:border-[#C4942A] hover:bg-[#F7F9FC]'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="space-y-3">
                    <RefreshCw className="w-10 h-10 text-[#C4942A] mx-auto animate-spin" />
                    <p className="text-sm font-medium text-[#0B1D33]">Uploading your CV...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-10 h-10 text-[#D1D9E6] mx-auto" />
                    <div>
                      <p className="text-sm font-semibold text-[#0B1D33]">Drag and drop your CV here</p>
                      <p className="text-xs text-[#5A6B7F] mt-1">or click to browse files</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Choose File
                    </Button>
                    <p className="text-[11px] text-[#5A6B7F]">
                      Accepted formats: PDF, DOC, DOCX · Maximum size: 5MB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* CV Tips */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#C4942A]" />
              CV Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {cvTips.map((tip) => (
                <div key={tip.title} className="flex gap-3 p-3 bg-[#F7F9FC] rounded-lg">
                  <Shield className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#0B1D33]">{tip.title}</p>
                    <p className="text-[11px] text-[#5A6B7F] mt-0.5 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
