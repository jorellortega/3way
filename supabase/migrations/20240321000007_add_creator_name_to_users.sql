-- Add creator_name field to users table
-- This field will be used as a display name instead of the real first_name and last_name

alter table public.users 
add column if not exists creator_name text;

-- Add comment to explain the field
comment on column public.users.creator_name is 'Display name used instead of real name for creators';

-- The field is nullable, so existing users won't be affected
-- Users can set this field if they want to use a display name

