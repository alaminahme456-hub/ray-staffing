'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb,
  Shield,
  X,
  File,
  Star,
  Loader2,
  CircleDot,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

interface CVRecord {
  id: string
  candidate_id: string
  file_url: string
  file_name: string
  is_primary: boolean
  created_at: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
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

function CVItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#F7F9FC] rounded-lg">
      <Skeleton className="w-12 h-12 rounded-lg bg-[#D1D9E6] shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-[#D1D9E6]" />
        <Skeleton className="h-3 w-1/2 bg-[#D1D9E6]" />
      </div>
    </div>
  )
}

export default function SeekerCV() {
  const user = useAppStore((s) => s.user)
  const [cvs, setCvs] = useState<CVRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    async function fetchCVs() {
      const supabase = createClient()
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('cvs')
          .select('*')
          .eq('candidate_id', user.id)
          .order('created_at', { ascending: false })
        if (fetchError) {
          toast.error('Failed to load CVs')
          return
        }
        setCvs((data as CVRecord[]) ?? [])
      } catch (err) {
        console.error('Failed to fetch CVs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCVs()
  }, [user, refreshKey])

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return 'Invalid file type. Please upload a PDF, DOC, or DOCX file.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Maximum file size is 5MB.'
    }
    return null
  }

  const handleUpload = async (file: File) => {
    if (!user?.id) {
      toast.error('You must be logged in to upload a CV')
      return
    }

    setError(null)
    setUploadSuccess(false)

    const err = validateFile(file)
    if (err) {
      setError(err)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    const supabase = createClient()
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `${user.id}/${timestamp}_${sanitizedName}`

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    setUploadProgress(50)

    if (uploadError) {
      setUploading(false)
      setUploadProgress(0)
      setError(uploadError.message)
      toast.error('Failed to upload CV')
      return
    }

    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(filePath)
    const fileUrl = urlData.publicUrl

    setUploadProgress(75)

    const isFirstCV = cvs.length === 0

    const { error: insertError } = await supabase.from('cvs').insert({
      candidate_id: user.id,
      file_url: fileUrl,
      file_name: file.name,
      is_primary: isFirstCV,
    })

    setUploadProgress(100)

    if (insertError) {
      await supabase.storage.from('cvs').remove([filePath])
      setUploading(false)
      setUploadProgress(0)
      setError(insertError.message)
      toast.error('Failed to save CV record')
      return
    }

    setUploading(false)
    setUploadProgress(0)
    setUploadSuccess(true)
    toast.success('CV uploaded successfully')
    setRefreshKey((k) => k + 1)

    setTimeout(() => setUploadSuccess(false), 3000)
  }

  const handleSetPrimary = async (cvId: string) => {
    if (!user?.id) return

    setSettingPrimaryId(cvId)
    const supabase = createClient()

    const { error: updateAllError } = await supabase
      .from('cvs')
      .update({ is_primary: false })
      .eq('candidate_id', user.id)

    if (updateAllError) {
      toast.error('Failed to update primary CV')
      setSettingPrimaryId(null)
      return
    }

    const { error: setPrimaryError } = await supabase
      .from('cvs')
      .update({ is_primary: true })
      .eq('id', cvId)

    if (setPrimaryError) {
      toast.error('Failed to set primary CV')
      setSettingPrimaryId(null)
      return
    }

    toast.success('Primary CV updated')
    setSettingPrimaryId(null)
    setRefreshKey((k) => k + 1)
  }

  const handleDelete = async (cv: CVRecord) => {
    if (!user?.id) return

    setDeletingId(cv.id)
    const supabase = createClient()

    let filePath = ''
    try {
      const url = new URL(cv.file_url)
      const pathParts = url.pathname.split('/')
      const cvsIndex = pathParts.indexOf('cvs')
      if (cvsIndex !== -1) {
        filePath = pathParts.slice(cvsIndex + 1).join('/')
      }
    } catch {
      filePath = `${user.id}/${cv.file_name}`
    }

    const { error: storageError } = await supabase.storage
      .from('cvs')
      .remove([filePath])

    if (storageError) {
      console.warn('Storage delete warning:', storageError.message)
    }

    const { error: dbError } = await supabase
      .from('cvs')
      .delete()
      .eq('id', cv.id)

    if (dbError) {
      toast.error('Failed to delete CV')
      setDeletingId(null)
      return
    }

    const wasPrimary = cv.is_primary
    toast.success('CV deleted')
    setDeletingId(null)

    if (wasPrimary) {
      const remaining = cvs.filter((c) => c.id !== cv.id)
      if (remaining.length > 0) {
        await supabase
          .from('cvs')
          .update({ is_primary: true })
          .eq('id', remaining[0].id)
      }
    }

    setRefreshKey((k) => k + 1)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = (cv: CVRecord) => {
    window.open(cv.file_url, '_blank', 'noopener,noreferrer')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return <FileText className="w-6 h-6 text-red-500" />
    return <File className="w-6 h-6 text-[#1A3A5C]" />
  }

  const primaryCV = cvs.find((c) => c.is_primary)
  const otherCVs = cvs.filter((c) => !c.is_primary)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My CV</h1>
        <p className="text-[#5A6B7F] mt-1">
          Manage your curriculum vitae for job applications.
        </p>
      </motion.div>

      {/* AI Extraction Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Alert className="border-amber-200 bg-amber-50">
          <Info className="w-4 h-4 text-amber-600" />
          <AlertTitle className="text-amber-800 text-sm font-semibold">
            AI-Powered CV Extraction
          </AlertTitle>
          <AlertDescription className="text-amber-700 text-xs mt-1">
            If your CV information is extracted automatically, please review the
            extracted information for accuracy. You can update your profile details
            in the Profile section.
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
              <AlertTitle className="text-emerald-800 text-sm font-semibold">
                CV uploaded successfully
              </AlertTitle>
              <AlertDescription className="text-emerald-700 text-xs mt-1">
                Your CV has been uploaded and is ready to use with your
                applications.
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
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#C4942A]" />
              Upload New CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
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
                <div className="space-y-4">
                  <Loader2 className="w-10 h-10 text-[#C4942A] mx-auto animate-spin" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#0B1D33]">
                      Uploading your CV...
                    </p>
                    <p className="text-xs text-[#5A6B7F]">
                      {uploadProgress < 50
                        ? 'Uploading file...'
                        : uploadProgress < 75
                          ? 'Processing...'
                          : uploadProgress < 100
                            ? 'Saving...'
                            : 'Complete!'}
                    </p>
                  </div>
                  <div className="w-48 mx-auto h-1.5 bg-[#D1D9E6] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C4942A] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 text-[#D1D9E6] mx-auto" />
                  <div>
                    <p className="text-sm font-semibold text-[#0B1D33]">
                      Drag and drop your CV here
                    </p>
                    <p className="text-xs text-[#5A6B7F] mt-1">
                      or click to browse files
                    </p>
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
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* CV List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C4942A]" />
              My CVs
              {!loading && cvs.length > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] ml-auto bg-[#F7F9FC] text-[#5A6B7F] border border-[#D1D9E6]"
                >
                  {cvs.length} file{cvs.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <CVItemSkeleton />
                <CVItemSkeleton />
              </div>
            ) : cvs.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#F7F9FC] border border-[#D1D9E6] flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7 text-[#D1D9E6]" />
                </div>
                <p className="text-sm font-semibold text-[#0B1D33]">
                  No CVs uploaded yet
                </p>
                <p className="text-xs text-[#5A6B7F] mt-1 max-w-sm mx-auto">
                  Upload your first CV to get started. Your CV will be visible to
                  recruiters when you apply for positions.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Your CV
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {/* Primary CV first */}
                {primaryCV && (
                  <div className="relative border border-[#C4942A] bg-amber-50/40 rounded-lg p-1">
                    <div className="absolute -top-2.5 left-3">
                      <Badge className="bg-[#C4942A] text-white hover:bg-[#C4942A] border-0 text-[10px] px-2 py-0">
                        <Star className="w-3 h-3 mr-1" />
                        Primary CV
                      </Badge>
                    </div>
                    <div className="flex items-start gap-4 p-4 pt-5 rounded-md">
                      <div className="w-12 h-12 rounded-lg bg-[#1A3A5C] flex items-center justify-center shrink-0">
                        {getFileIcon(primaryCV.file_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0B1D33] truncate">
                          {primaryCV.file_name}
                        </p>
                        <span className="text-xs text-[#5A6B7F]">
                          Uploaded: {formatDate(primaryCV.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#D1D9E6] text-[#0B1D33] text-xs h-8 px-2"
                          onClick={() => handleDownload(primaryCV)}
                          title="Download CV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-8 px-2"
                          onClick={() => handleDelete(primaryCV)}
                          disabled={deletingId === primaryCV.id}
                          title="Delete CV"
                        >
                          {deletingId === primaryCV.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other CVs */}
                {otherCVs.map((cv) => (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-[#D1D9E6] rounded-lg p-1 hover:bg-[#F7F9FC] transition-colors"
                  >
                    <div className="flex items-start gap-4 p-4 rounded-md">
                      <div className="w-12 h-12 rounded-lg bg-[#F7F9FC] border border-[#D1D9E6] flex items-center justify-center shrink-0">
                        {getFileIcon(cv.file_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0B1D33] truncate">
                          {cv.file_name}
                        </p>
                        <span className="text-xs text-[#5A6B7F]">
                          Uploaded: {formatDate(cv.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#D1D9E6] text-[#0B1D33] text-xs h-8 px-2"
                          onClick={() => handleSetPrimary(cv.id)}
                          disabled={settingPrimaryId === cv.id}
                          title="Set as primary CV"
                        >
                          {settingPrimaryId === cv.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CircleDot className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#D1D9E6] text-[#0B1D33] text-xs h-8 px-2"
                          onClick={() => handleDownload(cv)}
                          title="Download CV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-8 px-2"
                          onClick={() => handleDelete(cv)}
                          disabled={deletingId === cv.id}
                          title="Delete CV"
                        >
                          {deletingId === cv.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* CV Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
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
                <div
                  key={tip.title}
                  className="flex gap-3 p-3 bg-[#F7F9FC] rounded-lg"
                >
                  <Shield className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#0B1D33]">
                      {tip.title}
                    </p>
                    <p className="text-[11px] text-[#5A6B7F] mt-0.5 leading-relaxed">
                      {tip.description}
                    </p>
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
