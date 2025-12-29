# Admin Approval Setup Guide

## Overview
New users must be approved by an admin before they can access the application.

## Supabase Configuration

### Step 1: Create Admin Profiles Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create admin_profiles table to track user approval status
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own approval status
CREATE POLICY "Users can read own profile"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only admins can update approval status (you'll need to set admin users)
CREATE POLICY "Admins can update profiles"
  ON public.admin_profiles
  FOR UPDATE
  TO authenticated
  USING (
    -- Check if current user is an admin
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE user_id = auth.uid() AND approved = true
      -- You can add an additional 'is_admin' column for more control
    )
  );

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles
      WHERE user_id = auth.uid() AND approved = true
    )
  );

-- Create index for faster lookups
CREATE INDEX idx_admin_profiles_user_id ON public.admin_profiles(user_id);
CREATE INDEX idx_admin_profiles_approved ON public.admin_profiles(approved);
```

### Step 2: Create Trigger for New Users

Automatically create an admin_profile entry when a user signs up:

```sql
-- Function to create admin profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (user_id, email, approved)
  VALUES (NEW.id, NEW.email, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that runs when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Manually Approve First Admin

Run this SQL to approve your first admin user (replace with your email):

```sql
-- Find your user_id
SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- Approve that user
UPDATE public.admin_profiles 
SET approved = true, 
    approved_at = NOW()
WHERE user_id = 'USER_ID_FROM_ABOVE';
```

### Step 4: Optional - Email Notifications

Set up Supabase Database Webhooks or Edge Functions to send you an email when someone signs up:

1. Go to Database → Webhooks in Supabase Dashboard
2. Create a webhook that triggers on INSERT to `admin_profiles`
3. Point it to an email service (SendGrid, Resend, etc.) or your own endpoint

## Admin Approval Process

### Approving Users via SQL

```sql
-- List pending users
SELECT 
  user_id, 
  email, 
  created_at 
FROM public.admin_profiles 
WHERE approved = false
ORDER BY created_at DESC;

-- Approve a user
UPDATE public.admin_profiles 
SET 
  approved = true,
  approved_by = 'YOUR_ADMIN_USER_ID',
  approved_at = NOW()
WHERE user_id = 'USER_ID_TO_APPROVE';
```

### Creating an Admin Dashboard (Future Enhancement)

You can build an admin page in your app where approved admins can:
- View pending users
- Approve/reject users
- Manage user access

## Testing

1. Sign up with a test email
2. You should see "Awaiting admin approval" message
3. Approve the user via SQL
4. User can now access the app after refreshing

## Security Notes

- First admin must be manually approved via SQL
- Approved admins can approve other users
- RLS policies prevent unapproved users from accessing data
- Consider adding rate limiting on sign-up endpoint
