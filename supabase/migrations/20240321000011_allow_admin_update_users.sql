-- Allow admins and CEOs to update user profiles
-- This is needed for the verification page where admins need to update account_status
-- We use a security definer function to avoid infinite recursion in RLS policies

-- Drop existing admin update policy if it exists
drop policy if exists "Admins can update all user profiles" on public.users;
drop policy if exists "Admins can view all user profiles" on public.users;

-- Create a security definer function to check if current user is admin/CEO
-- This function bypasses RLS, preventing infinite recursion
create or replace function public.is_admin_or_ceo()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    return exists (
        select 1
        from public.users
        where id = auth.uid()
        and role in ('admin', 'ceo')
    );
end;
$$;

-- Create policy that allows admins and CEOs to update any user profile
-- Uses the security definer function to avoid recursion
create policy "Admins can update all user profiles"
    on public.users
    for update
    using (public.is_admin_or_ceo())
    with check (public.is_admin_or_ceo());

-- Also allow admins and CEOs to view all user profiles (for the verification page)
create policy "Admins can view all user profiles"
    on public.users
    for select
    using (public.is_admin_or_ceo());

