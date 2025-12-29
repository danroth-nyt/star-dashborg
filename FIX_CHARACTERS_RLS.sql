-- ============================================
-- FIX INFINITE RECURSION IN CHARACTERS RLS
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can read characters in same room" ON public.characters;

-- Replace with a simpler policy that doesn't reference the same table
-- This policy allows users to see characters in rooms where they are the GM
CREATE POLICY "Users can read characters in their GM rooms"
  ON public.characters
  FOR SELECT
  TO authenticated
  USING (
    room_code IN (
      SELECT code FROM public.rooms WHERE gm_id = auth.uid()
    )
  );

-- Verify the policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'characters'
ORDER BY policyname;
