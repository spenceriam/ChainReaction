-- Check which tables exist and which are missing

-- List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check for specific tables from our setup
SELECT 
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
       THEN 'exists' ELSE 'missing' END AS profiles_table,
       
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'words') 
       THEN 'exists' ELSE 'missing' END AS words_table,
       
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'daily_challenges') 
       THEN 'exists' ELSE 'missing' END AS daily_challenges_table,
       
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_solutions') 
       THEN 'exists' ELSE 'missing' END AS user_solutions_table,
       
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_stats') 
       THEN 'exists' ELSE 'missing' END AS user_stats_table,
       
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dictionary') 
       THEN 'exists' ELSE 'missing' END AS dictionary_table;

-- Check if important functions exist
SELECT 
  CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'users_with_admin_role') 
       THEN 'exists' ELSE 'missing' END AS admin_role_function,
       
  CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'validate_word_chain') 
       THEN 'exists' ELSE 'missing' END AS validate_word_chain_function,
       
  CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'calculate_solution_score') 
       THEN 'exists' ELSE 'missing' END AS calculate_score_function,
       
  CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'update_user_stats_on_solution') 
       THEN 'exists' ELSE 'missing' END AS stats_update_function,
       
  CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_updated_at') 
       THEN 'exists' ELSE 'missing' END AS updated_at_function; 