'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Shield,
  LogOut,
  Calendar,
  User,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

interface ProfileData {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string | null
  is_active: boolean | null
  created_at: string
}

function formatDateLong(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  )
}

export default function SeekerSettings() {
  const { user, logout } = useAppStore()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  const initialized = useRef(false)

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    const supabase = createClient()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data as ProfileData)
    } catch (err) {
      console.error('Failed to load profile:', err)
      toast.error('Failed to load account information')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  if (!initialized.current && user?.id) {
    initialized.current = true
    loadProfile()
  }

  if (!user) return null
  if (loading) return <PageSkeleton />

  const memberSince = profile?.created_at
    ? formatDateLong(profile.created_at)
    : 'N/A'

  function handleSignOut() {
    logout()
    toast.success('You have been signed out')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Settings</h1>
        <p className="text-[#5A6B7F] mt-1">Manage your account and preferences.</p>
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C4942A]" /> Account Information
            </CardTitle>
            <CardDescription className="text-xs">
              Your account details as registered with RAY Staffing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#5A6B7F]">Email Address</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#5A6B7F] shrink-0" />
                  <p className="text-sm font-medium text-[#0B1D33]">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#5A6B7F]">Full Name</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#5A6B7F] shrink-0" />
                  <p className="text-sm font-medium text-[#0B1D33]">
                    {profile?.name || user.name || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#5A6B7F]">Account Role</p>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#5A6B7F] shrink-0" />
                  <p className="text-sm font-medium text-[#0B1D33] capitalize">
                    {profile?.role || user.role || 'Candidate'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#5A6B7F]">
                  Member Since
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#5A6B7F] shrink-0" />
                  <p className="text-sm font-medium text-[#0B1D33]">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C4942A]" /> Account Status
            </CardTitle>
            <CardDescription className="text-xs">
              Current status of your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  profile?.is_active !== false ? 'bg-green-500' : 'bg-red-400'
                }`}
              />
              <p className="text-sm font-medium text-[#0B1D33]">
                {profile?.is_active !== false
                  ? 'Account is active'
                  : 'Account is deactivated'}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-xs text-red-600/80">
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-700">Sign Out</p>
                <p className="text-xs text-red-600/80 mt-0.5">
                  Sign out of your account on this device.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 text-xs shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-700">
                      Sign out of RAY?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                      You will be signed out and redirected to the homepage. You
                      can sign back in at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleSignOut}
                    >
                      Yes, sign me out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
