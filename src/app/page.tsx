'use client'

import { useEffect } from 'react'
import { useAppStore, getPortalType, isAuthView } from '@/store/app-store'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { PortalSidebar, PortalTopBar } from '@/components/layout/PortalSidebar'

// Public pages
import { HomePage } from '@/components/public/HomePage'
import { AboutPage } from '@/components/public/AboutPage'
import { HousingPage } from '@/components/public/HousingPage'
import { HRSolutionsPage } from '@/components/public/HRSolutionsPage'
import { CompliancePage } from '@/components/public/CompliancePage'
import { HealthcarePage } from '@/components/public/HealthcarePage'
import { JobSeekersPage } from '@/components/public/JobSeekersPage'
import { EmployersPage } from '@/components/public/EmployersPage'
import { ContactPage } from '@/components/public/ContactPage'
import { ResourcesPage } from '@/components/public/ResourcesPage'
import { CareersPage } from '@/components/public/CareersPage'
import { PrivacyPage, CookiePage, TermsPage } from '@/components/public/LegalPages'

// Auth
import { LoginPage, RegisterPage, RegisterEmployerPage, RegisterCandidatePage } from '@/components/shared/AuthPages'

// Customer portal
import { CustomerDashboard } from '@/components/portal/customer/CustomerDashboard'
import { CustomerHome } from '@/components/portal/customer/CustomerHome'
import { CustomerPayments } from '@/components/portal/customer/CustomerPayments'
import { CustomerDocuments } from '@/components/portal/customer/CustomerDocuments'
import { CustomerRequests } from '@/components/portal/customer/CustomerRequests'
import { CustomerMessages } from '@/components/portal/customer/CustomerMessages'
import { CustomerProfile } from '@/components/portal/customer/CustomerProfile'
import { CustomerSupport } from '@/components/portal/customer/CustomerSupport'

// Seeker portal
import { SeekerDashboard } from '@/components/portal/seeker/SeekerDashboard'
import { SeekerJobs } from '@/components/portal/seeker/SeekerJobs'
import { SeekerApplications } from '@/components/portal/seeker/SeekerApplications'
import { SeekerCV } from '@/components/portal/seeker/SeekerCV'
import { SeekerProfile } from '@/components/portal/seeker/SeekerProfile'
import { SeekerDocuments } from '@/components/portal/seeker/SeekerDocuments'
import { SeekerNotifications } from '@/components/portal/seeker/SeekerNotifications'
import { SeekerSettings } from '@/components/portal/seeker/SeekerSettings'

// Employer portal
import { EmployerDashboard } from '@/components/portal/employer/EmployerDashboard'
import { EmployerVacancies } from '@/components/portal/employer/EmployerVacancies'
import { EmployerCandidates } from '@/components/portal/employer/EmployerCandidates'
import { EmployerApplications } from '@/components/portal/employer/EmployerApplications'
import { EmployerInterviews } from '@/components/portal/employer/EmployerInterviews'
import { EmployerPlacements } from '@/components/portal/employer/EmployerPlacements'
import { EmployerReports } from '@/components/portal/employer/EmployerReports'
import { EmployerProfile } from '@/components/portal/employer/EmployerProfile'
import { EmployerDocuments } from '@/components/portal/employer/EmployerDocuments'
import { EmployerMessages } from '@/components/portal/employer/EmployerMessages'

// Admin
import { AdminDashboard } from '@/components/portal/admin/AdminDashboard'
import { AdminUsers } from '@/components/portal/admin/AdminUsers'
import { AdminCustomers } from '@/components/portal/admin/AdminCustomers'
import { AdminJobs } from '@/components/portal/admin/AdminJobs'
import { AdminHousing } from '@/components/portal/admin/AdminHousing'
import { AdminReports } from '@/components/portal/admin/AdminReports'
import { AdminSettings } from '@/components/portal/admin/AdminSettings'

// SEO
import { SeoDashboard } from '@/components/portal/seo/SeoDashboard'
import { SeoPages } from '@/components/portal/seo/SeoPages'
import { SeoSitemap } from '@/components/portal/seo/SeoSitemap'
import { SeoRobots } from '@/components/portal/seo/SeoRobots'
import { SeoAnalyzer } from '@/components/portal/seo/SeoAnalyzer'
import { SeoPerformance } from '@/components/portal/seo/SeoPerformance'

function PageRouter() {
  const { currentView } = useAppStore()

  const pageMap: Record<string, React.ComponentType> = {
    // Public
    'home': HomePage, 'about': AboutPage, 'housing': HousingPage,
    'hr-solutions': HRSolutionsPage, 'compliance': CompliancePage,
    'healthcare': HealthcarePage, 'job-seekers': JobSeekersPage,
    'employers': EmployersPage, 'contact': ContactPage,
    'resources': ResourcesPage, 'careers': CareersPage,
    'privacy': PrivacyPage, 'cookies': CookiePage, 'terms': TermsPage,
    // Auth
    'login': LoginPage, 'register': RegisterPage,
    'register-employer': RegisterEmployerPage, 'register-candidate': RegisterCandidatePage,
    // Customer
    'customer-dashboard': CustomerDashboard, 'customer-home': CustomerHome,
    'customer-payments': CustomerPayments, 'customer-documents': CustomerDocuments,
    'customer-requests': CustomerRequests, 'customer-messages': CustomerMessages,
    'customer-profile': CustomerProfile, 'customer-support': CustomerSupport,
    // Seeker
    'seeker-dashboard': SeekerDashboard, 'seeker-jobs': SeekerJobs,
    'seeker-applications': SeekerApplications, 'seeker-cv': SeekerCV,
    'seeker-profile': SeekerProfile, 'seeker-documents': SeekerDocuments,
    'seeker-notifications': SeekerNotifications, 'seeker-settings': SeekerSettings,
    // Employer
    'employer-dashboard': EmployerDashboard, 'employer-vacancies': EmployerVacancies,
    'employer-candidates': EmployerCandidates, 'employer-applications': EmployerApplications,
    'employer-interviews': EmployerInterviews, 'employer-placements': EmployerPlacements,
    'employer-reports': EmployerReports, 'employer-profile': EmployerProfile,
    'employer-documents': EmployerDocuments, 'employer-messages': EmployerMessages,
    // Admin
    'admin-dashboard': AdminDashboard, 'admin-users': AdminUsers,
    'admin-customers': AdminCustomers, 'admin-jobs': AdminJobs,
    'admin-housing': AdminHousing, 'admin-reports': AdminReports,
    'admin-settings': AdminSettings,
    // SEO
    'seo-dashboard': SeoDashboard, 'seo-pages': SeoPages,
    'seo-sitemap': SeoSitemap, 'seo-robots': SeoRobots,
    'seo-analyzer': SeoAnalyzer, 'seo-performance': SeoPerformance,
  }

  const PageComponent = pageMap[currentView]
  if (!PageComponent) return <HomePage />

  return <PageComponent />
}

export default function App() {
  const { currentView } = useAppStore()
  const portalType = getPortalType(currentView)
  const isAuth = isAuthView(currentView)
  const isPortal = portalType !== 'public'
  const isAdminOrSeo = portalType === 'admin' || portalType === 'seo'

  useEffect(() => {
    document.title = 'RAY Staffing Consulting Ltd | Quality Housing, HR & Talent'
  }, [])

  // Public website
  if (!isPortal && !isAuth) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1"><PageRouter /></main>
        <PublicFooter />
      </div>
    )
  }

  // Auth pages
  if (isAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PublicHeader />
        <main className="flex-1"><PageRouter /></main>
      </div>
    )
  }

  // Portal views (customer, seeker, employer, admin, seo)
  return (
    <div className={`min-h-screen flex ${isAdminOrSeo ? 'bg-[#0B1D33]' : 'bg-[#F7F9FC]'}`}>
      <PortalSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalTopBar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="mx-auto max-w-6xl">
            <PageRouter />
          </div>
        </main>
      </div>
    </div>
  )
}