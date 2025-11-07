-- Migrate old onboarding_progress schema to new schema
-- This handles the case where the table exists with old column names

-- Check if old columns exist and migrate data
do $$
begin
    -- If status column exists (old schema), migrate to new schema
    if exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' 
        and table_name = 'onboarding_progress' 
        and column_name = 'status'
    ) then
        -- Add new columns if they don't exist
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'identity_status'
        ) then
            alter table public.onboarding_progress 
            add column identity_status text default 'pending';
            
            -- Migrate data from old status to new identity_status
            update public.onboarding_progress
            set identity_status = case
                when status = 'in_progress' then 'submitted'
                when status = 'completed' and identity_verified = true then 'approved'
                when status = 'completed' and identity_verified = false then 'pending'
                else 'pending'
            end;
        end if;
        
        -- Add other new columns if they don't exist
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'identity_document_url'
        ) then
            alter table public.onboarding_progress 
            add column identity_document_url text;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'identity_submitted_at'
        ) then
            alter table public.onboarding_progress 
            add column identity_submitted_at timestamp with time zone;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'identity_reviewed_at'
        ) then
            alter table public.onboarding_progress 
            add column identity_reviewed_at timestamp with time zone;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'identity_review_notes'
        ) then
            alter table public.onboarding_progress 
            add column identity_review_notes text;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'terms_accepted'
        ) then
            alter table public.onboarding_progress 
            add column terms_accepted boolean default false;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'terms_accepted_at'
        ) then
            alter table public.onboarding_progress 
            add column terms_accepted_at timestamp with time zone;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'terms_version'
        ) then
            alter table public.onboarding_progress 
            add column terms_version text;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'payments_setup_at'
        ) then
            alter table public.onboarding_progress 
            add column payments_setup_at timestamp with time zone;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'payments_provider'
        ) then
            alter table public.onboarding_progress 
            add column payments_provider text;
        end if;
        
        if not exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and column_name = 'payments_account_id'
        ) then
            alter table public.onboarding_progress 
            add column payments_account_id text;
        end if;
        
        -- Add check constraint for identity_status if it doesn't exist
        if not exists (
            select 1 from information_schema.table_constraints 
            where table_schema = 'public' 
            and table_name = 'onboarding_progress' 
            and constraint_name = 'onboarding_progress_identity_status_check'
        ) then
            alter table public.onboarding_progress
            add constraint onboarding_progress_identity_status_check
            check (identity_status in ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'resubmit_required'));
        end if;
    end if;
end $$;

-- Add comments if columns exist
do $$
begin
    if exists (
        select 1 from information_schema.columns 
        where table_schema = 'public' 
        and table_name = 'onboarding_progress' 
        and column_name = 'identity_status'
    ) then
        comment on column public.onboarding_progress.identity_status is 'Status of identity verification: pending, submitted, under_review, approved, rejected, resubmit_required';
    end if;
end $$;

