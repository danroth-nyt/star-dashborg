# Admin Approval Guide

This guide explains how to grant users access to Star Dashborg using the Supabase admin approval system.

## Overview

Star Dashborg uses an admin approval workflow to control who can access the application. When a new user signs up, they are automatically placed in a "pending approval" state and must wait for an administrator to approve their account before they can use the app.

## Prerequisites

- Admin access to your Supabase project dashboard
- The `admin_profiles` table created in your database (see main README for schema)

## Approving a New User

### Step 1: User Signs Up

When a user creates an account:
1. They enter their email and password on the auth page
2. An account is created in Supabase Auth
3. A record is automatically created in the `admin_profiles` table with `approved = false`
4. The user sees a "Pending Approval" screen

### Step 2: Find the User in Supabase

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Star Dashborg project
3. Navigate to **Table Editor** in the left sidebar
4. Select the **`admin_profiles`** table

### Step 3: Approve the User

**Option A: Using the Table Editor (Recommended)**

1. Find the user's row in the `admin_profiles` table
2. Click on the `approved` column for that user
3. Change the value from `false` to `true`
4. Click the checkmark to save

**Option B: Using SQL Editor**

1. Navigate to **SQL Editor** in the left sidebar
2. Run this query (replace `USER_EMAIL` with their actual email):

```sql
update admin_profiles
set approved = true
where user_id = (
  select id 
  from auth.users 
  where email = 'USER_EMAIL'
);
```

### Step 4: User Accesses the App

Once approved:
1. The user can refresh their browser or click "Check Status"
2. They will be redirected to character creation
3. They can now use the app normally

## Viewing Pending Approvals

To see all users awaiting approval:

```sql
select 
  u.email,
  u.created_at as signed_up_at,
  ap.approved
from auth.users u
join admin_profiles ap on u.id = ap.user_id
where ap.approved = false
order by u.created_at desc;
```

## Viewing All Approved Users

To see all approved users:

```sql
select 
  u.email,
  u.created_at as signed_up_at,
  ap.approved,
  ap.created_at as approved_at
from auth.users u
join admin_profiles ap on u.id = ap.user_id
where ap.approved = true
order by u.created_at desc;
```

## Revoking Access

If you need to revoke a user's access:

1. Navigate to the `admin_profiles` table
2. Find the user's row
3. Change `approved` from `true` to `false`
4. The user will be logged out and redirected to the pending approval screen

Alternatively, use SQL:

```sql
update admin_profiles
set approved = false
where user_id = (
  select id 
  from auth.users 
  where email = 'USER_EMAIL'
);
```

## Automating Approval (Optional)

If you want to automatically approve all new users, you can create a Supabase database function and trigger:

```sql
-- Create function to auto-approve
create or replace function auto_approve_user()
returns trigger as $$
begin
  update admin_profiles
  set approved = true
  where user_id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to run on insert
create trigger on_profile_created
  after insert on admin_profiles
  for each row
  execute function auto_approve_user();
```

⚠️ **Warning**: This removes the approval requirement entirely. Only use this if you want open access to your app.

## Disabling the Approval System

If you want to disable the approval system entirely:

### Option 1: Approve All Existing Users

```sql
update admin_profiles set approved = true;
```

Then implement the auto-approval trigger above for new users.

### Option 2: Remove Approval Check from Code

1. Open `src/context/AuthContext.jsx`
2. Find the `checkApprovalStatus` function
3. Change it to always set `approved = true`:

```javascript
const checkApprovalStatus = async (userId) => {
  setCheckingApproval(false);
  setApproved(true); // Always approve
};
```

4. Or remove the approval check entirely from `src/App.jsx`

## Troubleshooting

### User Says They Can't Access After Approval

1. **Check Database**: Verify `approved = true` in `admin_profiles` table
2. **Check User ID**: Ensure the `user_id` in `admin_profiles` matches the user's ID in `auth.users`
3. **Ask User to Refresh**: They may need to hard refresh (Ctrl+F5 / Cmd+Shift+R)
4. **Check Browser Console**: Look for any errors related to approval checking

### Missing Record in admin_profiles Table

If a user signed up but has no record in `admin_profiles`:

```sql
-- Manually create the record
insert into admin_profiles (user_id, approved)
select id, false
from auth.users
where email = 'USER_EMAIL'
and id not in (select user_id from admin_profiles);
```

### RLS Issues

If users can't see their approval status, check Row Level Security policies:

```sql
-- Users should be able to read their own profile
create policy "Users can view their own profile" 
  on admin_profiles for select 
  using (auth.uid() = user_id);
```

## Email Notifications (Future Enhancement)

Currently, the system does not send email notifications. To add this feature:

1. Set up [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
2. Create a database function to send emails using Supabase's `pg_net` extension
3. Trigger the function when `approved` changes to `true`

Example:

```sql
create or replace function notify_user_approved()
returns trigger as $$
begin
  if new.approved = true and old.approved = false then
    -- Send email notification here
    -- (requires Supabase Edge Functions or external service)
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_approval_changed
  after update on admin_profiles
  for each row
  when (old.approved is distinct from new.approved)
  execute function notify_user_approved();
```

## Best Practices

1. **Regular Reviews**: Periodically review pending approvals
2. **Clear Criteria**: Establish clear criteria for who should be approved
3. **Communication**: Let users know they need approval (consider adding this to sign-up page)
4. **Monitor Access**: Keep track of who has been granted access
5. **Revoke When Needed**: Don't hesitate to revoke access if necessary

## New Features and Permissions

### Space Combat (No Additional Setup Required)
The space combat system introduced in this branch requires no additional database tables or permissions:
- Space combat state is stored in the existing `sessions.game_state` JSONB field
- Ship upgrades and torpedo inventory are part of game state
- No RLS policy changes needed
- All approved users automatically have access to space combat

### Character Journals (Already Configured)
Character journals use the existing `characters.journal` field:
- Personal journals auto-save with debounce
- Uses existing character RLS policies
- No additional configuration needed

## Support

If you need help with the approval system:
- Check Supabase logs for any database errors
- Review RLS policies to ensure they're configured correctly
- Test with a new account to verify the workflow
- Consult the main README.md for database schema details
- For space combat issues, check that `game_state` column allows JSONB updates
