'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Briefcase,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  PoundSterling,
  Calendar,
  Monitor,
  Home,
  Wifi,
  Star,
  Heart,
  Share2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface Job {
  id: number
  title: string
  employer: string
  location: string
  salary: string
  type: string
  mode: string
  industry: string
  experience: string
  posted: string
  description: string
  requirements: string[]
  benefits: string[]
  closing: string
  reference: string
  contact: string
}

const allJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Staff Nurse - Intensive Care Unit',
    employer: 'Barts Health NHS Trust',
    location: 'London, EC1A 7BE',
    salary: '£38,000 - £44,000 per annum',
    type: 'Full-time',
    mode: 'On-site',
    industry: 'Healthcare',
    experience: 'Senior',
    posted: '2 days ago',
    description: 'We are seeking an experienced Senior Staff Nurse to join our busy Intensive Care Unit at The Royal London Hospital. You will be responsible for delivering high-quality care to critically ill patients, supporting junior staff, and contributing to service improvement initiatives.',
    requirements: ['Valid NMC registration', 'Minimum 3 years ICU experience', 'IV cannulation and central line care competency', 'BLS/ACLS certification', 'Excellent communication skills'],
    benefits: ['NHS Pension Scheme', '27 days annual leave + bank holidays', 'Cycle to work scheme', 'NHS discount programme', 'Career development opportunities'],
    closing: '15 August 2025',
    reference: 'BARTS-ICU-2025-089',
    contact: 'Sarah Thompson, Nurse Recruitment',
  },
  {
    id: 2,
    title: 'Nurse Practitioner - Primary Care',
    employer: "Guy's and St Thomas' NHS Foundation Trust",
    location: 'London, SE1 7EH',
    salary: '£42,000 - £50,000 per annum',
    type: 'Full-time',
    mode: 'Hybrid',
    industry: 'Healthcare',
    experience: 'Senior',
    posted: '3 days ago',
    description: 'An exciting opportunity has arisen for a Nurse Practitioner to work within our Primary Care Network. You will manage patient caseloads independently, conduct assessments, diagnose conditions, and prescribe treatments within your scope of practice.',
    requirements: ['Non-medical prescribing qualification', '5+ years post-registration experience', 'Independent prescriber registration', 'Experience in primary care or community setting', 'Master\'s degree preferred'],
    benefits: ['NHS Pension Scheme', 'Flexible working patterns', '33 days annual leave', 'CPD funding available', 'Relocation support'],
    closing: '20 August 2025',
    reference: 'GSTT-PC-2025-142',
    contact: 'David Okonkwo, Recruitment Lead',
  },
  {
    id: 3,
    title: 'Charge Nurse - Accident & Emergency',
    employer: 'Imperial College Healthcare NHS Trust',
    location: 'London, W2 1NY',
    salary: '£36,000 - £41,000 per annum',
    type: 'Full-time',
    mode: 'On-site',
    industry: 'Healthcare',
    experience: 'Mid',
    posted: '5 days ago',
    description: 'We are looking for a motivated Charge Nurse to lead our nursing team in the A&E department at St Mary\'s Hospital. This role involves overseeing patient flow, coordinating with multidisciplinary teams, and ensuring the highest standards of emergency care.',
    requirements: ['NMC registration (Adult nursing)', '2+ years A&E experience', 'Leadership or management qualification desirable', 'Triage assessment competency', 'Ability to work under pressure'],
    benefits: ['NHS Pension Scheme', '25 days annual leave + bank holidays', 'Season ticket loan', 'On-site childcare', 'Staff wellbeing programme'],
    closing: '22 August 2025',
    reference: 'ICHT-AE-2025-076',
    contact: 'Claire Redmond, Matron',
  },
  {
    id: 4,
    title: 'Community Mental Health Nurse',
    employer: 'South London and Maudsley NHS FT',
    location: 'London, SE5 8AZ',
    salary: '£34,000 - £40,000 per annum',
    type: 'Full-time',
    mode: 'Hybrid',
    industry: 'Healthcare',
    experience: 'Mid',
    posted: '1 week ago',
    description: 'Join our Community Mental Health Team providing specialist assessment and interventions for adults with severe and enduring mental health conditions. You will work autonomously in the community, managing a caseload and collaborating with GPs, social services, and voluntary organisations.',
    requirements: ['NMC registration (Mental Health nursing)', 'Community nursing experience preferred', 'Risk assessment and management skills', 'Full UK driving licence', 'Cognitive behavioural therapy skills desirable'],
    benefits: ['NHS Pension Scheme', '27 days annual leave', 'Flexible working options', 'Regular clinical supervision', 'Research and audit opportunities'],
    closing: '28 August 2025',
    reference: 'SLAM-CMH-2025-201',
    contact: 'Dr Patricia Mensah, Clinical Lead',
  },
  {
    id: 5,
    title: 'Healthcare Assistant - Ward Setting',
    employer: 'Royal Free London NHS FT',
    location: 'London, NW3 2QG',
    salary: '£22,000 - £26,000 per annum',
    type: 'Full-time',
    mode: 'On-site',
    industry: 'Healthcare',
    experience: 'Entry',
    posted: '1 day ago',
    description: 'We are recruiting Healthcare Assistants to join our medical and surgical wards. You will support registered nurses in delivering compassionate, person-centred care, assisting with personal care, observations, and maintaining a safe environment for patients.',
    requirements: ['NVQ Level 2 or 3 in Health and Social Care (or willing to work towards)', 'Good communication skills', 'Caring and compassionate nature', 'Ability to work shifts including nights and weekends', 'Previous care experience desirable'],
    benefits: ['NHS Pension Scheme', '27 days annual leave', 'In-house training and development', 'Apprenticeship opportunities', 'Staff recognition scheme'],
    closing: '10 August 2025',
    reference: 'RFL-HCA-2025-334',
    contact: 'Human Resources, Recruitment Team',
  },
  {
    id: 6,
    title: 'Theatre Nurse - Operating Department',
    employer: 'University College London Hospitals',
    location: 'London, NW1 2BU',
    salary: '£35,000 - £42,000 per annum',
    type: 'Full-time',
    mode: 'On-site',
    industry: 'Healthcare',
    experience: 'Junior',
    posted: '4 days ago',
    description: 'UCLH is seeking Theatre Nurses to join our operating department across a range of surgical specialties including orthopaedics, general surgery, and urology. You will scrub, circulate, and provide anaesthetic support in our state-of-the-art theatres.',
    requirements: ['NMC registration', 'Theatre or perioperative experience', 'Willingness to participate in on-call rotas', 'Team player with attention to detail', 'AFPP or equivalent qualification desirable'],
    benefits: ['NHS Pension Scheme', '27 days annual leave', 'On-call payments', 'Professional development budget', 'Staff health and wellbeing services'],
    closing: '18 August 2025',
    reference: 'UCLH-TN-2025-058',
    contact: 'Anna Kowalski, Theatre Manager',
  },
  {
    id: 7,
    title: 'District Nurse Team Lead',
    employer: 'King\'s College Hospital NHS FT',
    location: 'London, SE5 9RS',
    salary: '£40,000 - £47,000 per annum',
    type: 'Full-time',
    mode: 'On-site',
    industry: 'Healthcare',
    experience: 'Senior',
    posted: '6 days ago',
    description: 'We are looking for an experienced District Nurse to lead one of our community nursing teams in the Lambeth area. You will manage a complex caseload, supervise a team of community nurses and healthcare assistants, and ensure high-quality care delivery to patients in their own homes.',
    requirements: ['Specialist Practitioner Qualification in District Nursing', 'NMC registration', 'Leadership or supervisory experience', 'Community nursing experience essential', 'Car driver with access to a vehicle'],
    benefits: ['NHS Pension Scheme', '30 days annual leave', 'Car lease scheme', 'Professional development support', 'Leadership training programmes'],
    closing: '25 August 2025',
    reference: 'KCH-DN-2025-112',
    contact: 'Rebecca Adebayo, Head of Community Services',
  },
  {
    id: 8,
    title: 'Paediatric Staff Nurse',
    employer: 'Great Ormond Street Hospital',
    location: 'London, WC1N 3JH',
    salary: '£33,000 - £39,000 per annum',
    type: 'Full-time',
    mode: 'On-site',
    industry: 'Healthcare',
    experience: 'Junior',
    posted: '2 days ago',
    description: 'Great Ormond Street Hospital is looking for enthusiastic Paediatric Staff Nurses to join our medical and surgical wards. You will provide specialist nursing care to children and young people, supporting their families through what can be a difficult time.',
    requirements: ['NMC registration (Child branch)', 'Paediatric nursing experience preferred', 'Excellent interpersonal skills', 'Commitment to family-centred care', 'IV competency training will be provided'],
    benefits: ['NHS Pension Scheme', '27 days annual leave', 'Staff accommodation available', 'World-class training opportunities', 'Childcare voucher scheme'],
    closing: '12 August 2025',
    reference: 'GOSH-PSN-2025-087',
    contact: 'Nicola Pemberton, Nurse Recruitment',
  },
]

const ITEMS_PER_PAGE = 5

const typeBadge: Record<string, string> = {
  'Full-time': 'bg-blue-100 text-blue-700',
  'Part-time': 'bg-purple-100 text-purple-700',
  Contract: 'bg-amber-100 text-amber-700',
  Temporary: 'bg-orange-100 text-orange-700',
}

const modeIcon = (mode: string) => {
  if (mode === 'Remote') return <Wifi className="w-3.5 h-3.5 text-emerald-600" />
  if (mode === 'Hybrid') return <Monitor className="w-3.5 h-3.5 text-[#C4942A]" />
  return <Home className="w-3.5 h-3.5 text-[#5A6B7F]" />
}

export default function SeekerJobs() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState('recent')

  // Filters
  const [fIndustry, setFIndustry] = useState('all')
  const [fType, setFType] = useState('all')
  const [fExperience, setFExperience] = useState('all')
  const [fMode, setFMode] = useState('all')
  const [fSalaryMin, setFSalaryMin] = useState('')
  const [fSalaryMax, setFSalaryMax] = useState('')
  const [fDate, setFDate] = useState('all')

  const filteredJobs = useMemo(() => {
    let jobs = [...allJobs]

    if (keyword.trim()) {
      const kw = keyword.toLowerCase()
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.employer.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw)
      )
    }
    if (location.trim()) {
      const loc = location.toLowerCase()
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc))
    }
    if (fIndustry !== 'all') jobs = jobs.filter((j) => j.industry === fIndustry)
    if (fType !== 'all') jobs = jobs.filter((j) => j.type === fType)
    if (fExperience !== 'all') jobs = jobs.filter((j) => j.experience === fExperience)
    if (fMode !== 'all') jobs = jobs.filter((j) => j.mode === fMode)
    if (fSalaryMin) {
      const min = parseInt(fSalaryMin.replace(/[^0-9]/g, ''))
      if (!isNaN(min)) {
        jobs = jobs.filter((j) => {
          const match = j.salary.match(/£([0-9,]+)/)
          return match ? parseInt(match[1].replace(',', '')) >= min : true
        })
      }
    }
    if (fSalaryMax) {
      const max = parseInt(fSalaryMax.replace(/[^0-9]/g, ''))
      if (!isNaN(max)) {
        jobs = jobs.filter((j) => {
          const matches = j.salary.match(/£([0-9,]+).*?£([0-9,]+)/)
          if (matches) {
            return parseInt(matches[2].replace(',', '')) <= max
          }
          return true
        })
      }
    }
    if (fDate !== 'all') {
      const now = Date.now()
      const day = 86400000
      jobs = jobs.filter((j) => {
        const days = { today: 1, week: 7, month: 30 }
        const d = days[fDate as keyof typeof days] || 0
        const postedDays = j.posted.match(/(\d+)/)
        const pd = postedDays ? parseInt(postedDays[1]) : 1
        const unit = j.posted.includes('week') ? 7 : 1
        return pd * unit <= d
      })
    }

    if (sort === 'recent') {
      jobs.sort((a, b) => {
        const da = a.posted.match(/(\d+)/)?.[1] || '0'
        const db = b.posted.match(/(\d+)/)?.[1] || '0'
        const ua = a.posted.includes('week') ? 7 : 1
        const ub = b.posted.includes('week') ? 7 : 1
        return parseInt(da) * ua - parseInt(db) * ub
      })
    } else if (sort === 'salary-high') {
      jobs.sort((a, b) => {
        const sa = parseInt((a.salary.match(/£([0-9,]+).*?£([0-9,]+)/)?.[2] || a.salary.match(/£([0-9,]+)/)?.[1] || '0').replace(',', ''))
        const sb = parseInt((b.salary.match(/£([0-9,]+).*?£([0-9,]+)/)?.[2] || b.salary.match(/£([0-9,]+)/)?.[1] || '0').replace(',', ''))
        return sb - sa
      })
    }

    return jobs
  }, [keyword, location, fIndustry, fType, fExperience, fMode, fSalaryMin, fSalaryMax, fDate, sort])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE))
  const pagedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const clearFilters = () => {
    setFIndustry('all')
    setFType('all')
    setFExperience('all')
    setFMode('all')
    setFSalaryMin('')
    setFSalaryMax('')
    setFDate('all')
    setCurrentPage(1)
  }

  const toggleSave = (id: number) => {
    setSavedJobs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Find Jobs</h1>
        <p className="text-[#5A6B7F] mt-1">Browse vacancies tailored to your skills and experience.</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-[#D1D9E6]">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
                <Input
                  placeholder="Job title, keyword, or employer"
                  className="pl-10 border-[#D1D9E6]"
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1) }}
                />
              </div>
              <div className="relative flex-1 sm:max-w-xs">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
                <Input
                  placeholder="Location"
                  className="pl-10 border-[#D1D9E6]"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setCurrentPage(1) }}
                />
              </div>
              <Button
                className="bg-[#C4942A] hover:bg-[#b3851f] text-white shrink-0"
                onClick={() => setCurrentPage(1)}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters Toggle + Count + Sort */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#0B1D33]" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {(fIndustry !== 'all' || fType !== 'all' || fExperience !== 'all' || fMode !== 'all' || fDate !== 'all' || fSalaryMin || fSalaryMax) && (
              <span className="ml-2 w-5 h-5 rounded-full bg-[#C4942A] text-white text-[10px] flex items-center justify-center">!</span>
            )}
          </Button>
          <p className="text-sm text-[#5A6B7F]">
            <span className="font-semibold text-[#0B1D33]">{filteredJobs.length}</span> jobs found
          </p>
        </div>
        <div className="flex items-center gap-2">
 <Label className="text-xs text-[#5A6B7F] whitespace-nowrap">Sort by:</Label>
          <Select value={sort} onValueChange={(v) => setSort(v)}>
            <SelectTrigger className="w-40 border-[#D1D9E6] text-sm h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Salary: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <Card className="border-[#D1D9E6]">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0B1D33]">Refine your search</p>
                  <Button variant="ghost" size="sm" className="text-xs text-[#5A6B7F]" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#5A6B7F]">Industry</Label>
                    <Select value={fIndustry} onValueChange={(v) => { setFIndustry(v); setCurrentPage(1) }}>
                      <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#5A6B7F]">Job Type</Label>
                    <Select value={fType} onValueChange={(v) => { setFType(v); setCurrentPage(1) }}>
                      <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#5A6B7F]">Experience Level</Label>
                    <Select value={fExperience} onValueChange={(v) => { setFExperience(v); setCurrentPage(1) }}>
                      <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Entry">Entry</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid">Mid</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#5A6B7F]">Work Mode</Label>
                    <Select value={fMode} onValueChange={(v) => { setFMode(v); setCurrentPage(1) }}>
                      <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#5A6B7F]">Date Posted</Label>
                    <Select value={fDate} onValueChange={(v) => { setFDate(v); setCurrentPage(1) }}>
                      <SelectTrigger className="border-[#D1D9E6] h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#5A6B7F]">Salary Range (£)</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Min" className="border-[#D1D9E6] h-9 text-sm" value={fSalaryMin} onChange={(e) => setFSalaryMin(e.target.value)} />
                      <Input placeholder="Max" className="border-[#D1D9E6] h-9 text-sm" value={fSalaryMax} onChange={(e) => setFSalaryMax(e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {pagedJobs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-[#D1D9E6]">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-10 h-10 text-[#D1D9E6] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#0B1D33]">No jobs found</p>
                  <p className="text-xs text-[#5A6B7F] mt-1">Try adjusting your search criteria or filters.</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            pagedJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-[#0B1D33] cursor-pointer hover:text-[#1A3A5C] transition-colors" onClick={() => setSelectedJob(job)}>
                            {job.title}
                          </h3>
                        </div>
                        <p className="text-sm text-[#5A6B7F] mt-1 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" /> {job.employer}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                          <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                            <PoundSterling className="w-3 h-3" /> {job.salary}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                            {modeIcon(job.mode)} {job.mode}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-[#5A6B7F]">
                            <Clock className="w-3 h-3" /> {job.posted}
                          </span>
                        </div>
                        <p className="text-sm text-[#5A6B7F] mt-2 line-clamp-2">{job.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge className={`${typeBadge[job.type] || 'bg-gray-100 text-gray-700'} hover:${typeBadge[job.type] || 'bg-gray-100'} border-0 text-[11px]`}>
                            {job.type}
                          </Badge>
                          <Badge className="bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#F0F4F8] border-0 text-[11px]">
                            {job.industry}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#0B1D33] text-xs" onClick={() => setSelectedJob(job)}>
                          View Job
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => toggleSave(job.id)}>
                          <Heart className={`w-4 h-4 mr-1 ${savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : 'text-[#5A6B7F]'}`} />
                          {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="border-[#D1D9E6]" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              className={
                currentPage === page
                  ? 'bg-[#C4942A] hover:bg-[#b3851f] text-white border-[#C4942A]'
                  : 'border-[#D1D9E6] text-[#0B1D33]'
              }
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="border-[#D1D9E6]" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
          <ScrollArea className="max-h-[85vh]">
            {selectedJob && (
              <div className="p-6 space-y-5">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-[#0B1D33] leading-snug">{selectedJob.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                  <p className="text-sm text-[#5A6B7F] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> {selectedJob.employer}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="flex items-center gap-1 text-sm text-[#5A6B7F]">
                      <MapPin className="w-3.5 h-3.5" /> {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-[#5A6B7F]">
                      <PoundSterling className="w-3.5 h-3.5" /> {selectedJob.salary}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-[#5A6B7F]">
                      {modeIcon(selectedJob.mode)} {selectedJob.mode}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge className={`${typeBadge[selectedJob.type] || 'bg-gray-100 text-gray-700'} border-0 text-xs`}>{selectedJob.type}</Badge>
                    <Badge className="bg-[#F0F4F8] text-[#5A6B7F] border-0 text-xs">{selectedJob.industry}</Badge>
                    <Badge className="bg-[#F0F4F8] text-[#5A6B7F] border-0 text-xs">{selectedJob.experience} level</Badge>
                    <Badge className="bg-[#F0F4F8] text-[#5A6B7F] border-0 text-xs">{selectedJob.posted}</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold text-[#0B1D33] mb-2">About the Role</h4>
                  <p className="text-sm text-[#5A6B7F] leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#0B1D33] mb-2">Requirements</h4>
                  <ul className="space-y-1.5">
                    {selectedJob.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-[#5A6B7F]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4942A] mt-1.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#0B1D33] mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-1.5 bg-[#F7F9FC] rounded-md px-2.5 py-1.5">
                        <Star className="w-3 h-3 text-[#C4942A]" />
                        <span className="text-xs text-[#0B1D33]">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-[#5A6B7F]">
                    <Calendar className="w-4 h-4 text-[#C4942A]" />
                    <span>Closing date: <span className="text-[#0B1D33] font-medium">{selectedJob.closing}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5A6B7F]">
                    <Briefcase className="w-4 h-4 text-[#C4942A]" />
                    <span>Ref: <span className="text-[#0B1D33] font-medium">{selectedJob.reference}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5A6B7F]">
                    <Building2 className="w-4 h-4 text-[#C4942A]" />
                    <span>Contact: <span className="text-[#0B1D33] font-medium">{selectedJob.contact}</span></span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="bg-[#C4942A] hover:bg-[#b3851f] text-white flex-1">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="border-[#D1D9E6] text-[#0B1D33]">
                    <Heart className={`w-4 h-4 mr-2 ${savedJobs.has(selectedJob.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {savedJobs.has(selectedJob.id) ? 'Saved' : 'Save Job'}
                  </Button>
                  <Button variant="outline" className="border-[#D1D9E6] text-[#0B1D33]">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
