'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Bell,
  Shield,
  Trash2,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
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

export default function SeekerSettings() {
  // Account
  const [email, setEmail] = useState('amara.okafor@email.co.uk')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // Notification Preferences
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [jobAlerts, setJobAlerts] = useState(true)
  const [appUpdates, setAppUpdates] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [smsAlerts, setSmsAlerts] = useState(false)

  // Privacy
  const [profileVisible, setProfileVisible] = useState(true)
  const [shareWithEmployers, setShareWithEmployers] = useState(true)

  // State
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1200)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Settings</h1>
        <p className="text-[#5A6B7F] mt-1">Manage your account, notifications, and privacy preferences.</p>
      </motion.div>

      {/* Account Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C4942A]" /> Account Settings
            </CardTitle>
            <CardDescription className="text-xs">Update your email address or change your password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#5A6B7F]">Email Address</Label>
              <Input
                type="email"
                className="border-[#D1D9E6] h-9 text-sm max-w-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-[#0B1D33] mb-3">Change Password</p>
              <div className="space-y-3 max-w-sm">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#5A6B7F]">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPw ? 'text' : 'password'}
                      className="border-[#D1D9E6] h-9 text-sm pr-10"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B7F] hover:text-[#0B1D33]"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#5A6B7F]">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPw ? 'text' : 'password'}
                      className="border-[#D1D9E6] h-9 text-sm pr-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6B7F] hover:text-[#0B1D33]"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#5A6B7F]">Confirm New Password</Label>
                  <Input
                    type="password"
                    className="border-[#D1D9E6] h-9 text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-[#D1D9E6] text-[#0B1D33] text-xs">
                  <Lock className="w-3.5 h-3.5 mr-1.5" /> Update Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C4942A]" /> Notification Preferences
            </CardTitle>
            <CardDescription className="text-xs">Choose how and when you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">Email Notifications</p>
                <p className="text-xs text-[#5A6B7F]">Receive notifications via email</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} className="data-[state=checked]:bg-[#C4942A]" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">Job Alerts</p>
                <p className="text-xs text-[#5A6B7F]">Get notified about new matching jobs</p>
              </div>
              <Switch checked={jobAlerts} onCheckedChange={setJobAlerts} className="data-[state=checked]:bg-[#C4942A]" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">Application Updates</p>
                <p className="text-xs text-[#5A6B7F]">Receive updates on your application status</p>
              </div>
              <Switch checked={appUpdates} onCheckedChange={setAppUpdates} className="data-[state=checked]:bg-[#C4942A]" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">Marketing Emails</p>
                <p className="text-xs text-[#5A6B7F]">Receive industry news and career tips</p>
              </div>
              <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} className="data-[state=checked]:bg-[#C4942A]" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">SMS Alerts</p>
                <p className="text-xs text-[#5A6B7F]">Receive urgent notifications via SMS</p>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} className="data-[state=checked]:bg-[#C4942A]" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C4942A]" /> Privacy Settings
            </CardTitle>
            <CardDescription className="text-xs">Control who can see your profile and data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">Profile Visibility</p>
                <p className="text-xs text-[#5A6B7F]">Make your profile visible to registered employers</p>
              </div>
              <Switch checked={profileVisible} onCheckedChange={setProfileVisible} className="data-[state=checked]:bg-[#C4942A]" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0B1D33]">Share Data with Employers</p>
                <p className="text-xs text-[#5A6B7F]">Allow employers to see your CV and contact details</p>
              </div>
              <Switch checked={shareWithEmployers} onCheckedChange={setShareWithEmployers} className="data-[state=checked]:bg-[#C4942A]" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="bg-[#C4942A] hover:bg-[#b3851f] text-white"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" /> Saved</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Settings</>
          )}
        </Button>
      </div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-xs text-red-600/80">Irreversible and destructive actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-red-600/80 mt-0.5">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 text-xs shrink-0">
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-700">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm">
                      This will permanently delete your account, all applications, uploaded documents, and personal data from our systems. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">
                      Yes, delete my account
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
