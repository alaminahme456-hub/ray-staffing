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
  { label: 'Home', view: 'home' },
  { label: 'Housing', view: 'housing' },
  {
    label: 'HR Solutions', view: 'hr-solutions',
    children: [
      { label: 'Housing Services', view: 'housing', desc: 'Quality, safe & compliant housing', icon: <Building2 className="h-4 w-4 text-[#C4942A]" /> },
      { label: 'HR Solutions', view: 'hr-solutions', desc: 'Comprehensive HR consultancy', icon: <Briefcase className="h-4 w-4 text-[#C4942A]" /> },
      { label: 'Employment Law Compliance', view: 'compliance', desc: 'UK employment law support', icon: <Shield className="h-4 w-4 text-[#C4942A]" /> },
      { label: 'Health & Care Staffing', view: 'healthcare', desc: 'Specialist healthcare recruitment', icon: <Heart className="h-4 w-4 text-[#C4942A]" /> },
    ]
  },
  { label: 'Recruitment', view: 'healthcare' },
  { label: 'Health & Care', view: 'healthcare' },
  { label: 'For Job Seekers', view: 'job-seekers' },
  { label: 'For Employers', view: 'employers' },
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
    <header className="sticky top-0 z-50 w-full border-b border-white/8" style={{ background: 'rgba(5,14,7,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-[68px]">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C4942A]/15 border border-[#C4942A]/25">
              <span className="text-base font-bold text-[#C4942A]">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#FAF8F5] leading-none">RAY</span>
              <span className="text-[9px] font-medium tracking-[0.15em] text-[#8A9B8E] uppercase leading-none mt-0.5">Staffing Consulting</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => item.children && setDropdownOpen(item.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  onClick={() => !item.children && handleNav(item.view)}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-[13px] font-medium text-[#9BADA0] transition-colors hover:text-[#FAF8F5] hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                >
                  {item.label}
                  {item.children && <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${dropdownOpen === item.label ? 'rotate-180 text-[#C4942A]' : ''}`} />}
                </button>
                <AnimatePresence>
                  {item.children && dropdownOpen === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full pt-2"
                    >
                      <div className="w-72 rounded-xl border border-[#153A22] p-2 shadow-xl" style={{ background: 'rgba(10,31,13,0.97)', backdropFilter: 'blur(12px)' }}>
                        {item.children.map((child) => (
                          <button
                            key={child.view}
                            onClick={() => handleNav(child.view)}
                            className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                          >
                            <div className="mt-0.5">{child.icon}</div>
                            <div>
                              <div className="text-sm font-medium text-[#FAF8F5]">{child.label}</div>
                              {child.desc && <div className="text-xs text-[#8A9B8E] mt-0.5">{child.desc}</div>}
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
            {user ? (
              <Button
                onClick={() => {
                  if (user.role === 'SUPER_ADMIN' || user.role === 'HOUSING_ADMIN' || user.role === 'RECRUITMENT_ADMIN' || user.role === 'HR_ADMIN') navigate('admin-dashboard')
                  else if (user.role === 'customer') navigate('customer-dashboard')
                  else if (user.role === 'candidate') navigate('seeker-dashboard')
                  else if (user.role === 'employer') navigate('employer-dashboard')
                }}
                className="bg-[#C4942A] hover:bg-[#B38524] text-white font-medium text-sm"
              >
                My Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNav('login')} className="text-[#9BADA0] hover:text-[#FAF8F5] hover:bg-white/5 text-sm">
                  <LogIn className="mr-2 size-4" />
                  Login
                </Button>
                <Button onClick={() => handleNav('register')} className="bg-[#C4942A] hover:bg-[#B38524] text-white font-medium text-sm shadow-md shadow-[#C4942A]/15">
                  <UserPlus className="mr-2 size-4" />
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-[#FAF8F5] hover:bg-white/5" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 overflow-y-auto" style={{ background: '#050E07' }}>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C4942A]/15">
                      <span className="text-sm font-bold text-[#C4942A]">R</span>
                    </div>
                    <span className="font-bold text-[#FAF8F5]">RAY</span>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Mobile navigation">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => !item.children && handleNav(item.view)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#9BADA0] hover:bg-white/5 hover:text-[#FAF8F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                      >
                        {item.label}
                        {item.children && <ChevronDown className="h-4 w-4" />}
                      </button>
                      {item.children && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.view}
                              onClick={() => handleNav(child.view)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#8A9B8E] hover:bg-white/5 hover:text-[#FAF8F5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
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
                <div className="border-t border-white/8 p-4 space-y-2">
                  {user ? (
                    <Button onClick={() => handleNav('admin-dashboard')} className="w-full bg-[#C4942A] hover:bg-[#B38524] text-white">My Dashboard</Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => handleNav('login')} className="w-full border-white/15 text-[#FAF8F5] hover:bg-white/5">Login</Button>
                      <Button onClick={() => handleNav('register')} className="w-full bg-[#C4942A] hover:bg-[#B38524] text-white">Get Started</Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}