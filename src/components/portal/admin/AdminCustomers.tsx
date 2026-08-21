'use client'

import { Suspense, use, useMemo, useState, useCallback, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, MoreHorizontal, Building2, MapPin, CalendarDays, Mail, Users,
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
import { useAppStore } from '@/store/app-store'

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface CustomerWithProfile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  address: string | null
  property_type: string | null
  created_at: string
  profiles: {
    email: string | null
    name: string | null
  } | null
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function getDisplayName(c: CustomerWithProfile): string {
  if (c.first_name || c.last_name) {
    return [c.first_name, c.last_name].filter(Boolean).join(' ')
  }
  return c.profiles?.name ?? 'Unknown'
}

function getEmail(c: CustomerWithProfile): string {
  return c.profiles?.email ?? '—'
}

/* ------------------------------------------------------------------ */
/*  Data fetcher                                                        */
/* ------------------------------------------------------------------ */
async function fetchCustomers(): Promise<CustomerWithProfile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('customer_profiles')
    .select(`
      id,
      user_id,
      first_name,
      last_name,
      address,
      property_type,
      created_at,
      profiles!user_id (
        email,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as CustomerWithProfile[]) ?? []
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
      </div>
      <Skeleton className="h-10 w-full max-w-md bg-[#1a2e1e]" />
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
                          style={{ width: j === 0 ? '160px' : j === 3 ? '100px' : '120px' }}
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
function AdminCustomersContent() {
  const customersPromise = useMemo(() => fetchCustomers(), [])
  const customers = use(customersPromise)
  const navigate = useAppStore((s) => s.navigate)

  const [search, setSearch] = useState('')

  const handleSearch = useCallback((value: string) => {
    startTransition(() => setSearch(value))
  }, [])

  /* ---- derived filtered list ---- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return customers.filter((c) => {
      const name = getDisplayName(c).toLowerCase()
      const email = getEmail(c).toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [customers, search])

  /* ---- property type counts ---- */
  const propertyCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of customers) {
      const t = c.property_type ?? 'Unknown'
      counts[t] = (counts[t] || 0) + 1
    }
    return counts
  }, [customers])

  const topPropertyType = useMemo(() => {
    const entries = Object.entries(propertyCounts)
    if (entries.length === 0) return '—'
    entries.sort((a, b) => b[1] - a[1])
    return entries[0][0]
  }, [propertyCounts])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FAF8F5]">Customer Management</h1>
          <p className="text-[#8A9B8E] mt-1">
            Manage housing customers and their profiles
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f2a16] flex items-center justify-center">
                <Users className="h-5 w-5 text-[#4ade80]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">{customers.length}</p>
                <p className="text-xs text-[#8A9B8E]">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#2a1f0f] flex items-center justify-center">
                <Mail className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">
                  {customers.filter((c) => c.profiles?.email).length}
                </p>
                <p className="text-xs text-[#8A9B8E]">With Email</p>
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
                <p className="text-2xl font-bold text-[#FAF8F5]">{topPropertyType}</p>
                <p className="text-xs text-[#8A9B8E]">Top Property Type</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9B8E]" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-[#0a1a0e] border-[#1a2e1e] text-[#FAF8F5] placeholder:text-[#5a6f65] focus-visible:ring-[#1a3a1e] focus-visible:border-[#2a4e2e]"
          />
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
                    <TableHead className="text-[#8A9B8E] font-medium">Name</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Email</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Address</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Property Type</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium">Created</TableHead>
                    <TableHead className="text-[#8A9B8E] font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow className="border-[#1a2e1e]">
                      <TableCell colSpan={6} className="h-40 text-center">
                        <div className="flex flex-col items-center gap-2 text-[#5a6f65]">
                          <Users className="h-10 w-10" />
                          <p className="text-sm">No customers found</p>
                          <p className="text-xs">Try adjusting your search</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filtered.map((customer) => {
                        const displayName = getDisplayName(customer)
                        const initials = displayName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || '??'

                        return (
                          <motion.tr
                            key={customer.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="border-[#1a2e1e] hover:bg-[#0f1f12] transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-[#1a3a1e] text-[#4ade80] flex items-center justify-center text-xs font-semibold shrink-0">
                                  {initials}
                                </div>
                                <span className="font-medium text-[#FAF8F5] whitespace-nowrap">
                                  {displayName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#8A9B8E] whitespace-nowrap">
                              {getEmail(customer)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-[#8A9B8E] max-w-[200px]">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate text-sm">{customer.address ?? '—'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {customer.property_type ? (
                                <Badge
                                  variant="outline"
                                  className="bg-[#0f2a16] text-emerald-300 border-emerald-700/50"
                                >
                                  {customer.property_type}
                                </Badge>
                              ) : (
                                <span className="text-[#5a6f65]">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-[#8A9B8E] text-sm whitespace-nowrap">
                              {formatDate(customer.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#8A9B8E] hover:text-[#4ade80] hover:bg-[#1a2e1e]"
                                  onClick={() => navigate('customer-dashboard')}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
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
                        )
                      })}
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
        Showing {filtered.length} of {customers.length} customers
      </motion.p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Exported wrapper with Suspense boundary                            */
/* ------------------------------------------------------------------ */
export default function AdminCustomers() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AdminCustomersContent />
    </Suspense>
  )
}