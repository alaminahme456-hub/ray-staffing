'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

interface EmployerProfileData {
  id: string
  company_name: string | null
  industry: string | null
  company_size: string | null
  website: string | null
  description: string | null
  address: string | null
}

interface ProfileData {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string | null
}

function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

const COMPANY_SIZES = [
  '1–50 employees',
  '51–250 employees',
  '251–1,000 employees',
  '1,000–5,000 employees',
  '5,000–15,000 employees',
  '15,000+ employees',
]

export default function EmployerProfile() {
  const user = useAppStore((s) => s.user)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Employer profile fields
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')

  // Profiles fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const initialized = useRef(false)

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    const supabase = createClient()
    setLoading(true)

    try {
      const [employerRes, profileRes] = await Promise.all([
        supabase
          .from('employer_profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ])

      if (employerRes.data) {
        const ep = employerRes.data as EmployerProfileData
        setCompanyName(ep.company_name ?? '')
        setIndustry(ep.industry ?? '')
        setCompanySize(ep.company_size ?? '')
        setWebsite(ep.website ?? '')
        setDescription(ep.description ?? '')
        setAddress(ep.address ?? '')
      }

      if (profileRes.data) {
        const p = profileRes.data as ProfileData
        setName(p.name ?? '')
        setPhone(p.phone ?? '')
      }
    } catch (err) {
      console.error('Failed to load employer profile:', err)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  if (!initialized.current && user?.id) {
    initialized.current = true
    loadProfile()
  }

  if (!user) return null
  if (loading) return <PageSkeleton />

  async function handleSave() {
    if (!user.id) return
    setSaving(true)

    try {
      const supabase = createClient()

      // Update employer_profiles
      const employerUpdate = supabase
        .from('employer_profiles')
        .upsert({
          id: user.id,
          company_name: companyName.trim() || null,
          industry: industry.trim() || null,
          company_size: companySize || null,
          website: website.trim() || null,
          description: description.trim() || null,
          address: address.trim() || null,
        })

      // Update profiles (name & phone)
      const profileUpdate = supabase
        .from('profiles')
        .update({
          name: name.trim() || null,
          phone: phone.trim() || null,
        })
        .eq('id', user.id)

      const [res1, res2] = await Promise.all([employerUpdate, profileUpdate])

      if (res1.error) throw res1.error
      if (res2.error) throw res2.error

      toast.success('Profile saved successfully')
    } catch (err) {
      console.error('Failed to save profile:', err)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">
          Company Profile
        </h1>
        <p className="text-[#5A6B7F] mt-0.5">
          Manage your organisation details
        </p>
      </motion.div>

      {/* Company Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C4942A]" /> Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Company Name
                </Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Barts Health NHS Trust"
                  className="border-[#D1D9E6] h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Industry
                </Label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Healthcare"
                  className="border-[#D1D9E6] h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Company Size
                </Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger className="border-[#D1D9E6] h-9 text-sm">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Website
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="www.example.co.uk"
                    className="border-[#D1D9E6] h-9 text-sm pl-9"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-[#D1D9E6]" />

            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#5A6B7F]">
                About
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your organisation, mission, and values..."
                rows={4}
                className="border-[#D1D9E6] text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C4942A]" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Contact Name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="border-[#D1D9E6] h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 020 7882 6205"
                    className="border-[#D1D9E6] h-9 text-sm pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Email (read-only)
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
                  <Input
                    value={user.email}
                    disabled
                    className="border-[#D1D9E6] h-9 text-sm pl-9 bg-[#F7F9FC] text-[#5A6B7F]"
                  />
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
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C4942A]" /> Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#5A6B7F]">
                Full Address
              </Label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. The Royal London Hospital, Whitechapel, London E1 1BB"
                rows={3}
                className="border-[#D1D9E6] text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="bg-[#C4942A] hover:bg-[#b3851f] text-white"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
