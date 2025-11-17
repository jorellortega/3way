-- Add phone field to users table
alter table public.users 
add column if not exists phone text;

-- Add comment to explain the field
comment on column public.users.phone is 'User phone number';

-- Update the handle_new_user function to include phone from user metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, first_name, last_name, role, phone)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'first_name', ''),
        coalesce(new.raw_user_meta_data->>'last_name', ''),
        coalesce(new.raw_user_meta_data->>'role', 'user'),
        coalesce(new.raw_user_meta_data->>'phone', null)
    );
    return new;
end;
$$ language plpgsql security definer;

