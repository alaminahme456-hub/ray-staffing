'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, Eye, Edit, Trash2, MoreHorizontal, MapPin, Clock, Users
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const statusColors: Record<string, string> = {
  Open: 'bg-green-100 text-green-700 border-green-200',
  Closed: 'bg-gray-100 text-gray-600 border-gray-200',
  Paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Filled: 'bg-blue-100 text-blue-700 border-blue-200',
}

const sampleJobs = [
  { id: 'JOB-001', title: 'Senior Care Nurse', employer: 'Midlands Care Group', location: 'Birmingham', status: 'Open', applications: 24, posted: '2024-06-01' },
  { id: 'JOB-002', title: 'Healthcare Assistant', employer: 'London Health Partners', location: 'London', status: 'Open', applications: 38, posted: '2024-05-28' },
  { id: 'JOB-003', title: 'RMN Nurse', employer: 'South Coast Healthcare', location: 'Southampton', status: 'Open', applications: 15, posted: '2024-06-05' },
  { id: 'JOB-004', title: 'Support Worker', employer: 'Northern Staffing Solutions', location: 'Manchester', status: 'Filled', applications: 42, posted: '2024-05-15' },
  { id: 'JOB-005', title: 'Staff Nurse (RGN)', employer: 'Devon Care Services', location: 'Exeter', status: 'Open', applications: 19, posted: '2024-06-10' },
  { id: 'JOB-006', title: 'Senior Support Worker', employer: 'Midlands Care Group', location: 'Coventry', status: 'Paused', applications: 8, posted: '2024-05-20' },
  { id: 'JOB-007', title: 'Mental Health Nurse', employer: 'London Health Partners', location: 'London', status: 'Open', applications: 31, posted: '2024-06-08' },
  { id: 'JOB-008', title: 'Care Home Manager', employer: 'South Coast Healthcare', location: 'Bournemouth', status: 'Closed', applications: 12, posted: '2024-04-20' },
  { id: 'JOB-009', title: 'Occupational Therapist', employer: 'Northern Staffing Solutions', location: 'Leeds', status: 'Open', applications: 7, posted: '2024-06-12' },
  { id: 'JOB-010', title: 'Pharmacy Technician', employer: 'Devon Care Services', location: 'Plymouth', status: 'Open', applications: 11, posted: '2024-06-14' },
]

const statuses = ['All', 'Open', 'Closed', 'Paused', 'Filled']

export default function AdminJobs() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = sampleJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.employer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">Job Management</h1>
          <p className="text-[#5A6B7F] mt-1">Monitor and manage all job postings across the platform</p>
        </div>
        <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
          + Create Job
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search jobs or employers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              className={
                statusFilter === status
                  ? 'bg-[#0B1D33] text-white hover:bg-[#1A3A5C]'
                  : 'border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F0F4F8]'
              }
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#D1D9E6] bg-[#F7F9FC]">
                    <TableHead className="text-[#5A6B7F]">Title</TableHead>
                    <TableHead className="text-[#5A6B7F]">Employer</TableHead>
                    <TableHead className="text-[#5A6B7F]">Location</TableHead>
                    <TableHead className="text-[#5A6B7F]">Status</TableHead>
                    <TableHead className="text-[#5A6B7F] text-center">Applications</TableHead>
                    <TableHead className="text-[#5A6B7F]">Posted</TableHead>
                    <TableHead className="text-[#5A6B7F]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((job) => (
                    <TableRow
                      key={job.id}
                      className="border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#0B1D33] whitespace-nowrap">{job.title}</p>
                          <p className="text-xs text-[#5A6B7F]">{job.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] whitespace-nowrap">{job.employer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-[#5A6B7F] whitespace-nowrap">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[job.status]}>
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[#0B1D33] font-medium">
                          <Users className="h-3.5 w-3.5 text-[#5A6B7F]" />
                          {job.applications}
                        </div>
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] text-sm whitespace-nowrap">{job.posted}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit
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
    </div>
  )
}
