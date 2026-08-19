'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  ArrowLeft,
  Send,
  Paperclip,
  Search,
  Circle,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'

interface Message {
  id: string
  sender: 'me' | 'other'
  text: string
  time: string
  hasAttachment?: boolean
  attachmentName?: string
}

interface Conversation {
  id: string
  name: string
  role: string
  initials: string
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
}

const conversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Sarah Mitchell',
    role: 'Housing Officer',
    initials: 'SM',
    lastMessage: 'Hi James, your repair has been scheduled for 20th August. The plumber will arrive between 9-11 AM.',
    time: '2:30 PM',
    unread: 2,
    messages: [
      { id: 'm1', sender: 'me', text: 'Hello Sarah, I wanted to follow up on my bathroom tap repair request.', time: '10:15 AM' },
      { id: 'm2', sender: 'other', text: 'Hi James, I can see the request REQ-2024-0092 is being processed. Let me check with the maintenance team.', time: '10:45 AM' },
      { id: 'm3', sender: 'other', text: 'Good news — the plumber can visit on Thursday 20th August. Would 9-11 AM work for you?', time: '11:30 AM' },
      { id: 'm4', sender: 'me', text: 'That works perfectly, thank you!', time: '11:45 AM' },
      { id: 'm5', sender: 'other', text: 'Hi James, your repair has been scheduled for 20th August. The plumber will arrive between 9-11 AM.', time: '2:30 PM' },
      { id: 'm6', sender: 'other', text: 'I\'ve also attached the job reference for your records.', time: '2:31 PM', hasAttachment: true, attachmentName: 'Job-REF-0092.pdf' },
    ],
  },
  {
    id: 'conv-2',
    name: 'David Chen',
    role: 'Finance Team',
    initials: 'DC',
    lastMessage: 'Your direct debit mandate has been updated. The next payment on 1st September will reflect the new amount.',
    time: 'Yesterday',
    unread: 1,
    messages: [
      { id: 'm7', sender: 'me', text: 'Hi, I noticed my May rent payment shows as failed. Can you help me understand what happened?', time: 'Yesterday, 9:00 AM' },
      { id: 'm8', sender: 'other', text: 'Hello James, I\'ve checked your account. The May payment failed due to insufficient funds on the payment date. The payment was retried on 3rd May and completed successfully.', time: 'Yesterday, 10:20 AM' },
      { id: 'm9', sender: 'me', text: 'Thank you for checking. I\'d like to update my direct debit to ensure this doesn\'t happen again.', time: 'Yesterday, 10:45 AM' },
      { id: 'm10', sender: 'other', text: 'Your direct debit mandate has been updated. The next payment on 1st September will reflect the new amount.', time: 'Yesterday, 3:15 PM' },
    ],
  },
  {
    id: 'conv-3',
    name: 'Emma Roberts',
    role: 'Customer Support',
    initials: 'ER',
    lastMessage: 'Your EPC certificate has been uploaded to your documents section. Let me know if you need anything else.',
    time: '14 Aug',
    unread: 0,
    messages: [
      { id: 'm11', sender: 'me', text: 'Hi, could you provide me with a copy of the EPC certificate for my property?', time: '14 Aug, 11:00 AM' },
      { id: 'm12', sender: 'other', text: 'Of course, James. I\'ll locate that and upload it to your portal.', time: '14 Aug, 11:30 AM' },
      { id: 'm13', sender: 'other', text: 'Your EPC certificate has been uploaded to your documents section. Let me know if you need anything else.', time: '14 Aug, 2:00 PM' },
    ],
  },
  {
    id: 'conv-4',
    name: 'Michael Thompson',
    role: 'Maintenance Manager',
    initials: 'MT',
    lastMessage: 'The annual gas safety inspection has been booked for 15th February 2027.',
    time: '10 Aug',
    unread: 0,
    messages: [
      { id: 'm14', sender: 'other', text: 'Hi James, this is a reminder that your annual gas safety inspection is coming up. We\'ll need access to your property.', time: '10 Aug, 9:00 AM' },
      { id: 'm15', sender: 'me', text: 'Thanks for the heads up. What date are you looking at?', time: '10 Aug, 9:30 AM' },
      { id: 'm16', sender: 'other', text: 'The annual gas safety inspection has been booked for 15th February 2027.', time: '10 Aug, 10:00 AM' },
    ],
  },
]

const avatarColors = [
  'bg-[#1A3A5C] text-white',
  'bg-[#C4942A] text-white',
  'bg-emerald-600 text-white',
  'bg-purple-600 text-white',
]

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-[300px_1fr] h-[500px]">
        <Skeleton className="rounded-xl" />
        <Skeleton className="rounded-xl" />
      </div>
    </div>
  )
}

export default function CustomerMessages() {
  const [loading, setLoading] = useState(true)
  const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useAppStore((s) => s.navigate)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation])

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('customer-dashboard')}
          className="text-[#5A6B7F] hover:text-[#0B1D33]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Messages</h1>
          <p className="text-[#5A6B7F] mt-0.5">Communicate with your housing team</p>
        </div>
      </motion.div>

      {/* Messaging Layout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-[320px_1fr] h-[calc(100vh-200px)] min-h-[400px]"
      >
        {/* Conversation List */}
        <Card className="border-[#D1D9E6] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#D1D9E6]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B7F]" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 border-[#D1D9E6] text-sm focus-visible:ring-[#C4942A]/30"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv, i) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    activeConversation.id === conv.id
                      ? 'bg-[#F0F4F8]'
                      : 'hover:bg-[#F7F9FC]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className={avatarColors[i % avatarColors.length]}>
                      <AvatarFallback className="text-xs font-semibold">{conv.initials}</AvatarFallback>
                    </Avatar>
                    {conv.unread > 0 && (
                      <Circle className="w-2.5 h-2.5 fill-[#C4942A] text-[#C4942A] absolute -top-0.5 -right-0.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conv.unread > 0 ? 'font-semibold text-[#0B1D33]' : 'font-medium text-[#0B1D33]'}`}>
                        {conv.name}
                      </p>
                      <span className="text-[10px] text-[#5A6B7F] shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <p className="text-xs text-[#5A6B7F] truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#C4942A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Message View */}
        <Card className="border-[#D1D9E6] flex flex-col overflow-hidden">
          {/* Conversation Header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#D1D9E6]">
            <Avatar className={avatarColors[conversations.indexOf(activeConversation) % avatarColors.length]}>
              <AvatarFallback className="text-xs font-semibold">{activeConversation.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-[#0B1D33]">{activeConversation.name}</p>
              <p className="text-xs text-[#5A6B7F]">{activeConversation.role}</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      msg.sender === 'me'
                        ? 'bg-[#1A3A5C] text-white rounded-br-md'
                        : 'bg-[#F0F4F8] text-[#0B1D33] rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-2 mt-1.5 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[10px] ${msg.sender === 'me' ? 'text-gray-300' : 'text-[#5A6B7F]'}`}>
                        {msg.time}
                      </span>
                      {msg.hasAttachment && (
                        <span className={`text-[10px] flex items-center gap-1 ${msg.sender === 'me' ? 'text-gray-300' : 'text-[#1A3A5C]'}`}>
                          <Paperclip className="w-3 h-3" />
                          {msg.attachmentName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Compose */}
          <div className="p-3 border-t border-[#D1D9E6]">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-[#5A6B7F] hover:text-[#1A3A5C] shrink-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="border-[#D1D9E6] focus-visible:ring-[#C4942A]/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && messageInput.trim()) {
                    setMessageInput('')
                  }
                }}
              />
              <Button
                className="bg-[#C4942A] hover:bg-[#B3861F] text-white shrink-0"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
