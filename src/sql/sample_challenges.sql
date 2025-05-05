-- Add sample daily challenges for testing ChainReaction game
-- These challenges use the word chains created in populate_words.sql

-- Ensure required tables exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'daily_challenges') THEN
    RAISE EXCEPTION 'daily_challenges table does not exist. Please run daily_challenges.sql first.';
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'words') THEN
    RAISE EXCEPTION 'words table does not exist. Please run base_tables.sql and populate_words.sql first.';
  END IF;
END $$;

-- Function to create a daily challenge
CREATE OR REPLACE FUNCTION create_challenge(
  p_start_word TEXT, 
  p_end_word TEXT, 
  p_expected_length INTEGER, 
  p_difficulty INTEGER, 
  p_days_from_today INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.daily_challenges (
    start_word, 
    end_word, 
    expected_chain_length, 
    difficulty, 
    valid_date
  )
  VALUES (
    p_start_word, 
    p_end_word, 
    p_expected_length, 
    p_difficulty, 
    CURRENT_DATE + p_days_from_today
  )
  ON CONFLICT (valid_date) DO UPDATE 
  SET 
    start_word = p_start_word,
    end_word = p_end_word,
    expected_chain_length = p_expected_length,
    difficulty = p_difficulty;
END;
$$ LANGUAGE plpgsql;

-- Begin transaction
BEGIN;

-- Past challenges (for testing history)
SELECT create_challenge('CAT', 'RED', 4, 1, -3);  -- Easy challenge from 3 days ago
SELECT create_challenge('WORD', 'POST', 7, 2, -2); -- Medium challenge from 2 days ago
SELECT create_challenge('CHAIR', 'SCORE', 10, 3, -1); -- Harder challenge from yesterday

-- Today's challenge
SELECT create_challenge('CHANGE', 'LARGE', 4, 2, 0); -- Medium challenge for today

-- Future challenges (for admins to prepare)
SELECT create_challenge('REACTION', 'CRACKING', 5, 4, 1); -- Hard challenge for tomorrow
SELECT create_challenge('BLANKET', 'ROCKET', 7, 3, 2); -- Medium-hard challenge for day after tomorrow
SELECT create_challenge('HOUSE', 'MOUSE', 2, 1, 3); -- Easy challenge for 3 days from now
SELECT create_challenge('COLD', 'GOLD', 3, 1, 4); -- Easy challenge for 4 days from now
SELECT create_challenge('SPARE', 'SHARE', 2, 2, 5); -- Medium challenge for 5 days from now
SELECT create_challenge('SPINNING', 'PLANNING', 6, 5, 6); -- Very hard challenge for 6 days from now

-- Commit transaction
COMMIT;

-- Drop the temporary function
DROP FUNCTION IF EXISTS create_challenge(TEXT, TEXT, INTEGER, INTEGER, INTEGER);

-- Verification query
SELECT 
  id, 
  start_word, 
  end_word, 
  expected_chain_length, 
  difficulty, 
  valid_date,
  CASE 
    WHEN valid_date < CURRENT_DATE THEN 'past'
    WHEN valid_date = CURRENT_DATE THEN 'today'
    ELSE 'future'
  END AS status
FROM public.daily_challenges
ORDER BY valid_date; 