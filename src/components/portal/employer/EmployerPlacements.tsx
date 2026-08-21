'use client'

import { useState, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  UserCheck,
  Calendar,
  Eye,
  Briefcase,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import { toast } from 'sonner'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PlacementRow {
  id: string
  candidate_name: string
  candidate_email: string | null
  candidate_phone: string | null
  candidate_role: string | null
  job_title: string
  placed_at: string
  updated_at: string
  application_id: string
  cover_letter: string | null
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Skeleton className="h-8 w-56" />
      <div className="grid sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EmployerPlacements() {
  const supabase = useMemo(() => createClient(), [])
  const user = useAppStore((s) => s.user)

  const [placements, setPlacements] = useState<PlacementRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlacement, setSelectedPlacement] = useState<PlacementRow | null>(null)

  const hasFetched = useRef(false)

  async function fetchPlacements() {
    if (!user?.id) return
    try {
      /* Get all jobs for this employer */
      const { data: jobs, error: jobsErr } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('employer_id', user.id)
      if (jobsErr) throw jobsErr

      if (!jobs || jobs.length === 0) {
        setPlacements([])
        return
      }

      const jobMap = new Map(jobs.map((j) => [j.id, j.title]))
      const jobIds = jobs.map((j) => j.id)

      /* Get applications with status 'placed' for these jobs */
      const { data: applications, error: appErr } = await supabase
        .from('applications')
        .select('id, candidate_id, job_id, cover_letter, status, created_at, updated_at')
        .in('job_id', jobIds)
        .eq('status', 'placed')
        .order('updated_at', { ascending: false })
      if (appErr) throw appErr

      if (!applications || applications.length === 0) {
        setPlacements([])
        return
      }

      /* Get candidate profiles */
      const candidateIds = [...new Set(applications.map((a) => a.candidate_id))]
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, name, email, phone, role')
        .in('id', candidateIds)
      if (profErr) throw profErr

      const profileMap = new Map((profiles || []).map((p) => [p.id, p]))

      const rows: PlacementRow[] = applications.map((a) => {
        const prof = profileMap.get(a.candidate_id)
        return {
          id: a.id,
          candidate_name: prof?.name || 'Unknown Candidate',
          candidate_email: prof?.email || null,
          candidate_phone: prof?.phone || null,
          candidate_role: prof?.role || null,
          job_title: jobMap.get(a.job_id) || 'Unknown Job',
          placed_at: a.updated_at,
          updated_at: a.updated_at,
          application_id: a.id,
          cover_letter: a.cover_letter,
        }
      })

      setPlacements(rows)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load placements')
    } finally {
      setLoading(false)
    }
  }

  if (!hasFetched.current && user?.id) {
    hasFetched.current = true
    fetchPlacements()
  }

  /* ---- derived ---- */

  const summaryStats = [
    { label: 'Total Placed', value: placements.length, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'This Month', value: placements.filter((p) => {
      const d = new Date(p.placed_at)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length, color: 'text-amber-600 bg-amber-50' },
    { label: 'This Year', value: placements.filter((p) => new Date(p.placed_at).getFullYear() === new Date().getFullYear()).length, color: 'text-blue-600 bg-blue-50' },
  ]

  /* ---- early returns ---- */

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-[#5A6B7F]">Please log in to view placements.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1D33]">Placements</h1>
        <p className="text-[#5A6B7F] mt-0.5">Track your current employees and placement status</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-3 gap-4"
      >
        {summaryStats.map((s) => (
          <Card key={s.label} className="border-[#D1D9E6]">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1D33]">{s.value}</p>
                <p className="text-xs text-[#5A6B7F]">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Placements Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-[#D1D9E6]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0B1D33]">Active Placements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {placements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#D1D9E6] bg-[#F7F9FC]">
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F]">Candidate</th>
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden md:table-cell">Job Title</th>
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden lg:table-cell">Role</th>
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F] hidden sm:table-cell">Placed</th>
                      <th className="text-left py-2.5 px-4 font-medium text-[#5A6B7F]">Status</th>
                      <th className="text-right py-2.5 px-4 font-medium text-[#5A6B7F]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placements.map((p) => (
                      <tr key={p.id} className="border-b border-[#D1D9E6] last:border-0 hover:bg-[#F7F9FC] transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium text-[#0B1D33]">{p.candidate_name}</p>
                          <p className="text-xs text-[#5A6B7F] md:hidden">{p.job_title}</p>
                        </td>
                        <td className="py-3 px-4 text-[#5A6B7F] hidden md:table-cell">{p.job_title}</td>
                        <td className="py-3 px-4 text-[#5A6B7F] hidden lg:table-cell">{p.candidate_role || '—'}</td>
                        <td className="py-3 px-4 text-[#5A6B7F] hidden sm:table-cell">{formatDate(p.placed_at)}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Placed</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#1A3A5C] hover:text-[#C4942A]"
                            onClick={() => setSelectedPlacement(p)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#F7F9FC] border border-[#D1D9E6] flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-[#5A6B7F]" />
                </div>
                <p className="text-lg font-semibold text-[#0B1D33]">No placements yet</p>
                <p className="text-sm text-[#5A6B7F] mt-1">Placements will appear here when candidates are marked as placed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Placement Detail Dialog */}
      <Dialog open={!!selectedPlacement} onOpenChange={() => setSelectedPlacement(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-[#D1D9E6]">
          {selectedPlacement && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#0B1D33]">Placement Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B1D33]">{selectedPlacement.candidate_name}</h3>
                    <p className="text-sm text-[#5A6B7F]">{selectedPlacement.job_title}</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Placed</Badge>
                </div>

                <Separator className="bg-[#D1D9E6]" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#5A6B7F]">Role</p>
                      <p className="font-medium text-[#0B1D33]">{selectedPlacement.candidate_role || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#C4942A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#5A6B7F]">Placed On</p>
                      <p className="font-medium text-[#0B1D33]">{formatDate(selectedPlacement.placed_at)}</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-[#D1D9E6]" />

                {selectedPlacement.cover_letter && (
                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-[#0B1D33]">Cover Letter</h4>
                    <div className="bg-[#F7F9FC] rounded-lg p-3 text-[#5A6B7F] leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {selectedPlacement.cover_letter}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
