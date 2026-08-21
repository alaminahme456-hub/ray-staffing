-- =============================================================
-- RAY Staffing Consulting — Supabase Database Schema
-- Clean slate: drops all existing tables then recreates them
-- Run this in the Supabase SQL Editor
-- =============================================================

-- ─── CLEAN SLATE ───
DROP TABLE IF EXISTS public.cvs CASCADE;
DROP TABLE IF EXISTS public.interviews CASCADE;
DROP TABLE IF EXISTS public.housing_requests CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.customer_profiles CASCADE;
DROP TABLE IF EXISTS public.employer_profiles CASCADE;
DROP TABLE IF EXISTS public.references CASCADE;
DROP TABLE IF EXISTS public.candidate_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ─── 1. PROFILES ───
CREATE TABLE public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT NOT NULL,
  name           TEXT NOT NULL DEFAULT '',
  phone          TEXT DEFAULT '',
  role           TEXT NOT NULL DEFAULT 'candidate'
                 CHECK (role IN (
                   'candidate',
                   'employer',
                   'customer',
                   'SUPER_ADMIN',
                   'HOUSING_ADMIN',
                   'RECRUITMENT_ADMIN',
                   'HR_ADMIN',
                   'LOCAL_ADMIN',
                   'SUPPORT_STAFF'
                 )),
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
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

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── 2. PROFILES RLS ───
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 3. CANDIDATE PROFILES ───
CREATE TABLE public.candidate_profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_complete  INTEGER NOT NULL DEFAULT 0,
  bio              TEXT DEFAULT '',
  location         TEXT DEFAULT '',
  nationality      TEXT DEFAULT '',
  rls_to_work      BOOLEAN DEFAULT TRUE,
  skills           TEXT[] DEFAULT '{}',
  certifications   TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER candidate_profiles_updated_at
  BEFORE UPDATE ON public.candidate_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own profile"
  ON public.candidate_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Candidates can update own profile"
  ON public.candidate_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Candidates can insert own profile"
  ON public.candidate_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all candidate profiles"
  ON public.candidate_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

CREATE POLICY "Employers can view candidate profiles"
  ON public.candidate_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'employer'
    )
  );

-- ─── 4. EMPLOYER PROFILES ───
CREATE TABLE public.employer_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name  TEXT NOT NULL DEFAULT '',
  industry      TEXT DEFAULT '',
  company_size  TEXT DEFAULT '',
  website       TEXT DEFAULT '',
  description   TEXT DEFAULT '',
  address       TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER employer_profiles_updated_at
  BEFORE UPDATE ON public.employer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view own profile"
  ON public.employer_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Employers can update own profile"
  ON public.employer_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Employers can insert own profile"
  ON public.employer_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all employer profiles"
  ON public.employer_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

CREATE POLICY "Candidates can view employer profiles"
  ON public.employer_profiles FOR SELECT USING (TRUE);

-- ─── 5. CUSTOMER PROFILES ───
CREATE TABLE public.customer_profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name    TEXT NOT NULL DEFAULT '',
  last_name     TEXT DEFAULT '',
  address       TEXT DEFAULT '',
  property_type TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TRIGGER customer_profiles_updated_at
  BEFORE UPDATE ON public.customer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own profile"
  ON public.customer_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can write own profile"
  ON public.customer_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all customer profiles"
  ON public.customer_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 6. JOBS ───
CREATE TABLE public.jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  listing     TEXT NOT NULL DEFAULT '',
  location    TEXT DEFAULT '',
  salary_min  INTEGER DEFAULT 0,
  salary_max  INTEGER DEFAULT 0,
  job_type    TEXT DEFAULT 'full-time'
              CHECK (job_type IN ('full-time','part-time','contract','temporary','bank')),
  sector      TEXT DEFAULT '',
  requirements TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active','closed','draft','paused')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view own jobs"
  ON public.jobs FOR SELECT USING (auth.uid() = employer_id);

CREATE POLICY "Employers can insert own jobs"
  ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can update own jobs"
  ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);

CREATE POLICY "Employers can delete own jobs"
  ON public.jobs FOR DELETE USING (auth.uid() = employer_id);

CREATE POLICY "Candidates can view active jobs"
  ON public.jobs FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can do everything on jobs"
  ON public.jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 7. APPLICATIONS ───
CREATE TABLE public.applications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id         UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter   TEXT DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN (
                   'pending','shortlisted','interviewing','offered','rejected','withdrawn','placed'
                 )),
  employer_notes TEXT DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own applications"
  ON public.applications FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can insert own applications"
  ON public.applications FOR INSERT WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can update own applications"
  ON public.applications FOR UPDATE USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE id = job_id AND employer_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update applications for their jobs"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE id = job_id AND employer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything on applications"
  ON public.applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 8. CVs / RESUMES ───
CREATE TABLE public.cvs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url     TEXT NOT NULL,
  file_name    TEXT NOT NULL DEFAULT '',
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own CVs"
  ON public.cvs FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can insert own CVs"
  ON public.cvs FOR INSERT WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can delete own CVs"
  ON public.cvs FOR DELETE USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view CVs of applicants"
  ON public.cvs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.jobs j ON j.id = a.job_id
      WHERE a.candidate_id = candidate_id AND j.employer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything on CVs"
  ON public.cvs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 9. INTERVIEWS ───
CREATE TABLE public.interviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  scheduled_at   TIMESTAMPTZ NOT NULL,
  duration_min   INTEGER DEFAULT 60,
  location       TEXT DEFAULT '',
  meeting_link   TEXT DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'scheduled'
                 CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  interviewer_notes TEXT DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own interviews"
  ON public.interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = application_id AND candidate_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view interviews for their jobs"
  ON public.interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.jobs j ON j.id = a.job_id
      WHERE a.id = application_id AND j.employer_id = auth.uid()
    )
  );

CREATE POLICY "Employers can manage interviews for their jobs"
  ON public.interviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.jobs j ON j.id = a.job_id
      WHERE a.id = application_id AND j.employer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything on interviews"
  ON public.interviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 10. HOUSING REQUESTS ───
CREATE TABLE public.housing_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL DEFAULT '',
  description   TEXT DEFAULT '',
  location      TEXT DEFAULT '',
  budget_min    INTEGER DEFAULT 0,
  budget_max    INTEGER DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','in_progress','matched','closed','cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER housing_requests_updated_at
  BEFORE UPDATE ON public.housing_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.housing_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own requests"
  ON public.housing_requests FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert own requests"
  ON public.housing_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own requests"
  ON public.housing_requests FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Housing admins can manage all requests"
  ON public.housing_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 11. DOCUMENTS ───
CREATE TABLE public.documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT '',
  file_url    TEXT NOT NULL,
  file_name   TEXT NOT NULL DEFAULT '',
  doc_type    TEXT DEFAULT 'other'
              CHECK (doc_type IN ('cv','certificate','id','reference','contract','other')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can do everything on documents"
  ON public.documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','HOUSING_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 12. REFERENCES ───
CREATE TABLE public.references (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ref_name      TEXT NOT NULL DEFAULT '',
  ref_company   TEXT DEFAULT '',
  ref_email     TEXT DEFAULT '',
  ref_phone     TEXT DEFAULT '',
  relationship  TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own references"
  ON public.references FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can manage own references"
  ON public.references FOR ALL USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view references of applicants"
  ON public.references FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      JOIN public.jobs j ON j.id = a.job_id
      WHERE a.candidate_id = candidate_id AND j.employer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything on references"
  ON public.references FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('SUPER_ADMIN','RECRUITMENT_ADMIN','HR_ADMIN','LOCAL_ADMIN','SUPPORT_STAFF')
    )
  );

-- ─── 13. MESSAGES ───
CREATE TABLE public.messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject     TEXT DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can insert own messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own received messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

-- ─── 14. NOTIFICATIONS ───
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT '',
  body        TEXT DEFAULT '',
  type        TEXT DEFAULT 'info'
              CHECK (type IN ('info','success','warning','error')),
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  link        TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ─── 15. PAYMENTS ───
CREATE TABLE public.payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL DEFAULT 0,
  currency      TEXT NOT NULL DEFAULT 'GBP',
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','completed','failed','refunded')),
  payment_type  TEXT DEFAULT 'service_fee'
                CHECK (payment_type IN ('service_fee','housing_fee','subscription','other')),
  description   TEXT DEFAULT '',
  stripe_payment_id TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

-- ─── 16. INDEXES ───
CREATE INDEX idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_sector ON public.jobs(sector);
CREATE INDEX idx_applications_job_id ON public.applications(job_id);
CREATE INDEX idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_cvs_candidate_id ON public.cvs(candidate_id);
CREATE INDEX idx_interviews_application_id ON public.interviews(application_id);
CREATE INDEX idx_interviews_status ON public.interviews(status);
CREATE INDEX idx_housing_requests_customer_id ON public.housing_requests(customer_id);
CREATE INDEX idx_housing_requests_status ON public.housing_requests(status);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_references_candidate_id ON public.references(candidate_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
