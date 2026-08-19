'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  UserCheck,
  CalendarCheck,
  Briefcase,
  MessageSquare,
  CheckCheck,
  Circle,
  Award,
  Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Notification {
  id: number
  type: 'application_update' | 'interview' | 'job_alert' | 'message'
  title: string
  content: string
  time: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'interview',
    title: 'Interview Scheduled',
    content: 'Your panel interview for Charge Nurse at Imperial College Healthcare has been scheduled for 28th July 2025 at 10:00. Please confirm your attendance.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'application_update',
    title: 'Application Shortlisted',
    content: 'Congratulations! Your application for Senior Staff Nurse - ICU at Barts Health NHS Trust has been shortlisted. The hiring manager will review your profile.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'job_alert',
    title: 'New Job Match',
    content: 'A new vacancy matching your profile has been posted: Senior Staff Nurse - Cardiac Catheter Lab at Royal Brompton Hospital. 92% match.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 4,
    type: 'application_update',
    title: 'Offer Received',
    content: 'You have received a conditional offer for Nurse Practitioner - Primary Care at Guy\'s and St Thomas\' NHS Foundation Trust (£45,000 p.a.). Please respond by 10th August.',
    time: '2 days ago',
    read: false,
  },
  {
    id: 5,
    type: 'message',
    title: 'New Message from Recruiter',
    content: 'Sarah Thompson from Barts Health has sent you a message regarding your application for the ICU Staff Nurse position.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 6,
    type: 'job_alert',
    title: 'New Job Match',
    content: 'A new vacancy matching your profile: Clinical Educator Nurse at University College London Hospitals. 87% match.',
    time: '4 days ago',
    read: true,
  },
  {
    id: 7,
    type: 'application_update',
    title: 'Application Acknowledged',
    content: 'Your application for Community Mental Health Nurse at South London and Maudsley has been received and is being reviewed by the clinical lead.',
    time: '5 days ago',
    read: true,
  },
  {
    id: 8,
    type: 'interview',
    title: 'Interview Feedback Available',
    content: 'Feedback from your first-round interview at Imperial College Healthcare is now available. Please check your applications page for details.',
    time: '1 week ago',
    read: true,
  },
]

const typeConfig = {
  application_update: {
    icon: UserCheck,
    color: 'text-[#C4942A]',
    bg: 'bg-amber-50',
    label: 'Application Update',
  },
  interview: {
    icon: CalendarCheck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    label: 'Interview',
  },
  job_alert: {
    icon: Briefcase,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    label: 'Job Alert',
  },
  message: {
    icon: MessageSquare,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Message',
  },
}

export default function SeekerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Notifications</h1>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs shrink-0"
              onClick={markAllAsRead}
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Mark all as read
            </Button>
          )}
        </div>
        <p className="text-[#5A6B7F] mt-1">Stay up to date with your job search activity.</p>
      </motion.div>

      {/* Notification List */}
      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const config = typeConfig[notif.type]
          const Icon = config.icon
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className={`border-[#D1D9E6] hover:shadow-sm transition-all cursor-pointer ${
                  notif.read ? 'bg-white' : 'bg-[#F7F9FC] border-l-4 border-l-[#C4942A]'
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex gap-3">
                    <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm ${notif.read ? 'font-medium' : 'font-semibold'} text-[#0B1D33]`}>
                            {notif.title}
                          </h3>
                          {!notif.read && (
                            <Circle className="w-2 h-2 fill-[#C4942A] text-[#C4942A] shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#5A6B7F] whitespace-nowrap shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A6B7F] mt-1 leading-relaxed line-clamp-2">{notif.content}</p>
                      <Badge
                        className={`${config.bg} ${config.color} hover:${config.bg} border-0 text-[10px] mt-2`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
