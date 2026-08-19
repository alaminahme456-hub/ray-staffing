'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Search,
  Download,
  Eye,
  ArrowLeft,
  Filter,
  FileSignature,
  FileSpreadsheet,
  LetterText,
  Bell,
  Handshake,
  FolderOpen,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/app-store'

type DocType = 'All' | 'Tenancy' | 'Statement' | 'Letter' | 'Notice' | 'Agreement'

interface Document {
  id: string
  name: string
  type: 'Tenancy' | 'Statement' | 'Letter' | 'Notice' | 'Agreement'
  date: string
  size: string
  important?: boolean
}

const documents: Document[] = [
  { id: 'DOC-001', name: 'Tenancy Agreement - 14 Oakwood Crescent', type: 'Agreement', date: '12 Mar 2026', size: '2.4 MB', important: true },
  { id: 'DOC-002', name: 'Rent Statement - August 2026', type: 'Statement', date: '1 Aug 2026', size: '348 KB' },
  { id: 'DOC-003', name: 'Gas Safety Certificate - 2026', type: 'Tenancy', date: '15 Jul 2026', size: '1.1 MB' },
  { id: 'DOC-004', name: 'Welcome Letter', type: 'Letter', date: '14 Mar 2026', size: '256 KB' },
  { id: 'DOC-005', name: 'Notice of Annual Rent Review 2027', type: 'Notice', date: '20 Aug 2026', size: '185 KB', important: true },
  { id: 'DOC-006', name: 'EPC Certificate', type: 'Tenancy', date: '12 Mar 2026', size: '856 KB' },
]

const typeFilters: DocType[] = ['All', 'Tenancy', 'Statement', 'Letter', 'Notice', 'Agreement']

const typeIcon: Record<string, React.ReactNode> = {
  Tenancy: <FileSignature className="w-5 h-5" />,
  Statement: <FileSpreadsheet className="w-5 h-5" />,
  Letter: <LetterText className="w-5 h-5" />,
  Notice: <Bell className="w-5 h-5" />,
  Agreement: <Handshake className="w-5 h-5" />,
}

const typeColor: Record<string, string> = {
  Tenancy: 'bg-blue-100 text-blue-700',
  Statement: 'bg-emerald-100 text-emerald-700',
  Letter: 'bg-purple-100 text-purple-700',
  Notice: 'bg-amber-100 text-amber-700',
  Agreement: 'bg-[#F0F4F8] text-[#1A3A5C]',
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  )
}

export default function CustomerDocuments() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<DocType>('All')
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
      const matchType = activeFilter === 'All' || d.type === activeFilter
      return matchSearch && matchType
    })
  }, [search, activeFilter])

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('customer-dashboard')}
          className="text-[#5A6B7F] hover:text-[#0B1D33]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Documents</h1>
          <p className="text-[#5A6B7F] mt-0.5">View and download your tenancy documents</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
          />
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        <Filter className="w-4 h-4 text-[#5A6B7F] shrink-0" />
        {typeFilters.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === type
                ? 'bg-[#0B1D33] text-white'
                : 'bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#D1D9E6]'
            }`}
          >
            {type}
          </button>
        ))}
      </motion.div>

      {/* Document List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="space-y-3"
      >
        {filtered.length === 0 ? (
          <Card className="border-[#D1D9E6]">
            <CardContent className="py-12 text-center">
              <FolderOpen className="w-12 h-12 text-[#D1D9E6] mx-auto mb-3" />
              <p className="text-[#0B1D33] font-medium">No documents found</p>
              <p className="text-sm text-[#5A6B7F] mt-1">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.15 + i * 0.05 }}
            >
              <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C] shrink-0">
                      {typeIcon[doc.type] || <FileText className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#0B1D33] truncate">{doc.name}</p>
                        {doc.important && (
                          <Badge className="bg-red-100 text-red-700 border-0 text-[10px] shrink-0">Important</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className={`${typeColor[doc.type]} border-0 text-[10px]`}>{doc.type}</Badge>
                        <span className="text-xs text-[#5A6B7F]">{doc.date}</span>
                        <span className="text-xs text-[#5A6B7F]">{doc.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="text-[#1A3A5C] hover:text-[#C4942A] h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-[#1A3A5C] hover:text-[#C4942A] h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
