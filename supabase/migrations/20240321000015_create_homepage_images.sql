-- Create homepage_images table for managing hero section images
create table if not exists public.homepage_images (
    id bigint primary key generated always as identity,
    image_url text not null,
    position integer not null,
    alt_text text,
    is_active boolean default true,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.homepage_images enable row level security;

-- RLS Policies - Only admins and ceo can manage
create policy "Anyone can view active homepage images"
    on public.homepage_images
    for select
    using (is_active = true);

create policy "Admins and CEO can manage homepage images"
    on public.homepage_images
    for all
    using (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.role in ('admin', 'ceo')
        )
    );

-- Create index for ordering
create index homepage_images_position_idx on public.homepage_images(position);
create index homepage_images_is_active_idx on public.homepage_images(is_active);

-- Create trigger to update updated_at
create or replace function update_homepage_images_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger homepage_images_updated_at
    before update on public.homepage_images
    for each row
    execute procedure update_homepage_images_updated_at();

