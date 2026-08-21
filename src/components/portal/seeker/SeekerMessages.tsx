'use client'

import { useState, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Send, Search, ArrowLeft, Loader2, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  subject: string | null
  body: string
  is_read: boolean
  created_at: string
}

interface Conversation {
  otherUserId: string
  otherUserName: string
  messages: Message[]
  unreadCount: number
  lastMessage: string
  lastTime: string
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return d.toLocaleDateString('en-GB', { weekday: 'short' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { weekday: 'short' }) + ', ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function ListSkeleton() {
  return (
    <div className="flex flex-col h-[600px]">
      <div className="p-3 border-b border-[#D1D9E6]">
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex-1 space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border-b border-[#D1D9E6]/50">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SeekerMessages() {
  const user = useAppStore((s) => s.user)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const initialized = useRef(false)

  const loadMessages = useCallback(async () => {
    if (!user?.id) return
    const supabase = createClient()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

      if (error) throw error

      const msgs: Message[] = (data ?? []) as Message[]

      // Collect unique other user IDs
      const otherUserIds = new Set<string>()
      for (const m of msgs) {
        otherUserIds.add(m.sender_id === user.id ? m.receiver_id : m.sender_id)
      }

      // Fetch profiles for other users
      let profileMap: Record<string, string> = {}
      if (otherUserIds.size > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', Array.from(otherUserIds))

        for (const p of profiles ?? []) {
          profileMap[p.id] = p.name || 'Unknown User'
        }
      }

      // Group messages into conversations
      const convMap = new Map<string, Message[]>()
      for (const m of msgs) {
        const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id
        if (!convMap.has(otherId)) convMap.set(otherId, [])
        convMap.get(otherId)!.push(m)
      }

      const convs: Conversation[] = []
      for (const [otherId, convMsgs] of convMap) {
        const last = convMsgs[convMsgs.length - 1]
        const unread = convMsgs.filter(
          (m) => m.receiver_id === user.id && !m.is_read
        ).length

        convs.push({
          otherUserId: otherId,
          otherUserName: profileMap[otherId] || 'Unknown User',
          messages: convMsgs,
          unreadCount: unread,
          lastMessage: last?.body || '',
          lastTime: last?.created_at || '',
        })
      }

      // Sort by last message time (most recent first)
      convs.sort(
        (a, b) =>
          new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
      )

      setConversations(convs)

      // Auto-select first conversation
      if (convs.length > 0 && !selectedUserId) {
        setSelectedUserId(convs[0].otherUserId)
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  if (!initialized.current && user?.id) {
    initialized.current = true
    loadMessages()
  }

  if (!user) return null

  const filtered = conversations.filter((c) =>
    c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selected = conversations.find((c) => c.otherUserId === selectedUserId)
  const selectedMessages = selected?.messages ?? []

  async function handleSend() {
    if (!newMessage.trim() || !user.id || !selectedUserId) return
    setSending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedUserId,
        body: newMessage.trim(),
        is_read: false,
      })

      if (error) throw error

      setNewMessage('')
      toast.success('Message sent')

      // Reload messages to get the new one
      await loadMessages()
    } catch (err) {
      console.error('Failed to send message:', err)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) return <ListSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1D33]">Messages</h1>
        <p className="text-sm text-[#5A6B7F]">
          Communicate with RAY staff and manage your conversations
        </p>
      </div>

      <Card className="border-[#D1D9E6] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[600px]">
          {/* Conversation List */}
          <div className="border-r border-[#D1D9E6] flex flex-col">
            <div className="p-3 border-b border-[#D1D9E6]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-[#D1D9E6]"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#5A6B7F]">
                  <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                filtered.map((conv) => (
                  <button
                    key={conv.otherUserId}
                    onClick={() => setSelectedUserId(conv.otherUserId)}
                    className={`w-full flex items-start gap-3 p-3 text-left border-b border-[#D1D9E6]/50 transition-colors hover:bg-[#F7F9FC] ${
                      selectedUserId === conv.otherUserId ? 'bg-[#F0F4F8]' : ''
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A3A5C] text-white text-sm font-bold">
                      {conv.otherUserName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#0B1D33] truncate">
                          {conv.otherUserName}
                        </span>
                        <span className="text-[10px] text-[#5A6B7F] shrink-0 ml-2">
                          {conv.lastTime ? formatTime(conv.lastTime) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A6B7F] mt-1 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4942A] text-[10px] font-bold text-white px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Message View */}
          <div className="flex flex-col">
            {selected ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-[#D1D9E6]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden shrink-0 text-[#5A6B7F]"
                    onClick={() => setSelectedUserId(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A3A5C] text-white text-sm font-bold">
                    {selected.otherUserName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0B1D33]">
                      {selected.otherUserName}
                    </h3>
                    <p className="text-xs text-[#5A6B7F]">{selectedMessages.length} messages</p>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedMessages.map((msg) => {
                      const isMe = msg.sender_id === user.id
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            isMe ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                              isMe
                                ? 'bg-[#0B1D33] text-white rounded-br-md'
                                : 'bg-[#F0F4F8] text-[#0B1D33] rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">
                              {msg.body}
                            </p>
                            <p
                              className={`text-[10px] mt-1 ${
                                isMe ? 'text-[#8899AA]' : 'text-[#5A6B7F]'
                              }`}
                            >
                              {formatMessageTime(msg.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </ScrollArea>
                <div className="p-3 border-t border-[#D1D9E6]">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="border-[#D1D9E6]"
                      disabled={sending}
                    />
                    <Button
                      size="icon"
                      className="shrink-0 bg-[#0B1D33] hover:bg-[#1A3A5C] text-white"
                      onClick={handleSend}
                      disabled={sending || !newMessage.trim()}
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#5A6B7F]">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
