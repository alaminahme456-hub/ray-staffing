import { db } from './db'
import { hash } from 'bcryptjs'

export async function seedDatabase() {
  const adminEmail = 'admin@raystaffing.co.uk'
  const existing = await db.user.findUnique({ where: { email: adminEmail } })
  if (existing) return

  const passwordHash = await hash('demo1234', 12)

  await db.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: 'RAY Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerified: true,
    },
  })

  await db.user.create({
    data: {
      email: 'customer@raystaffing.co.uk',
      passwordHash,
      name: 'John Tenant',
      role: 'customer',
      isActive: true,
      emailVerified: true,
    },
  })

  await db.user.create({
    data: {
      email: 'seeker@raystaffing.co.uk',
      passwordHash,
      name: 'Jane Candidate',
      role: 'candidate',
      isActive: true,
      emailVerified: true,
    },
  })

  await db.user.create({
    data: {
      email: 'employer@raystaffing.co.uk',
      passwordHash,
      name: 'Acme Healthcare Ltd',
      role: 'employer',
      isActive: true,
      emailVerified: true,
    },
  })

  await db.user.create({
    data: {
      email: 'housing@raystaffing.co.uk',
      passwordHash,
      name: 'Sarah Housing',
      role: 'HOUSING_ADMIN',
      isActive: true,
      emailVerified: true,
    },
  })

  await db.user.create({
    data: {
      email: 'recruitment@raystaffing.co.uk',
      passwordHash,
      name: 'Mike Recruitment',
      role: 'RECRUITMENT_ADMIN',
      isActive: true,
      emailVerified: true,
    },
  })

  await db.user.create({
    data: {
      email: 'support@raystaffing.co.uk',
      passwordHash,
      name: 'Emma Support',
      role: 'SUPPORT_STAFF',
      isActive: true,
      emailVerified: true,
    },
  })

  // Create properties
  const prop1 = await db.property.create({
    data: { name: 'Meridian Court', address: '15 Victoria Road, London', city: 'London', postcode: 'SW1A 1AA', propertyType: 'social_housing', bedrooms: 2, status: 'occupied' },
  })
  const prop2 = await db.property.create({
    data: { name: 'Oakwood House', address: '42 Manchester Road, Manchester', city: 'Manchester', postcode: 'M1 1AA', propertyType: 'private_rental', bedrooms: 3, status: 'available' },
  })
  const prop3 = await db.property.create({
    data: { name: 'Harbour View', address: '8 Waterfront Lane, Birmingham', city: 'Birmingham', postcode: 'B1 1AA', propertyType: 'supported', bedrooms: 1, status: 'occupied' },
  })

  // Create customer
  const customer = await db.user.create({
    data: {
      email: 'tenant@raystaffing.co.uk',
      passwordHash,
      name: 'David Wilson',
      role: 'customer',
      isActive: true,
      emailVerified: true,
      customer: {
        create: {
          firstName: 'David', lastName: 'Wilson', phone: '07700 900001',
          tenancies: {
            create: { propertyId: prop1.id, tenancyType: 'social', status: 'active', startDate: new Date('2024-06-01'), monthlyRent: 850, serviceCharge: 75, otherCharges: 25, paymentFreq: 'monthly' }
          },
          requests: {
            createMany: [
              { category: 'maintenance', subject: 'Leaking tap in kitchen', description: 'The kitchen tap has been dripping for 3 days. It needs urgent attention.', status: 'IN_PROGRESS', priority: 'high' },
              { category: 'documentation', subject: 'Tenancy agreement copy request', description: 'I need a copy of my current tenancy agreement for my records.', status: 'RESOLVED', priority: 'low' },
              { category: 'general', subject: 'Parking space enquiry', description: 'Is there an assigned parking space for Flat 3B at Meridian Court?', status: 'NEW', priority: 'medium' },
            ]
          },
          documents: {
            createMany: [
              { fileName: 'Tenancy_Agreement_2024.pdf', filePath: '/docs/tenancy.pdf', fileType: 'application/pdf', fileSize: 245000, category: 'tenancy' },
              { fileName: 'Statement_July_2026.pdf', filePath: '/docs/statement.pdf', fileType: 'application/pdf', fileSize: 128000, category: 'statement' },
            ]
          }
        }
      }
    }
  })

  // Create employer
  const employerUser = await db.user.create({
    data: {
      email: 'nhs-trust@raystaffing.co.uk',
      passwordHash,
      name: 'NHS Trust Birmingham',
      role: 'employer',
      isActive: true,
      emailVerified: true,
      employer: {
        create: {
          companyName: 'NHS Trust Birmingham', companyType: 'NHS Trust', industry: 'Healthcare',
          contactName: 'HR Department', contactEmail: 'hr@nhstrust-bham.nhs.uk', contactPhone: '0121 555 0100',
          address: 'Queen Elizabeth Hospital, Edgbaston', city: 'Birmingham', postcode: 'B15 2TH',
          description: 'One of the largest NHS trusts in the UK, providing comprehensive healthcare services across the West Midlands.',
        }
      }
    }
  })

  // Create jobs for the employer
  const employer = await db.employer.findUnique({ where: { userId: employerUser.id } })
  if (employer) {
    await db.job.createMany({
      data: [
        { employerId: employer.id, title: 'Staff Nurse - A&E Department', description: 'We are seeking a dedicated Staff Nurse to join our busy A&E department.', requirements: 'NMC Registration, minimum 2 years acute care experience.', benefits: 'NHS Pension, generous annual leave, CPD support.', location: 'Queen Elizabeth Hospital, Birmingham', city: 'Birmingham', postcode: 'B15 2TH', salaryMin: 27500, salaryMax: 32500, salaryType: 'annual', jobType: 'full-time', experience: 'mid', remoteType: 'on-site', industry: 'Healthcare', category: 'healthcare', status: 'open', isFeatured: true, applicationCount: 12, expiresAt: new Date('2026-10-15') },
        { employerId: employer.id, title: 'Healthcare Assistant', description: 'Join our team of dedicated Healthcare Assistants.', requirements: 'NVQ Level 2 in Health Care or equivalent.', benefits: 'NHS Pension, annual leave, training.', location: 'Queen Elizabeth Hospital, Birmingham', city: 'Birmingham', postcode: 'B15 2TH', salaryMin: 21000, salaryMax: 24500, salaryType: 'annual', jobType: 'full-time', experience: 'entry', remoteType: 'on-site', industry: 'Healthcare', category: 'healthcare', status: 'open', applicationCount: 23, expiresAt: new Date('2026-09-30') },
        { employerId: employer.id, title: 'Senior Physiotherapist', description: 'Lead our musculoskeletal outpatient service.', requirements: 'BSc Physiotherapy, HCPC Registration.', benefits: 'NHS Pension, 27 days annual leave.', location: 'Birmingham Community Hospital', city: 'Birmingham', postcode: 'B15 3TH', salaryMin: 38000, salaryMax: 45000, salaryType: 'annual', jobType: 'full-time', experience: 'senior', remoteType: 'hybrid', industry: 'Healthcare', category: 'healthcare', status: 'open', applicationCount: 5, expiresAt: new Date('2026-10-30') },
        { employerId: employer.id, title: 'Mental Health Nurse', description: 'Work within our community mental health team.', requirements: 'NMC Registration, mental health nursing qualification.', benefits: 'NHS Pension, flexible hours.', location: 'Community Health Centre, Solihull', city: 'Birmingham', postcode: 'B91 3GH', salaryMin: 30000, salaryMax: 36000, salaryType: 'annual', jobType: 'full-time', experience: 'mid', remoteType: 'hybrid', industry: 'Healthcare', category: 'healthcare', status: 'open', applicationCount: 8, expiresAt: new Date('2026-11-15') },
        { employerId: employer.id, title: 'HR Manager', description: 'Lead our people operations across multiple departments.', requirements: 'CIPD Level 7 or equivalent, 5+ years HR experience.', benefits: 'NHS Pension, generous leave.', location: 'Queen Elizabeth Hospital, Birmingham', city: 'Birmingham', postcode: 'B15 2TH', salaryMin: 45000, salaryMax: 55000, salaryType: 'annual', jobType: 'full-time', experience: 'senior', remoteType: 'hybrid', industry: 'Healthcare', category: 'hr', status: 'open', applicationCount: 3, expiresAt: new Date('2026-10-20') },
      ]
    })
  }

  // Create candidate
  const seekerUser = await db.user.create({
    data: {
      email: 'nurse@raystaffing.co.uk',
      passwordHash,
      name: 'Sarah Mitchell',
      role: 'candidate',
      isActive: true,
      emailVerified: true,
      profile: {
        create: {
          title: 'Registered Nurse', firstName: 'Sarah', lastName: 'Mitchell',
          phone: '07700 900100', location: 'Birmingham, West Midlands', city: 'Birmingham', postcode: 'B5 7AA',
          dateOfBirth: new Date('1990-03-15'), nationality: 'British', rightToWork: 'UK Citizen',
          summary: 'Dedicated Registered Nurse with 6 years of experience in acute care and community nursing. Skilled in patient assessment, care planning, and multidisciplinary team collaboration.',
          skills: 'Nursing, Patient Assessment, Care Planning, IV Cannulation, Medication Management',
          experience: 'Senior Staff Nurse | City Hospital | 2021-Present, Staff Nurse | Royal Infirmary | 2018-2021',
          qualifications: 'BSc Nursing, NMC Registered, BLS Certified',
          availability: 'Immediately', jobTypePref: 'full-time', salaryExpectMin: 28000, salaryExpectMax: 38000,
          remotePref: 'on-site', cvFileName: 'Sarah_Mitchell_CV.pdf', cvFilePath: '/cvs/sarah.pdf', profileComplete: 85
        }
      }
    }
  })

  // Create applications
  const jobs = await db.job.findMany({ where: { employerId: employer!.id } })
  if (jobs.length > 0 && seekerUser.profile) {
    await db.jobApplication.createMany({
      data: [
        { jobId: jobs[0].id, candidateId: seekerUser.profile.id, status: 'shortlisted', matchScore: 92, coverLetter: 'I am writing to express my interest in the Staff Nurse position at the A&E Department. With 6 years of nursing experience, I am confident I can make a meaningful contribution.' },
        { jobId: jobs[1].id, candidateId: seekerUser.profile.id, status: 'interview', matchScore: 78, coverLetter: 'I would like to apply for the Healthcare Assistant role. My nursing background makes me well-suited for this position.' },
        { jobId: jobs[3] ? jobs[3].id : jobs[0].id, candidateId: seekerUser.profile.id, status: 'applied', matchScore: 85, coverLetter: 'As a nurse with community experience, I am drawn to the Mental Health Nurse position.' },
      ]
    })
  }

  // Create notifications
  await db.notification.createMany({
    data: [
      { userId: customer.id, type: 'payment', title: 'Payment Due Soon', content: 'Your next rent payment of £950.00 is due on 1 September 2026.' },
      { userId: customer.id, type: 'request_update', title: 'Request Updated', content: 'Your maintenance request for the leaking tap is now in progress.' },
      { userId: seekerUser.id, type: 'application_update', title: 'Application Shortlisted', content: 'Your application for Staff Nurse - A&E Department has been shortlisted.' },
      { userId: seekerUser.id, type: 'interview', title: 'Interview Scheduled', content: 'You have been invited for an interview for the Healthcare Assistant position.' },
      { userId: seekerUser.id, type: 'job_alert', title: 'New Job Match', content: 'A new position matching your profile has been posted: Mental Health Nurse.' },
    ]
  })

  // Create SEO pages
  const seoPages = [
    { url: '/', title: 'RAY Staffing Consulting Ltd | Quality Housing, HR & Talent', metaDescription: 'RAY Staffing Consulting Ltd delivers quality, safe and compliant housing, comprehensive HR consultancy for SMEs, and specialist talent placement services across the UK.', indexStatus: 'indexed', seoScore: 92, h1: 'Quality Housing. Smarter HR. Exceptional Talent.', wordCount: 1200 },
    { url: '/about', title: 'About RAY Staffing Consulting Ltd', metaDescription: 'Learn about RAY Staffing Consulting Ltd - a UK-focused professional services company delivering quality housing, HR consultancy, and recruitment solutions.', indexStatus: 'indexed', seoScore: 85, h1: 'About RAY Staffing', wordCount: 800 },
    { url: '/housing-services', title: 'Housing Services | RAY Staffing Consulting', metaDescription: 'RAY provides quality, safe and compliant housing services including social housing, private rentals, and supported housing across the UK.', indexStatus: 'indexed', seoScore: 88, h1: 'Housing Services', wordCount: 1500 },
    { url: '/hr-solutions', title: 'HR Solutions & Recruitment | RAY Staffing', metaDescription: 'Comprehensive HR consultancy, SME support, and recruitment services from RAY Staffing Consulting Ltd.', indexStatus: 'indexed', seoScore: 82, h1: 'HR Solutions & Recruitment', wordCount: 1100 },
    { url: '/healthcare-staffing', title: 'Healthcare Staffing | RAY Staffing Consulting', metaDescription: 'Specialist healthcare recruitment and staffing solutions for NHS trusts and private healthcare providers across the UK.', indexStatus: 'indexed', seoScore: 90, h1: 'Specialist Health & Care Staffing', wordCount: 1300 },
  ]
  for (const page of seoPages) {
    await db.seoPage.create({ data: page })
  }

  console.log('Database seeded successfully')
}