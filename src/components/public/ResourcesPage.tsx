'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const categories = ['All', 'Employment Law', 'HR Best Practice', 'Healthcare', 'Housing', 'Recruitment']

const articles = [
  {
    id: 1,
    title: 'Understanding the Right to Work Checks: A 2025 Guide for UK Employers',
    category: 'Employment Law',
    date: '15 January 2025',
    readTime: '6 min read',
    description: 'Right to work checks remain a critical compliance requirement for all UK employers. This guide covers the current requirements, acceptable documents, digital checks, and the consequences of non-compliance under the Immigration, Asylum and Nationality Act 2006.',
  },
  {
    id: 2,
    title: 'Building an Effective Employee Onboarding Programme',
    category: 'HR Best Practice',
    date: '8 January 2025',
    readTime: '5 min read',
    description: 'A well-structured onboarding programme is essential for employee retention and productivity. We explore the key components of effective onboarding, from pre-arrival preparation through to the end of the probationary period, with practical tips for SMEs.',
  },
  {
    id: 3,
    title: 'The Growing Demand for Healthcare Professionals in the UK',
    category: 'Healthcare',
    date: '2 January 2025',
    readTime: '7 min read',
    description: 'The UK healthcare sector continues to face significant staffing challenges. We examine the current landscape, key demand areas, and how specialist recruitment agencies can help healthcare providers maintain safe staffing levels.',
  },
  {
    id: 4,
    title: 'Digital Housing Management: Transforming the Tenant Experience',
    category: 'Housing',
    date: '20 December 2024',
    readTime: '4 min read',
    description: 'Digital platforms are revolutionising how tenants interact with their housing providers. From online rent statements to repair tracking, we look at how technology is improving transparency, convenience, and communication in social and private housing.',
  },
  {
    id: 5,
    title: 'How to Write a Job Description That Attracts the Right Candidates',
    category: 'Recruitment',
    date: '15 December 2024',
    readTime: '5 min read',
    description: 'A poorly written job description can deter great candidates and attract the wrong ones. Learn how to craft job descriptions that are clear, inclusive, compliant, and compelling — improving both the quality and quantity of your applicant pool.',
  },
  {
    id: 6,
    title: 'Managing Absence in the Workplace: A Practical Framework',
    category: 'HR Best Practice',
    date: '10 December 2024',
    readTime: '6 min read',
    description: 'Employee absence costs UK businesses billions each year. This article provides a practical framework for managing both short-term and long-term absence fairly, consistently, and in compliance with employment law.',
  },
]

export default function ResourcesPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0B1D33] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.nav variants={fadeInUp} aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <button onClick={() => navigate('home')} className="hover:text-white transition-colors">Home</button>
              <ChevronRight className="size-4" />
              <span className="text-white">Resources & Insights</span>
            </motion.nav>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Resources &amp; <span className="text-[#C4942A]">Insights</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              Expert articles, guides, and insights on employment law, HR best practice, healthcare staffing, housing management, and recruitment. Stay informed with the latest thinking from the RAY team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Articles */}
      <section className="bg-[#F7F9FC] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((cat) => (
              <motion.div key={cat} variants={fadeInUp}>
                <Button
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className={
                    activeCategory === cat
                      ? 'bg-[#0B1D33] text-white hover:bg-[#1A3A5C]'
                      : 'border-[#D1D9E6] text-[#5A6B7F] hover:bg-white hover:text-[#0B1D33]'
                  }
                >
                  {cat}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Articles Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredArticles.map((article) => (
              <motion.div key={article.id} variants={fadeInUp} transition={{ duration: 0.35 }}>
                <Card className="h-full bg-white border-[#D1D9E6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-[#C4942A]/10 text-[#C4942A] border-0 text-xs font-medium">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base text-[#0B1D33] leading-snug">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-[#5A6B7F] text-sm leading-relaxed">{article.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[#5A6B7F]">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {article.readTime}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#5A6B7F]">No articles found in this category. Please check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
