'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, Edit, UserX, Trash2, MoreHorizontal,
  Mail, Phone, Calendar, Shield, X, Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700 border-red-200',
  HOUSING_ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
  RECRUITMENT_ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
  HR_ADMIN: 'bg-teal-100 text-teal-700 border-teal-200',
  LOCAL_ADMIN: 'bg-orange-100 text-orange-700 border-orange-200',
  SUPPORT_STAFF: 'bg-gray-100 text-gray-700 border-gray-200',
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  HOUSING_ADMIN: 'Housing Admin',
  RECRUITMENT_ADMIN: 'Recruitment Admin',
  HR_ADMIN: 'HR Admin',
  LOCAL_ADMIN: 'Local Admin',
  SUPPORT_STAFF: 'Support Staff',
}

const sampleUsers = [
  { id: 'USR-001', name: 'Sarah Mitchell', email: 'sarah.mitchell@raystaffing.com', role: 'SUPER_ADMIN', status: 'Active', lastLogin: '2024-06-15 09:32', phone: '+44 7700 900123', department: 'Operations', joined: '2023-01-10' },
  { id: 'USR-002', name: 'James Carter', email: 'james.carter@raystaffing.com', role: 'HOUSING_ADMIN', status: 'Active', lastLogin: '2024-06-15 08:45', phone: '+44 7700 900124', department: 'Housing', joined: '2023-03-22' },
  { id: 'USR-003', name: 'Emily Watson', email: 'emily.watson@raystaffing.com', role: 'RECRUITMENT_ADMIN', status: 'Active', lastLogin: '2024-06-14 17:20', phone: '+44 7700 900125', department: 'Recruitment', joined: '2023-05-15' },
  { id: 'USR-004', name: 'David Chen', email: 'david.chen@raystaffing.com', role: 'HR_ADMIN', status: 'Active', lastLogin: '2024-06-15 10:10', phone: '+44 7700 900126', department: 'Human Resources', joined: '2023-07-01' },
  { id: 'USR-005', name: 'Rachel Thompson', email: 'rachel.thompson@raystaffing.com', role: 'LOCAL_ADMIN', status: 'Active', lastLogin: '2024-06-13 14:55', phone: '+44 7700 900127', department: 'Birmingham Office', joined: '2023-09-18' },
  { id: 'USR-006', name: 'Michael O\'Brien', email: 'michael.obrien@raystaffing.com', role: 'SUPPORT_STAFF', status: 'Inactive', lastLogin: '2024-05-28 11:30', phone: '+44 7700 900128', department: 'Customer Support', joined: '2023-11-05' },
  { id: 'USR-007', name: 'Priya Sharma', email: 'priya.sharma@raystaffing.com', role: 'RECRUITMENT_ADMIN', status: 'Active', lastLogin: '2024-06-15 07:15', phone: '+44 7700 900129', department: 'Recruitment', joined: '2024-01-20' },
  { id: 'USR-008', name: 'Thomas Anderson', email: 'thomas.anderson@raystaffing.com', role: 'HOUSING_ADMIN', status: 'Active', lastLogin: '2024-06-14 16:40', phone: '+44 7700 900130', department: 'Housing', joined: '2024-02-14' },
  { id: 'USR-009', name: 'Lisa Morgan', email: 'lisa.morgan@raystaffing.com', role: 'SUPPORT_STAFF', status: 'Active', lastLogin: '2024-06-15 09:00', phone: '+44 7700 900131', department: 'Customer Support', joined: '2024-03-08' },
  { id: 'USR-010', name: 'Robert Taylor', email: 'robert.taylor@raystaffing.com', role: 'HR_ADMIN', status: 'Inactive', lastLogin: '2024-06-01 13:25', phone: '+44 7700 900132', department: 'Human Resources', joined: '2023-04-30' },
]

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState<typeof sampleUsers[0] | null>(null)

  const roles = ['ALL', ...Object.keys(roleLabels)]

  const filtered = sampleUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1D33]">User Management</h1>
        <p className="text-[#5A6B7F] mt-1">Manage platform users, roles, and permissions</p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roles.map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? 'default' : 'outline'}
              size="sm"
              className={
                roleFilter === role
                  ? 'bg-[#0B1D33] text-white hover:bg-[#1A3A5C]'
                  : 'border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F0F4F8]'
              }
              onClick={() => setRoleFilter(role)}
            >
              {role === 'ALL' ? 'All Roles' : roleLabels[role]}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#D1D9E6] bg-[#F7F9FC]">
                    <TableHead className="text-[#5A6B7F]">Name</TableHead>
                    <TableHead className="text-[#5A6B7F]">Email</TableHead>
                    <TableHead className="text-[#5A6B7F]">Role</TableHead>
                    <TableHead className="text-[#5A6B7F]">Status</TableHead>
                    <TableHead className="text-[#5A6B7F]">Last Login</TableHead>
                    <TableHead className="text-[#5A6B7F]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user, i) => (
                    <TableRow
                      key={user.id}
                      className="border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#1A3A5C] text-white flex items-center justify-center text-xs font-semibold">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="font-medium text-[#0B1D33] whitespace-nowrap">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] whitespace-nowrap">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm ${
                            user.status === 'Active' ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.status === 'Active' ? 'bg-green-500' : 'bg-red-400'
                            }`}
                          />
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] text-sm whitespace-nowrap">{user.lastLogin}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX className="h-4 w-4 mr-2" /> Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#1A3A5C] text-white flex items-center justify-center text-lg font-semibold">
                  {selectedUser.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0B1D33]">{selectedUser.name}</h3>
                  <Badge variant="outline" className={roleColors[selectedUser.role]}>
                    {roleLabels[selectedUser.role]}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-[#5A6B7F]">Email</p>
                  <div className="flex items-center gap-2 text-sm text-[#0B1D33]">
                    <Mail className="h-3.5 w-3.5 text-[#5A6B7F]" />
                    {selectedUser.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5A6B7F]">Phone</p>
                  <div className="flex items-center gap-2 text-sm text-[#0B1D33]">
                    <Phone className="h-3.5 w-3.5 text-[#5A6B7F]" />
                    {selectedUser.phone}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5A6B7F]">Department</p>
                  <div className="flex items-center gap-2 text-sm text-[#0B1D33]">
                    <Shield className="h-3.5 w-3.5 text-[#5A6B7F]" />
                    {selectedUser.department}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5A6B7F]">Status</p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm ${
                      selectedUser.status === 'Active' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        selectedUser.status === 'Active' ? 'bg-green-500' : 'bg-red-400'
                      }`}
                    />
                    {selectedUser.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5A6B7F]">Joined</p>
                  <div className="flex items-center gap-2 text-sm text-[#0B1D33]">
                    <Calendar className="h-3.5 w-3.5 text-[#5A6B7F]" />
                    {selectedUser.joined}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#5A6B7F]">Last Login</p>
                  <div className="flex items-center gap-2 text-sm text-[#0B1D33]">
                    <Calendar className="h-3.5 w-3.5 text-[#5A6B7F]" />
                    {selectedUser.lastLogin}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-[#0B1D33] hover:bg-[#1A3A5C]">
                  <Edit className="h-4 w-4 mr-2" /> Edit User
                </Button>
                <Button variant="outline" className="border-[#D1D9E6] text-[#5A6B7F]">
                  <UserX className="h-4 w-4 mr-2" /> Deactivate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
