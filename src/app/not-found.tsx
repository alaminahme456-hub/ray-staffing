import Link from 'next/link'
import {
  Home,
  Briefcase,
  Building2,
  Heart,
  Phone,
  ArrowLeft,
  Search,
  HelpCircle,
  FileQuestion,
} from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] flex flex-col justify-between selection:bg-[#C4942A]/20">
      {/* Subtle Top Navigation / Brand bar */}
      <header className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            id="not-found-logo-link"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-md"
          >
            <img
              src="/images/logo.jpg"
              alt="RAY Staffing Consulting Ltd"
              className="h-9 w-9 rounded-lg object-cover border border-gray-200/60 shadow-xs"
            />
            <div className="flex flex-col text-left">
              <span className="text-base font-bold tracking-tight text-[#0A2312] leading-none group-hover:text-[#0E341B] transition-colors">
                RAY
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-[#5C7362] uppercase leading-none mt-0.5">
                Staffing Consulting Ltd
              </span>
            </div>
          </Link>

          <Link
            href="/"
            id="not-found-return-home-header-btn"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A2312] hover:text-[#C4942A] transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Hero & Helpful Directory */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl w-full text-center">
          {/* Badge & Code */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A2312]/5 border border-[#0A2312]/10 mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C4942A] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0A2312]">
              HTTP 404 &bull; Page Not Found
            </span>
          </div>

          {/* Large Editorial Display Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0A2312] mb-4">
            Looking for something that isn&apos;t here.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
            The page you requested may have moved, been archived, or the URL might be mistyped.
            Let&apos;s get you back on track to the services, talent, or support you need.
          </p>

          {/* Direct CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Link
              href="/"
              id="not-found-cta-home-btn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A2312] text-[#FAF8F5] text-sm font-semibold hover:bg-[#12391F] active:scale-[0.99] transition-all shadow-sm"
            >
              <Home className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/#contact"
              id="not-found-cta-contact-btn"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-[#0A2312] border border-gray-300 text-sm font-semibold hover:bg-gray-50 active:scale-[0.99] transition-all shadow-xs"
            >
              <Phone className="h-4 w-4 text-[#C4942A]" />
              <span>Contact Support</span>
            </Link>
          </div>

          {/* Quick Helpful Destinations Grid */}
          <div className="border border-gray-200/90 rounded-2xl bg-white p-6 sm:p-8 shadow-xs text-left">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Search className="h-4 w-4 text-[#C4942A]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Popular Destinations &amp; Portals
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/"
                id="not-found-quick-housing"
                className="group p-3.5 rounded-xl border border-gray-100 hover:border-[#C4942A]/40 hover:bg-[#FAF8F5]/80 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-[#0A2312]/5 text-[#0A2312] group-hover:bg-[#0A2312] group-hover:text-[#FAF8F5] transition-colors">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-[#0A2312]">
                    Housing Services
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Safe, high-quality, fully compliant residential housing solutions.
                  </div>
                </div>
              </Link>

              <Link
                href="/"
                id="not-found-quick-hr"
                className="group p-3.5 rounded-xl border border-gray-100 hover:border-[#C4942A]/40 hover:bg-[#FAF8F5]/80 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-[#0A2312]/5 text-[#0A2312] group-hover:bg-[#0A2312] group-hover:text-[#FAF8F5] transition-colors">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-[#0A2312]">
                    HR &amp; Recruitment
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Tailored staffing, SME consulting, and candidate placements.
                  </div>
                </div>
              </Link>

              <Link
                href="/"
                id="not-found-quick-healthcare"
                className="group p-3.5 rounded-xl border border-gray-100 hover:border-[#C4942A]/40 hover:bg-[#FAF8F5]/80 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-[#0A2312]/5 text-[#0A2312] group-hover:bg-[#0A2312] group-hover:text-[#FAF8F5] transition-colors">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-[#0A2312]">
                    Healthcare Staffing
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    NHS trust &amp; private care staffing with rapid compliance checks.
                  </div>
                </div>
              </Link>

              <Link
                href="/"
                id="not-found-quick-portal"
                className="group p-3.5 rounded-xl border border-gray-100 hover:border-[#C4942A]/40 hover:bg-[#FAF8F5]/80 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-[#0A2312]/5 text-[#0A2312] group-hover:bg-[#0A2312] group-hover:text-[#FAF8F5] transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-[#0A2312]">
                    Client &amp; Candidate Portal
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Sign in to access your jobs, timesheets, tenancy, or invoices.
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer Strip */}
      <footer className="border-t border-gray-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} RAY Staffing Consulting Ltd. Registered in England &amp; Wales.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
