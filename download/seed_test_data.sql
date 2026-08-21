-- =============================================================
-- RAY Staffing Consulting — Test Data Seed
-- Run this in the Supabase SQL Editor AFTER the schema and SUPER_ADMIN
-- Creates: 2 employers, 3 candidates, 1 customer, jobs, applications,
--          interviews, housing requests, payments, messages, notifications,
--          documents, references
-- =============================================================

-- ═══════════════════════════════════════════════════════════════
-- 1. TEST USERS  (auth.users  →  profiles auto-created by trigger)
-- ═══════════════════════════════════════════════════════════════

-- ── Employer 1: Meridian Healthcare ──
INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role, confirmation_token, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'employer1@meridianhealth.co.uk',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"Sarah Mitchell","role":"employer"}',
  'authenticated', 'authenticated', '', ''
);

-- ── Employer 2: Greenfield Engineering ──
INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role, confirmation_token, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'employer2@greenfieldeng.co.uk',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"James Thornton","role":"employer"}',
  'authenticated', 'authenticated', '', ''
);

-- ── Candidate 1 ──
INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role, confirmation_token, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'candidate1@email.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"Aisha Okonkwo","role":"candidate"}',
  'authenticated', 'authenticated', '', ''
);

-- ── Candidate 2 ──
INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role, confirmation_token, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'candidate2@email.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"Marco Rossi","role":"candidate"}',
  'authenticated', 'authenticated', '', ''
);

-- ── Candidate 3 ──
INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role, confirmation_token, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'candidate3@email.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"Priya Sharma","role":"candidate"}',
  'authenticated', 'authenticated', '', ''
);

-- ── Customer (Housing) ──
INSERT INTO auth.users (instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, aud, role, confirmation_token, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'customer1@email.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"David Chen","role":"customer"}',
  'authenticated', 'authenticated', '', ''
);


-- ═══════════════════════════════════════════════════════════════
-- 2. EMPLOYER PROFILES
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.employer_profiles (id, company_name, industry, company_size, website, description, address)
SELECT id, 'Meridian Healthcare Ltd', 'Healthcare', '250-500', 'https://meridianhealth.co.uk',
  'Leading healthcare provider operating across the UK with over 15 hospitals and 30 clinics. Specialising in elderly care, mental health services, and community nursing.', '42 Harley Street, London, W1G 9PR'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

INSERT INTO public.employer_profiles (id, company_name, industry, company_size, website, description, address)
SELECT id, 'Greenfield Engineering Solutions', 'Engineering', '50-150', 'https://greenfieldeng.co.uk',
  'Innovative engineering firm focused on renewable energy infrastructure, civil engineering projects, and smart city solutions across the Midlands.', '15 Innovation Park, Birmingham, B7 4BB'
FROM public.profiles WHERE email = 'employer2@greenfieldeng.co.uk';


-- ═══════════════════════════════════════════════════════════════
-- 3. CANDIDATE PROFILES
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.candidate_profiles (id, profile_complete, bio, location, nationality, rls_to_work, skills, certifications, experience_years)
SELECT id, 85,
  'Dedicated Registered Nurse with 6 years of experience in acute care and community nursing. Passionate about patient-centred care and continuous professional development. Seeking Band 6 or Senior Nurse roles in London and the South East.',
  'London, UK', 'Nigerian', TRUE,
  ARRAY['Nursing', 'Patient Care', 'Clinical Assessment', 'Medication Management', 'Care Planning', 'Safeguarding', 'CPR/BLS', 'Phlebotomy'],
  ARRAY['BSc Nursing (University of Lagos)', 'NMC Registration (Pin: 12A3456B)', 'BLS/CPR Certified'],
  6
FROM public.profiles WHERE email = 'candidate1@email.com';

INSERT INTO public.candidate_profiles (id, profile_complete, bio, location, nationality, rls_to_work, skills, certifications, experience_years)
SELECT id, 70,
  'Skilled mechanical engineer with expertise in HVAC systems, plumbing, and building maintenance. Experienced in both residential and commercial projects. Looking for facilities management or maintenance engineer positions.',
  'Manchester, UK', 'Italian', TRUE,
  ARRAY['HVAC', 'Plumbing', 'Electrical Systems', 'Building Maintenance', 'CAD/AutoCAD', 'Health & Safety', 'Team Leadership'],
  ARRAY['NVQ Level 3 Mechanical Engineering', 'CSCS Card', 'Gas Safe Registered'],
  8
FROM public.profiles WHERE email = 'candidate2@email.com';

INSERT INTO public.candidate_profiles (id, profile_complete, bio, location, nationality, rls_to_work, skills, certifications, experience_years)
SELECT id, 55,
  'Recent IT graduate with strong skills in web development, database management, and cloud computing. Eager to start a career in software development or IT support. Flexible on location and willing to relocate.',
  'Birmingham, UK', 'Indian', TRUE,
  ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Git', 'Problem Solving'],
  ARRAY['BSc Computer Science (University of Birmingham)', 'AWS Cloud Practitioner'],
  1
FROM public.profiles WHERE email = 'candidate3@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 4. CUSTOMER PROFILES
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.customer_profiles (user_id, first_name, last_name, address, property_type)
SELECT id, 'David', 'Chen', '88 Victoria Road, Bristol, BS8 4NB', 'Flat'
FROM public.profiles WHERE email = 'customer1@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 5. JOBS  (10 jobs across both employers)
-- ═══════════════════════════════════════════════════════════════

-- ── Meridian Healthcare Jobs ──
INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Registered Nurse – Band 5', 'RN-B5-LON', 'London, UK', 28000, 32000, 'full-time', 'Healthcare',
  'NMC Registration, minimum 1 year acute care experience, excellent communication skills, right to work in the UK',
  'We are looking for a compassionate and skilled Registered Nurse to join our acute medical ward at St Thomas Hospital. You will be responsible for assessing, planning, implementing, and evaluating patient care. The role includes rotating shifts and opportunities for professional development including specialist training courses.',
  'active'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Senior Care Assistant', 'SCA-LON-001', 'London, UK', 22000, 26000, 'full-time', 'Healthcare',
  'NVQ Level 3 in Health and Social Care, minimum 2 years care experience, DBS check required',
  'Join our community nursing team providing high-quality care to elderly patients in their homes. You will work closely with multidisciplinary teams to deliver person-centred care plans. Flexible working patterns available with enhanced weekend rates.',
  'active'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Mental Health Support Worker', 'MHSW-MAN-001', 'Manchester, UK', 21000, 25000, 'full-time', 'Healthcare',
  'Relevant experience in mental health support, understanding of the Care Programme Approach, empathy and resilience',
  'An exciting opportunity to join our expanding mental health services team in Manchester. You will support individuals with severe and enduring mental health conditions, helping them to achieve their recovery goals and live independently in the community.',
  'active'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Pharmacy Technician – Bank', 'PHARM-BNK-001', 'Birmingham, UK', 18, 22, 'bank', 'Healthcare',
  'GPhC registration, accuracy and attention to detail, good customer service skills',
  'We are building a bank of Pharmacy Technicians to cover shifts across our hospital pharmacies in the Birmingham area. This is a flexible, zero-hours contract ideal for those seeking ad-hoc work to fit around other commitments.',
  'active'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Occupational Therapist', 'OT-LON-001', 'London, UK', 34000, 40000, 'full-time', 'Healthcare',
  'HCPC registered, degree in Occupational Therapy, experience in physical rehabilitation preferred',
  'Meridian Healthcare is seeking a qualified Occupational Therapist to join our rehabilitation team. You will assess patients functional abilities, develop treatment plans, and deliver therapeutic interventions to maximise independence following illness, injury, or surgery.',
  'active'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Healthcare Assistant – Part Time', 'HCA-PT-LIV', 'Liverpool, UK', 15000, 18000, 'part-time', 'Healthcare',
  'No formal qualifications required – training provided, caring nature, willingness to work shifts',
  'A fantastic entry-level opportunity for anyone looking to start a career in healthcare. You will support qualified nurses with patient care, observations, and maintaining a safe environment. Full induction and training programme included.',
  'active'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

-- ── Greenfield Engineering Jobs ──
INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Maintenance Engineer', 'ME-BIR-001', 'Birmingham, UK', 30000, 36000, 'full-time', 'Engineering',
  'NVQ Level 3 or equivalent in Mechanical/Electrical Engineering, experience with HVAC and building systems, full driving licence',
  'Greenfield Engineering is recruiting a Maintenance Engineer to join our facilities management team. You will carry out planned preventative maintenance and reactive repairs across a portfolio of commercial buildings in the Birmingham area.',
  'active'
FROM public.profiles WHERE email = 'employer2@greenfieldeng.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Junior Software Developer', 'JSD-BIR-001', 'Birmingham, UK', 24000, 28000, 'full-time', 'Technology',
  'Degree in Computer Science or related field, knowledge of JavaScript/React, understanding of SQL databases',
  'Join our growing digital team to help build internal tools and client-facing applications. You will work on greenfield projects using modern tech stacks including React, Node.js, and AWS. Mentorship and training budget included.',
  'active'
FROM public.profiles WHERE email = 'employer2@greenfieldeng.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Site Supervisor – Temporary Contract', 'SS-TEMP-001', 'Leeds, UK', 35, 42, 'temporary', 'Construction',
  'SSSTS or SMSTS certificate, minimum 5 years site supervision experience, knowledge of building regulations',
  'We need an experienced Site Supervisor for a 6-month renewable energy infrastructure project in Leeds. You will oversee daily operations, manage subcontractors, ensure health and safety compliance, and report on project progress.',
  'active'
FROM public.profiles WHERE email = 'employer2@greenfieldeng.co.uk';

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'CAD Technician – Contract', 'CAD-CON-001', 'Nottingham, UK', 25, 30, 'contract', 'Engineering',
  'Proficiency in AutoCAD and Revit, HND or degree in Engineering/Architecture, experience with MEP drawings',
  '12-month contract for a CAD Technician to produce detailed mechanical and electrical drawings for commercial building services projects. Hybrid working available with 2 days per week on-site in Nottingham.',
  'active'
FROM public.profiles WHERE email = 'employer2@greenfieldeng.co.uk';

-- ── One closed job (for variety) ──
INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT id, 'Staff Nurse – ICU (Filled)', 'RN-ICU-LON', 'London, UK', 32000, 38000, 'full-time', 'Healthcare',
  'NMC Registration, ICU experience, ILS/ALS certification',
  'This position has been filled. Thank you to all applicants.',
  'closed'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';


-- ═══════════════════════════════════════════════════════════════
-- 6. APPLICATIONS
-- ═══════════════════════════════════════════════════════════════

-- Aisha applies to 3 jobs (Registered Nurse, Senior Care Assistant, Occupational Therapist)
INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'Dear Hiring Manager, I am writing to express my strong interest in the Registered Nurse position. With 6 years of acute care experience and current NMC registration, I am confident I would make a valuable addition to your team at St Thomas Hospital. I am particularly drawn to your commitment to professional development and specialist training. I am available for immediate start and am flexible with shift patterns.',
  'shortlisted'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'RN-B5-LON' AND c.email = 'candidate1@email.com';

INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'I am very interested in the Senior Care Assistant role. While my primary experience is in acute nursing, I have extensive community nursing experience and hold an NVQ-equivalent qualification. I believe my clinical background gives me a strong foundation for this role.',
  'pending'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'SCA-LON-001' AND c.email = 'candidate1@email.com';

INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'As an experienced nurse with a strong interest in community-based care, I believe the Occupational Therapist role aligns well with my career aspirations. I am currently pursuing additional training in rehabilitation support.',
  'pending'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'OT-LON-001' AND c.email = 'candidate1@email.com';

-- Marco applies to 2 jobs (Maintenance Engineer, Site Supervisor)
INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'With 8 years of hands-on mechanical engineering experience and expertise in HVAC, plumbing, and building systems, I am an excellent fit for the Maintenance Engineer role. I hold NVQ Level 3, a valid CSCS card, and Gas Safe registration. I am based in Manchester and am happy to commute to Birmingham.',
  'interviewing'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'ME-BIR-001' AND c.email = 'candidate2@email.com';

INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'I am applying for the Site Supervisor position. I have 8 years of engineering experience including 3 years in a supervisory capacity. While I do not hold an SMSTS certificate currently, I am willing to obtain one before the start date.',
  'pending'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'SS-TEMP-001' AND c.email = 'candidate2@email.com';

-- Priya applies to 2 jobs (Junior Software Developer, CAD Technician)
INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'As a recent Computer Science graduate from the University of Birmingham, I am excited about the Junior Software Developer role. I have built several projects using React and Node.js during my degree, and I recently obtained my AWS Cloud Practitioner certification. I am eager to learn and grow within a professional development team.',
  'offered'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'JSD-BIR-001' AND c.email = 'candidate3@email.com';

INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'Although my primary focus is software development, I have strong AutoCAD skills from my engineering electives at university. I am interested in transitioning into a hybrid technical role and the contract nature of this position suits my current career stage.',
  'rejected'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'CAD-CON-001' AND c.email = 'candidate3@email.com';

-- Aisha also applies to Maintenance Engineer (cross-sector interest)
INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, c.id,
  'While my background is in nursing, I have always had a keen interest in healthcare facility management. I believe my understanding of clinical environments would be an asset in maintaining healthcare-specific engineering systems.',
  'rejected'
FROM public.jobs j CROSS JOIN public.profiles c
WHERE j.listing = 'ME-BIR-001' AND c.email = 'candidate1@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 7. INTERVIEWS
-- ═══════════════════════════════════════════════════════════════

-- Interview for Marco (Maintenance Engineer) – scheduled
INSERT INTO public.interviews (application_id, scheduled_at, duration_min, location, meeting_link, status)
SELECT a.id, now() + INTERVAL '3 days', 60, '15 Innovation Park, Birmingham, B7 4BB', '', 'scheduled'
FROM public.applications a
JOIN public.jobs j ON j.id = a.job_id
JOIN public.profiles c ON c.id = a.candidate_id
WHERE j.listing = 'ME-BIR-001' AND c.email = 'candidate2@email.com';

-- Interview for Aisha (Registered Nurse) – completed
INSERT INTO public.interviews (application_id, scheduled_at, duration_min, location, meeting_link, status, interviewer_notes)
SELECT a.id, now() - INTERVAL '5 days', 45, '', 'https://meet.google.com/abc-defg-hij', 'completed',
  'Strong candidate. Excellent clinical knowledge and communication skills. Recommended for shortlisting.'
FROM public.applications a
JOIN public.jobs j ON j.id = a.job_id
JOIN public.profiles c ON c.id = a.candidate_id
WHERE j.listing = 'RN-B5-LON' AND c.email = 'candidate1@email.com';

-- Interview for Priya (Junior Software Developer) – completed
INSERT INTO public.interviews (application_id, scheduled_at, duration_min, location, meeting_link, status, interviewer_notes)
SELECT a.id, now() - INTERVAL '2 days', 60, '', 'https://teams.microsoft.com/l/meetup/xyz', 'completed',
  'Good technical aptitude. Passed coding exercise. Made an offer – candidate accepted.'
FROM public.applications a
JOIN public.jobs j ON j.id = a.job_id
JOIN public.profiles c ON c.id = a.candidate_id
WHERE j.listing = 'JSD-BIR-001' AND c.email = 'candidate3@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 8. HOUSING REQUESTS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.housing_requests (customer_id, title, description, location, budget_min, budget_max, status)
SELECT id, 'One-Bedroom Flat Near City Centre',
  'Looking for a clean, modern one-bedroom flat within walking distance of Bristol city centre. Prefer furnished with bills included. Need to be close to public transport links.',
  'Bristol, UK', 700, 950, 'in_progress'
FROM public.profiles WHERE email = 'customer1@email.com';

INSERT INTO public.housing_requests (customer_id, title, description, location, budget_min, budget_max, status)
SELECT id, 'Shared Housing – Professional Flatshare',
  'Interested in a room in a professional shared house or flatshare. Happy to share with 2-3 others. Need good Wi-Fi and a quiet environment for remote work.',
  'Bristol, UK', 400, 600, 'pending'
FROM public.profiles WHERE email = 'customer1@email.com';

INSERT INTO public.housing_requests (customer_id, title, description, location, budget_min, budget_max, status)
SELECT id, 'Studio Apartment – Short Term',
  'Need a studio apartment for a 3-month period while I complete a work placement. Can be unfurnished. Flexible on exact location within Bristol.',
  'Bristol, UK', 500, 750, 'matched'
FROM public.profiles WHERE email = 'customer1@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 9. PAYMENTS
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.payments (user_id, amount, currency, status, payment_type, description, stripe_payment_id)
SELECT id, 15000, 'GBP', 'completed', 'service_fee', 'CV Review & Enhancement Service', 'pi_mock_001_completed'
FROM public.profiles WHERE email = 'candidate1@email.com';

INSERT INTO public.payments (user_id, amount, currency, status, payment_type, description, stripe_payment_id)
SELECT id, 5000, 'GBP', 'completed', 'housing_fee', 'Housing Matching Service – Initial Consultation', 'pi_mock_002_completed'
FROM public.profiles WHERE email = 'customer1@email.com';

INSERT INTO public.payments (user_id, amount, currency, status, payment_type, description, stripe_payment_id)
SELECT id, 12000, 'GBP', 'pending', 'service_fee', 'Premium Job Placement Package', 'pi_mock_003_pending'
FROM public.profiles WHERE email = 'candidate2@email.com';

INSERT INTO public.payments (user_id, amount, currency, status, payment_type, description, stripe_payment_id)
SELECT id, 8000, 'GBP', 'completed', 'subscription', 'Employer Monthly Subscription – August 2026', 'pi_mock_004_completed'
FROM public.profiles WHERE email = 'employer2@greenfieldeng.co.uk';

INSERT INTO public.payments (user_id, amount, currency, status, payment_type, description, stripe_payment_id)
SELECT id, 20000, 'GBP', 'failed', 'service_fee', 'International Recruitment Package', 'pi_mock_005_failed'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';


-- ═══════════════════════════════════════════════════════════════
-- 10. MESSAGES
-- ═══════════════════════════════════════════════════════════════

-- Get IDs for referencing
-- Message from Admin to Employer 1
INSERT INTO public.messages (sender_id, receiver_id, subject, body, is_read)
SELECT admin.id, emp.id, 'Welcome to RAY Staffing',
  'Dear Sarah, welcome to the RAY Staffing platform! We are delighted to have Meridian Healthcare on board. Your company profile is now live and you can start posting jobs immediately. If you need any assistance, do not hesitate to reach out to our support team.',
  TRUE
FROM public.profiles admin CROSS JOIN public.profiles emp
WHERE admin.role = 'SUPER_ADMIN' AND emp.email = 'employer1@meridianhealth.co.uk';

-- Message from Employer 1 to Candidate 1 (Aisha)
INSERT INTO public.messages (sender_id, receiver_id, subject, body, is_read)
SELECT emp.id, cand.id, 'Interview Invitation – Registered Nurse Band 5',
  'Dear Aisha, thank you for your application for the Registered Nurse position. We were impressed by your experience and would like to invite you for an interview. Please let us know your availability for next week.',
  TRUE
FROM public.profiles emp CROSS JOIN public.profiles cand
WHERE emp.email = 'employer1@meridianhealth.co.uk' AND cand.email = 'candidate1@email.com';

-- Message from Candidate 1 to Employer 1
INSERT INTO public.messages (sender_id, receiver_id, subject, body, is_read)
SELECT cand.id, emp.id, 'Re: Interview Invitation – Registered Nurse Band 5',
  'Dear Sarah, thank you for the invitation! I am available on Tuesday and Thursday next week. Please let me know which day works best for the team. I look forward to speaking with you.',
  TRUE
FROM public.profiles cand CROSS JOIN public.profiles emp
WHERE cand.email = 'candidate1@email.com' AND emp.email = 'employer1@meridianhealth.co.uk';

-- Unread message from Admin to Candidate 3 (Priya)
INSERT INTO public.messages (sender_id, receiver_id, subject, body, is_read)
SELECT admin.id, cand.id, 'Congratulations on Your Offer!',
  'Dear Priya, congratulations! Greenfield Engineering has extended a job offer for the Junior Software Developer position. Please check your applications page for full details. We wish you the very best in your new role!',
  FALSE
FROM public.profiles admin CROSS JOIN public.profiles cand
WHERE admin.role = 'SUPER_ADMIN' AND cand.email = 'candidate3@email.com';

-- Message from Customer 1 to Admin
INSERT INTO public.messages (sender_id, receiver_id, subject, body, is_read)
SELECT cust.id, admin.id, 'Housing Search Update',
  'Hi, I wanted to check on the progress of my housing request for the one-bedroom flat in Bristol city centre. I have not heard back in a week. Could you provide an update?',
  FALSE
FROM public.profiles cust CROSS JOIN public.profiles admin
WHERE cust.email = 'customer1@email.com' AND admin.role = 'SUPER_ADMIN';

-- Message from Employer 2 to Candidate 2 (Marco)
INSERT INTO public.messages (sender_id, receiver_id, subject, body, is_read)
SELECT emp.id, cand.id, 'Interview Confirmation – Maintenance Engineer',
  'Dear Marco, your interview for the Maintenance Engineer position has been confirmed for this Friday at 10:00 AM at our Birmingham office. Please bring your NVQ certificate, CSCS card, and Gas Safe registration. We look forward to meeting you.',
  TRUE
FROM public.profiles emp CROSS JOIN public.profiles cand
WHERE emp.email = 'employer2@greenfieldeng.co.uk' AND cand.email = 'candidate2@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 11. NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════

-- Notifications for Candidate 1 (Aisha)
INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Application Shortlisted', 'Your application for Registered Nurse – Band 5 has been shortlisted by Meridian Healthcare.', 'success', TRUE, '/seeker/applications'
FROM public.profiles WHERE email = 'candidate1@email.com';

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'New Job Match', '3 new jobs matching your profile have been posted this week.', 'info', FALSE, '/seeker/jobs'
FROM public.profiles WHERE email = 'candidate1@email.com';

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Interview Scheduled', 'Your interview for Registered Nurse – Band 5 has been completed. Check for updates.', 'info', TRUE, '/seeker/applications'
FROM public.profiles WHERE email = 'candidate1@email.com';

-- Notifications for Candidate 2 (Marco)
INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Interview Invited', 'Greenfield Engineering has invited you to interview for Maintenance Engineer.', 'success', TRUE, '/seeker/applications'
FROM public.profiles WHERE email = 'candidate2@email.com';

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Payment Processing', 'Your payment of £120.00 for Premium Job Placement Package is being processed.', 'warning', FALSE, '/seeker/payments'
FROM public.profiles WHERE email = 'candidate2@email.com';

-- Notifications for Candidate 3 (Priya)
INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Offer Received!', 'Congratulations! You have received a job offer from Greenfield Engineering for Junior Software Developer.', 'success', FALSE, '/seeker/applications'
FROM public.profiles WHERE email = 'candidate3@email.com';

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Application Update', 'Your application for CAD Technician – Contract was not successful on this occasion.', 'error', FALSE, '/seeker/applications'
FROM public.profiles WHERE email = 'candidate3@email.com';

-- Notifications for Employer 1
INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'New Application Received', 'Aisha Okonkwo has applied for Registered Nurse – Band 5.', 'info', TRUE, '/employer/applications'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Payment Failed', 'Your payment of £200.00 for International Recruitment Package could not be processed.', 'error', FALSE, '/employer/payments'
FROM public.profiles WHERE email = 'employer1@meridianhealth.co.uk';

-- Notifications for Customer 1
INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'Housing Request Update', 'Your housing request for Studio Apartment – Short Term has been matched. Check details.', 'success', TRUE, '/customer/requests'
FROM public.profiles WHERE email = 'customer1@email.com';

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'New Message', 'You have an unread message from RAY Staffing Support.', 'info', FALSE, '/customer/messages'
FROM public.profiles WHERE email = 'customer1@email.com';

-- Notifications for SUPER_ADMIN
INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'New User Registered', 'Greenfield Engineering Solutions has joined the platform.', 'info', TRUE, '/admin/users'
FROM public.profiles WHERE role = 'SUPER_ADMIN';

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT id, 'System Update', 'Database migration v2.1 has been applied successfully.', 'success', TRUE, '/admin'
FROM public.profiles WHERE role = 'SUPER_ADMIN';


-- ═══════════════════════════════════════════════════════════════
-- 12. CVs (placeholder file_url)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.cvs (candidate_id, file_url, file_name, is_primary)
SELECT id, '/storage/cvs/placeholder_aisha_cv.pdf', 'Aisha_Okonkwo_CV.pdf', TRUE
FROM public.profiles WHERE email = 'candidate1@email.com';

INSERT INTO public.cvs (candidate_id, file_url, file_name, is_primary)
SELECT id, '/storage/cvs/placeholder_marco_cv.pdf', 'Marco_Rossi_CV.pdf', TRUE
FROM public.profiles WHERE email = 'candidate2@email.com';

INSERT INTO public.cvs (candidate_id, file_url, file_name, is_primary)
SELECT id, '/storage/cvs/placeholder_priya_cv.pdf', 'Priya_Sharma_CV.pdf', TRUE
FROM public.profiles WHERE email = 'candidate3@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 13. REFERENCES
-- ═══════════════════════════════════════════════════════════════

-- References for Aisha
INSERT INTO public.references (candidate_id, ref_name, ref_company, ref_email, ref_phone, relationship)
SELECT id, 'Dr. Helen Brooks', 'St Mary Hospital London', 'h.brooks@stmaryhospital.nhs.uk', '+44 20 7946 0958', 'Line Manager (2019-2022)'
FROM public.profiles WHERE email = 'candidate1@email.com';

INSERT INTO public.references (candidate_id, ref_name, ref_company, ref_email, ref_phone, relationship)
SELECT id, 'Matron Grace Adeyemi', 'Lagos University Teaching Hospital', 'g.adeyemi@luth.gov.ng', '+234 1 234 5678', 'Clinical Supervisor (2017-2019)'
FROM public.profiles WHERE email = 'candidate1@email.com';

-- References for Marco
INSERT INTO public.references (candidate_id, ref_name, ref_company, ref_email, ref_phone, relationship)
SELECT id, 'Luca Bianchi', 'Milan Engineering Group', 'l.bianchi@milaneng.it', '+39 02 1234 5678', 'Project Manager (2020-2024)'
FROM public.profiles WHERE email = 'candidate2@email.com';

-- References for Priya
INSERT INTO public.references (candidate_id, ref_name, ref_company, ref_email, ref_phone, relationship)
SELECT id, 'Dr. Robert Taylor', 'University of Birmingham', 'r.taylor@bham.ac.uk', '+44 121 414 5000', 'Academic Tutor (2023-2025)'
FROM public.profiles WHERE email = 'candidate3@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 14. DOCUMENTS
-- ═══════════════════════════════════════════════════════════════

-- Documents for Aisha
INSERT INTO public.documents (user_id, title, file_url, file_name, doc_type)
SELECT id, 'NMC Registration Certificate', '/storage/documents/placeholder_aisha_nmc.pdf', 'Aisha_NMC_Cert.pdf', 'certificate'
FROM public.profiles WHERE email = 'candidate1@email.com';

INSERT INTO public.documents (user_id, title, file_url, file_name, doc_type)
SELECT id, 'Passport', '/storage/documents/placeholder_aisha_passport.pdf', 'Aisha_Passport.pdf', 'id'
FROM public.profiles WHERE email = 'candidate1@email.com';

-- Documents for Marco
INSERT INTO public.documents (user_id, title, file_url, file_name, doc_type)
SELECT id, 'NVQ Level 3 Certificate', '/storage/documents/placeholder_marco_nvq.pdf', 'Marco_NVQ3.pdf', 'certificate'
FROM public.profiles WHERE email = 'candidate2@email.com';

INSERT INTO public.documents (user_id, title, file_url, file_name, doc_type)
SELECT id, 'CSCS Card', '/storage/documents/placeholder_marco_cscs.pdf', 'Marco_CSCS.pdf', 'id'
FROM public.profiles WHERE email = 'candidate2@email.com';

-- Documents for Priya
INSERT INTO public.documents (user_id, title, file_url, file_name, doc_type)
SELECT id, 'AWS Cloud Practitioner Certificate', '/storage/documents/placeholder_priya_aws.pdf', 'Priya_AWS_Cert.pdf', 'certificate'
FROM public.profiles WHERE email = 'candidate3@email.com';

-- Documents for Customer 1
INSERT INTO public.documents (user_id, title, file_url, file_name, doc_type)
SELECT id, 'Tenancy Agreement', '/storage/documents/placeholder_david_tenancy.pdf', 'David_Tenancy_Agreement.pdf', 'contract'
FROM public.profiles WHERE email = 'customer1@email.com';


-- ═══════════════════════════════════════════════════════════════
-- 15. VERIFICATION SUMMARY
-- ═══════════════════════════════════════════════════════════════

SELECT '--- Users Created ---' AS info;
SELECT email, name, role, is_active, email_verified
FROM public.profiles
ORDER BY role, email;

SELECT '--- Jobs ---' AS info;
SELECT j.title, p.name AS employer, j.location, j.salary_min, j.salary_max, j.job_type, j.sector, j.status
FROM public.jobs j JOIN public.profiles p ON p.id = j.employer_id
ORDER BY j.created_at;

SELECT '--- Applications ---' AS info;
SELECT j.title AS job, c.name AS candidate, a.status, a.created_at::date AS applied_on
FROM public.applications a
JOIN public.jobs j ON j.id = a.job_id
JOIN public.profiles c ON c.id = a.candidate_id
ORDER BY a.created_at;

SELECT '--- Interviews ---' AS info;
SELECT c.name AS candidate, j.title AS job, i.scheduled_at, i.duration_min || ' min' AS duration, i.status, i.location
FROM public.interviews i
JOIN public.applications a ON a.id = i.application_id
JOIN public.jobs j ON j.id = a.job_id
JOIN public.profiles c ON c.id = a.candidate_id
ORDER BY i.scheduled_at;

SELECT '--- Totals ---' AS info;
SELECT
  (SELECT count(*) FROM public.profiles) AS total_users,
  (SELECT count(*) FROM public.jobs) AS total_jobs,
  (SELECT count(*) FROM public.applications) AS total_applications,
  (SELECT count(*) FROM public.interviews) AS total_interviews,
  (SELECT count(*) FROM public.housing_requests) AS total_housing_requests,
  (SELECT count(*) FROM public.payments) AS total_payments,
  (SELECT count(*) FROM public.messages) AS total_messages,
  (SELECT count(*) FROM public.notifications) AS total_notifications,
  (SELECT count(*) FROM public.cvs) AS total_cvs,
  (SELECT count(*) FROM public.references) AS total_references,
  (SELECT count(*) FROM public.documents) AS total_documents;