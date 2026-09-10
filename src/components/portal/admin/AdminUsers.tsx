'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Eye, Mail, Phone, Calendar, Shield,
  MoreHorizontal, UserCheck, UserX, RefreshCw, Users,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

type Profile = {
  id: string
  email: string | null
  name: string | null
  phone: string | null
  role: string | null
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700 border-red-200',
  HOUSING_ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
  RECRUITMENT_ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
  HR_ADMIN: 'bg-teal-100 text-teal-700 border-teal-200',
  LOCAL_ADMIN: 'bg-orange-100 text-orange-700 border-orange-200',
  SUPPORT_STAFF: 'bg-gray-100 text-gray-700 border-gray-200',
  candidate: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  employer: 'bg-amber-100 text-amber-700 border-amber-200',
  customer: 'bg-sky-100 text-sky-700 border-sky-200',
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  HOUSING_ADMIN: 'Housing Admin',
  RECRUITMENT_ADMIN: 'Recruitment Admin',
  HR_ADMIN: 'HR Admin',
  LOCAL_ADMIN: 'Local Admin',
  SUPPORT_STAFF: 'Support Staff',
  candidate: 'Candidate',
  employer: 'Employer',
  customer: 'Customer',
}

const adminRoles = ['SUPER_ADMIN', 'HOUSING_ADMIN', 'RECRUITMENT_ADMIN', 'HR_ADMIN', 'LOCAL_ADMIN', 'SUPPORT_STAFF']

const allRoles = ['ALL', ...adminRoles, 'candidate', 'employer', 'customer']

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name: string | null): string {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Skeleton rows for loading state
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i} className="border-[#1a2e1e]">
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full bg-[#0f1f12]" />
              <Skeleton className="h-4 w-32 bg-[#0f1f12]" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-44 bg-[#0f1f12]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 rounded-full bg-[#0f1f12]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16 bg-[#0f1f12]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28 bg-[#0f1f12]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 bg-[#0f1f12]" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function AdminUsers() {
  const { user: currentUser } = useAppStore()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProfiles((data as Profile[]) ?? [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load users'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch profiles on initial mount via useState initializer
  // to avoid useEffect + setState (React 19 strict lint).
  const [fetched] = useState(() => {
    // IIFE on initial render to trigger fetch without useEffect
    createClient()
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error(error.message)
        } else {
          setProfiles((data as Profile[]) ?? [])
        }
        setLoading(false)
      })
    return true
  })

  const filtered = profiles.filter((u) => {
    const name = (u.name ?? '').toLowerCase()
    const email = (u.email ?? '').toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleToggleActive = async (profile: Profile) => {
    if (togglingId) return
    const newStatus = !profile.is_active
    const actionLabel = newStatus ? 'activated' : 'deactivated'
    setTogglingId(profile.id)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', profile.id)

      if (error) throw error

      setProfiles(prev => prev.map(p =>
        p.id === profile.id ? { ...p, is_active: newStatus } : p
      ))

      toast.success(`${profile.name ?? profile.email} has been ${actionLabel}`)
      if (selectedUser?.id === profile.id) {
        setSelectedUser(prev => prev ? { ...prev, is_active: newStatus } : null)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : `Failed to ${actionLabel} user`
      toast.error(message)
    } finally {
      setTogglingId(null)
    }
  }

  const handleRefresh = () => {
    fetchProfiles()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#FAF8F5]">User Management</h1>
          <p className="text-[#7a8f8a] mt-1">Manage platform users, roles, and permissions</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="border-[#1a2e1e] text-[#7a8f8a] hover:bg-[#0f1f12] hover:text-[#FAF8F5]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f2a16] flex items-center justify-center">
                <Users className="h-5 w-5 text-[#4ade80]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">{profiles.length}</p>
                <p className="text-xs text-[#7a8f8a]">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f2a16] flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-[#4ade80]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">
                  {profiles.filter(p => p.is_active).length}
                </p>
                <p className="text-xs text-[#7a8f8a]">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#2a0f0f] flex items-center justify-center">
                <UserX className="h-5 w-5 text-[#f87171]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">
                  {profiles.filter(p => !p.is_active).length}
                </p>
                <p className="text-xs text-[#7a8f8a]">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0f2a16] flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#4ade80]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FAF8F5]">
                  {profiles.filter(p => adminRoles.includes(p.role ?? '')).length}
                </p>
                <p className="text-xs text-[#7a8f8a]">Admin Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a8f8a]" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#0a1a0e] border-[#1a2e1e] text-[#FAF8F5] placeholder:text-[#5a6f65] focus-visible:ring-[#1a3a1e] focus-visible:border-[#2a4e2e]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allRoles.map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? 'default' : 'outline'}
              size="sm"
              className={
                roleFilter === role
                  ? 'bg-[#1a3a1e] text-[#4ade80] hover:bg-[#1f4a24] border-[#2a5e2e]'
                  : 'border-[#1a2e1e] text-[#7a8f8a] hover:bg-[#0f1f12] hover:text-[#FAF8F5]'
              }
              onClick={() => setRoleFilter(role)}
            >
              {role === 'ALL' ? 'All Roles' : (roleLabels[role] ?? role)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-[#0a1a0e] border-[#1a2e1e]">
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#1a2e1e] bg-[#0f1f12] hover:bg-[#0f1f12]">
                    <TableHead className="text-[#7a8f8a] font-medium">Name</TableHead>
                    <TableHead className="text-[#7a8f8a] font-medium">Email</TableHead>
                    <TableHead className="text-[#7a8f8a] font-medium">Role</TableHead>
                    <TableHead className="text-[#7a8f8a] font-medium">Status</TableHead>
                    <TableHead className="text-[#7a8f8a] font-medium">Created</TableHead>
                    <TableHead className="text-[#7a8f8a] font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeleton />
                  ) : filtered.length === 0 ? (
                    <TableRow className="border-[#1a2e1e]">
                      <TableCell colSpan={6} className="h-40 text-center">
                        <div className="flex flex-col items-center gap-2 text-[#5a6f65]">
                          <Users className="h-10 w-10" />
                          <p className="text-sm">No users found</p>
                          <p className="text-xs">Try adjusting your search or filter</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filtered.map((user) => (
                        <motion.tr
                          key={user.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="border-[#1a2e1e] hover:bg-[#0f1f12] transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-[#1a3a1e] text-[#4ade80] flex items-center justify-center text-xs font-semibold shrink-0">
                                {getInitials(user.name)}
                              </div>
                              <span className="font-medium text-[#FAF8F5] whitespace-nowrap">
                                {user.name ?? 'Unnamed'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#7a8f8a] whitespace-nowrap">
                            {user.email ?? '—'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={roleColors[user.role ?? ''] ?? 'bg-gray-100 text-gray-500 border-gray-200'}
                            >
                              {roleLabels[user.role ?? ''] ?? user.role ?? 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 text-sm ${
                                  user.is_active ? 'text-[#4ade80]' : 'text-[#f87171]'
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    user.is_active ? 'bg-[#4ade80]' : 'bg-[#f87171]'
                                  }`}
                                />
                                {user.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[#7a8f8a] text-sm whitespace-nowrap">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#7a8f8a] hover:text-[#FAF8F5] hover:bg-[#1a2e1e]"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-[#7a8f8a] hover:text-[#FAF8F5] hover:bg-[#1a2e1e]"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="bg-[#0a1a0e] border-[#1a2e1e]"
                                >
                                  <DropdownMenuItem
                                    className="text-[#FAF8F5] focus:bg-[#1a2e1e] focus:text-[#4ade80]"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-[#FAF8F5] focus:bg-[#1a2e1e] focus:text-[#4ade80]"
                                    onClick={() => handleToggleActive(user)}
                                    disabled={togglingId === user.id || currentUser?.id === user.id}
                                  >
                                    {user.is_active ? (
                                      <><UserX className="h-4 w-4 mr-2" /> Deactivate</>
                                    ) : (
                                      <><UserCheck className="h-4 w-4 mr-2" /> Activate</>
                                    )}
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

      {/* Results count */}
      {!loading && profiles.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[#5a6f65] text-right"
        >
          Showing {filtered.length} of {profiles.length} users
        </motion.p>
      )}

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-lg bg-[#0a1a0e] border-[#1a2e1e]">
          <DialogHeader>
            <DialogTitle className="text-[#FAF8F5]">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <motion.div
              key={selectedUser.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#1a3a1e] text-[#4ade80] flex items-center justify-center text-lg font-semibold shrink-0">
                  {getInitials(selectedUser.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-[#FAF8F5] truncate">
                    {selectedUser.name ?? 'Unnamed'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge
                      variant="outline"
                      className={roleColors[selectedUser.role ?? ''] ?? 'bg-gray-100 text-gray-500 border-gray-200'}
                    >
                      {roleLabels[selectedUser.role ?? ''] ?? selectedUser.role ?? 'Unknown'}
                    </Badge>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        selectedUser.is_active ? 'text-[#4ade80]' : 'text-[#f87171]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          selectedUser.is_active ? 'bg-[#4ade80]' : 'bg-[#f87171]'
                        }`}
                      />
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {selectedUser.email_verified && (
                      <Badge variant="outline" className="bg-[#0f2a16] text-[#4ade80] border-[#1a3a1e] text-[10px]">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-[#5a6f65]">Email</p>
                  <div className="flex items-center gap-2 text-sm text-[#FAF8F5]">
                    <Mail className="h-3.5 w-3.5 text-[#5a6f65] shrink-0" />
                    <span className="truncate">{selectedUser.email ?? '—'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5a6f65]">Phone</p>
                  <div className="flex items-center gap-2 text-sm text-[#FAF8F5]">
                    <Phone className="h-3.5 w-3.5 text-[#5a6f65] shrink-0" />
                    {selectedUser.phone ?? '—'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5a6f65]">Role</p>
                  <div className="flex items-center gap-2 text-sm text-[#FAF8F5]">
                    <Shield className="h-3.5 w-3.5 text-[#5a6f65] shrink-0" />
                    {roleLabels[selectedUser.role ?? ''] ?? selectedUser.role ?? 'Unknown'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5a6f65]">Account Status</p>
                  <div className="flex items-center gap-2 text-sm text-[#FAF8F5]">
                    <UserCheck className="h-3.5 w-3.5 text-[#5a6f65] shrink-0" />
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5a6f65]">Created</p>
                  <div className="flex items-center gap-2 text-sm text-[#FAF8F5]">
                    <Calendar className="h-3.5 w-3.5 text-[#5a6f65] shrink-0" />
                    {formatDateTime(selectedUser.created_at)}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5a6f65]">Last Updated</p>
                  <div className="flex items-center gap-2 text-sm text-[#FAF8F5]">
                    <Calendar className="h-3.5 w-3.5 text-[#5a6f65] shrink-0" />
                    {formatDateTime(selectedUser.updated_at)}
                  </div>
                </div>
              </div>

              {/* Toggle Active Switch */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0f1f12] border border-[#1a2e1e]">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#FAF8F5]">Active Status</p>
                  <p className="text-xs text-[#5a6f65]">
                    {selectedUser.is_active
                      ? 'User can access the platform'
                      : 'User is currently deactivated'
                    }
                  </p>
                </div>
                <Switch
                  checked={selectedUser.is_active}
                  onCheckedChange={() => handleToggleActive(selectedUser)}
                  disabled={togglingId === selectedUser.id || currentUser?.id === selectedUser.id}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  className="flex-1 bg-[#1a3a1e] text-[#4ade80] hover:bg-[#1f4a24]"
                  onClick={() => handleToggleActive(selectedUser)}
                  disabled={togglingId === selectedUser.id || currentUser?.id === selectedUser.id}
                >
                  {togglingId === selectedUser.id ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
                  ) : selectedUser.is_active ? (
                    <><UserX className="h-4 w-4 mr-2" /> Deactivate User</>
                  ) : (
                    <><UserCheck className="h-4 w-4 mr-2" /> Activate User</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}