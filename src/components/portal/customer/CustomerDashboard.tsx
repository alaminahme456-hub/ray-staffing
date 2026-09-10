'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Home, CreditCard, ClipboardList, FileText, MessageSquare, Bell,
  AlertTriangle, CheckCircle2, ArrowRight, Clock, Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'
import { createClient } from '@/lib/supabase/client'

type NavTarget = 'customer-home' | 'customer-payments' | 'customer-requests' | 'customer-documents' | 'customer-messages'

interface CustomerData {
  profile: { first_name: string; last_name: string; address: string; property_type: string } | null
  requests: { id: string; title: string; status: string; created_at: string }[]
  payments: { id: string; amount: number; currency: string; status: string; description: string; payment_type: string; created_at: string }[]
  messages: { id: string; subject: string; body: string; is_read: boolean; created_at: string }[]
}

function DashboardCard({ icon, title, subtitle, children, target, delay = 0 }: {
  icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode; target: NavTarget; delay?: number
}) {
  const navigate = useAppStore((s) => s.navigate)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-[#D1D9E6] group" onClick={() => navigate(target)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C] group-hover:bg-[#C4942A] group-hover:text-white transition-colors duration-200">{icon}</div>
              <div>
                <CardTitle className="text-base font-semibold text-[#0B1D33]">{title}</CardTitle>
                <p className="text-xs text-[#5A6B7F] mt-0.5">{subtitle}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#5A6B7F] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const user = useAppStore((s) => s.user)
  const [data, setData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    async function fetchData() {
      const supabase = createClient()
      try {
        const [profileRes, requestsRes, paymentsRes, messagesRes] = await Promise.all([
          supabase.from('customer_profiles').select('*').eq('user_id', user.id).single(),
          supabase.from('housing_requests').select('id, title, status, created_at').eq('customer_id', user.id).order('created_at', { ascending: false }),
          supabase.from('payments').select('id, amount, currency, status, description, payment_type, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
          supabase.from('messages').select('id, subject, body, is_read, created_at').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(5),
        ])

        setData({
          profile: profileRes.data,
          requests: requestsRes.data || [],
          payments: paymentsRes.data || [],
          messages: messagesRes.data || [],
        })
      } catch (err) {
        console.error('Failed to fetch customer dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading || !data) return <DashboardSkeleton />

  const firstName = data.profile?.first_name || user?.name?.split(' ')[0] || 'there'
  const pendingCount = data.requests.filter(r => r.status === 'pending').length
  const inProgressCount = data.requests.filter(r => r.status === 'in_progress').length
  const resolvedCount = data.requests.filter(r => r.status === 'matched' || r.status === 'closed').length
  const unreadMessages = data.messages.filter(m => !m.is_read && m.receiver_id === user?.id).length
  const totalPaid = data.payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Welcome back, {firstName}</h1>
        <p className="text-[#5A6B7F] mt-1">Here's what's happening with your housing account today.</p>
      </motion.div>

      {/* Notifications */}
      {pendingCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-amber-50 border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0B1D33]">You have {pendingCount} pending request{pendingCount > 1 ? 's' : ''}</p>
              <p className="text-sm text-[#5A6B7F] mt-0.5">Your housing request{pendingCount > 1 ? 's are' : ' is'} being reviewed.</p>
            </div>
          </div>
        </motion.div>
      )}
      {pendingCount === 0 && resolvedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0B1D33]">All caught up!</p>
              <p className="text-sm text-[#5A6B7F] mt-0.5">No pending requests. {resolvedCount} request{resolvedCount > 1 ? 's' : ''} resolved so far.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* My Home Card */}
        <DashboardCard icon={<Home className="w-5 h-5" />} title="My Home" subtitle="Property & tenancy details" target="customer-home" delay={0.1}>
          <div className="space-y-2.5">
            {data.profile?.address ? (
              <>
                <p className="text-sm font-medium text-[#0B1D33]">{data.profile.address}</p>
                {data.profile.property_type && (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs capitalize">{data.profile.property_type}</Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-[#5A6B7F]">No address on file yet.</p>
            )}
          </div>
        </DashboardCard>

        {/* Payments Card */}
        <DashboardCard icon={<CreditCard className="w-5 h-5" />} title="Payments" subtitle="Rent & charges" target="customer-payments" delay={0.15}>
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-[#5A6B7F]">Total Paid</p>
              <p className="text-lg font-bold text-[#0B1D33]">£{totalPaid.toLocaleString()}.00</p>
            </div>
            {data.payments.length > 0 ? (
              <div className="border-t border-[#D1D9E6] pt-2.5 space-y-1.5">
                {data.payments.slice(0, 3).map(p => (
                  <div key={p.id} className="flex justify-between text-xs">
                    <span className="text-[#0B1D33] truncate flex-1 mr-2">{p.description || p.payment_type}</span>
                    <span className={p.status === 'completed' ? 'text-emerald-600 font-medium' : p.status === 'pending' ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'}>
                      £{p.amount.toLocaleString()}.00
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#5A6B7F]">No payment history yet.</p>
            )}
          </div>
        </DashboardCard>

        {/* Requests Card */}
        <DashboardCard icon={<ClipboardList className="w-5 h-5" />} title="Requests" subtitle="Service & maintenance" target="customer-requests" delay={0.2}>
          <div className="space-y-2.5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-amber-50 rounded-lg p-2"><p className="text-lg font-bold text-amber-600">{pendingCount}</p><p className="text-[10px] text-[#5A6B7F]">Open</p></div>
              <div className="bg-blue-50 rounded-lg p-2"><p className="text-lg font-bold text-blue-600">{inProgressCount}</p><p className="text-[10px] text-[#5A6B7F]">In Progress</p></div>
              <div className="bg-emerald-50 rounded-lg p-2"><p className="text-lg font-bold text-emerald-600">{resolvedCount}</p><p className="text-[10px] text-[#5A6B7F]">Resolved</p></div>
            </div>
            {data.requests.length > 0 ? (
              <div className="border-t border-[#D1D9E6] pt-2">
                <p className="text-xs text-[#5A6B7F]">Latest: {data.requests[0].title || 'Housing request'}</p>
                <p className="text-[10px] text-[#5A6B7F] capitalize">{data.requests[0].status} · {new Date(data.requests[0].created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
              </div>
            ) : (
              <div className="border-t border-[#D1D9E6] pt-2"><p className="text-xs text-[#5A6B7F]">No requests submitted yet.</p></div>
            )}
          </div>
        </DashboardCard>

        {/* Documents Card */}
        <DashboardCard icon={<FileText className="w-5 h-5" />} title="Documents" subtitle="Tenancy documents & letters" target="customer-documents" delay={0.25}>
          <div className="space-y-2.5">
            <p className="text-xs text-[#5A6B7F]">Upload and manage your housing documents.</p>
          </div>
        </DashboardCard>

        {/* Messages Card */}
        <DashboardCard icon={<MessageSquare className="w-5 h-5" />} title="Messages" subtitle="Communication centre" target="customer-messages" delay={0.3}>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${unreadMessages > 0 ? 'bg-[#C4942A] text-white' : 'bg-[#D1D9E6] text-[#5A6B7F]'}`}>
                {unreadMessages}
              </div>
              <span className="text-sm font-medium text-[#0B1D33]">{unreadMessages} unread message{unreadMessages !== 1 ? 's' : ''}</span>
            </div>
            {data.messages.length > 0 ? (
              <div className="border-t border-[#D1D9E6] pt-2.5 space-y-2">
                {data.messages.slice(0, 2).map(m => (
                  <div key={m.id}>
                    <p className="text-xs font-medium text-[#0B1D33]">{m.subject || 'No subject'}</p>
                    <p className="text-[10px] text-[#5A6B7F] truncate">{m.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#5A6B7F]">No messages yet.</p>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
