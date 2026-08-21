-- =============================================================
-- RAY Staffing Consulting — Supabase Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================================

-- ─── 1. PROFILES TABLE (extends auth.users) ───
-- Stores app-specific user data linked to Supabase Auth

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  name          TEXT NOT NULL DEFAULT '',
  phone         TEXT DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'candidate' CHECK (role IN ('candidate','employer','customer','SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 2. PROFILES RLS ───
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF'))
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF'))
  );

-- ─── 3. CANDIDATE PROFILES ───
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_complete INTEGER NOT NULL DEFAULT 0,
  bio             TEXT DEFAULT '',
  location        TEXT DEFAULT '',
  nationality      TEXT DEFAULT '',
  right_to_work   BOOLEAN DEFAULT TRUE,
  skills          TEXT[] DEFAULT '{}',
  certifications  TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own profile"
  ON public.candidate_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Candidates can update own profile"
  ON public.candidate_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Candidates can insert own profile"
  ON public.candidate_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all candidate profiles"
  ON public.candidate_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));
CREATE POLICY "Employers can view candidate profiles"
  ON public.candidate_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employer'));

-- ─── 4. EMPLOYER PROFILES ───
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name    TEXT NOT NULL DEFAULT '',
  industry        TEXT DEFAULT '',
  company_size    TEXT DEFAULT '',
  website         TEXT DEFAULT '',
  description     TEXT DEFAULT '',
  address         TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view own profile"
  ON public.employer_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Employers can update own profile"
  ON public.employer_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Employers can insert own profile"
  ON public.employer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all employer profiles"
  ON public.employer_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 5. CUSTOMER PROFILES ───
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL DEFAULT '',
  last_name       TEXT DEFAULT '',
  address         TEXT DEFAULT '',
  property_type   TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own profile"
  ON public.customer_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Customers can update own profile"
  ON public.customer_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Customers can insert own profile"
  ON public.customer_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all customer profiles"
  ON public.customer_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 6. JOBS / VACANCIES ───
CREATE TABLE IF NOT EXISTS public.jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  location        TEXT DEFAULT '',
  salary_min      INTEGER DEFAULT 0,
  salary_max      INTEGER DEFAULT 0,
  job_type        TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time','part-time','contract','temporary','bank')),
  sector          TEXT DEFAULT '',
  requirements    TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed','draft','paused')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view own jobs"
  ON public.jobs FOR SELECT USING (auth.uid() = employer_id);
CREATE POLICY "Employers can insert own jobs"
  ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update own jobs"
  ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Candidates can view active jobs"
  ON public.jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can do everything on jobs"
  ON public.jobs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 7. APPLICATIONS ───
CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter    TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','shortlisted','interviewing','offered','rejected','withdrawn','placed')),
  employer_notes  TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own applications"
  ON public.applications FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Candidates can insert own applications"
  ON public.applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);
CREATE POLICY "Candidates can update own applications (withdraw)"
  ON public.applications FOR UPDATE USING (auth.uid() = candidate_id);
CREATE POLICY "Employers can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND employer_id = auth.uid()));
CREATE POLICY "Employers can update applications for their jobs"
  ON public.applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND employer_id = auth.uid()));
CREATE POLICY "Admins can do everything on applications"
  ON public.applications FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 8. DOCUMENTS ───
CREATE TABLE IF NOT EXISTS public.documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'other' CHECK (type IN ('cv','cover_letter','certificate','id_proof','right_to_work','db_check','other')),
  file_url        TEXT NOT NULL,
  file_size       INTEGER DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected','expired')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents"
  ON public.documents FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));
CREATE POLICY "Admins can update all documents (verify/reject)"
  ON public.documents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 9. MESSAGES ───
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL DEFAULT '',
  body            TEXT NOT NULL DEFAULT '',
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  job_id          UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent or received"
  ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own received messages (mark read)"
  ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 10. NOTIFICATIONS ───
CREATE TABLE IF NOT EXISTS public.notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL DEFAULT '',
  type            TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','error','job_update','application_update','message','system')),
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  link            TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications (mark read)"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert notifications for any user"
  ON public.notifications FOR INSERT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 11. PAYMENTS ───
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount          DECIMAL(10,2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'GBP',
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  description     TEXT DEFAULT '',
  reference       TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 12. HOUSING REQUESTS ───
CREATE TABLE IF NOT EXISTS public.housing_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  priority        TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.housing_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own requests"
  ON public.housing_requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers can insert own requests"
  ON public.housing_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update own requests"
  ON public.housing_requests FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Admins can view all housing requests"
  ON public.housing_requests FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 13. INTERVIEWS ───
CREATE TABLE IF NOT EXISTS public.interviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employer_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at    TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  location        TEXT DEFAULT '',
  meeting_link    TEXT DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  notes           TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own interviews"
  ON public.interviews FOR SELECT USING (auth.uid() = candidate_id);
CREATE POLICY "Employers can view interviews for their jobs"
  ON public.interviews FOR SELECT
  USING (auth.uid() = employer_id);
CREATE POLICY "Employers can manage interviews for their jobs"
  ON public.interviews FOR ALL
  USING (auth.uid() = employer_id);
CREATE POLICY "Admins can do everything on interviews"
  ON public.interviews FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')));

-- ─── 14. CVS (stored documents for candidates) ───
CREATE TABLE IF NOT EXISTS public.cvs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content         JSONB NOT NULL DEFAULT '{}',
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CVs"
  ON public.cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CVs"
  ON public.cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs"
  ON public.cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs"
  ON public.cvs FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins and employers can view CVs"
  ON public.cvs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF'))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'employer')
  );

-- ─── 15. INDEXES for performance ───
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_housing_requests_customer_id ON public.housing_requests(customer_id);
