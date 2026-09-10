'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { Building2, Briefcase, House, Shield, ArrowLeft, Eye, EyeOff, CheckCircle2, Loader2, Check } from 'lucide-react'
import { neonSignIn, neonSignUp } from '@/lib/auth/neon-auth'

const ADMIN_ROLES = ['SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF']

export function LoginPage() {
  const { navigate, setUser } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { user } = await neonSignIn({ email, password })
      setUser({ id: user.id, email: user.email, name: user.name, role: user.role })
      if (ADMIN_ROLES.includes(user.role)) navigate('admin-dashboard')
      else if (user.role === 'customer') navigate('customer-dashboard')
      else if (user.role === 'candidate') navigate('seeker-dashboard')
      else if (user.role === 'employer') navigate('employer-dashboard')
      else navigate('home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <button onClick={() => navigate('home')} className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </button>
        <Card className="border-[#D1D9E6] shadow-lg">
          <CardHeader className="text-center pb-4">
            <img src="/images/logo.jpg" alt="RAY" className="mx-auto mb-3 h-14 w-14 rounded-xl object-cover" />
            <CardTitle className="text-xl text-[#0B1D33]">Sign in to RAY</CardTitle>
            <CardDescription>Access your RAY Staffing portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.co.uk" value={email} onChange={e => setEmail(e.target.value)} required className="border-[#D1D9E6]" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="border-[#D1D9E6] pr-10" disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B7F] hover:text-[#0B1D33] cursor-pointer" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#0B1D33] hover:bg-[#1A3A5C] text-white h-11 cursor-pointer">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</span> : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E8EEF5]">
              <p className="text-xs font-semibold text-[#5A6B7F] mb-2 uppercase tracking-wider">Quick Demo Logins (Click to autofill):</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setEmail('admin@raystaffing.co.uk'); setPassword('Password123!') }}
                  className="px-2.5 py-1.5 rounded-lg border border-[#D1D9E6] hover:border-[#0B1D33] hover:bg-[#F3F6FA] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold block text-[#0B1D33]">Super Admin</span>
                  <span className="text-[#5A6B7F] text-[11px]">admin@raystaffing.co.uk</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('employer@raystaffing.co.uk'); setPassword('Password123!') }}
                  className="px-2.5 py-1.5 rounded-lg border border-[#D1D9E6] hover:border-[#0B1D33] hover:bg-[#F3F6FA] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold block text-[#0B1D33]">Employer</span>
                  <span className="text-[#5A6B7F] text-[11px]">employer@raystaffing.co.uk</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('seeker@raystaffing.co.uk'); setPassword('Password123!') }}
                  className="px-2.5 py-1.5 rounded-lg border border-[#D1D9E6] hover:border-[#0B1D33] hover:bg-[#F3F6FA] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold block text-[#0B1D33]">Job Seeker</span>
                  <span className="text-[#5A6B7F] text-[11px]">seeker@raystaffing.co.uk</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('customer@raystaffing.co.uk'); setPassword('Password123!') }}
                  className="px-2.5 py-1.5 rounded-lg border border-[#D1D9E6] hover:border-[#0B1D33] hover:bg-[#F3F6FA] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold block text-[#0B1D33]">Housing Client</span>
                  <span className="text-[#5A6B7F] text-[11px]">customer@raystaffing.co.uk</span>
                </button>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-[#5A6B7F]">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-[#C4942A] font-semibold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const { navigate, setUser } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Selected role can be candidate, employer, customer, or staff
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employer' | 'customer' | 'staff'>('candidate')
  const [staffSubRole, setStaffSubRole] = useState<'SUPER_ADMIN' | 'HOUSING_ADMIN' | 'RECRUITMENT_ADMIN' | 'HR_ADMIN'>('SUPER_ADMIN')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: 'Healthcare',
    tenancyRef: '',
  })

  const roles = [
    {
      id: 'candidate' as const,
      label: 'Job Seeker',
      tagline: 'Healthcare & Careers',
      desc: 'Looking for healthcare, nursing, social care, or professional positions',
      icon: Briefcase,
      dashboard: 'Job Seeker Dashboard',
    },
    {
      id: 'employer' as const,
      label: 'Employer',
      tagline: 'Hiring & Staffing',
      desc: 'Hiring qualified staff, booking healthcare shifts, and accessing HR compliance',
      icon: Building2,
      dashboard: 'Employer Dashboard',
    },
    {
      id: 'customer' as const,
      label: 'Housing Client',
      tagline: 'Tenant & Property',
      desc: 'Tenants and residents accessing rent accounts, tenancy services, and repairs',
      icon: House,
      dashboard: 'Customer Dashboard',
    },
    {
      id: 'staff' as const,
      label: 'Staff & Admin',
      tagline: 'Operations & Management',
      desc: 'Internal RAY staff, housing officers, recruiters, and compliance team',
      icon: Shield,
      dashboard: 'Admin Command Center',
    },
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (selectedRole === 'employer' && !form.companyName.trim()) {
      setError('Please enter your Company / Organization name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const actualRole = selectedRole === 'staff' ? staffSubRole : selectedRole
      const { user } = await neonSignUp({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        role: actualRole,
        companyName: selectedRole === 'employer' ? form.companyName : undefined,
      })

      setUser({ id: user.id, email: user.email, name: user.name, role: user.role })

      if (selectedRole === 'candidate') navigate('seeker-dashboard')
      else if (selectedRole === 'employer') navigate('employer-dashboard')
      else if (selectedRole === 'customer') navigate('customer-dashboard')
      else navigate('admin-dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentRoleConfig = roles.find((r) => r.id === selectedRole)!

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <button
          id="back-to-website-btn"
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to website
        </button>

        <Card className="border-[#D1D9E6] shadow-xl bg-white overflow-hidden">
          <CardHeader className="text-center pb-6 pt-8 px-6 bg-gradient-to-b from-[#FAF8F5] to-white border-b border-gray-100">
            <img
              src="/images/logo.jpg"
              alt="RAY Staffing Consulting"
              className="mx-auto mb-3 h-14 w-14 rounded-xl object-cover shadow-sm"
            />
            <CardTitle className="text-2xl font-bold text-[#0B1D33]">Create your RAY Account</CardTitle>
            <CardDescription className="text-sm text-[#5A6B7F] mt-1 max-w-md mx-auto">
              Select your role below to register and access your personalized RAY dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* ── Step 1: Select Your Role ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-[#0B1D33]">
                    1. Select Your Account Role <span className="text-red-500">*</span>
                  </Label>
                  <span className="text-xs text-[#C4942A] font-medium">
                    Accessing: {currentRoleConfig.dashboard}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon
                    const isSelected = selectedRole === r.id
                    return (
                      <button
                        key={r.id}
                        type="button"
                        id={`role-select-${r.id}`}
                        onClick={() => setSelectedRole(r.id)}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0B1D33] bg-[#F7F9FC] shadow-sm ring-1 ring-[#0B1D33]'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected ? 'bg-[#0B1D33] text-[#C4942A]' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#0B1D33]">{r.label}</div>
                              <div className="text-[11px] font-medium text-[#C4942A] uppercase tracking-wider">
                                {r.tagline}
                              </div>
                            </div>
                          </div>

                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'bg-[#0B1D33] border-[#0B1D33] text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Contextual Role Options ── */}
              {selectedRole === 'employer' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-4"
                >
                  <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                    Employer &amp; Organization Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName" className="text-xs font-medium text-gray-700">
                        Company / Organization Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        value={form.companyName}
                        onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                        placeholder="e.g. Care Horizon Ltd, NHS Trust"
                        required
                        className="bg-white border-gray-300"
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="industry" className="text-xs font-medium text-gray-700">
                        Sector / Industry
                      </Label>
                      <Input
                        id="industry"
                        value={form.industry}
                        onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                        placeholder="e.g. Healthcare, Social Care, Corporate"
                        className="bg-white border-gray-300"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedRole === 'staff' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    RAY Department / Administrative Assignment
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="staffRole" className="text-xs font-medium text-gray-700">
                      Departmental Role
                    </Label>
                    <select
                      id="staffRole"
                      value={staffSubRole}
                      onChange={(e) => setStaffSubRole(e.target.value as typeof staffSubRole)}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B1D33]"
                      disabled={loading}
                    >
                      <option value="SUPER_ADMIN">Central Operations &amp; Management (Super Admin)</option>
                      <option value="HOUSING_ADMIN">Housing Services &amp; Property Officer</option>
                      <option value="RECRUITMENT_ADMIN">Specialist Recruitment &amp; Healthcare Lead</option>
                      <option value="HR_ADMIN">HR Consulting &amp; Employment Law Lead</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {selectedRole === 'customer' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3"
                >
                  <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    Housing Tenancy Details (Optional)
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tenancyRef" className="text-xs font-medium text-gray-700">
                      Tenancy Reference / Property Postcode
                    </Label>
                    <Input
                      id="tenancyRef"
                      value={form.tenancyRef}
                      onChange={(e) => setForm((f) => ({ ...f, tenancyRef: e.target.value }))}
                      placeholder="e.g. TEN-84920 or SE1 7PB"
                      className="bg-white border-gray-300"
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Personal & Login Details ── */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <Label className="text-sm font-semibold text-[#0B1D33] block">
                  2. Account Credentials &amp; Contact
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reg-name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. John Smith"
                      required
                      className="border-[#D1D9E6]"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. 07700 900123"
                      className="border-[#D1D9E6]"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.co.uk"
                    required
                    className="border-[#D1D9E6]"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">
                      Password (min. 8 chars) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        placeholder="At least 8 characters"
                        required
                        className="border-[#D1D9E6] pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B7F] hover:text-[#0B1D33] cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                        placeholder="Repeat your password"
                        required
                        className="border-[#D1D9E6] pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B7F] hover:text-[#0B1D33] cursor-pointer"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Submit Button ── */}
              <div className="pt-2">
                <Button
                  type="submit"
                  id="submit-register-button"
                  disabled={loading}
                  className="w-full bg-[#0B1D33] hover:bg-[#153355] text-white font-semibold h-12 text-base shadow-md cursor-pointer transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-[#5A6B7F]">
                Already have an account?{' '}
                <button
                  type="button"
                  id="switch-to-login-button"
                  onClick={() => navigate('login')}
                  className="text-[#C4942A] font-semibold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export function RegisterEmployerPage() {
  const { navigate, setUser } = useAppStore()
  const [form, setForm] = useState({ companyName: '', email: '', name: '', password: '', phone: '', industry: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { user } = await neonSignUp({ email: form.email, password: form.password, name: form.name, phone: form.phone, role: 'employer' })
      setUser({ id: user.id, email: user.email, name: user.name, role: user.role })
      navigate('employer-dashboard')
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <button onClick={() => navigate('employers')} className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6"><ArrowLeft className="h-4 w-4" /> Back</button>
        <Card className="border-[#D1D9E6] shadow-lg">
          <CardHeader className="text-center pb-4">
            <img src="/images/logo.jpg" alt="RAY" className="mx-auto mb-3 h-14 w-14 rounded-xl object-cover" />
            <CardTitle className="text-xl">Create Employer Account</CardTitle>
            <CardDescription>Start finding exceptional talent with RAY</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Company name</Label><Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} required className="border-[#D1D9E6]" disabled={loading} /></div>
                <div className="space-y-2"><Label>Industry</Label><Input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="e.g. Healthcare" className="border-[#D1D9E6]" disabled={loading} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Contact name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="border-[#D1D9E6]" disabled={loading} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="border-[#D1D9E6]" disabled={loading} /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="border-[#D1D9E6]" disabled={loading} /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 8 characters" className="border-[#D1D9E6]" disabled={loading} /></div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C4942A] hover:bg-[#B38524] text-white h-11">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating...</span> : 'Create Employer Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export function RegisterCandidatePage() {
  const { navigate, setUser } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { user } = await neonSignUp({ email: form.email, password: form.password, name: form.name, phone: form.phone, role: 'candidate' })
      setUser({ id: user.id, email: user.email, name: user.name, role: user.role })
      navigate('seeker-dashboard')
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button onClick={() => navigate('job-seekers')} className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6"><ArrowLeft className="h-4 w-4" /> Back</button>
        <Card className="border-[#D1D9E6] shadow-lg">
          <CardHeader className="text-center pb-4">
            <img src="/images/logo.jpg" alt="RAY" className="mx-auto mb-3 h-14 w-14 rounded-xl object-cover" />
            <CardTitle className="text-xl">Create Job Seeker Profile</CardTitle>
            <CardDescription>Find your next opportunity with RAY</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-2"><Label>Full name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="border-[#D1D9E6]" disabled={loading} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="border-[#D1D9E6]" disabled={loading} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="border-[#D1D9E6]" disabled={loading} /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 8 characters" className="border-[#D1D9E6]" disabled={loading} /></div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C4942A] hover:bg-[#B38524] text-white h-11">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating...</span> : 'Create Your Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
