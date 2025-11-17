-- Update the handle_new_user function to use role from user metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, first_name, last_name, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'first_name', ''),
        coalesce(new.raw_user_meta_data->>'last_name', ''),
        coalesce(new.raw_user_meta_data->>'role', 'user')
    );
    return new;
end;
$$ language plpgsql security definer;

