-- Fix RLS update policies to include WITH CHECK clauses
-- This fixes the 400 error when users try to update their onboarding progress

-- Drop and recreate the update policies with WITH CHECK clauses
drop policy if exists "Users can update their own onboarding progress" on public.onboarding_progress;
drop policy if exists "Admins can update all onboarding progress" on public.onboarding_progress;

-- Recreate with proper WITH CHECK clauses
create policy "Users can update their own onboarding progress"
    on public.onboarding_progress
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Admins can update all onboarding progress"
    on public.onboarding_progress
    for update
    using (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.role in ('admin', 'ceo')
        )
    )
    with check (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.role in ('admin', 'ceo')
        )
    );

