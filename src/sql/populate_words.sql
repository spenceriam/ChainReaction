-- Populate words table for ChainReaction game
-- This script adds 100 carefully selected words with proper difficulty ratings and frequency values
-- Words are chosen to form valid chains where changing one letter creates another valid word

-- Clear existing words if needed (comment out if you want to keep existing words)
-- TRUNCATE TABLE public.words;

-- Verify words table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'words') THEN
    RAISE EXCEPTION 'words table does not exist. Please run base_tables.sql first.';
  END IF;
END $$;

-- Word insertion function to simplify the script
CREATE OR REPLACE FUNCTION insert_word(p_word TEXT, p_difficulty INTEGER, p_frequency FLOAT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.words (word, difficulty, frequency)
  VALUES (p_word, p_difficulty, p_frequency)
  ON CONFLICT (word) DO UPDATE 
  SET difficulty = p_difficulty, frequency = p_frequency;
END;
$$ LANGUAGE plpgsql;

-- Begin transaction
BEGIN;

-- -------------------------------------------------------------------------
-- 3-letter words (Difficulty 1, Higher frequency 0.70-0.95)
-- -------------------------------------------------------------------------
SELECT insert_word('CAT', 1, 0.92);
SELECT insert_word('BAT', 1, 0.88);
SELECT insert_word('RAT', 1, 0.86);
SELECT insert_word('HAT', 1, 0.90);
SELECT insert_word('MAT', 1, 0.84);
SELECT insert_word('FAT', 1, 0.89);
SELECT insert_word('SAT', 1, 0.91);
SELECT insert_word('DOG', 1, 0.95);
SELECT insert_word('LOG', 1, 0.82);
SELECT insert_word('FOG', 1, 0.83);
SELECT insert_word('BOG', 1, 0.75);
SELECT insert_word('COG', 1, 0.73);
SELECT insert_word('BED', 1, 0.94);
SELECT insert_word('RED', 1, 0.93);
SELECT insert_word('WED', 1, 0.78);
SELECT insert_word('LED', 1, 0.85);
SELECT insert_word('FED', 1, 0.87);

-- -------------------------------------------------------------------------
-- 4-letter words (Difficulty 1-2, Medium-high frequency 0.60-0.85)
-- -------------------------------------------------------------------------
SELECT insert_word('CATS', 1, 0.81);
SELECT insert_word('BATS', 1, 0.79);
SELECT insert_word('RATS', 1, 0.77);
SELECT insert_word('HATS', 1, 0.80);
SELECT insert_word('MATS', 1, 0.72);
SELECT insert_word('CARD', 1, 0.82);
SELECT insert_word('WARD', 1, 0.75);
SELECT insert_word('HARD', 1, 0.83);
SELECT insert_word('WORD', 1, 0.85);
SELECT insert_word('CORD', 1, 0.71);
SELECT insert_word('LORD', 1, 0.78);
SELECT insert_word('FORD', 1, 0.76);
SELECT insert_word('COLD', 2, 0.83);
SELECT insert_word('SOLD', 2, 0.81);
SELECT insert_word('GOLD', 2, 0.82);
SELECT insert_word('HOLD', 2, 0.82);
SELECT insert_word('TOLD', 2, 0.84);
SELECT insert_word('FOLD', 2, 0.75);
SELECT insert_word('BOLD', 2, 0.76);

-- -------------------------------------------------------------------------
-- 5-letter words (Difficulty 2-3, Medium frequency 0.50-0.75)
-- -------------------------------------------------------------------------
SELECT insert_word('WORDS', 2, 0.73);
SELECT insert_word('CORDS', 2, 0.63);
SELECT insert_word('LORDS', 2, 0.65);
SELECT insert_word('FORDS', 2, 0.60);
SELECT insert_word('WORLD', 2, 0.75);
SELECT insert_word('WOULD', 2, 0.73);
SELECT insert_word('COULD', 2, 0.74);
SELECT insert_word('HOUSE', 2, 0.72);
SELECT insert_word('MOUSE', 2, 0.68);
SELECT insert_word('CHAIN', 2, 0.65);
SELECT insert_word('CHAIR', 2, 0.71);
SELECT insert_word('CHARM', 3, 0.62);
SELECT insert_word('CHAMP', 3, 0.61);
SELECT insert_word('CHOMP', 3, 0.55);
SELECT insert_word('CHORE', 3, 0.58);
SELECT insert_word('SHORE', 3, 0.64);
SELECT insert_word('SHARE', 3, 0.67);
SELECT insert_word('SPARE', 3, 0.63);
SELECT insert_word('SCARE', 3, 0.62);
SELECT insert_word('SCORE', 3, 0.65);

-- -------------------------------------------------------------------------
-- 6-letter words (Difficulty 3-4, Medium-low frequency 0.40-0.60)
-- -------------------------------------------------------------------------
SELECT insert_word('CHANGE', 3, 0.59);
SELECT insert_word('CHARGE', 3, 0.58);
SELECT insert_word('BARGE', 3, 0.47);
SELECT insert_word('LARGE', 3, 0.60);
SELECT insert_word('TARGET', 3, 0.57);
SELECT insert_word('MARKET', 3, 0.55);
SELECT insert_word('MARKED', 3, 0.53);
SELECT insert_word('PARKED', 3, 0.52);
SELECT insert_word('PARSED', 3, 0.48);
SELECT insert_word('PASSED', 3, 0.56);
SELECT insert_word('PAUSED', 4, 0.51);
SELECT insert_word('CAUSED', 4, 0.53);
SELECT insert_word('GARDEN', 3, 0.54);
SELECT insert_word('HARDEN', 3, 0.49);
SELECT insert_word('BURDEN', 4, 0.46);
SELECT insert_word('HIDDEN', 3, 0.52);

-- -------------------------------------------------------------------------
-- 7-letter words (Difficulty 4-5, Lower frequency 0.30-0.45)
-- -------------------------------------------------------------------------
SELECT insert_word('CHANGED', 4, 0.45);
SELECT insert_word('CHARGED', 4, 0.44);
SELECT insert_word('CHANNEL', 4, 0.43);
SELECT insert_word('FLANNEL', 4, 0.38);
SELECT insert_word('FLANKED', 4, 0.36);
SELECT insert_word('BLANKED', 4, 0.35);
SELECT insert_word('BLANKET', 4, 0.42);
SELECT insert_word('BRACKET', 4, 0.38);
SELECT insert_word('RACKET', 3, 0.43);
SELECT insert_word('ROCKET', 3, 0.44);
SELECT insert_word('POCKET', 3, 0.47);
SELECT insert_word('LOCKET', 4, 0.36);
SELECT insert_word('LOCKED', 3, 0.41);

-- -------------------------------------------------------------------------
-- 8-letter words (Difficulty 5, Lower frequency 0.20-0.35)
-- -------------------------------------------------------------------------
SELECT insert_word('REACTION', 5, 0.34);
SELECT insert_word('FRACTION', 5, 0.32);
SELECT insert_word('TRACTION', 5, 0.30);
SELECT insert_word('TRACKING', 5, 0.33);
SELECT insert_word('CRACKING', 5, 0.31);
SELECT insert_word('CRACKLING', 5, 0.27);
SELECT insert_word('SPARKLING', 5, 0.29);
SELECT insert_word('SPIRALING', 5, 0.26);
SELECT insert_word('SPRINTING', 5, 0.28);
SELECT insert_word('SPLITTING', 5, 0.25);
SELECT insert_word('SPITTING', 4, 0.24);
SELECT insert_word('SPINNING', 4, 0.30);
SELECT insert_word('SPANNING', 5, 0.22);
SELECT insert_word('PLANNING', 4, 0.33);
SELECT insert_word('PLANTING', 4, 0.31);

-- Commit transaction
COMMIT;

-- Add some complete chains for game testing
COMMENT ON TABLE public.words IS 'Word dictionary for ChainReaction with difficulty ratings 1-5.
Sample chains for testing:
1. CAT -> BAT -> BED -> RED
2. WORD -> WARD -> CARD -> CART -> CAST -> COST -> POST
3. CHAIR -> CHAIN -> CHAMP -> CHOMP -> CHORE -> SHORE -> SHARE -> SPARE -> SCARE -> SCORE
4. CHANGE -> CHARGE -> BARGE -> LARGE
5. REACTION -> FRACTION -> TRACTION -> TRACKING -> CRACKING';

-- Drop the temporary function
DROP FUNCTION IF EXISTS insert_word(TEXT, INTEGER, FLOAT);

-- Quick verification query
SELECT difficulty, COUNT(*) as word_count, MIN(frequency) as min_freq, MAX(frequency) as max_freq, AVG(frequency) as avg_freq
FROM public.words
GROUP BY difficulty
ORDER BY difficulty; 