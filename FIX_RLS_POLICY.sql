-- ============================================
-- FIX RLS POLICY FOR ADMIN PROFILES
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.admin_profiles;

-- Recreate with simpler, more permissive policies

-- 1. Allow all authenticated users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Allow all authenticated users to read all profiles (for debugging)
-- You can remove this later if you want stricter security
CREATE POLICY "All authenticated can read profiles"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Allow approved admins to update any profile
CREATE POLICY "Admins can update profiles"
  ON public.admin_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE user_id = auth.uid() AND approved = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE user_id = auth.uid() AND approved = true
    )
  );

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'admin_profiles'
ORDER BY policyname;

-- Test query (should return your profile)
SELECT * FROM public.admin_profiles;
