# Database Migration Guide

## Summary of Changes

I've identified and fixed several issues with your signup flow and database schema:

### Issues Found:
1. **ID Type Mismatch**: The `users` table was expecting a `number` ID but Supabase Auth creates UUID IDs
2. **Missing Database Schema**: No proper migration for the `users` table
3. **Race Condition**: Dashboard trying to fetch user profile before database trigger creates it
4. **Delayed Redirect**: Signup was waiting 2.5 seconds before redirecting

### Fixes Applied:

1. **Created proper database migrations**:
   - `20240321000001_create_users_table.sql`: Creates users table with UUID primary key and trigger
   - `20240321000002_create_content_table.sql`: Creates content table with proper schema

2. **Updated signup flow**:
   - Now passes user metadata to Supabase Auth
   - Database trigger automatically creates user profile
   - Immediate redirect to dashboard (no 2.5 second delay)

3. **Improved dashboard**:
   - Added retry logic for profile fetching
   - Handles cases where trigger might be delayed
   - Fallback to manual profile creation if needed

4. **Fixed TypeScript types**:
   - Updated all table types to match actual database schema
   - Proper UUID types for user IDs

## How to Apply Migrations

### Option 1: Using Supabase CLI
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### Option 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order:
   - `20240321000001_create_users_table.sql`
   - `20240321000002_create_content_table.sql`

### Option 3: Manual SQL Execution
Copy and paste the contents of each migration file into your Supabase SQL Editor and execute them in order.

## What the Trigger Does

The database trigger `on_auth_user_created` automatically:
1. Creates a user profile in the `users` table when a new auth user is created
2. Uses the metadata passed during signup (first_name, last_name)
3. Sets default role to 'user'

## Testing the Fix

After applying migrations:
1. Try signing up a new user
2. Should immediately redirect to `/dashboard`
3. Dashboard should load user profile without issues
4. Check browser console for any remaining errors

## Database Schema Overview

- **auth.users**: Supabase Auth users (UUID primary key)
- **public.users**: User profiles (UUID primary key, references auth.users)
- **public.content**: Content items (bigint primary key, references users)
- **public.user_content_access**: Access control (UUID primary key, references both users and content) 