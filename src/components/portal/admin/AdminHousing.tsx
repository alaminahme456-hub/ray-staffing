'use client'

import { Suspense, use, useMemo, useState, useCallback, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, RefreshCw, Eye, MoreHorizontal, Home, CircleDollarSign, CalendarDays, Building2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface HousingRequest {
  id: string
  customer_id: string
  title: string
  description: string | null
  location: string | null
  budget_min: number | null
  budget_max: number | null
  status: string
  created_at: string
  profiles: {
    name: string | null
  } | null
}

/* ------------------------------------------------------------------ */
/*  Status config                                                       */
/* ------------------------------------------------------------------ */
const statusColors: Record<string, string> = {
  pending:    'bg-amber-900/40 text-amber-300 border-amber-700/50',
  in_progress:'bg-sky-900/40 text-sky-300 border-sky-700/50',
  matched:    'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  closed:     'bg-zinc-800/60 text-zinc-400 border-zinc-600/50',
  cancelled:  'bg-red-900/40 text-red-300 border-red-700/50',
}

const statusDotColors: Record<string, string> = {
  pending:    'bg-amber-400',
  in_progress:'bg-sky-400',
  matched:    'bg-emerald-400',
  closed:     'bg-zinc-500',
  cancelled:  'bg-red-400',
}

const statusLabels: Record<string, string> = {
  pending:    'Pending',
  in_progress:'In Progress',
  matched:    'Matched',
  closed:     'Closed',
  cancelled:  'Cancelled',
}

const statuses = ['All', 'pending', 'in_progress', 'matched', 'closed', 'cancelled'] as const
type StatusFilter = (typeof statuses)[number]

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatBudget(min: number | null, max: number | null): string {
  if (min == null && max == null) return '—'
  const fmt = (n: number) => `£${n.toLocaleString()}`
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`
  return min != null ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`
}

/* ------------------------------------------------------------------ */
/*  Data fetcher                                                        */
/* ------------------------------------------------------------------ */
async function fetchHousingRequests(): Promise<HousingRequest[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('housing_requests')
    .select(`
      id,
      customer_id,
      title,
      description,
      location,
      budget_min,
      budget_max,
      status,
      created_at,
      profiles!customer_id (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as HousingRequest[]) ?? []
}

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 bg-[#1a2e1e]" />
          <Skeleton className="h-4 w-80 bg-[#1a2e1e]" />
        </div>
        <Skeleton className="h-10 w-32 bg-[#1a2e1e]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 w-full max-w-md bg-[#1a2e1e]" />
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 bg-[#1a2e1e]" />
          ))}
        </div>
      </div>
      <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2e1e]">
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20 bg-[#1a2e1e]" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1a2e1e]/60">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <Skeleton
                          className="h-4 bg-[#1a2e1e]"
                          style={{ width: j === 0 ? '160px' : j === 2 ? '80px' : '100px' }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Inner content consumed via use()                                    */
/* ------------------------------------------------------------------ */
function AdminHousingContent() {
  const requestsPromise = useMemo(() => fetchHousingRequests(), [])
  const requests = use(requestsPromise)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  const handleSearch = useCallback((value: string) => {
    startTransition(() => setSearch(value))
  }, [])

  const handleStatusFilter = useCallback((value: StatusFilter) => {
    startTransition(() => setStatusFilter(value))
  }, [])

  /* ---- derived filtered list ---- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return requests.filter((r) => {
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter
      const customerName = (r.profiles?.name ?? '').toLowerCase()
      const matchesSearch =
        r.title.toLowerCase().includes(q) || customerName.includes(q)
      return matchesStatus && matchesSearch
    })
  }, [requests, search, statusFilter])

  /* ---- stats ---- */
  const stats = useMemo(() => {
    const s = { pending: 0, in_progress: 0, matched: 0, closed: 0, cancelled: 0, total: requests.length }
    for (const r of requests) {
      if (r.status in s) (s as Record<string, number>)[r.status]++
    }
    return s
  }, [requests])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAF8F5]">Housing Requests</h1>
          <p className="text-[#8A9B8E] mt-1">
            Manage housing requests, allocations, and matching status
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-[#1a2e1e] text-[#8A9B8E] hover:bg-[#0f1f12] hover:text-[#FAF8F5]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f2a16] flex items-center justify-center">
                <Home className="h-5 w-5 text-[#4ade80]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">{stats.total}</p>
                <p className="text-xs text-[#8A9B8E]">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#2a1f0f] flex items-center justify-center">
                <CircleDollarSign className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">{stats.pending}</p>
                <p className="text-xs text-[#8A9B8E]">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f1f2a] flex items-center justify-center">
                <Building2 className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">{stats.in_progress}</p>
                <p className="text-xs text-[#8A9B8E]">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f2a16] flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">{stats.matched}</p>
                <p className="text-xs text-[#8A9B8E]">Matched</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9B8E]" />
          <Input
            placeholder="Search by title or customer name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-[#0a1a0e] border-[#1a2e1e] text-[#FAF8F5] placeholder:text-[#5a6f65] focus-visible:ring-[#1a3a1e] focus-visible:border-[#2a4e2e]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              className={
                statusFilter === s
                  ? 'bg-[#1a3a1e] text-[#4ade80] hover:bg-[#1f4a24] border-[#2a5e2e]'
                  : 'border-[#1a2e1e] text-[#8A9B8E] hover:bg-[#0f1f12] hover:text-[#FAF8F5]'
              }
              onClick={() => handleStatusFilter(s)}
            >
              {s === 'All' ? 'All Status' : statusLabels[s] ?? s}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1a2e1e] bg-[#0f1f12] hover:bg-[#0f1f12]">
                    <TableHead className="text-[#8A9B8E] font-medium">Title</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Customer</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Location</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Budget Range</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Status</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Created</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow className="border-[#1a2e1e]">
                      <TableCell colSpan={7} className="h-40 text-center">
                        <div className="flex flex-col items-center gap-2 text-[#5a6f65]">
                          <Home className="h-10 w-10" />
                          <p className="text-sm">No housing requests found</p>
                          <p className="text-xs">Try adjusting your search or filter</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filtered.map((req) => (
                        <motion.tr
                          key={req.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="border-[#1a2e1e] hover:bg-[#0f1f12] transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-[#1a3a1e] text-[#4ade80] flex items-center justify-center shrink-0">
                                <Home className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-[#FAF8F5] whitespace-nowrap">{req.title}</p>
                                <p className="text-xs text-[#5a6f65] max-w-[200px] truncate">
                                  {req.description ?? '—'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#FAF8F5] whitespace-nowrap">
                            {req.profiles?.name ?? 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-[#8A9B8E] max-w-[180px]">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate text-sm">{req.location ?? '—'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#FAF8F5] whitespace-nowrap font-medium">
                            {formatBudget(req.budget_min, req.budget_max)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusColors[req.status] ?? 'bg-zinc-800/60 text-zinc-400 border-zinc-600/50'}
                            >
                              <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${statusDotColors[req.status] ?? 'bg-zinc-500'}`} />
                              {statusLabels[req.status] ?? req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[#8A9B8E] text-sm whitespace-nowrap">
                            {formatDate(req.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[#8A9B8E] hover:text-[#FAF8F5] hover:bg-[#1a2e1e]"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0a1a0e] border-[#1a2e1e]">
                                  <DropdownMenuItem className="text-[#FAF8F5] focus:bg-[#1a2e1e] focus:text-[#4ade80]">
                                    <Eye className="h-4 w-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results summary */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-[#8A9B8E]/60 text-right"
      >
        Showing {filtered.length} of {requests.length} requests
      </motion.p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Exported wrapper with Suspense boundary                            */
/* ------------------------------------------------------------------ */
export default function AdminHousing() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminHousingContent />
    </Suspense>
  )
}