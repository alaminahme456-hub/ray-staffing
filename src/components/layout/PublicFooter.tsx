'use client'

import { useAppStore, type AppView } from '@/store/app-store'
import { Separator } from '@/components/ui/separator'

const footerLinks: { title: string; links: { label: string; view: AppView }[] }[] = [
  {
    title: 'Services',
    links: [
      { label: 'Housing Services', view: 'housing' },
      { label: 'HR Solutions', view: 'hr-solutions' },
      { label: 'Employment Law', view: 'compliance' },
      { label: 'Healthcare Staffing', view: 'healthcare' },
    ]
  },
  {
    title: 'For You',
    links: [
      { label: 'Job Seekers', view: 'job-seekers' },
      { label: 'Employers', view: 'employers' },
      { label: 'Resources', view: 'resources' },
      { label: 'Careers at RAY', view: 'careers' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About RAY', view: 'about' },
      { label: 'Contact Us', view: 'contact' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', view: 'privacy' },
      { label: 'Cookie Policy', view: 'cookies' },
      { label: 'Terms & Conditions', view: 'terms' },
    ]
  },
]

export function PublicFooter() {
  const { navigate } = useAppStore()

  return (
    <footer className="border-t border-[#153A22]/50" style={{ background: 'linear-gradient(180deg, #050E07 0%, #030A05 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/images/logo.jpg" alt="RAY" className="h-10 w-10 rounded-lg object-cover" />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#FAF8F5] leading-none">RAY</span>
                <span className="text-[10px] font-medium tracking-widest text-[#8A9B8E] uppercase leading-none mt-0.5">Staffing Consulting Ltd</span>
              </div>
            </div>
            <p className="text-sm text-[#5C7362] max-w-xs leading-relaxed">
              Quality Housing. Smarter HR. Exceptional Talent. Professional services across the United Kingdom.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-[#FAF8F5] mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.view}>
                    <button
                      onClick={() => navigate(link.view)}
                      className="text-sm text-[#5C7362] hover:text-[#C4942A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-[#153A22]/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5C7362]">
            &copy; {new Date().getFullYear()} RAY Staffing Consulting Ltd. All rights reserved. Registered in England and Wales.
          </p>
          <p className="text-xs text-[#5C7362]">
            Built with care for communities across the UK.
          </p>
        </div>
      </div>
    </footer>
  )
}