-- ============================================
-- ADMIN APPROVAL QUERIES
-- Run these in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. SETUP QUERIES (Run these first)
-- ============================================

-- View all users and their approval status
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  ap.approved,
  ap.approved_at,
  ap.approved_by
FROM auth.users u
LEFT JOIN public.admin_profiles ap ON u.id = ap.user_id
ORDER BY u.created_at DESC;

-- ============================================
-- 2. APPROVE YOUR FIRST ADMIN
-- (Replace 'your-email@example.com' with your actual email)
-- ============================================

-- Step 1: Find your user ID
SELECT id, email 
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Step 2: Approve yourself as admin (replace USER_ID)
UPDATE public.admin_profiles 
SET 
  approved = true,
  approved_at = NOW()
WHERE user_id = 'USER_ID_FROM_STEP_1';

-- Verify you're approved
SELECT * FROM public.admin_profiles WHERE approved = true;

-- ============================================
-- 3. DAILY MANAGEMENT QUERIES
-- ============================================

-- List all pending (unapproved) users
SELECT 
  ap.user_id,
  u.email,
  u.created_at as signed_up_at,
  EXTRACT(EPOCH FROM (NOW() - u.created_at))/3600 as hours_waiting
FROM public.admin_profiles ap
JOIN auth.users u ON ap.user_id = u.id
WHERE ap.approved = false
ORDER BY u.created_at ASC;

-- Count pending users
SELECT COUNT(*) as pending_users
FROM public.admin_profiles
WHERE approved = false;

-- ============================================
-- 4. APPROVE A USER
-- (Get USER_ID from the pending users query above)
-- (Get YOUR_ADMIN_ID from the approved users query)
-- ============================================

UPDATE public.admin_profiles 
SET 
  approved = true,
  approved_by = 'YOUR_ADMIN_USER_ID',
  approved_at = NOW()
WHERE user_id = 'USER_ID_TO_APPROVE';

-- ============================================
-- 5. REVOKE ACCESS (if needed)
-- ============================================

UPDATE public.admin_profiles 
SET 
  approved = false,
  approved_by = NULL,
  approved_at = NULL
WHERE user_id = 'USER_ID_TO_REVOKE';

-- ============================================
-- 6. DELETE A USER COMPLETELY
-- ============================================

-- WARNING: This permanently deletes the user and all their data
-- First delete their profile (cascade will delete character)
DELETE FROM public.admin_profiles WHERE user_id = 'USER_ID';

-- Then delete from auth.users
DELETE FROM auth.users WHERE id = 'USER_ID';

-- ============================================
-- 7. MONITORING QUERIES
-- ============================================

-- Total users by approval status
SELECT 
  approved,
  COUNT(*) as count
FROM public.admin_profiles
GROUP BY approved;

-- Recent approvals (last 7 days)
SELECT 
  u.email,
  ap.approved_at,
  approver.email as approved_by_email
FROM public.admin_profiles ap
JOIN auth.users u ON ap.user_id = u.id
LEFT JOIN auth.users approver ON ap.approved_by = approver.id
WHERE ap.approved = true 
  AND ap.approved_at > NOW() - INTERVAL '7 days'
ORDER BY ap.approved_at DESC;

-- ============================================
-- 8. FIND SPECIFIC USER
-- ============================================

-- By email
SELECT 
  u.id,
  u.email,
  ap.approved,
  ap.created_at,
  ap.approved_at
FROM auth.users u
LEFT JOIN public.admin_profiles ap ON u.id = ap.user_id
WHERE u.email ILIKE '%search-term%';

-- By user ID
SELECT 
  u.id,
  u.email,
  ap.approved,
  ap.created_at,
  ap.approved_at
FROM auth.users u
LEFT JOIN public.admin_profiles ap ON u.id = ap.user_id
WHERE u.id = 'USER_ID';
