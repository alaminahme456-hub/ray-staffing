-- =============================================================
-- RAY Staffing Consulting — Test Data Seed Script
-- Run this AFTER the schema and SUPER_ADMIN seed
-- =============================================================

-- ─── 1. TEST EMPLOYER ───
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data, aud, role,
  confirmation_token, recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'employer@test.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"Sarah Mitchell","phone":"07700 100200","role":"employer","companyName":"Barts Health NHS Trust","industry":"Healthcare"}',
  'authenticated', 'authenticated', '', ''
) ON CONFLICT DO NOTHING;

-- ─── 2. TEST CANDIDATE ───
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data, aud, role,
  confirmation_token, recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'candidate@test.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"Amara Okafor","phone":"07700 300400","role":"candidate"}',
  'authenticated', 'authenticated', '', ''
) ON CONFLICT DO NOTHING;

-- ─── 3. TEST CUSTOMER ───
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, raw_user_meta_data, aud, role,
  confirmation_token, recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'customer@test.com',
  crypt('Test@12345', gen_salt('bf')),
  now(),
  '{"name":"James Worthington","phone":"07700 500600","role":"customer"}',
  'authenticated', 'authenticated', '', ''
) ON CONFLICT DO NOTHING;

-- ─── 4. EMPLOYER PROFILES (will be created by trigger, but let's add company details) ───
INSERT INTO public.employer_profiles (id, company_name, industry, company_size, website, description, address)
SELECT 
  u.id, 'Barts Health NHS Trust', 'Healthcare', '5000+ employees',
  'https://www.bartshealth.nhs.uk',
  'Barts Health NHS Trust is one of the largest NHS trusts in England, serving over 2.5 million patients across East London.',
  'The Royal London Hospital, Whitechapel, London E1 1BB'
FROM auth.users u WHERE u.email = 'employer@test.com' AND NOT EXISTS (
  SELECT 1 FROM public.employer_profiles WHERE id = u.id
)
ON CONFLICT DO NOTHING;

-- ─── 5. CANDIDATE PROFILES ───
INSERT INTO public.candidate_profiles (id, profile_complete, bio, location, nationality, rls_to_work, skills, certifications, experience_years)
SELECT
  u.id, 85,
  'Experienced Senior Staff Nurse with 6+ years of ICU and critical care experience. Skilled in patient assessment, care planning, IV therapy, and mentoring junior staff. Passionate about delivering high-quality, evidence-based care.',
  'London, UK', 'British', true,
  ARRAY['ICU Nursing', 'Critical Care', 'IV Cannulation', 'Patient Assessment', 'Care Planning', 'BLS/ACLS', 'Mentoring', 'Triage'],
  ARRAY['NMC Registered Nurse', 'BLS Certified', 'ACLS Certified', 'ICU Competency Certificate'],
  6
FROM auth.users u WHERE u.email = 'candidate@test.com' AND NOT EXISTS (
  SELECT 1 FROM public.candidate_profiles WHERE id = u.id
)
ON CONFLICT DO NOTHING;

-- ─── 6. CUSTOMER PROFILES ───
INSERT INTO public.customer_profiles (user_id, first_name, last_name, address, property_type)
SELECT
  u.id, 'James', 'Worthington', '14 Oakwood Crescent, Manchester, M14 5QW', 'Flat'
FROM auth.users u WHERE u.email = 'customer@test.com' AND NOT EXISTS (
  SELECT 1 FROM public.customer_profiles WHERE user_id = u.id
)
ON CONFLICT DO NOTHING;

-- ─── 7. TEST JOBS ───
INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT
  ep.id,
  'Senior Staff Nurse - Intensive Care Unit',
  'We are seeking an experienced Senior Staff Nurse to join our busy Intensive Care Unit at The Royal London Hospital. You will be responsible for delivering high-quality care to critically ill patients, supporting junior staff, and contributing to service improvement initiatives.',
  'London, EC1A 7BE', 38000, 44000, 'full-time', 'Healthcare',
  'Valid NMC registration; Minimum 3 years ICU experience; IV cannulation and central line care competency; BLS/ACLS certification; Excellent communication skills',
  'Join our award-winning ICU team. We offer a supportive environment with excellent opportunities for professional development and career progression. Our ICU is a 32-bed unit providing level 3 critical care services.',
  'active'
FROM public.employer_profiles ep WHERE ep.company_name = 'Barts Health NHS Trust'
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT
  ep.id,
  'Nurse Practitioner - Primary Care',
  'An exciting opportunity for a Nurse Practitioner to work within our Primary Care Network. You will manage patient caseloads independently, conduct assessments, diagnose conditions, and prescribe treatments.',
  'London, SE1 7EH', 42000, 50000, 'full-time', 'Healthcare',
  'Non-medical prescribing qualification; 5+ years post-registration experience; Independent prescriber registration; Experience in primary care or community setting',
  'Work alongside GPs and multidisciplinary teams in a forward-thinking Primary Care Network. Flexible working patterns available.',
  'active'
FROM public.employer_profiles ep WHERE ep.company_name = 'Barts Health NHS Trust'
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT
  ep.id,
  'Charge Nurse - Accident & Emergency',
  'We are looking for a dynamic Charge Nurse to lead our busy A&E department. You will oversee patient flow, coordinate with multidisciplinary teams, and ensure the highest standards of emergency care.',
  'London, W2 1NY', 36000, 41000, 'full-time', 'Healthcare',
  'Valid NMC registration; Minimum 4 years A&E experience; Leadership or charge nurse experience; Triage certification; Advanced assessment skills',
  'Our A&E department sees over 400 patients daily. Join a team that is at the forefront of emergency medicine innovation.',
  'active'
FROM public.employer_profiles ep WHERE ep.company_name = 'Barts Health NHS Trust'
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT
  ep.id,
  'Community Mental Health Nurse',
  'Join our community mental health team providing holistic care to patients in their homes and community settings. You will work autonomously managing a caseload of patients with varying mental health needs.',
  'London, SE5 8AZ', 34000, 40000, 'full-time', 'Healthcare',
  'Valid NMC registration; Mental health nursing experience; Community nursing experience preferred; Valid UK driving licence; Ability to work independently',
  'We offer a supportive team environment with regular supervision, CPD opportunities, and a commitment to work-life balance.',
  'active'
FROM public.employer_profiles ep WHERE ep.company_name = 'Barts Health NHS Trust'
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT
  ep.id,
  'Occupational Therapist - Rehabilitation',
  'An exciting opportunity for an Occupational Therapist to join our rehabilitation team. You will assess patients, develop treatment plans, and deliver interventions to maximise independence.',
  'London, E1 4DG', 32000, 38000, 'full-time', 'Healthcare',
  'Degree in Occupational Therapy; HCPC registration; Experience in rehabilitation or physical disability; Strong assessment and report-writing skills',
  'Work within our state-of-the-art rehabilitation unit. We invest heavily in our staff with dedicated CPD budgets and study leave.',
  'active'
FROM public.employer_profiles ep WHERE ep.company_name = 'Barts Health NHS Trust'
ON CONFLICT DO NOTHING;

INSERT INTO public.jobs (employer_id, title, listing, location, salary_min, salary_max, job_type, sector, requirements, description, status)
SELECT
  ep.id,
  'Radiographer - Diagnostic Imaging',
  'Join our diagnostic imaging department performing a range of radiographic examinations including plain film, CT, and fluoroscopy. Our department is equipped with the latest imaging technology.',
  'London, NW1 2BU', 35000, 42000, 'full-time', 'Healthcare',
  'HCPC registered radiographer; CT experience preferred; Ability to work flexibly across modalities; Excellent patient care skills',
  'Access to cutting-edge imaging equipment including 3 CT scanners and 2 MRI machines. Rotating shift pattern with unsocial hours supplement.',
  'active'
FROM public.employer_profiles ep WHERE ep.company_name = 'Barts Health NHS Trust'
ON CONFLICT DO NOTHING;

-- ─── 8. TEST APPLICATION ───
INSERT INTO public.applications (job_id, candidate_id, cover_letter, status)
SELECT j.id, cp.id,
  'Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Staff Nurse - ICU position at Barts Health NHS Trust. With over 6 years of dedicated experience in intensive care nursing, I have developed advanced clinical skills in patient assessment, critical care interventions, and multidisciplinary collaboration.\n\nMy current role has equipped me with expertise in managing complex patient cases, mentoring junior staff, and contributing to quality improvement initiatives. I hold current BLS and ACLS certifications and am passionate about evidence-based practice.\n\nI would welcome the opportunity to contribute to your esteemed ICU team and am available for interview at your earliest convenience.\n\nKind regards,\nAmara Okafor',
  'shortlisted'
FROM public.jobs j, public.candidate_profiles cp, auth.users u
WHERE j.title = 'Senior Staff Nurse - Intensive Care Unit'
AND cp.id = u.id AND u.email = 'candidate@test.com'
AND NOT EXISTS (
  SELECT 1 FROM public.applications a
  WHERE a.job_id = j.id AND a.candidate_id = cp.id
);

-- ─── 9. TEST HOUSING REQUEST ───
INSERT INTO public.housing_requests (customer_id, title, description, location, budget_min, budget_max, status)
SELECT
  cp.id,
  '2-Bedroom Property Near Manchester City Centre',
  'Looking for a 2-bedroom property within 15 minutes of Manchester city centre. Prefer modern build with good transport links. Need parking space.',
  'Manchester, M1', 800, 1200, 'pending'
FROM public.customer_profiles cp, auth.users u
WHERE cp.user_id = u.id AND u.email = 'customer@test.com'
AND NOT EXISTS (
  SELECT 1 FROM public.housing_requests hr WHERE hr.customer_id = cp.id
);

-- ─── 10. TEST MESSAGES ───
INSERT INTO public.messages (sender_id, receiver_id, subject, body, is_read)
SELECT u1.id, u2.id,
  'Welcome to RAY Staffing!',
  'Hi Amara, welcome to RAY Staffing Consulting! Your account has been set up successfully. You can now browse jobs, upload your CV, and track your applications all in one place. If you have any questions, don''t hesitate to reach out.',
  true
FROM auth.users u1, auth.users u2
WHERE u1.email = 'employer@test.com' AND u2.email = 'candidate@test.com'
ON CONFLICT DO NOTHING;

-- ─── 11. TEST NOTIFICATIONS ───
INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT u.id,
  'Application Shortlisted',
  'Congratulations! Your application for Senior Staff Nurse - ICU at Barts Health NHS Trust has been shortlisted.',
  'success', false, 'seeker-applications'
FROM auth.users u WHERE u.email = 'candidate@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT u.id,
  'New Application Received',
  'Amara Okafor has applied for the Senior Staff Nurse - ICU position.',
  'info', false, 'employer-applications'
FROM auth.users u WHERE u.email = 'employer@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.notifications (user_id, title, body, type, is_read, link)
SELECT u.id,
  'Housing Request Update',
  'Your housing request is being reviewed by our housing team. We will contact you within 48 hours.',
  'info', false, 'customer-requests'
FROM auth.users u WHERE u.email = 'customer@test.com'
ON CONFLICT DO NOTHING;

-- ─── VERIFY ───
SELECT 'Profiles' as table_name, count(*) as count FROM public.profiles
UNION ALL
SELECT 'Employer Profiles', count(*) FROM public.employer_profiles
UNION ALL
SELECT 'Candidate Profiles', count(*) FROM public.candidate_profiles
UNION ALL
SELECT 'Customer Profiles', count(*) FROM public.customer_profiles
UNION ALL
SELECT 'Jobs', count(*) FROM public.jobs
UNION ALL
SELECT 'Applications', count(*) FROM public.applications
UNION ALL
SELECT 'Housing Requests', count(*) FROM public.housing_requests
UNION ALL
SELECT 'Messages', count(*) FROM public.messages
UNION ALL
SELECT 'Notifications', count(*) FROM public.notifications;
