import { create } from 'zustand'

export type AppView = 
  // Public pages
  | 'home' | 'about' | 'housing' | 'hr-solutions' | 'compliance' 
  | 'healthcare' | 'job-seekers' | 'employers' | 'contact'
  | 'resources' | 'careers' | 'privacy' | 'cookies' | 'terms'
  // Auth
  | 'login' | 'register' | 'register-employer' | 'register-candidate'
  // Customer Portal
  | 'customer-dashboard' | 'customer-home' | 'customer-payments' 
  | 'customer-documents' | 'customer-requests' | 'customer-messages'
  | 'customer-profile' | 'customer-support'
  // Job Seeker Portal
  | 'seeker-dashboard' | 'seeker-jobs' | 'seeker-applications'
  | 'seeker-cv' | 'seeker-profile' | 'seeker-documents'
  | 'seeker-messages' | 'seeker-notifications' | 'seeker-settings'
  // Employer Portal
  | 'employer-dashboard' | 'employer-vacancies' | 'employer-candidates'
  | 'employer-applications' | 'employer-interviews' | 'employer-placements'
  | 'employer-documents' | 'employer-messages' | 'employer-reports'
  | 'employer-profile'
  // Admin
  | 'admin-dashboard' | 'admin-users' | 'admin-customers' | 'admin-tenants'
  | 'admin-seekers' | 'admin-employers' | 'admin-jobs' | 'admin-applications'
  | 'admin-housing' | 'admin-documents' | 'admin-requests' | 'admin-messages'
  | 'admin-payments' | 'admin-compliance' | 'admin-reports' | 'admin-seo'
  | 'admin-settings'
  // SEO Command Center
  | 'seo-dashboard' | 'seo-pages' | 'seo-sitemap' | 'seo-robots'
  | 'seo-analyzer' | 'seo-performance'

export type PortalType = 'public' | 'customer' | 'seeker' | 'employer' | 'admin' | 'seo'

interface AppState {
  currentView: AppView
  previousView: AppView | null
  sidebarOpen: boolean
  user: {
    id: string
    email: string
    name: string
    role: string
  } | null
  
  navigate: (view: AppView) => void
  goBack: () => void
  setSidebarOpen: (open: boolean) => void
  setUser: (user: AppState['user']) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'home',
  previousView: null,
  sidebarOpen: false,
  user: null,
  
  navigate: (view) => {
    const state = get()
    set({ 
      previousView: state.currentView,
      currentView: view,
      sidebarOpen: false 
    })
    window.scrollTo(0, 0)
  },
  
  goBack: () => {
    const state = get()
    if (state.previousView) {
      set({ 
        currentView: state.previousView,
        previousView: null,
        sidebarOpen: false
      })
      window.scrollTo(0, 0)
    }
  },
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setUser: (user) => set({ user }),
  
  logout: () => {
    // Sign out from Supabase (fire-and-forget, don't block UI)
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient().auth.signOut()
    })
    set({ 
      user: null, 
      currentView: 'home',
      previousView: null,
      sidebarOpen: false
    })
  },
}))

export function getPortalType(view: AppView): PortalType {
  if (view.startsWith('customer-')) return 'customer'
  if (view.startsWith('seeker-')) return 'seeker'
  if (view.startsWith('employer-')) return 'employer'
  if (view.startsWith('seo-')) return 'seo'
  if (view.startsWith('admin-')) return 'admin'
  return 'public'
}

export function isAuthView(view: AppView): boolean {
  return view === 'login' || view === 'register' || view === 'register-employer' || view === 'register-candidate'
}