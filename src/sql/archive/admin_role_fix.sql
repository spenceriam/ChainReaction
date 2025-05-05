-- Fixed SQL script for users_with_admin_role function

-- Create admin role function for policy use - FIXED VERSION
CREATE OR REPLACE FUNCTION public.users_with_admin_role()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT auth.users.id FROM auth.users
  WHERE auth.users.raw_user_meta_data->>'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative version if the above doesn't work
-- CREATE OR REPLACE FUNCTION public.users_with_admin_role()
-- RETURNS SETOF UUID AS 38211
-- BEGIN
--   RETURN QUERY
--   SELECT uuid FROM auth.users
--   WHERE raw_user_meta_data->>'role' = 'admin';
-- END;
-- 38211 LANGUAGE plpgsql SECURITY DEFINER;

-- Check auth.users table structure (run this separately to see the columns)
-- SELECT column_name FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users';
