'use client'

import { useAppStore, type AppView } from '@/store/app-store'
import {
  Home,
  Building2,
  Briefcase,
  Heart,
  Phone,
  ArrowLeft,
  Search,
  LogIn,
  FileQuestion,
  HelpCircle,
} from 'lucide-react'

export default function NotFoundView() {
  const { navigate, goBack, previousView } = useAppStore()

  const quickLinks: {
    title: string
    desc: string
    view: AppView
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    {
      title: 'Housing Services',
      desc: 'Safe, quality, fully compliant residential housing solutions across the UK.',
      view: 'housing',
      icon: Building2,
    },
    {
      title: 'HR & Recruitment Solutions',
      desc: 'Comprehensive employment compliance, staff placement, and SME consulting.',
      view: 'hr-solutions',
      icon: Briefcase,
    },
    {
      title: 'Health & Care Staffing',
      desc: 'Specialist medical, nursing, and healthcare support staffing services.',
      view: 'healthcare',
      icon: Heart,
    },
    {
      title: 'Sign In / Portals',
      desc: 'Access your dedicated candidate, tenant, employer, or admin portal.',
      view: 'login',
      icon: LogIn,
    },
  ]

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center selection:bg-[#C4942A]/20">
      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0A2312]/5 border border-[#0A2312]/10 mb-6">
        <span className="inline-block w-2 h-2 rounded-full bg-[#C4942A] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#0A2312]">
          Error 404 &bull; Page Not Found
        </span>
      </div>

      {/* Hero Heading */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0A2312] mb-4">
        Looking for something that isn&apos;t here.
      </h1>

      <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
        The view or address you requested cannot be located. It might have moved, been renamed, or does not exist.
        Choose an option below to return to safety.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
        <button
          id="not-found-btn-home"
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A2312] text-[#FAF8F5] text-sm font-semibold hover:bg-[#12391F] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Go to Homepage</span>
        </button>

        {previousView && (
          <button
            id="not-found-btn-back"
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-[#0A2312] border border-gray-300 text-sm font-semibold hover:bg-gray-50 active:scale-[0.99] transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#C4942A]" />
            <span>Go Back</span>
          </button>
        )}

        <button
          id="not-found-btn-contact"
          type="button"
          onClick={() => navigate('contact')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-[#0A2312] border border-gray-300 text-sm font-semibold hover:bg-gray-50 active:scale-[0.99] transition-all shadow-xs cursor-pointer"
        >
          <Phone className="h-4 w-4 text-[#C4942A]" />
          <span>Contact Us</span>
        </button>
      </div>

      {/* Helpful Directory */}
      <div className="border border-gray-200/90 rounded-2xl bg-white p-6 sm:p-8 shadow-xs text-left">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Search className="h-4 w-4 text-[#C4942A]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Quick Navigation Links
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.view}
                id={`not-found-quick-${item.view}`}
                type="button"
                onClick={() => navigate(item.view)}
                className="group p-3.5 rounded-xl border border-gray-100 hover:border-[#C4942A]/40 hover:bg-[#FAF8F5]/80 transition-all flex items-start gap-3 text-left w-full cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#0A2312]/5 text-[#0A2312] group-hover:bg-[#0A2312] group-hover:text-[#FAF8F5] transition-colors shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-[#0A2312]">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
