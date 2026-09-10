'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HelpCircle,
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Wrench,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useAppStore } from '@/store/app-store'

const faqs = [
  {
    question: 'How do I report a maintenance issue?',
    answer: 'You can report a maintenance issue by visiting the "Requests" section from your dashboard. Click "New Request", select the appropriate category (e.g., Plumbing, Electrical), provide a description of the issue, set the priority, and submit. Our team will review and assign a contractor within 24-48 hours. For urgent issues like gas leaks or flooding, please call our emergency line immediately.',
  },
  {
    question: 'When is my rent payment due and how can I pay?',
    answer: 'Rent is due on the 1st of each month. We accept payment via Direct Debit (preferred), bank transfer, or standing order. Your payment details and history can be viewed in the "Payments" section. If you experience difficulties making a payment, please contact our Finance Team as soon as possible to discuss available options.',
  },
  {
    question: 'How do I update my contact details?',
    answer: 'You can update your phone number and correspondence address from the "My Profile" section. For email address changes, please contact our support team directly as this requires additional verification. Keeping your contact details up to date ensures you receive important notifications about your tenancy.',
  },
  {
    question: 'What happens at the end of my tenancy agreement?',
    answer: 'Approximately 2 months before your tenancy end date, we will contact you to discuss renewal options. If you wish to renew, a new agreement will be prepared. If you decide to leave, we will arrange a checkout inspection and provide guidance on the deposit return process. Your deposit is protected by a government-approved scheme.',
  },
  {
    question: 'Can I make alterations to the property?',
    answer: 'Most structural or permanent alterations require prior written permission from RAY Staffing Consulting. Minor decorative changes such as painting are generally permitted but please check with your Housing Officer first. Any unauthorised alterations may result in charges at the end of your tenancy. Always submit a request before making changes.',
  },
  {
    question: 'How do I access my tenancy documents?',
    answer: 'All your tenancy-related documents including your tenancy agreement, safety certificates, rent statements, and official letters are available in the "Documents" section. You can search, filter by type, preview, and download any document. If you cannot find a specific document, please contact your Housing Officer.',
  },
]

const emergencyContacts = [
  { label: 'Gas Emergency', number: '0800 111 999', icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
  { label: 'Electrical Emergency', number: '0800 111 999', icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
  { label: 'Water Emergency', number: '0345 672 3773', icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
]

function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )
}

export default function CustomerSupport() {
  const [loading, setLoading] = useState(true)
  const [formSubject, setFormSubject] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <PageSkeleton />

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <motion.div {...fadeIn} className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('customer-dashboard')}
          className="text-[#5A6B7F] hover:text-[#0B1D33]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Help & Support</h1>
          <p className="text-[#5A6B7F] mt-0.5">Find answers and get in touch with our team</p>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-[#0B1D33]">Frequently Asked Questions</CardTitle>
                <CardDescription className="text-xs">Common questions about your tenancy and account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-[#D1D9E6]">
                  <AccordionTrigger className="text-sm text-[#0B1D33] hover:text-[#C4942A] text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#5A6B7F] leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Support Form */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border-[#D1D9E6]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-[#0B1D33]">Contact Support</CardTitle>
                <CardDescription className="text-xs">Can't find what you're looking for? Send us a message.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="support-subject" className="text-sm text-[#0B1D33]">Subject</Label>
                <Input
                  id="support-subject"
                  placeholder="Brief summary of your enquiry"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-message" className="text-sm text-[#0B1D33]">Message</Label>
                <Textarea
                  id="support-message"
                  placeholder="Please describe your enquiry in detail..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  rows={5}
                  className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30 resize-none"
                />
              </div>
              <Button
                className="bg-[#C4942A] hover:bg-[#B3861F] text-white font-semibold"
                onClick={() => { setFormSubject(''); setFormMessage('') }}
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contacts & Office Info */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Emergency Contacts */}
        <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card className="border-red-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-red-700">Emergency Contacts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-50/50">
                  <div className="flex items-center gap-3">
                    {contact.icon}
                    <span className="text-sm text-[#0B1D33] font-medium">{contact.label}</span>
                  </div>
                  <a href={`tel:${contact.number}`} className="text-sm font-semibold text-red-600 hover:underline">
                    {contact.number}
                  </a>
                </div>
              ))}
              <p className="text-xs text-[#5A6B7F] mt-2">
                For life-threatening emergencies, always call 999.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Office Info */}
        <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-[#D1D9E6]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F4F8] text-[#1A3A5C]">
                  <Phone className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg text-[#0B1D33]">Contact Us</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#5A6B7F]" />
                <div>
                  <p className="text-sm font-medium text-[#0B1D33]">0161 234 5678</p>
                  <p className="text-xs text-[#5A6B7F]">General Enquiries</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#5A6B7F]" />
                <div>
                  <p className="text-sm font-medium text-[#0B1D33]">support@raystaffing.co.uk</p>
                  <p className="text-xs text-[#5A6B7F]">Email Support</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#5A6B7F]" />
                <div>
                  <p className="text-sm font-medium text-[#0B1D33]">Mon – Fri, 9:00 AM – 5:00 PM</p>
                  <p className="text-xs text-[#5A6B7F]">Office Hours</p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#D1D9E6]">
                <p className="text-xs text-[#5A6B7F]">
                  Out of hours emergencies: 0161 234 9999
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
