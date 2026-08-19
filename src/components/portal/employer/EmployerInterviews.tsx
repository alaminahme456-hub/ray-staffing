'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  List,
  Video,
  Phone,
  MapPin,
  Clock,
  Plus,
  ExternalLink,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
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
import { useAppStore } from '@/store/app-store'

interface Interview {
  id: string
  candidate: string
  job: string
  date: string
  time: string
  duration: string
  type: 'Phone' | 'Video' | 'In-person'
  status: 'Scheduled' | 'Completed' | 'Cancelled'
  location: string
  notes?: string
}

const interviews: Interview[] = [
  { id: 'I-001', candidate: 'Emma Worthington', job: 'Radiographer', date: '20 Aug 2026', time: '10:00 AM', duration: '45 min', type: 'Video', status: 'Scheduled', location: 'Microsoft Teams – link sent via email' },
  { id: 'I-002', candidate: 'Kwame Asante', job: 'Mental Health Nurse', date: '20 Aug 2026', time: '2:00 PM', duration: '30 min', type: 'Phone', status: 'Scheduled', location: '07700 900 123' },
  { id: 'I-003', candidate: 'Aisha Patel', job: 'Staff Nurse – ICU', date: '21 Aug 2026', time: '11:30 AM', duration: '60 min', type: 'In-person', status: 'Scheduled', location: 'Barts Health, Royal London Hospital, Interview Room 4B' },
  { id: 'I-004', candidate: 'James Okafor', job: 'Senior Physiotherapist', date: '15 Aug 2026', time: '9:00 AM', duration: '45 min', type: 'Video', status: 'Completed', location: 'Zoom Meeting' },
  { id: 'I-005', candidate: 'Raj Mehta', job: 'Staff Nurse – ICU', date: '12 Aug 2026', time: '3:00 PM', duration: '30 min', type: 'Phone', status: 'Cancelled', location: 'N/A' },
]

const typeIcon = (type: string) => {
  switch (type) {
    case 'Video': return <Video className="w-4 h-4" />
    case 'Phone': return <Phone className="w-4 h-4" />
    default: return <MapPin className="w-4 h-4" />
  }
}

const typeColor: Record<string, string> = {
  Video: 'bg-purple-100 text-purple-700',
  Phone: 'bg-blue-100 text-blue-700',
  'In-person': 'bg-emerald-100 text-emerald-700',
}

const statusColor: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
}

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
    </div>
  )
}

export default function EmployerInterviews() {
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [showSchedule, setShowSchedule] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackInterview, setFeedbackInterview] = useState<Interview | null>(null)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackRecommend, setFeedbackRecommend] = useState('')
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const scheduled = interviews.filter(i => i.status === 'Scheduled')
  const completed = interviews.filter(i => i.status === 'Completed')

  const openFeedback = (intv: Interview) => {
    setFeedbackInterview(intv)
    setShowFeedback(true)
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Interviews</h1>
          <p className="text-[#5A6B7F] mt-0.5">Schedule and manage candidate interviews</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#F0F4F8] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white shadow text-[#0B1D33]' : 'text-[#5A6B7F] hover:text-[#0B1D33]'
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white shadow text-[#0B1D33]' : 'text-[#5A6B7F] hover:text-[#0B1D33]'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Calendar
            </button>
          </div>
          <Button
            className="bg-[#C4942A] hover:bg-[#B3861F] text-white"
            onClick={() => setShowSchedule(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> Schedule
          </Button>
        </div>
      </motion.div>

      {viewMode === 'list' ? (
        <div className="space-y-5">
          {/* Scheduled */}
          {scheduled.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-sm font-semibold text-[#5A6B7F] uppercase tracking-wider mb-3">Upcoming ({scheduled.length})</h2>
              <div className="space-y-3">
                {scheduled.map((intv, i) => (
                  <motion.div
                    key={intv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.04 }}
                  >
                    <Card className="border-[#D1D9E6] hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-[#0B1D33] text-sm">{intv.candidate}</h3>
                              <Badge variant="secondary" className={typeColor[intv.type]}>
                                {typeIcon(intv.type)} {intv.type}
                              </Badge>
                              <Badge variant="secondary" className={statusColor[intv.status]}>{intv.status}</Badge>
                            </div>
                            <p className="text-xs text-[#5A6B7F] mt-1">{intv.job}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#5A6B7F]">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{intv.date} · {intv.time}</span>
                              <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{intv.duration}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{intv.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {intv.type === 'Video' && (
                              <Button size="sm" className="bg-[#C4942A] hover:bg-[#B3861F] text-white text-xs">
                                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Join
                              </Button>
                            )}
                            {intv.type === 'In-person' && (
                              <Button size="sm" variant="outline" className="border-[#D1D9E6] text-[#1A3A5C] text-xs">
                                <MapPin className="w-3.5 h-3.5 mr-1" /> Directions
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="border-[#D1D9E6] text-[#1A3A5C] text-xs">
                              <MessageSquare className="w-3.5 h-3.5 mr-1" /> Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="text-sm font-semibold text-[#5A6B7F] uppercase tracking-wider mb-3">Completed ({completed.length})</h2>
              <div className="space-y-3">
                {completed.map((intv) => (
                  <Card key={intv.id} className="border-[#D1D9E6]">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-[#0B1D33] text-sm">{intv.candidate}</h3>
                            <Badge variant="secondary" className={statusColor[intv.status]}>{intv.status}</Badge>
                          </div>
                          <p className="text-xs text-[#5A6B7F] mt-1">{intv.job} · {intv.date} at {intv.time}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#D1D9E6] text-[#1A3A5C] text-xs"
                          onClick={() => openFeedback(intv)}
                        >
                          <Star className="w-3.5 h-3.5 mr-1" /> Leave Feedback
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cancelled */}
          {interviews.filter(i => i.status === 'Cancelled').length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="text-sm font-semibold text-[#5A6B7F] uppercase tracking-wider mb-3">Cancelled</h2>
              <div className="space-y-3">
                {interviews.filter(i => i.status === 'Cancelled').map((intv) => (
                  <Card key={intv.id} className="border-[#D1D9E6] opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#0B1D33] text-sm line-through">{intv.candidate}</h3>
                            <Badge variant="secondary" className={statusColor.Cancelled}>{intv.status}</Badge>
                          </div>
                          <p className="text-xs text-[#5A6B7F] mt-1">{intv.job} · {intv.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Calendar View - Simple monthly view */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-[#D1D9E6]">
            <CardHeader>
              <CardTitle className="text-base text-[#0B1D33]">August 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-px bg-[#D1D9E6] rounded-lg overflow-hidden">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <div key={d} className="bg-[#F7F9FC] p-2 text-center text-xs font-medium text-[#5A6B7F]">{d}</div>
                ))}
                {Array.from({ length: 6 }).map((_, week) => (
                  Array.from({ length: 7 }).map((_, day) => {
                    const dayNum = week * 7 + day + 1
                    if (dayNum > 31) return <div key={`${week}-${day}`} className="bg-white p-2 min-h-[60px]" />
                    const hasInterview = interviews.some(i => {
                      const d = parseInt(i.date.split(' ')[0])
                      return d === dayNum && i.status === 'Scheduled'
                    })
                    return (
                      <div key={`${week}-${day}`} className={`bg-white p-2 min-h-[60px] ${dayNum === 20 || dayNum === 21 ? 'bg-[#C4942A]/5' : ''}`}>
                        <span className={`text-xs ${dayNum === 20 || dayNum === 21 ? 'font-bold text-[#C4942A]' : 'text-[#5A6B7F]'}`}>{dayNum}</span>
                        {hasInterview && (
                          <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#C4942A] mx-auto" />
                        )}
                      </div>
                    )
                  })
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Schedule Interview Dialog */}
      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#C4942A]" /> Schedule Interview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Candidate *</Label>
              <Select>
                <SelectTrigger className="border-[#D1D9E6]"><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">Aisha Patel</SelectItem>
                  <SelectItem value="c2">Emma Worthington</SelectItem>
                  <SelectItem value="c3">Kwame Asante</SelectItem>
                  <SelectItem value="c4">Sophie Chambers</SelectItem>
                  <SelectItem value="c5">Raj Mehta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Job *</Label>
              <Select>
                <SelectTrigger className="border-[#D1D9E6]"><SelectValue placeholder="Select job" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Staff Nurse – ICU</SelectItem>
                  <SelectItem value="v2">Senior Physiotherapist</SelectItem>
                  <SelectItem value="v3">Radiographer</SelectItem>
                  <SelectItem value="v4">Mental Health Nurse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select>
                  <SelectTrigger className="border-[#D1D9E6]"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="inperson">In-person</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration *</Label>
                <Select>
                  <SelectTrigger className="border-[#D1D9E6]"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input type="date" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
              <div className="space-y-2">
                <Label>Time *</Label>
                <Input type="time" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location / Meeting Link *</Label>
              <Input placeholder="e.g. Zoom link, room number, phone number" className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Any additional notes for the interviewer or candidate..." rows={3} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowSchedule(false)}>Cancel</Button>
              <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">Schedule Interview</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-lg border-[#D1D9E6]">
          <DialogHeader>
            <DialogTitle className="text-[#0B1D33]">Interview Feedback</DialogTitle>
          </DialogHeader>
          {feedbackInterview && (
            <div className="space-y-5 pt-2">
              <div className="bg-[#F7F9FC] rounded-lg p-3 text-sm">
                <p className="font-medium text-[#0B1D33]">{feedbackInterview.candidate}</p>
                <p className="text-xs text-[#5A6B7F]">{feedbackInterview.job} · {feedbackInterview.date} at {feedbackInterview.time}</p>
              </div>

              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      onClick={() => setFeedbackRating(n)}
                      className="w-10 h-10 rounded-lg border border-[#D1D9E6] flex items-center justify-center text-sm font-medium transition-colors hover:bg-[#F0F4F8]"
                      style={feedbackRating >= n ? { backgroundColor: '#C4942A', color: 'white', borderColor: '#C4942A' } : {}}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Strengths</Label>
                <Textarea placeholder="What impressed you about this candidate?" rows={2} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>

              <div className="space-y-2">
                <Label>Concerns</Label>
                <Textarea placeholder="Any areas of concern or further questions?" rows={2} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>

              <div className="space-y-2">
                <Label>Recommendation *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Hire', 'Maybe', 'No Hire'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFeedbackRecommend(opt)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        feedbackRecommend === opt
                          ? opt === 'Hire' ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                            : opt === 'No Hire' ? 'bg-red-100 border-red-300 text-red-700'
                            : 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F7F9FC]'
                      }`}
                    >
                      {opt === 'Hire' && <CheckCircle2 className="w-4 h-4" />}
                      {opt === 'Maybe' && <MinusCircle className="w-4 h-4" />}
                      {opt === 'No Hire' && <XCircle className="w-4 h-4" />}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea placeholder="Any other comments..." rows={2} className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" className="border-[#D1D9E6]" onClick={() => setShowFeedback(false)}>Cancel</Button>
                <Button className="bg-[#C4942A] hover:bg-[#B3861F] text-white">Submit Feedback</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
