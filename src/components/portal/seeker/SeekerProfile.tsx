'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  MapPin,
  FileText,
  Tag,
  Briefcase,
  Globe,
  CheckCircle2,
  Save,
  Phone,
  GraduationCap,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

interface CandidateProfile {
  id: string
  profile_complete: number | null
  bio: string | null
  location: string | null
  nationality: string | null
  rls_to_work: boolean | null
  skills: string[] | null
  certifications: string[] | null
  experience_years: number | null
  created_at: string
  updated_at: string
}

interface Profile {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string | null
  is_active: boolean | null
}

function computeCompletion(
  name: string,
  phone: string,
  bio: string,
  location: string,
  nationality: string,
  rlsToWork: boolean,
  experienceYears: number,
  skills: string[],
  certifications: string[]
): number {
  const fields = [
    name.trim().length > 0,
    phone.trim().length > 0,
    bio.trim().length > 0,
    location.trim().length > 0,
    nationality.trim().length > 0,
    rlsToWork === true,
    experienceYears > 0,
    skills.length >= 1,
    certifications.length >= 1,
  ]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-56 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  )
}

export default function SeekerProfile() {
  const user = useAppStore((s) => s.user)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [nationality, setNationality] = useState('')
  const [rlsToWork, setRlsToWork] = useState(false)
  const [experienceYears, setExperienceYears] = useState<number>(0)
  const [skillsInput, setSkillsInput] = useState('')
  const [certificationsInput, setCertificationsInput] = useState('')

  const initialized = useRef(false)

  const loadData = useCallback(async () => {
    if (!user?.id) return
    const supabase = createClient()

    const [profileRes, candidateRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('candidate_profiles').select('*').eq('id', user.id).single(),
    ])

    if (profileRes.data) {
      const p = profileRes.data as Profile
      setName(p.name ?? '')
      setPhone(p.phone ?? '')
    }

    if (candidateRes.data) {
      const c = candidateRes.data as CandidateProfile
      setBio(c.bio ?? '')
      setLocation(c.location ?? '')
      setNationality(c.nationality ?? '')
      setRlsToWork(c.rls_to_work ?? false)
      setExperienceYears(c.experience_years ?? 0)
      setSkillsInput(Array.isArray(c.skills) ? c.skills.join(', ') : '')
      setCertificationsInput(Array.isArray(c.certifications) ? c.certifications.join(', ') : '')
    }

    setLoading(false)
  }, [user?.id])

  if (!initialized.current && user?.id) {
    initialized.current = true
    loadData()
  }

  if (!user) return null
  if (loading) return <ProfileSkeleton />

  const skills = skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const certifications = certificationsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const completionPct = computeCompletion(
    name,
    phone,
    bio,
    location,
    nationality,
    rlsToWork,
    experienceYears,
    skills,
    certifications
  )

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = createClient()

      const profileUpdate = supabase
        .from('profiles')
        .update({ name: name.trim() || null, phone: phone.trim() || null })
        .eq('id', user.id)

      const candidateUpdate = supabase
        .from('candidate_profiles')
        .upsert(
          {
            id: user.id,
            bio: bio.trim() || null,
            location: location.trim() || null,
            nationality: nationality.trim() || null,
            rls_to_work: rlsToWork,
            experience_years: experienceYears > 0 ? experienceYears : null,
            skills: skills.length > 0 ? skills : null,
            certifications: certifications.length > 0 ? certifications : null,
            profile_complete: computeCompletion(
              name,
              phone,
              bio,
              location,
              nationality,
              rlsToWork,
              experienceYears,
              skills,
              certifications
            ),
          },
          { onConflict: 'id' }
        )

      const [, candidateErr] = await Promise.all([profileUpdate, candidateUpdate])

      if (candidateErr) throw candidateErr

      toast.success('Profile saved successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header + Completion */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My Profile</h1>
            <p className="text-[#5A6B7F] mt-1">
              Keep your details up to date for better job matches.
            </p>
          </div>
          <Button
            className="bg-[#C4942A] hover:bg-[#b3851f] text-white shrink-0"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Profile
              </span>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#0B1D33]">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-[#C4942A]">
                {completionPct}%
              </span>
            </div>
            <Progress value={completionPct} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <User className="w-4 h-4 text-[#C4942A]" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B7F]" />
                  <Input
                    className="border-[#D1D9E6] h-9 text-sm pl-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B7F]" />
                  <Input
                    className="border-[#D1D9E6] h-9 text-sm pl-9"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Nationality
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B7F]" />
                  <Input
                    className="border-[#D1D9E6] h-9 text-sm pl-9"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. British"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">
                  Experience (years)
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B7F]" />
                  <Input
                    type="number"
                    min={0}
                    className="border-[#D1D9E6] h-9 text-sm pl-9"
                    value={experienceYears || ''}
                    onChange={(e) =>
                      setExperienceYears(parseInt(e.target.value, 10) || 0)
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-[#5A6B7F]">
                    Right to Work
                  </Label>
                  <Switch
                    checked={rlsToWork}
                    onCheckedChange={setRlsToWork}
                    className="data-[state=checked]:bg-[#C4942A]"
                  />
                </div>
                <p className="text-[11px] text-[#5A6B7F]">
                  {rlsToWork
                    ? 'You have confirmed your right to work'
                    : 'Confirm you have the right to work in the relevant jurisdiction'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C4942A]" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#5A6B7F]">
                Location
              </Label>
              <Input
                className="border-[#D1D9E6] h-9 text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Professional Summary / Bio */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C4942A]" /> Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="border-[#D1D9E6] text-sm min-h-[120px] resize-y"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a brief professional summary..."
            />
            <p className="text-[11px] text-[#5A6B7F] mt-1.5 text-right">
              {bio.length} characters
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#C4942A]" /> Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              className="border-[#D1D9E6] h-9 text-sm"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Enter skills separated by commas, e.g. Nursing, IV Therapy, BLS"
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-[#F0F4F8] text-[#1A3A5C] hover:bg-[#F0F4F8] border border-[#D1D9E6] text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-[11px] text-[#5A6B7F]">
              Separate each skill with a comma. {skills.length} skill
              {skills.length !== 1 ? 's' : ''} added.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#C4942A]" />{' '}
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              className="border-[#D1D9E6] h-9 text-sm"
              value={certificationsInput}
              onChange={(e) => setCertificationsInput(e.target.value)}
              placeholder="Enter certifications separated by commas, e.g. BLS, NMC Registration, ACLS"
            />
            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge
                    key={cert}
                    className="bg-[#F7F9FC] text-[#0B1D33] hover:bg-[#F7F9FC] border border-[#D1D9E6] text-xs"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-[11px] text-[#5A6B7F]">
              Separate each certification with a comma.{' '}
              {certifications.length} certification
              {certifications.length !== 1 ? 's' : ''} added.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Save Button */}
      <div className="flex justify-end pb-4">
        <Button
          className="bg-[#C4942A] hover:bg-[#b3851f] text-white"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Save Profile
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
