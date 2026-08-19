'use client'

import { useState } from 'react'
import { useAppStore, type AppView } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  Menu, X, ChevronDown, Home, Building2, Users, Heart, Briefcase,
  Shield, FileText, Phone, BookOpen, GraduationCap, LogIn, UserPlus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  view: AppView
  children?: { label: string; view: AppView; desc?: string }[]
}

const navItems: NavItem[] = [
  { label: 'About RAY', view: 'about' },
  {
    label: 'Services', view: 'housing',
    children: [
      { label: 'Housing Services', view: 'housing', desc: 'Quality, safe & compliant housing' },
      { label: 'HR Solutions', view: 'hr-solutions', desc: 'Comprehensive HR consultancy' },
      { label: 'Employment Law Compliance', view: 'compliance', desc: 'UK employment law support' },
      { label: 'Health & Care Staffing', view: 'healthcare', desc: 'Specialist healthcare recruitment' },
    ]
  },
  { label: 'Job Seekers', view: 'job-seekers' },
  { label: 'Employers', view: 'employers' },
  { label: 'Resources', view: 'resources' },
  { label: 'Careers', view: 'careers' },
  { label: 'Contact', view: 'contact' },
]

const serviceIcons: Record<string, React.ReactNode> = {
  housing: <Building2 className="h-5 w-5 text-[#C4942A]" />,
  'hr-solutions': <Briefcase className="h-5 w-5 text-[#C4942A]" />,
  compliance: <Shield className="h-5 w-5 text-[#C4942A]" />,
  healthcare: <Heart className="h-5 w-5 text-[#C4942A]" />,
}

export function PublicHeader() {
  const { navigate } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const user = useAppStore(s => s.user)

  const handleNav = (view: AppView) => {
    navigate(view)
    setMobileOpen(false)
    setDropdownOpen(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D1D9E6]/20 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1D33]">
              <span className="text-lg font-bold text-[#C4942A]">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#0B1D33] leading-none">RAY</span>
              <span className="text-[10px] font-medium tracking-widest text-[#5A6B7F] uppercase leading-none mt-0.5">Staffing Consulting</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => item.children && setDropdownOpen(item.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  onClick={() => !item.children && handleNav(item.view)}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#0B1D33] transition-colors hover:bg-[#F0F4F8] hover:text-[#1A3A5C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                >
                  {item.label}
                  {item.children && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />}
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
                      <div className="w-72 rounded-xl border border-[#D1D9E6] bg-white p-2 shadow-lg">
                        {item.children.map((child) => (
                          <button
                            key={child.view}
                            onClick={() => handleNav(child.view)}
                            className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#F7F9FC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                          >
                            {serviceIcons[child.view]}
                            <div>
                              <div className="text-sm font-medium text-[#0B1D33]">{child.label}</div>
                              {child.desc && <div className="text-xs text-[#5A6B7F] mt-0.5">{child.desc}</div>}
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
                className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white"
              >
                My Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNav('login')} className="text-[#0B1D33] hover:text-[#1A3A5C] hover:bg-[#F0F4F8]">
                  Sign In
                </Button>
                <Button onClick={() => handleNav('register')} className="bg-[#C4942A] hover:bg-[#B38524] text-white">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-[#0B1D33]" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 overflow-y-auto">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-[#D1D9E6]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B1D33]">
                      <span className="text-sm font-bold text-[#C4942A]">R</span>
                    </div>
                    <span className="font-bold text-[#0B1D33]">RAY</span>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Mobile navigation">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => !item.children && handleNav(item.view)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#0B1D33] hover:bg-[#F0F4F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
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
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#5A6B7F] hover:bg-[#F7F9FC] hover:text-[#0B1D33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]"
                            >
                              {serviceIcons[child.view]}
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="border-t border-[#D1D9E6] p-4 space-y-2">
                  {user ? (
                    <Button onClick={() => { handleNav('admin-dashboard'); }} className="w-full bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">My Dashboard</Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => handleNav('login')} className="w-full">Sign In</Button>
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