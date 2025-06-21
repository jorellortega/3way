-- Create users table with UUID primary key to match Supabase Auth
create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    first_name text not null,
    last_name text not null,
    role text default 'user' check (role in ('user', 'creator', 'admin', 'ceo')),
    profile_image text,
    bio text,
    is_verified boolean default false,
    last_login timestamp with time zone,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.users enable row level security;

-- RLS Policies
create policy "Users can view their own profile"
    on public.users
    for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users
    for update
    using (auth.uid() = id);

create policy "System can insert user profiles"
    on public.users
    for insert
    with check (true);

-- Create trigger to automatically create user profile when auth user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, first_name, last_name, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'first_name', ''),
        coalesce(new.raw_user_meta_data->>'last_name', ''),
        'user'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create indexes
create index users_email_idx on public.users(email);
create index users_role_idx on public.users(role); 