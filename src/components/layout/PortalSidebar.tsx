'use client'

import { useAppStore, type AppView, type PortalType, getPortalType } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Home, CreditCard, FileText, MessageSquare, HelpCircle,
  User, Search, Briefcase, Upload, Bell, Settings,
  Building2, Users, FileCheck, BarChart3, Shield,
  Globe, FileSearch, Bot, Activity, TrendingUp,
  ChevronLeft, LogOut, Menu, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarItem {
  icon: React.ReactNode
  label: string
  view: AppView
  badge?: number
}

const portalNav: Record<string, { title: string; subtitle: string; items: SidebarItem[] }> = {
  customer: {
    title: 'My RAY Account',
    subtitle: 'Customer Portal',
    items: [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', view: 'customer-dashboard' },
      { icon: <Home className="h-5 w-5" />, label: 'My Home', view: 'customer-home' },
      { icon: <CreditCard className="h-5 w-5" />, label: 'Payments', view: 'customer-payments' },
      { icon: <FileText className="h-5 w-5" />, label: 'Documents', view: 'customer-documents' },
      { icon: <FileCheck className="h-5 w-5" />, label: 'Requests', view: 'customer-requests' },
      { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', view: 'customer-messages', badge: 3 },
      { icon: <User className="h-5 w-5" />, label: 'Profile', view: 'customer-profile' },
      { icon: <HelpCircle className="h-5 w-5" />, label: 'Support', view: 'customer-support' },
    ]
  },
  seeker: {
    title: 'My Career Dashboard',
    subtitle: 'Job Seeker Portal',
    items: [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', view: 'seeker-dashboard' },
      { icon: <Search className="h-5 w-5" />, label: 'Jobs', view: 'seeker-jobs' },
      { icon: <Briefcase className="h-5 w-5" />, label: 'Applications', view: 'seeker-applications', badge: 2 },
      { icon: <Upload className="h-5 w-5" />, label: 'My CV', view: 'seeker-cv' },
      { icon: <User className="h-5 w-5" />, label: 'My Profile', view: 'seeker-profile' },
      { icon: <FileText className="h-5 w-5" />, label: 'Documents', view: 'seeker-documents' },
      { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', view: 'seeker-messages', badge: 1 },
      { icon: <Bell className="h-5 w-5" />, label: 'Notifications', view: 'seeker-notifications', badge: 5 },
      { icon: <Settings className="h-5 w-5" />, label: 'Settings', view: 'seeker-settings' },
    ]
  },
  employer: {
    title: 'My Recruitment Workspace',
    subtitle: 'Employer Portal',
    items: [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', view: 'employer-dashboard' },
      { icon: <Briefcase className="h-5 w-5" />, label: 'Vacancies', view: 'employer-vacancies' },
      { icon: <Users className="h-5 w-5" />, label: 'Candidates', view: 'employer-candidates' },
      { icon: <FileCheck className="h-5 w-5" />, label: 'Applications', view: 'employer-applications', badge: 4 },
      { icon: <Building2 className="h-5 w-5" />, label: 'Interviews', view: 'employer-interviews' },
      { icon: <Users className="h-5 w-5" />, label: 'Placements', view: 'employer-placements' },
      { icon: <FileText className="h-5 w-5" />, label: 'Documents', view: 'employer-documents' },
      { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', view: 'employer-messages', badge: 2 },
      { icon: <BarChart3 className="h-5 w-5" />, label: 'Reports', view: 'employer-reports' },
      { icon: <User className="h-5 w-5" />, label: 'Company Profile', view: 'employer-profile' },
    ]
  },
  admin: {
    title: 'RAY Command Center',
    subtitle: 'Admin Dashboard',
    items: [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', view: 'admin-dashboard' },
      { icon: <Users className="h-5 w-5" />, label: 'Users', view: 'admin-users' },
      { icon: <Home className="h-5 w-5" />, label: 'Customers', view: 'admin-customers' },
      { icon: <Users className="h-5 w-5" />, label: 'Job Seekers', view: 'admin-seekers' },
      { icon: <Building2 className="h-5 w-5" />, label: 'Employers', view: 'admin-employers' },
      { icon: <Briefcase className="h-5 w-5" />, label: 'Jobs', view: 'admin-jobs' },
      { icon: <FileCheck className="h-5 w-5" />, label: 'Housing', view: 'admin-housing' },
      { icon: <BarChart3 className="h-5 w-5" />, label: 'Reports', view: 'admin-reports' },
      { icon: <Shield className="h-5 w-5" />, label: 'SEO Center', view: 'seo-dashboard' },
      { icon: <Settings className="h-5 w-5" />, label: 'Settings', view: 'admin-settings' },
    ]
  },
  seo: {
    title: 'RAY SEO Control Room',
    subtitle: 'SEO Command Center',
    items: [
      { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', view: 'seo-dashboard' },
      { icon: <FileText className="h-5 w-5" />, label: 'Pages', view: 'seo-pages' },
      { icon: <Globe className="h-5 w-5" />, label: 'Sitemap', view: 'seo-sitemap' },
      { icon: <Bot className="h-5 w-5" />, label: 'Robots.txt', view: 'seo-robots' },
      { icon: <FileSearch className="h-5 w-5" />, label: 'SEO Analyzer', view: 'seo-analyzer' },
      { icon: <Activity className="h-5 w-5" />, label: 'Search Performance', view: 'seo-performance' },
    ]
  },
}

export function PortalSidebar() {
  const { currentView, navigate, logout, user, sidebarOpen, setSidebarOpen } = useAppStore()
  const portalType = getPortalType(currentView)
  const navConfig = portalNav[portalType]

  if (!navConfig) return null

  const sidebarBg = portalType === 'admin' || portalType === 'seo' ? 'bg-[#050E07]' : 'bg-white'
  const textColor = portalType === 'admin' || portalType === 'seo' ? 'text-[#E8EDE9]' : 'text-[#0A1F0D]'
  const mutedColor = portalType === 'admin' || portalType === 'seo' ? 'text-[#8A9B8E]' : 'text-[#5C7362]'
  const activeBg = portalType === 'admin' || portalType === 'seo' ? 'bg-[#0F2B18] text-[#FAF8F5]' : 'bg-[#E8EDE9] text-[#0A1F0D]'
  const hoverBg = portalType === 'admin' || portalType === 'seo' ? 'hover:bg-[#0F2B18]/60' : 'hover:bg-[#E8EDE9]'
  const borderColor = portalType === 'admin' || portalType === 'seo' ? 'border-[#153A22]' : 'border-[#D1DDD4]'

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-transform duration-200 lg:relative lg:translate-x-0',
          sidebarBg, borderColor,
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b lg:h-20" style={{ borderColor: `var(--tw-border-opacity, ${borderColor})` }}>
          <button onClick={() => {
            if (portalType === 'admin') navigate('admin-dashboard')
            else if (portalType === 'seo') navigate('seo-dashboard')
            else if (portalType === 'customer') navigate('customer-dashboard')
            else if (portalType === 'seeker') navigate('seeker-dashboard')
            else if (portalType === 'employer') navigate('employer-dashboard')
          }} className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm">
            <img src="/images/logo.jpg" alt="RAY" className="h-9 w-9 rounded-lg object-cover" />
            <div className="flex flex-col">
              <span className={cn('text-sm font-bold leading-none', textColor)}>{navConfig.title.split(' ').slice(0, 2).join(' ')}</span>
              <span className={cn('text-[9px] font-medium tracking-wider uppercase leading-none mt-0.5', mutedColor)}>{navConfig.subtitle}</span>
            </div>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-black/10">
            <X className={cn('h-5 w-5', textColor)} />
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2 scrollbar-thin">
          <nav className="space-y-0.5 px-3" role="navigation" aria-label="Portal navigation">
            {navConfig.items.map((item) => {
              const isActive = currentView === item.view
              return (
                <button
                  key={item.view}
                  onClick={() => { navigate(item.view); setSidebarOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]',
                    isActive ? activeBg : cn(textColor, hoverBg)
                  )}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className={cn(
                      'flex h-5 min-w-5 items-center justify-center rounded-full text-xs font-semibold px-1.5',
                      isActive ? 'bg-[#C4942A] text-white' : portalType === 'admin' || portalType === 'seo' ? 'bg-[#C4942A] text-white' : 'bg-[#C4942A]/10 text-[#C4942A]'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="p-3 border-t" style={{ borderColor: `var(--tw-border-opacity, ${borderColor})` }}>
          <button
            onClick={() => navigate('home')}
            className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1', textColor, hoverBg)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Website
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export function PortalTopBar() {
  const { currentView, setSidebarOpen, user, navigate } = useAppStore()
  const portalType = getPortalType(currentView)
  const navConfig = portalNav[portalType]

  if (!navConfig) return null

  return (
    <header className={cn(
      'sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 lg:px-6 lg:hidden',
      portalType === 'admin' || portalType === 'seo' ? 'bg-[#050E07] border-[#153A22] text-[#FAF8F5]' : 'bg-white border-[#D1DDD4] text-[#0A1F0D]'
    )}>
      <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className={portalType === 'admin' || portalType === 'seo' ? 'text-white hover:bg-white/10' : ''}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2">
        <img src="/images/logo.jpg" alt="RAY" className="h-7 w-7 rounded-md object-cover" />
        <span className="text-sm font-semibold">{navConfig.subtitle}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F2B18] text-[#FAF8F5] text-xs font-bold">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  )
}