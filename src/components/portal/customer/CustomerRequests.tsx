'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Plus,
  ArrowLeft,
  ChevronRight,
  X,
  Send,
  Wrench,
  Droplets,
  Zap,
  Thermometer,
  DoorOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/store/app-store'

type ReqStatus = 'New' | 'In Review' | 'In Progress' | 'Resolved' | 'Closed'
type ReqPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
type ReqCategory = 'Plumbing' | 'Electrical' | 'Heating' | 'Security' | 'General' | 'Structural'

type FilterTab = 'All' | ReqStatus

interface TimelineEntry {
  status: ReqStatus
  date: string
  note: string
  completed: boolean
}

interface Request {
  id: string
  subject: string
  category: ReqCategory
  status: ReqStatus
  priority: ReqPriority
  createdDate: string
  updatedDate: string
  description: string
  timeline: TimelineEntry[]
}

const categoryIcons: Record<ReqCategory, React.ReactNode> = {
  Plumbing: <Droplets className="w-4 h-4" />,
  Electrical: <Zap className="w-4 h-4" />,
  Heating: <Thermometer className="w-4 h-4" />,
  Security: <DoorOpen className="w-4 h-4" />,
  General: <Wrench className="w-4 h-4" />,
  Structural: <AlertCircle className="w-4 h-4" />,
}

const statusColor: Record<ReqStatus, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'In Review': 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Resolved': 'bg-emerald-100 text-emerald-700',
  'Closed': 'bg-gray-100 text-gray-600',
}

const priorityColor: Record<ReqPriority, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-700',
  Urgent: 'bg-red-100 text-red-700',
}

const sampleRequests: Request[] = [
  {
    id: 'REQ-2024-0092',
    subject: 'Bathroom tap leaking continuously',
    category: 'Plumbing',
    status: 'In Progress',
    priority: 'High',
    createdDate: '15 Aug 2026',
    updatedDate: '18 Aug 2026',
    description: 'The cold water tap in the main bathroom has been leaking continuously for the past 3 days. It drips even when fully turned off, and the dripping has gotten worse. Water is pooling around the base of the tap. This is causing water wastage and potential damage to the basin area.',
    timeline: [
      { status: 'New', date: '15 Aug 2026', note: 'Request submitted', completed: true },
      { status: 'In Review', date: '16 Aug 2026', note: 'Reviewed by housing officer Sarah Mitchell', completed: true },
      { status: 'In Progress', date: '18 Aug 2026', note: 'Plumber assigned — visit scheduled for 20 Aug', completed: true },
      { status: 'Resolved', date: '', note: '', completed: false },
      { status: 'Closed', date: '', note: '', completed: false },
    ],
  },
  {
    id: 'REQ-2024-0091',
    subject: 'Kitchen light fixture flickering',
    category: 'Electrical',
    status: 'New',
    priority: 'Medium',
    createdDate: '17 Aug 2026',
    updatedDate: '17 Aug 2026',
    description: 'The main kitchen ceiling light has started flickering intermittently. It happens more frequently in the evenings. We have tried changing the bulb but the issue persists. Concerned it may be a wiring issue.',
    timeline: [
      { status: 'New', date: '17 Aug 2026', note: 'Request submitted', completed: true },
      { status: 'In Review', date: '', note: '', completed: false },
      { status: 'In Progress', date: '', note: '', completed: false },
      { status: 'Resolved', date: '', note: '', completed: false },
      { status: 'Closed', date: '', note: '', completed: false },
    ],
  },
  {
    id: 'REQ-2024-0089',
    subject: 'Boiler not heating properly',
    category: 'Heating',
    status: 'In Review',
    priority: 'Urgent',
    createdDate: '10 Aug 2026',
    updatedDate: '16 Aug 2026',
    description: 'The boiler is not maintaining consistent temperature. Hot water runs lukewarm after 5 minutes and the radiators in both bedrooms are cold. This has been an issue since last week and is getting worse. We have two children in the property.',
    timeline: [
      { status: 'New', date: '10 Aug 2026', note: 'Request submitted', completed: true },
      { status: 'In Review', date: '12 Aug 2026', note: 'Urgent priority flagged — safety check scheduled', completed: true },
      { status: 'In Progress', date: '', note: '', completed: false },
      { status: 'Resolved', date: '', note: '', completed: false },
      { status: 'Closed', date: '', note: '', completed: false },
    ],
  },
  {
    id: 'REQ-2024-0085',
    subject: 'Front door lock stiff to turn',
    category: 'Security',
    status: 'Resolved',
    priority: 'Medium',
    createdDate: '1 Aug 2026',
    updatedDate: '8 Aug 2026',
    description: 'The front door lock has become increasingly difficult to turn. Sometimes it takes multiple attempts to lock or unlock the door. This is a security concern as the door does not always lock properly on the first attempt.',
    timeline: [
      { status: 'New', date: '1 Aug 2026', note: 'Request submitted', completed: true },
      { status: 'In Review', date: '2 Aug 2026', note: 'Reviewed and locksmith assigned', completed: true },
      { status: 'In Progress', date: '4 Aug 2026', note: 'Lock mechanism replaced', completed: true },
      { status: 'Resolved', date: '7 Aug 2026', note: 'Lock replaced and tested — working correctly', completed: true },
      { status: 'Closed', date: '', note: '', completed: false },
    ],
  },
  {
    id: 'REQ-2024-0080',
    subject: 'Crack in bedroom ceiling',
    category: 'Structural',
    status: 'Closed',
    priority: 'Low',
    createdDate: '20 Jul 2026',
    updatedDate: '5 Aug 2026',
    description: 'A hairline crack has appeared in the second bedroom ceiling, approximately 60cm long. It does not appear to be growing but we wanted to report it for inspection.',
    timeline: [
      { status: 'New', date: '20 Jul 2026', note: 'Request submitted', completed: true },
      { status: 'In Review', date: '22 Jul 2026', note: 'Inspection booked', completed: true },
      { status: 'In Progress', date: '25 Jul 2026', note: 'Inspector visited — minor settling crack, no structural concern', completed: true },
      { status: 'Resolved', date: '1 Aug 2026', note: 'Cosmetic repair completed', completed: true },
      { status: 'Closed', date: '5 Aug 2026', note: 'Tenant confirmed satisfaction', completed: true },
    ],
  },
  {
    id: 'REQ-2024-0078',
    subject: 'Waste disposal not working',
    category: 'General',
    status: 'Closed',
    priority: 'Medium',
    createdDate: '15 Jul 2026',
    updatedDate: '22 Jul 2026',
    description: 'The kitchen waste disposal unit under the sink is making a humming noise but the blades are not spinning. It is jammed and will not turn on properly.',
    timeline: [
      { status: 'New', date: '15 Jul 2026', note: 'Request submitted', completed: true },
      { status: 'In Review', date: '16 Jul 2026', note: 'Reviewed', completed: true },
      { status: 'In Progress', date: '18 Jul 2026', note: 'Engineer visit scheduled', completed: true },
      { status: 'Resolved', date: '20 Jul 2026', note: 'Unit unjammed and serviced', completed: true },
      { status: 'Closed', date: '22 Jul 2026', note: 'Confirmed working', completed: true },
    ],
  },
]

const filterTabs: FilterTab[] = ['All', 'New', 'In Review', 'In Progress', 'Resolved', 'Closed']

function StatusTimeline({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <div className="space-y-0 pl-1">
      {timeline.map((entry, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full shrink-0 mt-1.5 ${
                entry.completed ? 'bg-[#C4942A]' : 'bg-[#D1D9E6]'
              }`}
            />
            {i < timeline.length - 1 && (
              <div
                className={`w-0.5 flex-1 min-h-[2rem] ${
                  entry.completed ? 'bg-[#C4942A]' : 'bg-[#D1D9E6]'
                }`}
              />
            )}
          </div>
          <div className="pb-6">
            <p className={`text-sm font-medium ${entry.completed ? 'text-[#0B1D33]' : 'text-[#5A6B7F]'}`}>
              {entry.status}
            </p>
            {entry.note && <p className="text-xs text-[#5A6B7F] mt-0.5">{entry.note}</p>}
            {entry.date && <p className="text-[10px] text-[#5A6B7F] mt-0.5">{entry.date}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  )
}

export default function CustomerRequests() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const navigate = useAppStore((s) => s.navigate)

  // New request form state
  const [formCategory, setFormCategory] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPriority, setFormPriority] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    if (activeTab === 'All') return sampleRequests
    return sampleRequests.filter((r) => r.status === activeTab)
  }, [activeTab])

  const handleSubmitRequest = () => {
    setNewRequestOpen(false)
    setFormCategory('')
    setFormSubject('')
    setFormDescription('')
    setFormPriority('')
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('customer-dashboard')}
            className="text-[#5A6B7F] hover:text-[#0B1D33]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Service Requests</h1>
            <p className="text-[#5A6B7F] mt-0.5">Track and manage your maintenance requests</p>
          </div>
        </div>
        <Button
          className="bg-[#C4942A] hover:bg-[#B3861F] text-white font-semibold shrink-0"
          onClick={() => setNewRequestOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Request</span>
        </Button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {filterTabs.map((tab) => {
          const count = tab === 'All'
            ? sampleRequests.length
            : sampleRequests.filter((r) => r.status === tab).length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-[#0B1D33] text-white'
                  : 'bg-[#F0F4F8] text-[#5A6B7F] hover:bg-[#D1D9E6]'
              }`}
            >
              {tab}
              <span className={`text-[10px] ${activeTab === tab ? 'bg-white/20' : 'bg-[#D1D9E6]'} px-1.5 py-0.5 rounded-full`}>
                {count}
              </span>
            </button>
          )
        })}
      </motion.div>

      {/* Request List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((req, i) => (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Card
                className="border-[#D1D9E6] hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedRequest(req)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C] shrink-0">
                      {categoryIcons[req.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0B1D33] truncate">{req.subject}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge className={`${statusColor[req.status]} border-0 text-[10px]`}>{req.status}</Badge>
                        <Badge className={`${priorityColor[req.priority]} border-0 text-[10px]`}>{req.priority}</Badge>
                        <span className="text-xs text-[#5A6B7F]">{req.id}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-xs text-[#5A6B7F]">{req.createdDate}</p>
                      <p className="text-[10px] text-[#5A6B7F] mt-0.5">Updated {req.updatedDate}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5A6B7F] shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${statusColor[selectedRequest.status]} border-0 text-xs`}>
                    {selectedRequest.status}
                  </Badge>
                  <Badge className={`${priorityColor[selectedRequest.priority]} border-0 text-xs`}>
                    {selectedRequest.priority} Priority
                  </Badge>
                  <Badge className="bg-[#F0F4F8] text-[#1A3A5C] border-0 text-xs gap-1">
                    {categoryIcons[selectedRequest.category]}
                    {selectedRequest.category}
                  </Badge>
                </div>
                <DialogTitle className="text-xl text-[#0B1D33] mt-2">{selectedRequest.subject}</DialogTitle>
                <DialogDescription>{selectedRequest.id} · Created {selectedRequest.createdDate}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-2">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-[#0B1D33] mb-2">Description</h4>
                  <p className="text-sm text-[#5A6B7F] leading-relaxed">{selectedRequest.description}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F7F9FC] rounded-lg p-3">
                    <p className="text-xs text-[#5A6B7F]">Created</p>
                    <p className="text-sm font-medium text-[#0B1D33]">{selectedRequest.createdDate}</p>
                  </div>
                  <div className="bg-[#F7F9FC] rounded-lg p-3">
                    <p className="text-xs text-[#5A6B7F]">Last Updated</p>
                    <p className="text-sm font-medium text-[#0B1D33]">{selectedRequest.updatedDate}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-[#0B1D33] mb-3">Status Timeline</h4>
                  <StatusTimeline timeline={selectedRequest.timeline} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Request Dialog */}
      <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0B1D33]">New Service Request</DialogTitle>
            <DialogDescription>Describe the issue so we can help resolve it quickly.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-[#0B1D33]">Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger className="w-full border-[#D1D9E6]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Heating">Heating</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Structural">Structural</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B1D33]">Subject</Label>
              <Input
                placeholder="Brief description of the issue"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B1D33]">Description</Label>
              <Textarea
                placeholder="Please provide as much detail as possible about the issue..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-[#0B1D33]">Priority</Label>
              <Select value={formPriority} onValueChange={setFormPriority}>
                <SelectTrigger className="w-full border-[#D1D9E6]">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setNewRequestOpen(false)} className="border-[#D1D9E6]">
              Cancel
            </Button>
            <Button
              className="bg-[#C4942A] hover:bg-[#B3861F] text-white font-semibold"
              onClick={handleSubmitRequest}
            >
              <Send className="w-4 h-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
