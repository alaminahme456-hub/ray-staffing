'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Shield, Bell, Mail, Puzzle, Globe, Save, Eye, EyeOff, Lock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
}

const sections: SettingSection[] = [
  { id: 'general', title: 'General', description: 'Platform name, URL, and basic settings', icon: Globe, color: 'bg-[#1A3A5C] text-white' },
  { id: 'security', title: 'Security', description: 'Password policies, 2FA, and session management', icon: Shield, color: 'bg-[#0B1D33] text-white' },
  { id: 'notifications', title: 'Notifications', description: 'Email and in-app notification preferences', icon: Bell, color: 'bg-[#C4942A] text-white' },
  { id: 'email', title: 'Email', description: 'SMTP configuration and email templates', icon: Mail, color: 'bg-green-600 text-white' },
  { id: 'integrations', title: 'Integrations', description: 'Third-party service connections', icon: Puzzle, color: 'bg-purple-600 text-white' },
]

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general')
  const [platformName, setPlatformName] = useState('RAY Staffing Consulting')
  const [platformUrl, setPlatformUrl] = useState('https://raystaffing.co.uk')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [require2FA, setRequire2FA] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [smtpHost, setSmtpHost] = useState('smtp.raystaffing.co.uk')
  const [smtpPort, setSmtpPort] = useState('587')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1D33]">Platform Settings</h1>
        <p className="text-[#5A6B7F] mt-1">Configure your platform preferences and integrations</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              className={`shrink-0 gap-2 ${
                activeSection === section.id
                  ? 'bg-[#0B1D33] text-white hover:bg-[#1A3A5C]'
                  : 'border-[#D1D9E6] text-[#5A6B7F] hover:bg-[#F0F4F8]'
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.title}</span>
            </Button>
          )
        })}
      </div>

      {/* General Settings */}
      {activeSection === 'general' && (
        <motion.div
          key="general"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0B1D33]">General Settings</CardTitle>
              <CardDescription className="text-[#5A6B7F]">Configure basic platform information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformUrl">Platform URL</Label>
                  <Input
                    id="platformUrl"
                    value={platformUrl}
                    onChange={(e) => setPlatformUrl(e.target.value)}
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-xs text-[#5A6B7F] mt-1">Disable public access to the platform</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeSection === 'security' && (
        <motion.div
          key="security"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0B1D33]">Security Settings</CardTitle>
              <CardDescription className="text-[#5A6B7F]">Manage security policies and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-xs text-[#5A6B7F] mt-1">Enforce 2FA for all admin accounts</p>
                </div>
                <Switch checked={require2FA} onCheckedChange={setRequire2FA} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value="sk-ray-xxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeSection === 'notifications' && (
        <motion.div
          key="notifications"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0B1D33]">Notification Settings</CardTitle>
              <CardDescription className="text-[#5A6B7F]">Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-[#5A6B7F] mt-1">Send email alerts for important events</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-xs text-[#5A6B7F] mt-1">Allow sending marketing communications</p>
                </div>
                <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Email Settings */}
      {activeSection === 'email' && (
        <motion.div
          key="email"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0B1D33]">Email Configuration</CardTitle>
              <CardDescription className="text-[#5A6B7F]">Configure SMTP settings for outgoing emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input id="smtpUser" value="noreply@raystaffing.co.uk" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPass">SMTP Password</Label>
                <div className="relative">
                  <Input
                    id="smtpPass"
                    type={showPassword ? 'text' : 'password'}
                    value="••••••••••••"
                    readOnly
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Integrations Settings */}
      {activeSection === 'integrations' && (
        <motion.div
          key="integrations"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0B1D33]">Integrations</CardTitle>
              <CardDescription className="text-[#5A6B7F]">Manage third-party service connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Google Search Console', status: 'Not Connected', connected: false },
                { name: 'Stripe Payments', status: 'Connected', connected: true },
                { name: 'SendGrid Email', status: 'Connected', connected: true },
                { name: 'Slack Notifications', status: 'Not Connected', connected: false },
              ].map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between py-3 border-b border-[#D1D9E6] last:border-0"
                >
                  <div>
                    <p className="font-medium text-[#0B1D33]">{integration.name}</p>
                    <p className="text-xs text-[#5A6B7F]">{integration.status}</p>
                  </div>
                  <Button
                    variant={integration.connected ? 'outline' : 'default'}
                    size="sm"
                    className={
                      integration.connected
                        ? 'border-[#D1D9E6] text-[#5A6B7F]'
                        : 'bg-[#0B1D33] hover:bg-[#1A3A5C] text-white'
                    }
                  >
                    {integration.connected ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button className="bg-[#0B1D33] hover:bg-[#1A3A5C] text-white">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
