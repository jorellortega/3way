-- Add test creators to the database
-- First, let's check if there are any existing users
SELECT id, email, first_name, last_name, role FROM users LIMIT 5;

-- Add test creators (using proper UUID generation)
INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    role,
    bio,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'john.creator@example.com',
    'John',
    'Creator',
    'creator',
    'Digital content creator specializing in photography and videography',
    true,
    NOW(),
    NOW()
);

INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    role,
    bio,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'jane.artist@example.com',
    'Jane',
    'Artist',
    'creator',
    'Professional illustrator and 3D artist',
    false,
    NOW(),
    NOW()
);

INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    role,
    bio,
    is_verified,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'mike.designer@example.com',
    'Mike',
    'Designer',
    'creator',
    'UI/UX designer and graphic artist',
    true,
    NOW(),
    NOW()
);

-- Check the results
SELECT id, email, first_name, last_name, role FROM users WHERE role = 'creator'; 