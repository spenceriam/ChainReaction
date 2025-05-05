-- Fixed SQL script for users_with_admin_role function - Version 2

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.users_with_admin_role();

-- Create admin role function for policy use - simplified version
CREATE OR REPLACE FUNCTION public.users_with_admin_role()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT id FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a test to see if function is working
SELECT EXISTS (
  SELECT 1 FROM users_with_admin_role() LIMIT 1
) AS has_admin_users; 