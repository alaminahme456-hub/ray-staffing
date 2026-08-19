'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChevronRight, MapPin, Mail, Phone, Clock, Send, CheckCircle } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

export default function ContactPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would POST to an API
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0B1D33] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.nav variants={fadeInUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <button onClick={() => navigate('home')} className="hover:text-white transition-colors">Home</button>
              <ChevronRight className="size-4" />
              <span className="text-white">Contact</span>
            </motion.nav>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Get in <span className="text-[#C4942A]">Touch</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              Have a question about our services or want to discuss how RAY can support your organisation? Our team is ready to help. Reach out using the form below or contact us directly.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="lg:col-span-2"
            >
              <motion.div variants={fadeInUp}>
                <Card className="bg-white border-[#D1D9E6]">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#0B1D33]">Send Us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-12">
                        <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[#0B1D33] mb-2">Message Sent Successfully</h3>
                        <p className="text-[#5A6B7F] mb-6">Thank you for contacting RAY. Our team will review your message and respond within one working day.</p>
                        <Button
                          onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                          variant="outline"
                          className="border-[#0B1D33] text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-[#0B1D33]">Full Name *</Label>
                            <Input
                              id="name"
                              required
                              placeholder="John Smith"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="bg-[#F7F9FC] border-[#D1D9E6]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-[#0B1D33]">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="bg-[#F7F9FC] border-[#D1D9E6]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-[#0B1D33]">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="020 1234 5678"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="bg-[#F7F9FC] border-[#D1D9E6]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#0B1D33]">Subject *</Label>
                            <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })} required>
                              <SelectTrigger className="w-full bg-[#F7F9FC] border-[#D1D9E6]">
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="housing">Housing Services Enquiry</SelectItem>
                                <SelectItem value="hr">HR & Compliance Enquiry</SelectItem>
                                <SelectItem value="recruitment">Recruitment Enquiry</SelectItem>
                                <SelectItem value="healthcare">Healthcare Staffing Enquiry</SelectItem>
                                <SelectItem value="general">General Enquiry</SelectItem>
                                <SelectItem value="complaint">Complaint</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium text-[#0B1D33]">Message *</Label>
                          <Textarea
                            id="message"
                            required
                            placeholder="Please describe your enquiry..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="bg-[#F7F9FC] border-[#D1D9E6] resize-none"
                          />
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          className="bg-[#C4942A] hover:bg-[#B38523] text-white font-semibold px-8 h-11 w-full sm:w-auto"
                        >
                          <Send className="mr-2 size-4" />
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <Card className="bg-white border-[#D1D9E6]">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0B1D33]">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-[#0B1D33] flex items-center justify-center shrink-0">
                        <MapPin className="size-5 text-[#C4942A]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0B1D33] text-sm">Address</h4>
                        <p className="text-[#5A6B7F] text-sm leading-relaxed">RAY Staffing Consulting Ltd<br />London, England<br />United Kingdom</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-[#0B1D33] flex items-center justify-center shrink-0">
                        <Mail className="size-5 text-[#C4942A]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0B1D33] text-sm">Email</h4>
                        <p className="text-[#5A6B7F] text-sm">info@raystaffing.co.uk</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-[#0B1D33] flex items-center justify-center shrink-0">
                        <Phone className="size-5 text-[#C4942A]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0B1D33] text-sm">Phone</h4>
                        <p className="text-[#5A6B7F] text-sm">020 1234 5678</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-white border-[#D1D9E6]">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0B1D33]">Office Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="size-4 text-[#C4942A] shrink-0" />
                      <div className="text-sm">
                        <p className="text-[#0B1D33] font-medium">Monday – Friday</p>
                        <p className="text-[#5A6B7F]">09:00 – 17:30 GMT</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="size-4 text-[#5A6B7F] shrink-0" />
                      <div className="text-sm">
                        <p className="text-[#0B1D33] font-medium">Saturday – Sunday</p>
                        <p className="text-[#5A6B7F]">Closed</p>
                      </div>
                    </div>
                    <p className="text-[#5A6B7F] text-xs leading-relaxed pt-2 border-t border-[#D1D9E6]">
                      For urgent healthcare staffing enquiries outside office hours, please email urgent@raystaffing.co.uk and a member of our team will respond as soon as possible.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
