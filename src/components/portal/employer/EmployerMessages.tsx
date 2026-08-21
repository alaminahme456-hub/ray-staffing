'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Circle,
  ArrowLeft,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MessageRow {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  is_read: boolean | null
}

interface Conversation {
  other_user_id: string
  other_user_name: string
  other_user_role: string | null
  lastMessage: string
  lastTime: string
  unread: number
  messages: MessageRow[]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const avatarColors = [
  'bg-[#1A3A5C] text-white',
  'bg-[#C4942A] text-white',
  'bg-emerald-600 text-white',
  'bg-purple-600 text-white',
]

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerMessages() {
  const supabase = useMemo(() => createClient(), [])
  const user = useAppStore((s) => s.user)
  const navigate = useAppStore((s) => s.navigate)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasFetched = useRef(false)

  async function fetchMessages() {
    if (!user?.id) return
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })
      if (error) throw error

      const msgs: MessageRow[] = (data || []).map((m: Record<string, unknown>) => ({
        id: m.id as string,
        sender_id: m.sender_id as string,
        receiver_id: m.receiver_id as string,
        content: m.content as string,
        created_at: m.created_at as string,
        is_read: (m.is_read as boolean) ?? false,
      }))

      /* Group by other user */
      const otherUserIds = new Set<string>()
      for (const m of msgs) {
        otherUserIds.add(m.sender_id === user.id ? m.receiver_id : m.sender_id)
      }

      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, name, role')
        .in('id', [...otherUserIds])
      if (profErr) throw profErr

      const profileMap = new Map<string, { name: string; role: string | null }>()
      for (const p of profiles || []) {
        profileMap.set(p.id, { name: p.name || 'Unknown User', role: p.role || null })
      }

      /* Build conversations */
      const convMap = new Map<string, MessageRow[]>()
      for (const m of msgs) {
        const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id
        if (!convMap.has(otherId)) convMap.set(otherId, [])
        convMap.get(otherId)!.push(m)
      }

      const convs: Conversation[] = []
      for (const [otherId, convMsgs] of convMap) {
        const prof = profileMap.get(otherId) || { name: 'Unknown User', role: null }
        const last = convMsgs[convMsgs.length - 1]
        const unread = convMsgs.filter(
          (m) => m.receiver_id === user.id && !m.is_read
        ).length
        convs.push({
          other_user_id: otherId,
          other_user_name: prof.name,
          other_user_role: prof.role,
          lastMessage: last?.content || '',
          lastTime: last?.created_at || '',
          unread,
          messages: convMsgs,
        })
      }

      /* Sort by last message time, newest first */
      convs.sort(
        (a, b) =>
          new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
      )

      setConversations(convs)
      if (convs.length > 0 && !activeConv) {
        setActiveConv(convs[0])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  if (!hasFetched.current && user?.id) {
    hasFetched.current = true
    fetchMessages()
  }

  /* Scroll to bottom when active conversation changes */
  if (activeConv && messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  /* ---- handlers ---- */

  const handleSend = useCallback(async () => {
    if (!messageInput.trim() || !activeConv || !user?.id) return
    const text = messageInput.trim()
    setMessageInput('')
    setSending(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: activeConv.other_user_id,
          content: text,
          is_read: false,
        })
        .select()
        .single()
      if (error) throw error

      const newMsg: MessageRow = {
        id: data.id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
        created_at: data.created_at,
        is_read: data.is_read,
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.other_user_id !== activeConv.other_user_id) return c
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: text,
            lastTime: data.created_at,
          }
        })
      )

      setActiveConv((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMsg],
              lastMessage: text,
              lastTime: data.created_at,
            }
          : prev
      )
    } catch {
      toast.error('Failed to send message')
      setMessageInput(text)
    } finally {
      setSending(false)
    }
  }, [supabase, messageInput, activeConv, user?.id])

  const selectConversation = useCallback(
    (conv: Conversation) => {
      setActiveConv(conv)
      /* Mark messages as read */
      if (user?.id) {
        const unreadIds = conv.messages
          .filter((m) => m.receiver_id === user.id && !m.is_read)
          .map((m) => m.id)
        if (unreadIds.length > 0) {
          supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds)
          setConversations((prev) =>
            prev.map((c) =>
              c.other_user_id === conv.other_user_id
                ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, is_read: true })) }
                : c
            )
          )
        }
      }
    },
    [user?.id, supabase]
  )

  /* ---- derived ---- */

  const filteredConversations = conversations.filter((c) =>
    c.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  /* ---- early returns ---- */

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#5A6B7F]">Please log in to view messages.</p>
      </div>
    )
  }

  /* Get color index for consistent avatar coloring */
  function getConvColorIndex(conv: Conversation): number {
    const idx = conversations.indexOf(conv)
    return idx >= 0 ? idx % avatarColors.length : 0
  }

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
              {filteredConversations.map((conv) => {
                const isActive = activeConv?.other_user_id === conv.other_user_id
                const colorIdx = getConvColorIndex(conv)
                return (
                  <button
                    key={conv.other_user_id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-[#F0F4F8]'
                        : 'hover:bg-[#F7F9FC]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className={avatarColors[colorIdx]}>
                        <AvatarFallback className="text-xs font-semibold">
                          {getInitials(conv.other_user_name)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.unread > 0 && (
                        <Circle className="w-2.5 h-2.5 fill-[#C4942A] text-[#C4942A] absolute -top-0.5 -right-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${conv.unread > 0 ? 'font-semibold text-[#0B1D33]' : 'font-medium text-[#0B1D33]'}`}>
                          {conv.other_user_name}
                        </p>
                        <span className="text-[10px] text-[#5A6B7F] shrink-0 ml-2">{conv.lastTime ? formatTime(conv.lastTime) : ''}</span>
                      </div>
                      <p className="text-xs text-[#5A6B7F] truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#C4942A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Message View */}
        <Card className="border-[#D1D9E6] flex flex-col overflow-hidden">
          {activeConv ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center gap-3 p-4 border-b border-[#D1D9E6]">
                <Avatar className={avatarColors[getConvColorIndex(activeConv)]}>
                  <AvatarFallback className="text-xs font-semibold">
                    {getInitials(activeConv.other_user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B1D33]">{activeConv.other_user_name}</p>
                  <p className="text-xs text-[#5A6B7F]">{activeConv.other_user_role || 'User'}</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeConv.messages.map((msg) => {
                    const isMe = msg.sender_id === user.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isMe
                              ? 'bg-[#1A3A5C] text-white rounded-br-md'
                              : 'bg-[#F0F4F8] text-[#0B1D33] rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center gap-2 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-[10px] ${isMe ? 'text-gray-300' : 'text-[#5A6B7F]'}`}>
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
                      if (e.key === 'Enter' && !e.shiftKey && messageInput.trim()) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    disabled={sending}
                  />
                  <Button
                    className="bg-[#C4942A] hover:bg-[#B3861F] text-white shrink-0"
                    size="icon"
                    disabled={sending || !messageInput.trim()}
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[#D1D9E6]" />
                <p className="text-[#5A6B7F]">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
