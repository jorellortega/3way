-- Allow public viewing of creator profiles
-- Drop existing restrictive policy first
drop policy if exists "Users can view their own profile" on public.users;

-- Create new policy that allows viewing creator profiles publicly
create policy "Anyone can view creator profiles"
    on public.users
    for select
    using (role = 'creator');

-- Also allow users to view their own profile regardless of role
create policy "Users can view their own profile"
    on public.users
    for select
    using (auth.uid() = id);

-- Keep the update policy
create policy "Users can update their own profile"
    on public.users
    for update
    using (auth.uid() = id);

-- Keep the insert policy
create policy "System can insert user profiles"
    on public.users
    for insert
    with check (true); 