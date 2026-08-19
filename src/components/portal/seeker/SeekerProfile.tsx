'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  MapPin,
  FileText,
  Tag,
  Briefcase,
  GraduationCap,
  Settings2,
  Plus,
  X,
  Save,
  Phone,
  Calendar,
  Globe,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface ExperienceEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface QualificationEntry {
  id: string
  name: string
  institution: string
  date: string
}

export default function SeekerProfile() {
  const [title, setTitle] = useState('Ms')
  const [firstName, setFirstName] = useState('Amara')
  const [lastName, setLastName] = useState('Okafor')
  const [phone, setPhone] = useState('+44 7700 123456')
  const [dob, setDob] = useState('1992-03-15')
  const [nationality, setNationality] = useState('British')
  const [rightToWork, setRightToWork] = useState('yes')
  const [address, setAddress] = useState('42 Harley Street')
  const [city, setCity] = useState('London')
  const [postcode, setPostcode] = useState('W1G 9PA')
  const [summary, setSummary] = useState(
    'Dedicated and compassionate Senior Staff Nurse with over 6 years of experience in critical care and acute medical settings. Registered with the NMC (Pin: 12A3456B) with specialist competencies in intensive care, IV therapy, and advanced life support.'
  )
  const [skills, setSkills] = useState([
    'Intensive Care Nursing',
    'IV Cannulation',
    'BLS/ACLS',
    'Patient Assessment',
    'Mentoring',
    'Electronic Patient Records',
    'Infection Control',
    'Medication Management',
  ])
  const [newSkill, setNewSkill] = useState('')
  const [experience, setExperience] = useState<ExperienceEntry[]>([
    {
      id: '1',
      company: "St Mary's Hospital, Imperial College Healthcare",
      role: 'Senior Staff Nurse - ICU',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Leading a team of 8 nurses in a 16-bed intensive care unit. Managing complex patient cases including ventilated patients, post-cardiac surgery, and sepsis management.',
    },
    {
      id: '2',
      company: 'Royal London Hospital, Barts Health',
      role: 'Staff Nurse - Medical Assessment Unit',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: 'Provided acute nursing care for patients referred from A&E. Gained experience in rapid assessment, triage, and managing deteriorating patients.',
    },
  ])
  const [qualifications, setQualifications] = useState<QualificationEntry[]>([
    { id: '1', name: 'BSc (Hons) Adult Nursing', institution: "King's College London", date: '2019' },
    { id: '2', name: 'NMC Registration (Adult)', institution: 'Nursing and Midwifery Council', date: '2019' },
    { id: '3', name: 'BLS/ACLS Certified', institution: 'Resuscitation Council UK', date: '2023' },
  ])
  const [jobType, setJobType] = useState('full-time')
  const [salaryMin, setSalaryMin] = useState('36000')
  const [salaryMax, setSalaryMax] = useState('50000')
  const [workMode, setWorkMode] = useState('on-site')
  const [availability, setAvailability] = useState('1-month')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const filledSections = [
    Boolean(firstName && lastName),
    Boolean(phone),
    Boolean(address && city && postcode),
    Boolean(summary && summary.length > 50),
    skills.length >= 3,
    experience.length >= 1,
    qualifications.length >= 1,
    Boolean(jobType),
  ]
  const completionPct = Math.round((filledSections.filter(Boolean).length / filledSections.length) * 100)

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s)) {
      setSkills([...skills, s])
      setNewSkill('')
    }
  }
  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill))
  const addExperience = () => {
    setExperience([
      ...experience,
      { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' },
    ])
  }
  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | boolean) => {
    setExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }
  const removeExperience = (id: string) => setExperience(experience.filter((e) => e.id !== id))
  const addQualification = () => {
    setQualifications([
      ...qualifications,
      { id: Date.now().toString(), name: '', institution: '', date: '' },
    ])
  }
  const updateQualification = (id: string, field: keyof QualificationEntry, value: string) => {
    setQualifications(qualifications.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }
  const removeQualification = (id: string) => setQualifications(qualifications.filter((q) => q.id !== id))

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1200)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header + Completion */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">My Profile</h1>
            <p className="text-[#5A6B7F] mt-1">Keep your details up to date for better job matches.</p>
          </div>
          <Button className="bg-[#C4942A] hover:bg-[#b3851f] text-white shrink-0" onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
            ) : saved ? (
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved</span>
            ) : (
              <span className="inline-flex items-center gap-2"><Save className="w-4 h-4" /> Save Profile</span>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-[#D1D9E6]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#0B1D33]">Profile Completion</span>
              <span className="text-sm font-bold text-[#C4942A]">{completionPct}%</span>
            </div>
            <Progress value={completionPct} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <User className="w-4 h-4 text-[#C4942A]" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Title</Label>
                <Select value={title} onValueChange={setTitle}>
                  <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">First Name</Label>
                <Input className="border-[#D1D9E6] h-9 text-sm" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Last Name</Label>
                <Input className="border-[#D1D9E6] h-9 text-sm" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B7F]" />
                  <Input className="border-[#D1D9E6] h-9 text-sm pl-9" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B7F]" />
                  <Input type="date" className="border-[#D1D9E6] h-9 text-sm pl-9" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Nationality</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6B7F]" />
                  <Input className="border-[#D1D9E6] h-9 text-sm pl-9" value={nationality} onChange={(e) => setNationality(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Right to Work in the UK</Label>
                <Select value={rightToWork} onValueChange={setRightToWork}>
                  <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C4942A]" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-3">
                <Label className="text-xs font-medium text-[#5A6B7F]">Address</Label>
                <Input className="border-[#D1D9E6] h-9 text-sm" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">City</Label>
                <Input className="border-[#D1D9E6] h-9 text-sm" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Postcode</Label>
                <Input className="border-[#D1D9E6] h-9 text-sm" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Professional Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C4942A]" /> Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="border-[#D1D9E6] text-sm min-h-[120px] resize-y" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Write a brief professional summary..." />
            <p className="text-[11px] text-[#5A6B7F] mt-1.5 text-right">{summary.length} characters</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#C4942A]" /> Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input className="border-[#D1D9E6] h-9 text-sm flex-1" placeholder="Add a skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <Button variant="outline" size="sm" className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white shrink-0" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} className="bg-[#F0F4F8] text-[#1A3A5C] hover:bg-[#F0F4F8] border border-[#D1D9E6] text-xs gap-1 pr-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-red-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && <p className="text-xs text-[#5A6B7F]">No skills added yet.</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Experience */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#C4942A]" /> Experience
              </CardTitle>
              <Button variant="outline" size="sm" className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs" onClick={addExperience}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id} className="relative p-4 bg-[#F7F9FC] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5A6B7F]">Experience #{idx + 1}</span>
                  {experience.length > 1 && (
                    <button onClick={() => removeExperience(exp.id)} className="text-[#5A6B7F] hover:text-red-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-[#5A6B7F]">Role / Job Title</Label>
                    <Input className="border-[#D1D9E6] h-9 text-sm" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="e.g. Staff Nurse" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-[#5A6B7F]">Employer</Label>
                    <Input className="border-[#D1D9E6] h-9 text-sm" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="e.g. NHS Trust" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-[#5A6B7F]">Start Date</Label>
                    <Input type="month" className="border-[#D1D9E6] h-9 text-sm" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-[#5A6B7F]">End Date</Label>
                    <Input type="month" className="border-[#D1D9E6] h-9 text-sm" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} />
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="rounded border-[#D1D9E6] accent-[#C4942A]" />
                      <span className="text-[11px] text-[#5A6B7F]">Currently working here</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium text-[#5A6B7F]">Description</Label>
                  <Textarea className="border-[#D1D9E6] text-sm min-h-[80px] resize-y" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="Describe your responsibilities..." />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Qualifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#C4942A]" /> Qualifications
              </CardTitle>
              <Button variant="outline" size="sm" className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs" onClick={addQualification}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {qualifications.map((qual) => (
              <div key={qual.id} className="flex gap-2 items-start">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                  <Input className="border-[#D1D9E6] h-9 text-sm" value={qual.name} onChange={(e) => updateQualification(qual.id, 'name', e.target.value)} placeholder="Qualification" />
                  <Input className="border-[#D1D9E6] h-9 text-sm" value={qual.institution} onChange={(e) => updateQualification(qual.id, 'institution', e.target.value)} placeholder="Institution" />
                  <div className="flex gap-2">
                    <Input className="border-[#D1D9E6] h-9 text-sm" value={qual.date} onChange={(e) => updateQualification(qual.id, 'date', e.target.value)} placeholder="Year" />
                    {qualifications.length > 1 && (
                      <button onClick={() => removeQualification(qual.id)} className="text-[#5A6B7F] hover:text-red-600 transition-colors mt-1.5">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#C4942A]" /> Job Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Preferred Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Salary Minimum</Label>
                <Input type="number" className="border-[#D1D9E6] h-9 text-sm" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Salary Maximum</Label>
                <Input type="number" className="border-[#D1D9E6] h-9 text-sm" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Work Mode</Label>
                <Select value={workMode} onValueChange={setWorkMode}>
                  <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#5A6B7F]">Availability</Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediately</SelectItem>
                    <SelectItem value="1-week">1 week</SelectItem>
                    <SelectItem value="2-weeks">2 weeks</SelectItem>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="3-months">3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-end pb-4">
        <Button className="bg-[#C4942A] hover:bg-[#b3851f] text-white" onClick={handleSave} disabled={saving}>
          {saving ? (
            <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
          ) : saved ? (
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved</span>
          ) : (
            <span className="inline-flex items-center gap-2"><Save className="w-4 h-4" /> Save Profile</span>
          )}
        </Button>
      </div>
    </div>
  )
}
