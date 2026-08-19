'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Building2, Phone, Mail, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { useAppStore } from '@/store/app-store'

const sampleCustomers = [
  { id: 'CUS-001', name: 'Midlands Care Group', email: 'admin@midlandscare.co.uk', phone: '+44 121 555 0101', properties: 8, activeTenancies: 12, lastLogin: '2024-06-15 08:30', status: 'Active' },
  { id: 'CUS-002', name: 'London Health Partners', email: 'ops@londonhealth.co.uk', phone: '+44 20 7946 0958', properties: 5, activeTenancies: 7, lastLogin: '2024-06-14 16:45', status: 'Active' },
  { id: 'CUS-003', name: 'Northern Staffing Solutions', email: 'info@northernstaffing.co.uk', phone: '+44 161 555 0234', properties: 3, activeTenancies: 4, lastLogin: '2024-06-13 11:20', status: 'Active' },
  { id: 'CUS-004', name: 'South Coast Healthcare', email: 'hr@southcoasthealth.co.uk', phone: '+44 23 9287 6543', properties: 6, activeTenancies: 9, lastLogin: '2024-06-12 14:10', status: 'Active' },
  { id: 'CUS-005', name: 'East Anglia Nursing Ltd', email: 'contact@eanursing.co.uk', phone: '+44 1603 555 0789', properties: 2, activeTenancies: 2, lastLogin: '2024-05-28 09:55', status: 'Inactive' },
  { id: 'CUS-006', name: 'Devon Care Services', email: 'admin@devoncare.co.uk', phone: '+44 1392 555 0321', properties: 4, activeTenancies: 6, lastLogin: '2024-06-15 10:05', status: 'Active' },
]

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const navigate = useAppStore((s) => s.navigate)

  const filtered = sampleCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1D33]">Customer Management</h1>
          <p className="text-[#5A6B7F] mt-1">Manage housing customers and their tenancies</p>
        </div>
        <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
          + Add Customer
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
            placeholder="Search customers..."
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
                    <TableHead className="text-[#5A6B7F]">Customer</TableHead>
                    <TableHead className="text-[#5A6B7F]">Email</TableHead>
                    <TableHead className="text-[#5A6B7F]">Phone</TableHead>
                    <TableHead className="text-[#5A6B7F] text-center">Properties</TableHead>
                    <TableHead className="text-[#5A6B7F] text-center">Active Tenancies</TableHead>
                    <TableHead className="text-[#5A6B7F]">Last Login</TableHead>
                    <TableHead className="text-[#5A6B7F]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((customer, i) => (
                    <TableRow
                      key={customer.id}
                      className="border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-[#C4942A] text-white flex items-center justify-center">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-[#0B1D33] whitespace-nowrap">{customer.name}</p>
                            <p className="text-xs text-[#5A6B7F]">{customer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] whitespace-nowrap">{customer.email}</TableCell>
                      <TableCell className="text-[#5A6B7F] whitespace-nowrap">{customer.phone}</TableCell>
                      <TableCell className="text-center font-medium text-[#0B1D33]">{customer.properties}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-[#1A3A5C]/10 text-[#1A3A5C]">
                          {customer.activeTenancies}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#5A6B7F] text-sm whitespace-nowrap">{customer.lastLogin}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#C4942A] hover:text-[#C4942A]/80"
                          onClick={() => navigate('customer-dashboard')}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
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
