'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Pencil,
  Save,
  X,
  Shield,
  Bell,
  Key,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/store/app-store'

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3">
      <span className="text-sm text-[#5A6B7F] flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-[#0B1D33] text-right max-w-[60%]">{value}</span>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )
}

export default function CustomerProfile() {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const startEditing = () => {
    setEditName('James Okafor')
    setEditPhone('+44 7700 900 123')
    setEditAddress('14 Oakwood Crescent, Longsight, Manchester, M14 5QW')
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
  }

  const saveProfile = () => {
    setEditing(false)
  }

  if (loading) return <PageSkeleton />

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div {...fadeIn} className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('customer-dashboard')}
          className="text-[#5A6B7F] hover:text-[#0B1D33]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My Profile</h1>
          <p className="text-[#5A6B7F] mt-0.5">Manage your personal information and account settings</p>
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                  <User className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-[#0B1D33]">Personal Information</CardTitle>
              </div>
              {!editing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startEditing}
                  className="border-[#D1D9E6] text-[#1A3A5C] hover:text-[#C4942A] hover:border-[#C4942A]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    className="border-[#D1D9E6] text-[#5A6B7F]"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveProfile}
                    className="bg-[#C4942A] hover:bg-[#B3861F] text-white"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="space-y-0">
                <InfoRow label="Full Name" value="James Okafor" icon={<User className="w-3.5 h-3.5" />} />
                <Separator className="bg-[#D1D9E6]" />
                <InfoRow label="Email Address" value="james.okafor@email.co.uk" icon={<Mail className="w-3.5 h-3.5" />} />
                <Separator className="bg-[#D1D9E6]" />
                <InfoRow label="Phone Number" value="+44 7700 900 123" icon={<Phone className="w-3.5 h-3.5" />} />
                <Separator className="bg-[#D1D9E6]" />
                <InfoRow label="Correspondence Address" value="14 Oakwood Crescent, Longsight, Manchester, M14 5QW" icon={<MapPin className="w-3.5 h-3.5" />} />
                <Separator className="bg-[#D1D9E6]" />
                <InfoRow label="Account Created" value="12 March 2026" />
                <Separator className="bg-[#D1D9E6]" />
                <div className="flex items-start justify-between py-3">
                  <span className="text-sm text-[#5A6B7F]">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Active</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm text-[#0B1D33]">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone" className="text-sm text-[#0B1D33]">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address" className="text-sm text-[#0B1D33]">Correspondence Address</Label>
                  <Input
                    id="edit-address"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                  />
                </div>
                <p className="text-xs text-[#5A6B7F]">
                  Email address cannot be changed here. Please contact support for email changes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Settings */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <Shield className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg text-[#0B1D33]">Account Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-[#5A6B7F]" />
                  <div>
                    <p className="text-sm font-medium text-[#0B1D33]">Change Password</p>
                    <p className="text-xs text-[#5A6B7F]">Last changed 45 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#1A3A5C]">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#5A6B7F]" />
                  <div>
                    <p className="text-sm font-medium text-[#0B1D33]">Notification Preferences</p>
                    <p className="text-xs text-[#5A6B7F]">Manage email and in-app notifications</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#1A3A5C]">
                  Manage
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-[#D1D9E6] hover:bg-[#F7F9FC] transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#5A6B7F]" />
                  <div>
                    <p className="text-sm font-medium text-[#0B1D33]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#5A6B7F]">Add extra security to your account</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
