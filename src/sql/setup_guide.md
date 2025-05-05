# ChainReaction Database Setup Guide

This guide explains how to set up the database for the ChainReaction game using modular SQL scripts.

## Prerequisites

- Supabase project with database access
- SQL Editor access

## Setup Order

Run the scripts in the following order:

1. **base_tables.sql**
   - Creates profiles table (extends auth.users)
   - Creates words/dictionary table
   - Sets up basic utility functions

2. **admin_role_fix_v2.sql**
   - Creates the users_with_admin_role() function
   - Tests if there are any admin users

3. **daily_challenges.sql**
   - Creates the daily_challenges table
   - Sets up basic RLS policies without admin checks

4. **user_solutions.sql**
   - Creates the user_solutions table
   - Sets up RLS policies
   - References the daily_challenges table

5. **functions.sql**
   - Creates utility functions
   - No table dependencies

6. **user_stats.sql**
   - Creates the user_stats table
   - Sets up the trigger function on user_solutions
   - References both daily_challenges and user_solutions tables

7. **populate_words.sql** (Optional but recommended)
   - Adds 100 sample words with carefully selected difficulty levels and frequencies
   - Includes words that can form valid word chains for testing
   - Verifies counts of words at each difficulty level

8. **sample_challenges.sql** (Optional but recommended)
   - Creates sample daily challenges using the word chains
   - Includes past challenges for history testing
   - Sets up today's challenge and future challenges

## Troubleshooting

If you encounter any errors:

1. Check if tables already exist before creating them
2. Verify that functions have been created successfully
3. Ensure you run the scripts in the correct order
4. Use the `check_existing_tables.sql` script to verify what exists already

## Adding Admin Users

After setting up, you'll need to add admin users to enable admin policies. Run:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE email = 'your-admin-email@example.com';
```

Then re-check if admins exist:

```sql
SELECT EXISTS (
  SELECT 1 FROM users_with_admin_role() LIMIT 1
) AS has_admin_users;
```

## Testing Your Setup

After completing the setup, you can test the game functionality with:

1. Check if word chains are valid:
```sql
SELECT validate_word_chain(ARRAY['CAT', 'BAT', 'BED', 'RED']);
```

2. Calculate scores for a solution:
```sql
SELECT calculate_solution_score(
  4, -- chain length
  120, -- time taken in seconds
  6, -- number of attempts
  2 -- difficulty level
);
```

3. View a daily challenge:
```sql
SELECT * FROM daily_challenges WHERE valid_date = CURRENT_DATE;
```

## Next Steps

Once the core tables are set up, you can create additional tables for badges, tournaments, etc. 