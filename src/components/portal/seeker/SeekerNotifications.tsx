'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, UserCheck, CalendarCheck, MessageSquare,
  CheckCheck, Circle, Clock,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'

type NotifRow = {
  id: string
  title: string
  body: string
  type: string
  is_read: boolean
  link: string
  created_at: string
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  info:    { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Info' },
  success: { icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Success' },
  warning: { icon: CalendarCheck, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Warning' },
  error:   { icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50', label: 'Error' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function SeekerNotifications() {
  const user = useAppStore((s) => s.user)
  const [notifications, setNotifications] = useState<NotifRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    async function load() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setNotifications((data || []) as NotifRow[])
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const newNotif = payload.new as NotifRow
        setNotifications(prev => [newNotif, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  const unreadCount = notifications.filter(n => !n.is_read).length

  async function markAsRead(id: string) {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  async function markAllAsRead() {
    if (!user) return
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
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
            <Button variant="outline" size="sm" className="border-[#C4942A] text-[#C4942A] hover:bg-[#C4942A] hover:text-white text-xs shrink-0"
              onClick={markAllAsRead}>
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Mark all as read
            </Button>
          )}
        </div>
        <p className="text-[#5A6B7F] mt-1">Stay up to date with your job search activity.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : notifications.length === 0 ? (
        <Card className="border-[#D1D9E6]"><CardContent className="p-12 text-center">
          <Bell className="w-10 h-10 text-[#D1D9E6] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#0B1D33]">No notifications yet</p>
          <p className="text-xs text-[#5A6B7F] mt-1">Notifications about your applications will appear here.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const config = typeConfig[notif.type] || typeConfig.info
            const Icon = config.icon
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <Card className={`border-[#D1D9E6] hover:shadow-sm transition-all cursor-pointer ${
                  notif.is_read ? 'bg-white' : 'bg-[#F7F9FC] border-l-4 border-l-[#C4942A]'
                }`} onClick={() => markAsRead(notif.id)}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-3">
                      <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm ${notif.is_read ? 'font-medium' : 'font-semibold'} text-[#0B1D33]`}>{notif.title}</h3>
                            {!notif.is_read && <Circle className="w-2 h-2 fill-[#C4942A] text-[#C4942A] shrink-0" />}
                          </div>
                          <span className="text-[11px] text-[#5A6B7F] whitespace-nowrap shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo(notif.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-[#5A6B7F] mt-1 leading-relaxed line-clamp-2">{notif.body}</p>
                        <Badge className={`${config.bg} ${config.color} border-0 text-[10px] mt-2`}>{config.label}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
