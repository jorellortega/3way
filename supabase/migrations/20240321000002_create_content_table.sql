-- Create content table
create table if not exists public.content (
    id bigint primary key generated always as identity,
    creator_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    description text,
    price decimal(10,2) not null default 0,
    type text not null check (type in ('video', 'image', 'package')),
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    thumbnail_url text,
    content_url text,
    views_count bigint default 0,
    likes_count bigint default 0,
    is_featured boolean default false,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.content enable row level security;

-- RLS Policies
create policy "Anyone can view published content"
    on public.content
    for select
    using (status = 'published');

create policy "Creators can view their own content"
    on public.content
    for select
    using (auth.uid() = creator_id);

create policy "Creators can insert their own content"
    on public.content
    for insert
    with check (auth.uid() = creator_id);

create policy "Creators can update their own content"
    on public.content
    for update
    using (auth.uid() = creator_id);

create policy "Creators can delete their own content"
    on public.content
    for delete
    using (auth.uid() = creator_id);

-- Create indexes
create index content_creator_id_idx on public.content(creator_id);
create index content_status_idx on public.content(status);
create index content_type_idx on public.content(type);
create index content_is_featured_idx on public.content(is_featured); 