'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Paperclip, Phone, Search, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const conversations = [
  {
    id: '1', name: 'Emily Carter', role: 'RAY Recruitment', lastMessage: 'Your interview for Healthcare Assistant has been scheduled for next Tuesday at 2pm.', time: '10:30', unread: 2,
    messages: [
      { id: 'm1', sender: 'them', content: 'Hi Sarah, thank you for your application for the Healthcare Assistant position at NHS Trust Birmingham.', time: 'Mon, 14:20' },
      { id: 'm2', sender: 'me', content: 'Thank you for getting back to me. I am very interested in this position.', time: 'Mon, 14:45' },
      { id: 'm3', sender: 'them', content: 'Great! We would like to invite you for an interview. Would next Tuesday at 2pm work for you?', time: 'Tue, 10:15' },
      { id: 'm4', sender: 'them', content: 'Your interview for Healthcare Assistant has been scheduled for next Tuesday at 2pm.', time: 'Tue, 10:30' },
    ]
  },
  {
    id: '2', name: 'James Thompson', role: 'RAY Support', lastMessage: 'Your DBS check documents have been received and are being processed.', time: 'Yesterday', unread: 0,
    messages: [
      { id: 'm5', sender: 'me', content: 'Hello, I wanted to check on the status of my DBS check.', time: 'Mon, 09:00' },
      { id: 'm6', sender: 'them', content: 'Your DBS check documents have been received and are being processed. We expect the results within 2 weeks.', time: 'Mon, 11:30' },
    ]
  },
  {
    id: '3', name: 'RAY Notifications', role: 'System', lastMessage: 'A new job matching your profile has been posted: Senior Staff Nurse - Manchester.', time: '2 days ago', unread: 1,
    messages: [
      { id: 'm7', sender: 'them', content: 'Job Alert: A new position matching your skills has been posted.\n\nSenior Staff Nurse - Manchester Royal Infirmary\nSalary: £35,000 - £42,000 per annum\nType: Full-time\n\nView details in the Jobs section of your dashboard.', time: 'Sun, 08:00' },
    ]
  },
]

export default function SeekerMessages() {
  const [selectedId, setSelectedId] = useState('1')
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const selected = conversations.find(c => c.id === selectedId)
  const filtered = conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1D33]">Messages</h1>
        <p className="text-sm text-[#5A6B7F]">Communicate with RAY staff and manage your conversations</p>
      </div>

      <Card className="border-[#D1D9E6] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[600px]">
          {/* Conversation List */}
          <div className="border-r border-[#D1D9E6] flex flex-col">
            <div className="p-3 border-b border-[#D1D9E6]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A6B7F]" />
                <Input placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 border-[#D1D9E6]" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filtered.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 text-left border-b border-[#D1D9E6]/50 transition-colors hover:bg-[#F7F9FC] ${selectedId === conv.id ? 'bg-[#F0F4F8]' : ''}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A3A5C] text-white text-sm font-bold">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#0B1D33] truncate">{conv.name}</span>
                      <span className="text-[10px] text-[#5A6B7F] shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <p className="text-xs text-[#5A6B7F] mt-0.5">{conv.role}</p>
                    <p className="text-xs text-[#5A6B7F] mt-1 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4942A] text-[10px] font-bold text-white px-1">{conv.unread}</span>
                  )}
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Message View */}
          <div className="flex flex-col">
            {selected ? (
              <>
                <div className="flex items-center gap-3 p-4 border-b border-[#D1D9E6]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A3A5C] text-white text-sm font-bold">{selected.name.charAt(0)}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0B1D33]">{selected.name}</h3>
                    <p className="text-xs text-[#5A6B7F]">{selected.role}</p>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selected.messages.map(msg => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.sender === 'me' ? 'bg-[#0B1D33] text-white rounded-br-md' : 'bg-[#F0F4F8] text-[#0B1D33] rounded-bl-md'}`}>
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-[#8899AA]' : 'text-[#5A6B7F]'}`}>{msg.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-3 border-t border-[#D1D9E6]">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0 text-[#5A6B7F]"><Paperclip className="h-4 w-4" /></Button>
                    <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." className="border-[#D1D9E6]" />
                    <Button size="icon" className="shrink-0 bg-[#0B1D33] hover:bg-[#1A3A5C] text-white"><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#5A6B7F]">
                <p>Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}