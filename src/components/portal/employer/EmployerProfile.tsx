'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Globe,
  Users,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Check,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
    </div>
  )
}

export default function EmployerProfile() {
  const [loading, setLoading] = useState(true)
  const [showCompanyEdit, setShowCompanyEdit] = useState(false)
  const [showContactEdit, setShowContactEdit] = useState(false)
  const [showAddressEdit, setShowAddressEdit] = useState(false)

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Barts Health NHS Trust',
    type: 'NHS Acute Trust',
    industry: 'Healthcare',
    website: 'www.bartshealth.nhs.uk',
    size: '15,000+ employees',
    description: 'Barts Health NHS Trust is one of the largest NHS trusts in England, serving over 2.5 million people across East London. The trust operates five hospitals: The Royal London, St Bartholomew\'s, Whipps Cross, Newham, and Mile End. We are committed to delivering outstanding patient care and providing excellent working environments for our staff.',
  })

  const [contactInfo, setContactInfo] = useState({
    name: 'Claire Whitfield',
    role: 'Head of Recruitment',
    email: 'recruitment@bartshealth.nhs.uk',
    phone: '020 7882 6205',
  })

  const [addressInfo, setAddressInfo] = useState({
    line1: 'Barts Health NHS Trust',
    line2: 'The Royal London Hospital',
    city: 'London',
    postcode: 'E1 1BB',
  })

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Company Profile</h1>
        <p className="text-[#5A6B7F] mt-0.5">Manage your organisation details</p>
      </motion.div>

      {/* Company Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C4942A]" /> Company Information
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#C4942A] hover:text-[#B3861F]"
              onClick={() => setShowCompanyEdit(true)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#5A6B7F]">Organisation Name</p>
                <p className="font-medium text-[#0B1D33]">{companyInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6B7F]">Type</p>
                <p className="font-medium text-[#0B1D33]">{companyInfo.type}</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6B7F]">Industry</p>
                <p className="font-medium text-[#0B1D33]">{companyInfo.industry}</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6B7F]">Organisation Size</p>
                <p className="font-medium text-[#0B1D33]">{companyInfo.size}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-[#5A6B7F]">Website</p>
                <p className="font-medium text-[#1A3A5C] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {companyInfo.website}
                </p>
              </div>
            </div>
            <Separator className="bg-[#D1D9E6]" />
            <div>
              <p className="text-xs text-[#5A6B7F] mb-1">About</p>
              <p className="text-sm text-[#5A6B7F] leading-relaxed">{companyInfo.description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C4942A]" /> Contact Information
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#C4942A] hover:text-[#B3861F]"
              onClick={() => setShowContactEdit(true)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#5A6B7F]">Primary Contact</p>
                <p className="font-medium text-[#0B1D33]">{contactInfo.name}</p>
                <p className="text-xs text-[#5A6B7F]">{contactInfo.role}</p>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-[#5A6B7F]">Email</p>
                  <p className="font-medium text-[#0B1D33] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#5A6B7F]" /> {contactInfo.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5A6B7F]">Phone</p>
                  <p className="font-medium text-[#0B1D33] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#5A6B7F]" /> {contactInfo.phone}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Address Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C4942A]" /> Address
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#C4942A] hover:text-[#B3861F]"
              onClick={() => setShowAddressEdit(true)}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p className="font-medium text-[#0B1D33]">{addressInfo.line1}</p>
              <p className="text-[#5A6B7F]">{addressInfo.line2}</p>
              <p className="text-[#5A6B7F]">{addressInfo.city} {addressInfo.postcode}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Company Dialog */}
      <Dialog open={showCompanyEdit} onOpenChange={setShowCompanyEdit}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">Edit Company Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Organisation Name</Label>
              <Input value={companyInfo.name} onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={companyInfo.type} onValueChange={v => setCompanyInfo({ ...companyInfo, type: v })}>
                  <SelectTrigger className="border-[#D1D9E6]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NHS Acute Trust">NHS Acute Trust</SelectItem>
                    <SelectItem value="NHS Mental Health Trust">NHS Mental Health Trust</SelectItem>
                    <SelectItem value="NHS Foundation Trust">NHS Foundation Trust</SelectItem>
                    <SelectItem value="Private Healthcare">Private Healthcare</SelectItem>
                    <SelectItem value="Social Care">Social Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={companyInfo.size} onValueChange={v => setCompanyInfo({ ...companyInfo, size: v })}>
                  <SelectTrigger className="border-[#D1D9E6]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50 employees">1–50 employees</SelectItem>
                    <SelectItem value="51-250 employees">51–250 employees</SelectItem>
                    <SelectItem value="251-1000 employees">251–1,000 employees</SelectItem>
                    <SelectItem value="1000-5000 employees">1,000–5,000 employees</SelectItem>
                    <SelectItem value="15,000+ employees">15,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={companyInfo.website} onChange={e => setCompanyInfo({ ...companyInfo, website: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="space-y-2">
              <Label>About</Label>
              <Textarea value={companyInfo.description} onChange={e => setCompanyInfo({ ...companyInfo, description: e.target.value })} rows={4} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowCompanyEdit(false)}>Cancel</Button>
              <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={showContactEdit} onOpenChange={setShowContactEdit}>
        <DialogContent className="max-w-lg border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">Edit Contact Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input value={contactInfo.name} onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={contactInfo.role} onChange={e => setContactInfo({ ...contactInfo, role: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={contactInfo.phone} onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowContactEdit(false)}>Cancel</Button>
              <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={showAddressEdit} onOpenChange={setShowAddressEdit}>
        <DialogContent className="max-w-lg border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">Edit Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Address Line 1</Label>
              <Input value={addressInfo.line1} onChange={e => setAddressInfo({ ...addressInfo, line1: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input value={addressInfo.line2} onChange={e => setAddressInfo({ ...addressInfo, line2: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={addressInfo.city} onChange={e => setAddressInfo({ ...addressInfo, city: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>Postcode</Label>
                <Input value={addressInfo.postcode} onChange={e => setAddressInfo({ ...addressInfo, postcode: e.target.value })} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowAddressEdit(false)}>Cancel</Button>
              <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
