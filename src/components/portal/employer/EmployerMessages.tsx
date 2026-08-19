'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Circle,
  ArrowLeft,
  Phone,
  Mail,
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
  isRAYStaff?: boolean
}

const conversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Laura Bennett',
    role: 'RAY Recruitment Consultant',
    initials: 'LB',
    lastMessage: 'I\'ve shortlisted three excellent ICU nurses for your review. Their profiles are in the candidates section.',
    time: '3:45 PM',
    unread: 2,
    isRAYStaff: true,
    messages: [
      { id: 'm1', sender: 'other', text: 'Good afternoon! I wanted to update you on the ICU nursing vacancies.', time: '2:10 PM' },
      { id: 'm2', sender: 'me', text: 'Hi Laura, any progress on that?', time: '2:15 PM' },
      { id: 'm3', sender: 'other', text: 'Yes! We\'ve had a strong response. 24 applications so far and I\'ve reviewed them all against your person specification.', time: '2:30 PM' },
      { id: 'm4', sender: 'me', text: 'That\'s great. How many would you recommend we shortlist?', time: '2:45 PM' },
      { id: 'm5', sender: 'other', text: 'I\'ve shortlisted three excellent ICU nurses for your review. Their profiles are in the candidates section.', time: '3:45 PM' },
      { id: 'm6', sender: 'other', text: 'Two of them are available immediately and the third is on one month\'s notice. All have NHS ICU experience.', time: '3:46 PM' },
    ],
  },
  {
    id: 'conv-2',
    name: 'Aisha Patel',
    role: 'Candidate – Staff Nurse ICU',
    initials: 'AP',
    lastMessage: 'Thank you for the interview invitation. I\'m very much looking forward to it.',
    time: '1:20 PM',
    unread: 1,
    isRAYStaff: false,
    messages: [
      { id: 'm7', sender: 'me', text: 'Dear Aisha, following your successful application, we would like to invite you for an interview.', time: '11:00 AM' },
      { id: 'm8', sender: 'other', text: 'Thank you so much! I\'d be delighted to attend. What date and time would suit?', time: '11:30 AM' },
      { id: 'm9', sender: 'me', text: 'We have availability on 21st August at 11:30 AM. This would be an in-person interview at The Royal London Hospital.', time: '12:00 PM' },
      { id: 'm10', sender: 'other', text: 'Thank you for the interview invitation. I\'m very much looking forward to it.', time: '1:20 PM' },
    ],
  },
  {
    id: 'conv-3',
    name: 'David Okonkwo',
    role: 'RAY Compliance Officer',
    initials: 'DO',
    lastMessage: 'All DBS checks for your latest placements have been completed and uploaded to the portal.',
    time: 'Yesterday',
    unread: 0,
    isRAYStaff: true,
    messages: [
      { id: 'm11', sender: 'other', text: 'Hi Claire, I\'m following up on the compliance checks for the three new starters.', time: 'Yesterday, 10:00 AM' },
      { id: 'm12', sender: 'me', text: 'Hi David, yes – any updates on the DBS and right-to-work checks?', time: 'Yesterday, 10:30 AM' },
      { id: 'm13', sender: 'other', text: 'All DBS checks for your latest placements have been completed and uploaded to the portal.', time: 'Yesterday, 2:15 PM' },
    ],
  },
  {
    id: 'conv-4',
    name: 'James Okafor',
    role: 'Candidate – Senior Physiotherapist',
    initials: 'JO',
    lastMessage: 'Could you share more details about the rotational aspect of the role?',
    time: '16 Aug',
    unread: 0,
    isRAYStaff: false,
    messages: [
      { id: 'm14', sender: 'other', text: 'Hello, I saw the Senior Physiotherapist vacancy on the RAY portal and I\'m very interested.', time: '16 Aug, 9:00 AM' },
      { id: 'm15', sender: 'me', text: 'Hi James, great to hear from you. The role involves working across MSK, neuro, and respiratory teams on a rotational basis.', time: '16 Aug, 10:00 AM' },
      { id: 'm16', sender: 'other', text: 'Could you share more details about the rotational aspect of the role?', time: '16 Aug, 11:30 AM' },
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

export default function EmployerMessages() {
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
          onClick={() => navigate('employer-dashboard')}
          className="text-[#5A6B7F] hover:text-[#0B1D33]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Messages</h1>
          <p className="text-[#5A6B7F] mt-0.5">Communicate with candidates and RAY staff</p>
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
                    {conv.isRAYStaff && (
                      <span className="inline-block mt-0.5 text-[9px] font-medium text-[#C4942A]">RAY Staff</span>
                    )}
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0B1D33]">{activeConversation.name}</p>
              <p className="text-xs text-[#5A6B7F]">{activeConversation.role}</p>
            </div>
            {activeConversation.isRAYStaff && (
              <span className="text-[10px] font-medium text-[#C4942A] bg-[#C4942A]/10 px-2 py-1 rounded-md">RAY Staff</span>
            )}
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
