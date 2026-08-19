'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  Star,
  Eye,
  X,
  Download,
  MessageSquare,
  UserCheck,
  Briefcase,
  GraduationCap,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppStore } from '@/store/app-store'

interface Candidate {
  id: string
  name: string
  title: string
  location: string
  skills: string[]
  matchScore: number
  availability: string
  experience: string
  qualifications: string[]
  summary: string
  recentRole: string
  rightToWork: string
  dbs: string
}

const candidates: Candidate[] = [
  {
    id: 'C-001', name: 'Aisha Patel', title: 'Staff Nurse – ICU', location: 'London, UK',
    skills: ['ICU Nursing', 'Ventilator Care', 'BLS/ACLS', 'Sepsis Management'],
    matchScore: 94, availability: 'Immediately', experience: '5 years',
    qualifications: ['BSc Nursing (Hons)', 'NMC Registered', 'ICU Certificate'],
    summary: 'Highly skilled ICU nurse with extensive experience in critical care, ventilator management, and multi-organ support. Proven track record in high-pressure NHS environments.',
    recentRole: 'ICU Staff Nurse at Guy\'s and St Thomas\' NHS FT', rightToWork: 'Indefinite Leave to Remain', dbs: 'Enhanced (May 2026)',
  },
  {
    id: 'C-002', name: 'James Okafor', title: 'Senior Physiotherapist', location: 'Manchester, UK',
    skills: ['MSK Physiotherapy', 'Rehabilitation', 'Acupuncture', 'Pilates'],
    matchScore: 87, availability: '2 weeks notice', experience: '8 years',
    qualifications: ['MSc Physiotherapy', 'HCPC Registered', 'MACP Member'],
    summary: 'Senior physiotherapist specialising in musculoskeletal conditions with a keen interest in occupational health and return-to-work programmes.',
    recentRole: 'Senior Physiotherapist at Manchester University NHS FT', rightToWork: 'British Citizen', dbs: 'Enhanced (Jan 2026)',
  },
  {
    id: 'C-003', name: 'Emma Worthington', title: 'Radiographer', location: 'Birmingham, UK',
    skills: ['Diagnostic Imaging', 'CT Scanning', 'MRI', 'Radiation Safety'],
    matchScore: 91, availability: '1 month notice', experience: '6 years',
    qualifications: ['BSc Diagnostic Radiography', 'HCPC Registered'],
    summary: 'Experienced diagnostic radiographer competent in CT and MRI. Committed to patient safety and high-quality imaging standards within the NHS.',
    recentRole: 'Radiographer at University Hospitals Birmingham NHS FT', rightToWork: 'British Citizen', dbs: 'Standard (Mar 2026)',
  },
  {
    id: 'C-004', name: 'Kwame Asante', title: 'Mental Health Nurse', location: 'Leeds, UK',
    skills: ['Crisis Intervention', 'CBT', 'Risk Assessment', 'Medication Management'],
    matchScore: 82, availability: 'Immediately', experience: '4 years',
    qualifications: ['BSc Mental Health Nursing', 'NMC Registered', 'CBT Certificate'],
    summary: 'Dedicated mental health nurse with experience in acute inpatient settings and community crisis teams. Skilled in de-escalation and therapeutic engagement.',
    recentRole: 'Mental Health Nurse at Leeds and York Partnership NHS FT', rightToWork: 'Skilled Worker Visa', dbs: 'Enhanced (Jun 2026)',
  },
  {
    id: 'C-005', name: 'Sophie Chambers', title: 'Occupational Therapist', location: 'Bristol, UK',
    skills: ['Neuro Rehab', 'Paediatric OT', 'Home Assessments', 'Splinting'],
    matchScore: 78, availability: '1 week notice', experience: '3 years',
    qualifications: ['BSc Occupational Therapy', 'HCPC Registered'],
    summary: 'Occupational therapist with a broad clinical background spanning neuro-rehabilitation and community paediatric services. Adaptable and patient-focused.',
    recentRole: 'Occupational Therapist at North Bristol NHS Trust', rightToWork: 'British Citizen', dbs: 'Enhanced (Apr 2026)',
  },
  {
    id: 'C-006', name: 'Raj Mehta', title: 'Pharmacist', location: 'London, UK',
    skills: ['Clinical Pharmacy', 'Medicines Management', 'Aseptic Compounding', 'Audit'],
    matchScore: 85, availability: '1 month notice', experience: '7 years',
    qualifications: ['MPharm', 'GPhC Registered', 'Clinical Diploma'],
    summary: 'Clinical pharmacist with expertise in medicines optimisation, antimicrobial stewardship, and ward-based pharmaceutical care across acute and community sectors.',
    recentRole: 'Clinical Pharmacist at Barts Health NHS Trust', rightToWork: 'Indefinite Leave to Remain', dbs: 'Standard (Feb 2026)',
  },
]

const matchColor = (score: number) => {
  if (score >= 90) return 'text-emerald-600 bg-emerald-50'
  if (score >= 80) return 'text-[#C4942A] bg-[#C4942A]/10'
  return 'text-[#5A6B7F] bg-gray-100'
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}</div>
    </div>
  )
}

export default function EmployerCandidates() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('all')
  const [expFilter, setExpFilter] = useState('all')
  const [availFilter, setAvailFilter] = useState('all')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchSkill = skillFilter === 'all' || c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))
    const matchExp = expFilter === 'all' || c.experience === expFilter
    const matchAvail = availFilter === 'all' || c.availability === availFilter
    return matchSearch && matchSkill && matchExp && matchAvail
  })

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Candidates</h1>
        <p className="text-[#5A6B7F] mt-0.5">Browse and manage candidate profiles</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
          <Input
            placeholder="Search by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
          />
        </div>
        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full sm:w-40 border-[#D1D9E6]">
            <SelectValue placeholder="Skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            <SelectItem value="ICU">ICU</SelectItem>
            <SelectItem value="Physio">Physiotherapy</SelectItem>
            <SelectItem value="Mental">Mental Health</SelectItem>
            <SelectItem value="Rehab">Rehabilitation</SelectItem>
            <SelectItem value="Pharmacy">Pharmacy</SelectItem>
          </SelectContent>
        </Select>
        <Select value={expFilter} onValueChange={setExpFilter}>
          <SelectTrigger className="w-full sm:w-40 border-[#D1D9E6]">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Experience</SelectItem>
            <SelectItem value="3 years">3+ years</SelectItem>
            <SelectItem value="5 years">5+ years</SelectItem>
            <SelectItem value="8 years">8+ years</SelectItem>
          </SelectContent>
        </Select>
        <Select value={availFilter} onValueChange={setAvailFilter}>
          <SelectTrigger className="w-full sm:w-44 border-[#D1D9E6]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availability</SelectItem>
            <SelectItem value="Immediately">Immediately</SelectItem>
            <SelectItem value="1 week notice">1 week</SelectItem>
            <SelectItem value="2 weeks notice">2 weeks</SelectItem>
            <SelectItem value="1 month notice">1 month</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Candidate Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow h-full flex flex-col">
                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-11 h-11 bg-[#1A3A5C] text-white shrink-0">
                      <AvatarFallback className="text-xs font-semibold">{c.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#0B1D33] text-sm truncate">{c.name}</h3>
                      <p className="text-xs text-[#5A6B7F]">{c.title}</p>
                      <p className="text-xs text-[#5A6B7F] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {c.location}
                      </p>
                    </div>
                    <div className={`shrink-0 px-2 py-1 rounded-lg text-xs font-bold ${matchColor(c.matchScore)}`}>
                      {c.matchScore}%
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C] text-[10px] font-medium">
                        {s}
                      </Badge>
                    ))}
                    {c.skills.length > 4 && (
                      <Badge variant="secondary" className="bg-gray-100 text-[#5A6B7F] text-[10px]">
                        +{c.skills.length - 4}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-auto pt-3">
                    <Button
                      variant="outline"
                      className="w-full border-[#D1D9E6] text-[#1A3A5C] hover:bg-[#F0F4F8] text-sm"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#5A6B7F]">
          <p className="text-lg font-medium">No candidates found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#0B1D33] flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-[#1A3A5C] text-white">
                    <AvatarFallback className="text-sm font-semibold">{selectedCandidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {selectedCandidate.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C]">{selectedCandidate.title}</Badge>
                  <span className="text-[#5A6B7F] flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selectedCandidate.location}</span>
                  <span className={`ml-auto px-2.5 py-1 rounded-lg text-sm font-bold ${matchColor(selectedCandidate.matchScore)}`}>
                    <Star className="w-3.5 h-3.5 inline mr-1" />{selectedCandidate.matchScore}% Match
                  </span>
                </div>

                <p className="text-sm text-[#5A6B7F] leading-relaxed">{selectedCandidate.summary}</p>

                <Separator className="bg-[#D1D9E6]" />

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#0B1D33] flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#C4942A]" /> Experience</h4>
                    <p className="text-[#5A6B7F]">{selectedCandidate.experience} in healthcare</p>
                    <p className="text-[#5A6B7F]">{selectedCandidate.recentRole}</p>
                    <p className="text-[#5A6B7F]">Available: <span className="font-medium text-[#0B1D33]">{selectedCandidate.availability}</span></p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#0B1D33] flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#C4942A]" /> Qualifications</h4>
                    <ul className="space-y-1">
                      {selectedCandidate.qualifications.map((q) => (
                        <li key={q} className="text-[#5A6B7F]">• {q}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#0B1D33] text-sm mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="bg-[#F0F4F8] text-[#1A3A5C]">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#F7F9FC] rounded-lg p-3">
                    <p className="text-xs text-[#5A6B7F]">Right to Work</p>
                    <p className="font-medium text-[#0B1D33]">{selectedCandidate.rightToWork}</p>
                  </div>
                  <div className="bg-[#F7F9FC] rounded-lg p-3">
                    <p className="text-xs text-[#5A6B7F]">DBS Check</p>
                    <p className="font-medium text-[#0B1D33]">{selectedCandidate.dbs}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white flex-1 sm:flex-none">
                    <UserCheck className="w-4 h-4 mr-2" /> Shortlist
                  </Button>
                  <Button variant="outline" className="border-[#D1D9E6] text-[#1A3A5C] hover:bg-[#F0F4F8] flex-1 sm:flex-none">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                  <Button variant="outline" className="border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F0F4F8] flex-1 sm:flex-none">
                    <Download className="w-4 h-4 mr-2" /> Download CV
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
