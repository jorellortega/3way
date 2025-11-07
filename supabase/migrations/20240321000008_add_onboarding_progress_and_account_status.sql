-- Add account_status to users table
alter table public.users 
add column if not exists account_status text default 'good_standing' 
check (account_status in ('good_standing', 'paused', 'hold', 'blocked'));

-- Add comment to explain the field
comment on column public.users.account_status is 'Account status: good_standing, paused, hold, or blocked';

-- Create onboarding_progress table
create table if not exists public.onboarding_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references public.users(id) on delete cascade,
    
    -- Step 1: Identity & Age Verification
    identity_status text default 'pending' 
        check (identity_status in ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'resubmit_required')),
    identity_document_url text,
    identity_submitted_at timestamp with time zone,
    identity_reviewed_at timestamp with time zone,
    identity_review_notes text,
    
    -- Step 2: Payments Setup
    payments_setup boolean default false,
    payments_setup_at timestamp with time zone,
    payments_provider text, -- e.g., 'stripe', 'paypal', etc.
    payments_account_id text, -- External payment provider account ID
    
    -- Step 3: Terms & Documents
    terms_accepted boolean default false,
    terms_accepted_at timestamp with time zone,
    terms_version text, -- Track which version of terms was accepted
    
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    
    constraint fk_onboarding_progress_user_id foreign key (user_id) references public.users(id) on delete cascade
);

-- Add comments to explain fields
comment on table public.onboarding_progress is 'Tracks onboarding progress for creators';
comment on column public.onboarding_progress.identity_status is 'Status of identity verification: pending, submitted, under_review, approved, rejected, resubmit_required';
comment on column public.onboarding_progress.payments_setup is 'Whether payment setup is complete';
comment on column public.onboarding_progress.terms_accepted is 'Whether terms and documents have been accepted';

-- Enable RLS
alter table public.onboarding_progress enable row level security;

-- Drop existing policies if they exist (to allow re-running migration)
drop policy if exists "Users can view their own onboarding progress" on public.onboarding_progress;
drop policy if exists "Admins can view all onboarding progress" on public.onboarding_progress;
drop policy if exists "Users can update their own onboarding progress" on public.onboarding_progress;
drop policy if exists "Admins can update all onboarding progress" on public.onboarding_progress;
drop policy if exists "Users can insert their own onboarding progress" on public.onboarding_progress;
drop policy if exists "System can insert onboarding records" on public.onboarding_progress;

-- RLS Policies for onboarding_progress
create policy "Users can view their own onboarding progress"
    on public.onboarding_progress
    for select
    using (auth.uid() = user_id);

create policy "Admins can view all onboarding progress"
    on public.onboarding_progress
    for select
    using (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.role in ('admin', 'ceo')
        )
    );

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

create policy "Users can insert their own onboarding progress"
    on public.onboarding_progress
    for insert
    with check (auth.uid() = user_id);

-- Create indexes (drop first if they exist)
drop index if exists public.onboarding_progress_user_id_idx;
drop index if exists public.onboarding_progress_identity_status_idx;
drop index if exists public.users_account_status_idx;

create index onboarding_progress_user_id_idx on public.onboarding_progress(user_id);
create index onboarding_progress_identity_status_idx on public.onboarding_progress(identity_status);
create index users_account_status_idx on public.users(account_status);

-- Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Drop trigger if it exists
drop trigger if exists update_onboarding_progress_updated_at on public.onboarding_progress;

-- Create trigger to update updated_at on onboarding_progress
create trigger update_onboarding_progress_updated_at
    before update on public.onboarding_progress
    for each row
    execute function update_updated_at_column();

