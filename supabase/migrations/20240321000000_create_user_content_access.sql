-- Create user_content_access table
create table if not exists public.user_content_access (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    content_id integer references public.content(id) on delete cascade not null,
    transaction_id text not null,
    access_granted boolean default true not null,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Add RLS policies
alter table public.user_content_access enable row level security;

-- Allow users to view their own access
create policy "Users can view their own content access"
    on public.user_content_access
    for select
    using (auth.uid() = user_id);

-- Allow system to insert access records
create policy "System can insert access records"
    on public.user_content_access
    for insert
    with check (true);

-- Create index for faster lookups
create index user_content_access_user_id_idx on public.user_content_access(user_id);
create index user_content_access_content_id_idx on public.user_content_access(content_id);
create index user_content_access_transaction_id_idx on public.user_content_access(transaction_id); 