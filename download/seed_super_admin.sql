-- =============================================================
-- Seed SUPER_ADMIN user for RAY Staffing Consulting
-- Run this in the Supabase SQL Editor
-- CHANGE the email/password before running!
-- =============================================================

INSERT INTO auth.users (
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  aud,
  role,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@raystaffing.com',
  crypt('Admin@12345', gen_salt('bf')),
  now(),
  '{"name":"Super Admin","role":"SUPER_ADMIN"}',
  'authenticated',
  'authenticated',
  '',
  ''
);

-- Verify the profile was auto-created by the trigger
SELECT id, email, name, role, is_active, email_verified
FROM public.profiles
WHERE role = 'SUPER_ADMIN';
