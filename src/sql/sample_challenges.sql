-- Add sample daily challenges for testing ChainReaction game
-- This script adds today's challenge and 30 days of future challenges
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

-- Today's challenge
SELECT create_challenge('CHANGE', 'LARGE', 4, 2, 0); -- Medium challenge for today

-- Future challenges (next 30 days) with varying difficulty patterns
-- Week 1
SELECT create_challenge('REACTION', 'CRACKING', 5, 4, 1); -- Hard challenge
SELECT create_challenge('BLANKET', 'ROCKET', 7, 3, 2); -- Medium-hard challenge
SELECT create_challenge('HOUSE', 'MOUSE', 2, 1, 3); -- Easy challenge
SELECT create_challenge('COLD', 'GOLD', 3, 1, 4); -- Easy challenge
SELECT create_challenge('SPARE', 'SHARE', 2, 2, 5); -- Medium challenge
SELECT create_challenge('SPINNING', 'PLANNING', 6, 5, 6); -- Very hard challenge
SELECT create_challenge('CHAIR', 'SHORE', 5, 3, 7); -- Medium-hard challenge

-- Week 2
SELECT create_challenge('WORD', 'CORD', 2, 1, 8); -- Easy challenge
SELECT create_challenge('LORD', 'FORD', 2, 1, 9); -- Easy challenge
SELECT create_challenge('CHARM', 'CHAMP', 2, 2, 10); -- Medium challenge
SELECT create_challenge('CHOMP', 'CHORE', 2, 3, 11); -- Medium challenge
SELECT create_challenge('SHARE', 'SCARE', 2, 3, 12); -- Medium challenge
SELECT create_challenge('SCORE', 'SHORE', 2, 3, 13); -- Medium challenge
SELECT create_challenge('CHANGED', 'CHARGED', 2, 4, 14); -- Hard challenge

-- Week 3
SELECT create_challenge('CHANNEL', 'FLANNEL', 2, 4, 15); -- Hard challenge
SELECT create_challenge('BLANKED', 'BLANKET', 2, 4, 16); -- Hard challenge
SELECT create_challenge('BRACKET', 'RACKET', 2, 3, 17); -- Medium challenge
SELECT create_challenge('ROCKET', 'POCKET', 2, 2, 18); -- Medium challenge
SELECT create_challenge('LOCKED', 'LOCKET', 2, 3, 19); -- Medium challenge
SELECT create_challenge('GARDEN', 'HARDEN', 2, 2, 20); -- Medium challenge
SELECT create_challenge('BURDEN', 'HIDDEN', 2, 4, 21); -- Hard challenge

-- Week 4 and beyond
SELECT create_challenge('CAT', 'HAT', 2, 1, 22); -- Easy challenge
SELECT create_challenge('BAT', 'RAT', 2, 1, 23); -- Easy challenge
SELECT create_challenge('DOG', 'LOG', 2, 1, 24); -- Easy challenge
SELECT create_challenge('FOG', 'BOG', 2, 2, 25); -- Medium challenge
SELECT create_challenge('BED', 'RED', 2, 1, 26); -- Easy challenge
SELECT create_challenge('WED', 'LED', 2, 2, 27); -- Medium challenge
SELECT create_challenge('WORLD', 'WOULD', 2, 3, 28); -- Medium challenge
SELECT create_challenge('COULD', 'WOULD', 2, 3, 29); -- Medium challenge
SELECT create_challenge('FRACTION', 'TRACTION', 2, 5, 30); -- Very hard challenge

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
    WHEN valid_date = CURRENT_DATE THEN 'today'
    ELSE 'future'
  END AS status
FROM public.daily_challenges
WHERE valid_date >= CURRENT_DATE
ORDER BY valid_date; 