'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { LogIn, UserPlus, Building2, Briefcase, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export function LoginPage() {
  const { navigate, setUser } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
 setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid credentials'); return }

      setUser({ id: data.user.id, email: data.user.email, name: data.user.name || '', role: data.user.role })
      const role = data.user.role
      if (role === 'SUPER_ADMIN' || role === 'HOUSING_ADMIN' || role === 'RECRUITMENT_ADMIN' || role === 'HR_ADMIN' || role === 'LOCAL_ADMIN' || role === 'SUPPORT_STAFF') navigate('admin-dashboard')
      else if (role === 'customer') navigate('customer-dashboard')
      else if (role === 'candidate') navigate('seeker-dashboard')
      else if (role === 'employer') navigate('employer-dashboard')
      else navigate('home')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogins = [
    { label: 'Admin', email: 'admin@raystaffing.co.uk', desc: 'Full access' },
    { label: 'Customer', email: 'tenant@raystaffing.co.uk', desc: 'Housing tenant' },
    { label: 'Job Seeker', email: 'nurse@raystaffing.co.uk', desc: 'Candidate portal' },
    { label: 'Employer', email: 'nhs-trust@raystaffing.co.uk', desc: 'Recruitment portal' },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <button onClick={() => navigate('home')} className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A] rounded-sm">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </button>

        <Card className="border-[#D1D9E6] shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0B1D33]">
              <span className="text-2xl font-bold text-[#C4942A]">R</span>
            </div>
            <CardTitle className="text-xl text-[#0B1D33]">Sign in to RAY</CardTitle>
            <CardDescription>Access your RAY Staffing portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.co.uk" value={email} onChange={e => setEmail(e.target.value)} required className="border-[#D1D9E6]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="border-[#D1D9E6] pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B7F] hover:text-[#0B1D33]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#0B1D33] hover:bg-[#1A3A5C] text-white h-11">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Quick Login */}
            <div className="mt-6 pt-6 border-t border-[#D1D9E6]">
              <p className="text-xs font-medium text-[#5A6B7F] text-center mb-3">DEMO ACCOUNTS (password: demo1234)</p>
              <div className="grid grid-cols-2 gap-2">
                {quickLogins.map(ql => (
                  <button key={ql.email} onClick={() => { setEmail(ql.email); setPassword('demo1234') }} className="flex flex-col items-start rounded-lg border border-[#D1D9E6] p-2.5 text-left hover:bg-[#F0F4F8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4942A]">
                    <span className="text-xs font-semibold text-[#0B1D33]">{ql.label}</span>
                    <span className="text-[10px] text-[#5A6B7F] truncate w-full">{ql.email}</span>
                  </button>
                ))}
              </div>
            </div>
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
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', accountType: 'candidate' as 'candidate' | 'employer' | 'customer' })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true); setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: form.accountType === 'employer' ? 'employer' : form.accountType === 'customer' ? 'customer' : 'candidate' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      setUser({ id: data.user.id, email: data.user.email, name: data.user.name || '', role: data.user.role })
      if (form.accountType === 'candidate') navigate('seeker-dashboard')
      else if (form.accountType === 'employer') navigate('employer-dashboard')
      else navigate('customer-dashboard')
    } catch {
      setError('Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <button onClick={() => navigate('home')} className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </button>
        <Card className="border-[#D1D9E6] shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0B1D33]">
              <span className="text-2xl font-bold text-[#C4942A]">R</span>
            </div>
            <CardTitle className="text-xl text-[#0B1D33]">Create your RAY account</CardTitle>
            <CardDescription>Join RAY Staffing Consulting</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-2">
                <Label>Account type</Label>
                <Tabs value={form.accountType} onValueChange={v => setForm(f => ({ ...f, accountType: v as typeof f.accountType }))}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="candidate" className="text-xs"><Briefcase className="h-3.5 w-3.5 mr-1" /> Job Seeker</TabsTrigger>
                    <TabsTrigger value="employer" className="text-xs"><Building2 className="h-3.5 w-3.5 mr-1" /> Employer</TabsTrigger>
                    <TabsTrigger value="customer" className="text-xs"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Customer</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" required className="border-[#D1D9E6]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email address</Label>
                <Input id="reg-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.co.uk" required className="border-[#D1D9E6]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="07700 900000" className="border-[#D1D9E6]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters" required className="border-[#D1D9E6]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input id="confirm-password" type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Repeat password" required className="border-[#D1D9E6]" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C4942A] hover:bg-[#B38524] text-white h-11">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-[#5A6B7F]">
              Already have an account?{' '}
              <button onClick={() => navigate('login')} className="text-[#1A3A5C] font-medium hover:underline">Sign in</button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export function RegisterEmployerPage() {
  const { navigate } = useAppStore()
  const [form, setForm] = useState({ companyName: '', email: '', name: '', password: '', phone: '', industry: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: 'employer' }) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Registration failed'); return }
      const data = await res.json()
      useAppStore.getState().setUser({ id: data.user.id, email: data.user.email, name: data.user.name, role: 'employer' })
      navigate('employer-dashboard')
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <button onClick={() => navigate('employers')} className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6"><ArrowLeft className="h-4 w-4" /> Back</button>
        <Card className="border-[#D1D9E6] shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0B1D33]"><span className="text-2xl font-bold text-[#C4942A]">R</span></div>
            <CardTitle className="text-xl">Create Employer Account</CardTitle>
            <CardDescription>Start finding exceptional talent with RAY</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Company name</Label><Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} required className="border-[#D1D9E6]" /></div>
                <div className="space-y-2"><Label>Industry</Label><Input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="e.g. Healthcare" className="border-[#D1D9E6]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Contact name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="border-[#D1D9E6]" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="border-[#D1D9E6]" /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="border-[#D1D9E6]" /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 8 characters" className="border-[#D1D9E6]" /></div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C4942A] hover:bg-[#B38524] text-white h-11">{loading ? 'Creating...' : 'Create Employer Account'}</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export function RegisterCandidatePage() {
  const { navigate } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: 'candidate' }) })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Registration failed'); return }
      const data = await res.json()
      useAppStore.getState().setUser({ id: data.user.id, email: data.user.email, name: data.user.name, role: 'candidate' })
      navigate('seeker-dashboard')
    } catch { setError('Something went wrong') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC] py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button onClick={() => navigate('job-seekers')} className="flex items-center gap-1.5 text-sm text-[#5A6B7F] hover:text-[#0B1D33] mb-6"><ArrowLeft className="h-4 w-4" /> Back</button>
        <Card className="border-[#D1D9E6] shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0B1D33]"><span className="text-2xl font-bold text-[#C4942A]">R</span></div>
            <CardTitle className="text-xl">Create Job Seeker Profile</CardTitle>
            <CardDescription>Find your next opportunity with RAY</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              <div className="space-y-2"><Label>Full name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="border-[#D1D9E6]" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="border-[#D1D9E6]" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="border-[#D1D9E6]" /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 8 characters" className="border-[#D1D9E6]" /></div>
              <Button type="submit" disabled={loading} className="w-full bg-[#C4942A] hover:bg-[#B38524] text-white h-11">{loading ? 'Creating...' : 'Create Your Profile'}</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
