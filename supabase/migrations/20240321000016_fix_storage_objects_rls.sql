-- Fix RLS policies for storage.objects to allow authenticated users to upload/update files
-- This allows authenticated users to insert and update objects in the 'files' bucket

-- Drop existing policies if they exist (to allow re-running)
drop policy if exists "Allow authenticated to upload files" on storage.objects;
drop policy if exists "Allow authenticated to update files" on storage.objects;
drop policy if exists "Allow authenticated to delete files" on storage.objects;
drop policy if exists "Allow authenticated to view files" on storage.objects;

-- Allow authenticated users to insert files into the 'files' bucket
create policy "Allow authenticated to upload files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'files'::text
);

-- Allow authenticated users to update files in the 'files' bucket
create policy "Allow authenticated to update files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'files'::text
)
with check (
  bucket_id = 'files'::text
);

-- Allow authenticated users to delete files from the 'files' bucket
create policy "Allow authenticated to delete files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'files'::text
);

-- Allow authenticated users to view files in the 'files' bucket
create policy "Allow authenticated to view files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'files'::text
);

