'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Plus, MapPin, Bed, Home, Building, Eye, Edit, MoreHorizontal, Users
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
  Available: 'bg-green-100 text-green-700 border-green-200',
  Occupied: 'bg-blue-100 text-blue-700 border-blue-200',
  Maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Reserved: 'bg-purple-100 text-purple-700 border-purple-200',
}

const typeIcons: Record<string, string> = {
  'Detached House': '🏠',
  'Flat': '🏢',
  'Semi-Detached': '🏡',
  'Terraced': '🏘️',
  'Studio': '🛏️',
}

const sampleProperties = [
  { id: 'PROP-001', name: 'Oakwood Residence', address: '42 Oakwood Road, Birmingham, B15 2TP', type: 'Detached House', status: 'Available', bedrooms: 4, tenancies: 0, owner: 'Midlands Care Group' },
  { id: 'PROP-002', name: 'Marina View Apartments', address: '15 Harbour Street, Southampton, SO14 5JH', type: 'Flat', status: 'Occupied', bedrooms: 2, tenancies: 3, owner: 'South Coast Healthcare' },
  { id: 'PROP-003', name: 'Greenfield House', address: '8 Green Lane, Manchester, M1 2WL', type: 'Semi-Detached', status: 'Maintenance', bedrooms: 3, tenancies: 1, owner: 'Northern Staffing Solutions' },
  { id: 'PROP-004', name: 'Central Lodge', address: '101 High Street, London, EC1A 1BB', type: 'Flat', status: 'Occupied', bedrooms: 1, tenancies: 5, owner: 'London Health Partners' },
  { id: 'PROP-005', name: 'Riverside Court', address: '7 Riverside Walk, Exeter, EX2 8DP', type: 'Terraced', status: 'Available', bedrooms: 3, tenancies: 0, owner: 'Devon Care Services' },
  { id: 'PROP-006', name: 'Park View Studio', address: '23 Park Avenue, Birmingham, B3 3JG', type: 'Studio', status: 'Reserved', bedrooms: 1, tenancies: 0, owner: 'Midlands Care Group' },
]

export default function AdminHousing() {
  const [search, setSearch] = useState('')

  const filtered = sampleProperties.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">Housing Management</h1>
          <p className="text-[#5A6B7F] mt-1">Manage properties, tenancies, and allocations</p>
        </div>
        <Button className="bg-[#C4942A] hover:bg-[#C4942A]/90 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Property
        </Button>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
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
                    <TableHead className="text-[#5A6B7F]">Property</TableHead>
                    <TableHead className="text-[#5A6B7F]">Address</TableHead>
                    <TableHead className="text-[#5A6B7F]">Type</TableHead>
                    <TableHead className="text-[#5A6B7F]">Status</TableHead>
                    <TableHead className="text-[#5A6B7F] text-center">Bedrooms</TableHead>
                    <TableHead className="text-[#5A6B7F] text-center">Tenancies</TableHead>
                    <TableHead className="text-[#5A6B7F]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((prop) => (
                    <TableRow
                      key={prop.id}
                      className="border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#1A3A5C] text-white flex items-center justify-center">
                            <Home className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-[#0B1D33] whitespace-nowrap">{prop.name}</p>
                            <p className="text-xs text-[#5A6B7F]">{prop.owner}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-[#5A6B7F] max-w-[200px]">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate text-sm">{prop.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-[#0B1D33]">
                          <span>{typeIcons[prop.type]}</span>
                          {prop.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[prop.status]}>
                          {prop.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[#0B1D33] font-medium">
                          <Bed className="h-3.5 w-3.5 text-[#5A6B7F]" />
                          {prop.bedrooms}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-[#0B1D33] font-medium">
                          <Users className="h-3.5 w-3.5 text-[#5A6B7F]" />
                          {prop.tenancies}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Edit
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
