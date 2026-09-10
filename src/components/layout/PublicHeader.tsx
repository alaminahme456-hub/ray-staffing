'use client'

import { useState } from 'react'
import { useAppStore, type AppView } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  Menu, ChevronDown, Home, Building2, Users, Heart, Briefcase,
  Shield, Phone, BookOpen, GraduationCap, LogIn, UserPlus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  view: AppView
  children?: { label: string; view: AppView; desc?: string; icon?: React.ReactNode }[]
}

const navItems: NavItem[] = [
  { label: 'About RAY', view: 'about' },
  {
    label: 'Services',
    view: 'housing',
    children: [
      { label: 'Housing Services', view: 'housing', desc: 'Quality, safe & compliant housing', icon: <Building2 className="h-4 w-4 text-[#C4942A]" /> },
      { label: 'HR Solutions', view: 'hr-solutions', desc: 'Comprehensive HR consultancy', icon: <Briefcase className="h-4 w-4 text-[#C4942A]" /> },
      { label: 'Employment Law Compliance', view: 'compliance', desc: 'UK employment law support', icon: <Shield className="h-4 w-4 text-[#C4942A]" /> },
      { label: 'Health & Care Staffing', view: 'healthcare', desc: 'Specialist healthcare recruitment', icon: <Heart className="h-4 w-4 text-[#C4942A]" /> },
    ]
  },
  { label: 'Job Seekers', view: 'job-seekers' },
  { label: 'Employers', view: 'employers' },
  { label: 'Resources', view: 'resources' },
  { label: 'Careers', view: 'careers' },
  { label: 'Contact', view: 'contact' },
]

export function PublicHeader() {
  const { navigate, user } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const handleNav = (view: AppView) => {
    navigate(view)
    setMobileOpen(false)
    setDropdownOpen(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-[70px]">
          {/* Logo */}
          <button
            id="header-brand-logo"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm py-1 cursor-pointer"
          >
            <img src="/images/logo.jpg" alt="RAY" className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-cover shadow-xs border border-gray-200/60" />
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0B1E35] leading-none">RAY</span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.16em] text-[#0B1E35]/80 leading-tight mt-0.5 uppercase">STAFFING CONSULTING</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setDropdownOpen(item.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => !item.children && handleNav(item.view)}
                  className="flex items-center gap-1 rounded-md px-3.5 py-2 text-[14px] font-medium text-gray-700 transition-colors hover:text-[#0B1E35] hover:bg-gray-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] cursor-pointer"
                >
                  {item.label}
                  {item.children && <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${dropdownOpen === item.label ? 'rotate-180 text-[#C4942A]' : ''}`} />}
                </button>
                <AnimatePresence>
                  {item.children && dropdownOpen === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full pt-1.5"
                    >
                      <div className="w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                        {item.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => handleNav(child.view)}
                            className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] cursor-pointer"
                          >
                            <div className="mt-0.5">{child.icon}</div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{child.label}</div>
                              {child.desc && <div className="text-xs text-gray-500 mt-0.5">{child.desc}</div>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              id="header-dashboard-button"
              onClick={() => {
                if (user) {
                  if (user.role === 'SUPER_ADMIN' || user.role === 'HOUSING_ADMIN' || user.role === 'RECRUITMENT_ADMIN' || user.role === 'HR_ADMIN' || user.role === 'LOCAL_ADMIN' || user.role === 'SUPPORT_STAFF') navigate('admin-dashboard')
                  else if (user.role === 'customer') navigate('customer-dashboard')
                  else if (user.role === 'candidate') navigate('seeker-dashboard')
                  else if (user.role === 'employer') navigate('employer-dashboard')
                  else navigate('admin-dashboard')
                } else {
                  navigate('register')
                }
              }}
              className="bg-[#0B1E35] hover:bg-[#153355] text-white font-semibold text-sm px-5 h-10 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {user ? 'My Dashboard' : 'Get Started'}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-gray-800 hover:bg-gray-100" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 overflow-y-auto bg-white">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <img src="/images/logo.jpg" alt="RAY" className="h-8 w-8 rounded-lg object-cover border border-gray-200" />
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-[#0B1E35] leading-none">RAY</span>
                      <span className="text-[9px] font-bold tracking-wider text-[#0B1E35]/70 uppercase mt-0.5">STAFFING CONSULTING</span>
                    </div>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Mobile navigation">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => !item.children && handleNav(item.view)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                      >
                        {item.label}
                        {item.children && <ChevronDown className="h-4 w-4 text-gray-500" />}
                      </button>
                      {item.children && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.label}
                              onClick={() => handleNav(child.view)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                            >
                              {child.icon}
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="border-t border-gray-200 p-4 space-y-2">
                  <Button
                    id="mobile-header-dashboard-button"
                    onClick={() => {
                      if (user) {
                        if (user.role === 'SUPER_ADMIN' || user.role === 'HOUSING_ADMIN' || user.role === 'RECRUITMENT_ADMIN' || user.role === 'HR_ADMIN' || user.role === 'LOCAL_ADMIN' || user.role === 'SUPPORT_STAFF') navigate('admin-dashboard')
                        else if (user.role === 'customer') navigate('customer-dashboard')
                        else if (user.role === 'candidate') navigate('seeker-dashboard')
                        else if (user.role === 'employer') navigate('employer-dashboard')
                        else navigate('admin-dashboard')
                      } else {
                        navigate('register')
                      }
                      setMobileOpen(false)
                    }}
                    className="w-full bg-[#0B1E35] hover:bg-[#153355] text-white font-semibold cursor-pointer"
                  >
                    {user ? 'My Dashboard' : 'Get Started'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}