-- Query to check column names in auth.users table
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'users' 
ORDER BY ordinal_position; 