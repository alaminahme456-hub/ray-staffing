'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  CreditCard,
  ClipboardList,
  FileText,
  MessageSquare,
  Bell,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'

type NavTarget = 'customer-home' | 'customer-payments' | 'customer-requests' | 'customer-documents' | 'customer-messages'

interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
  target: NavTarget
  delay?: number
}

function DashboardCard({ icon, title, subtitle, children, target, delay = 0 }: DashboardCardProps) {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-[#D1D9E6] group"
        onClick={() => navigate(target)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C] group-hover:bg-[#C4942A] group-hover:text-white transition-colors duration-200">
                {icon}
              </div>
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
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <DashboardSkeleton />

  const notifications = [
    {
      id: 1,
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      title: 'Rent payment due in 3 days',
      description: 'Your rent of £850.00 is due on 1st September 2026.',
      type: 'warning' as const,
    },
    {
      id: 2,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      title: 'Repair request completed',
      description: 'Your kitchen tap repair (REQ-2024-0089) has been resolved.',
      type: 'success' as const,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Welcome back, James</h1>
        <p className="text-[#5A6B7F] mt-1">Here's what's happening with your tenancy today.</p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-3"
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              n.type === 'warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div className="mt-0.5">{n.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0B1D33]">{n.title}</p>
              <p className="text-sm text-[#5A6B7F] mt-0.5">{n.description}</p>
            </div>
            <Bell className="w-4 h-4 text-[#5A6B7F] shrink-0 mt-0.5" />
          </div>
        ))}
      </motion.div>

      {/* Summary Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* My Home Card */}
        <DashboardCard
          icon={<Home className="w-5 h-5" />}
          title="My Home"
          subtitle="Property & tenancy details"
          target="customer-home"
          delay={0.1}
        >
          <div className="space-y-2.5">
            <p className="text-sm font-medium text-[#0B1D33]">14 Oakwood Crescent</p>
            <p className="text-xs text-[#5A6B7F]">Manchester, M14 5QW</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">
                Active Tenancy
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5A6B7F]">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Rent: Up to date</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5A6B7F]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Next: £850.00 on 1 Sep</span>
            </div>
          </div>
        </DashboardCard>

        {/* Payments Card */}
        <DashboardCard
          icon={<CreditCard className="w-5 h-5" />}
          title="Payments"
          subtitle="Rent & charges"
          target="customer-payments"
          delay={0.15}
        >
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-[#5A6B7F]">Current Balance</p>
              <p className="text-lg font-bold text-[#0B1D33]">£0.00</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5A6B7F]">
              <Clock className="w-3.5 h-3.5" />
              <span>Next: £850.00 due 1 Sep 2026</span>
            </div>
            <div className="border-t border-[#D1D9E6] pt-2.5 space-y-1.5">
              <p className="text-xs font-medium text-[#5A6B7F]">Recent Transactions</p>
              <div className="flex justify-between text-xs">
                <span className="text-[#0B1D33]">Rent - Aug 2026</span>
                <span className="text-emerald-600 font-medium">£850.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#0B1D33]">Service Charge - Q2</span>
                <span className="text-emerald-600 font-medium">£45.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#0B1D33]">Rent - Jul 2026</span>
                <span className="text-emerald-600 font-medium">£850.00</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Requests Card */}
        <DashboardCard
          icon={<ClipboardList className="w-5 h-5" />}
          title="Requests"
          subtitle="Service & maintenance"
          target="customer-requests"
          delay={0.2}
        >
          <div className="space-y-2.5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-amber-50 rounded-lg p-2">
                <p className="text-lg font-bold text-amber-600">2</p>
                <p className="text-[10px] text-[#5A6B7F]">Open</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-lg font-bold text-blue-600">1</p>
                <p className="text-[10px] text-[#5A6B7F]">Pending</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-2">
                <p className="text-lg font-bold text-emerald-600">12</p>
                <p className="text-[10px] text-[#5A6B7F]">Completed</p>
              </div>
            </div>
            <div className="border-t border-[#D1D9E6] pt-2">
              <p className="text-xs text-[#5A6B7F]">Latest: Bathroom leak repair</p>
              <p className="text-[10px] text-[#5A6B7F]">In Progress · Updated 2 days ago</p>
            </div>
          </div>
        </DashboardCard>

        {/* Documents Card */}
        <DashboardCard
          icon={<FileText className="w-5 h-5" />}
          title="Documents"
          subtitle="Tenancy documents & letters"
          target="customer-documents"
          delay={0.25}
        >
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-[10px]">
                1 Important
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#0B1D33] truncate flex-1 mr-2">Tenancy Agreement</span>
                <span className="text-[#5A6B7F] shrink-0">12 Mar</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#0B1D33] truncate flex-1 mr-2">Rent Statement - Aug</span>
                <span className="text-[#5A6B7F] shrink-0">1 Aug</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#0B1D33] truncate flex-1 mr-2">Safety Certificate</span>
                <span className="text-[#5A6B7F] shrink-0">15 Jul</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Messages Card */}
        <DashboardCard
          icon={<MessageSquare className="w-5 h-5" />}
          title="Messages"
          subtitle="Communication centre"
          target="customer-messages"
          delay={0.3}
        >
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#C4942A] text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-sm font-medium text-[#0B1D33]">Unread messages</span>
            </div>
            <div className="border-t border-[#D1D9E6] pt-2.5 space-y-2">
              <div>
                <p className="text-xs font-medium text-[#0B1D33]">Sarah Mitchell</p>
                <p className="text-[10px] text-[#5A6B7F] truncate">Hi James, your repair has been scheduled...</p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
