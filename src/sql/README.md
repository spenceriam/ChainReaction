# ChainReaction SQL Database Setup

This directory contains SQL scripts to set up the database for the ChainReaction word game.

## Database Schema Overview

The ChainReaction game uses several tables to track:
- Daily challenges
- User solutions
- User statistics
- Badges and achievements
- Tournaments and matchups

## Setup Instructions

### Modular Setup (Recommended)

For the most reliable setup, use these scripts in the following order:

1. `base_tables.sql` - Creates profiles and words tables
2. `admin_role_fix_v2.sql` - Creates admin role function
3. `daily_challenges.sql` - Creates daily challenges table
4. `user_solutions.sql` - Creates user solutions table
5. `functions.sql` - Creates utility functions
6. `user_stats.sql` - Creates user stats table with triggers
7. `populate_words.sql` - Adds sample words (optional but recommended)
8. `sample_challenges.sql` - Adds sample challenges (optional but recommended)

Follow the detailed instructions in `setup_guide.md` for step-by-step guidance.

### Initial Setup

If you're setting up a fresh database, you may also need to run:

```sql
-- Create the dictionary table
CREATE TABLE IF NOT EXISTS public.dictionary (
  word TEXT PRIMARY KEY,
  word_length INTEGER GENERATED ALWAYS AS (length(word)) STORED,
  popularity INTEGER DEFAULT 0
);

-- Add any additional base tables needed
```

## Maintenance

After initial setup, you may need to:

1. Add admin users:
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
   WHERE email = 'your-admin-email@example.com';
   ```

2. Add daily challenges:
   ```sql
   INSERT INTO daily_challenges (start_word, end_word, expected_chain_length, difficulty, valid_date)
   VALUES ('word', 'game', 4, 3, CURRENT_DATE);
   ```

## Archive

Deprecated scripts have been moved to the `archive` directory and should not be used.

## Verifying Setup

After running the setup scripts, you can verify it worked by:

1. Checking the "Tables" section in your Supabase dashboard to see the new tables
2. Running a SQL query to test the utility functions:
   ```sql
   SELECT validate_word_chain(ARRAY['CAT', 'BAT', 'BED', 'RED']);
   
   SELECT calculate_solution_score(5, 120, 7, 3);
   ```

## Troubleshooting

If you need to check what's already set up in your database, run:
```sql
-- Check for existing tables and functions
SELECT * FROM check_existing_tables.sql;
```

## Next Steps

After setting up your database, you can:

1. Load word data into the `words` table
2. Create test daily challenges
3. Set up admin users with the 'admin' role in their metadata
4. Test the game functionality

## Troubleshooting

If you encounter any issues:

- Check the SQL Editor error messages
- Ensure you have the correct permissions in your Supabase project
- Verify that your application's environment variables are set correctly 