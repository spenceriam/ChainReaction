-- Helper functions for ChainReaction game

-- Create function to calculate score for a solution
CREATE OR REPLACE FUNCTION calculate_solution_score(
  p_chain_length INTEGER,
  p_time_taken INTEGER,
  p_attempts INTEGER,
  p_difficulty INTEGER
) RETURNS INTEGER AS $$
DECLARE
  base_score INTEGER;
  time_multiplier FLOAT;
  attempt_multiplier FLOAT;
  difficulty_multiplier FLOAT;
  final_score INTEGER;
BEGIN
  -- Base score based on chain length
  base_score := p_chain_length * 100;
  
  -- Time multiplier: faster = higher score
  -- Max multiplier is 2.0, min is 0.5
  time_multiplier := GREATEST(0.5, 2.0 - (p_time_taken::float / (30 * p_chain_length)));
  
  -- Attempt multiplier: fewer attempts = higher score
  -- Perfect solution (chain_length attempts) gets 1.5, many attempts approaches 0.75
  attempt_multiplier := GREATEST(0.75, 1.5 - ((p_attempts - p_chain_length)::float / (2 * p_chain_length)));
  
  -- Difficulty multiplier: 1.0 for easy, up to 2.0 for hardest
  difficulty_multiplier := 1.0 + ((p_difficulty - 1) * 0.25);
  
  -- Calculate final score
  final_score := ROUND(base_score * time_multiplier * attempt_multiplier * difficulty_multiplier);
  
  RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate a word chain
CREATE OR REPLACE FUNCTION validate_word_chain(chain TEXT[])
RETURNS BOOLEAN AS $$
DECLARE
  i INTEGER;
  word1 TEXT;
  word2 TEXT;
  diff_count INTEGER;
  j INTEGER;
BEGIN
  -- Check if chain has at least 2 words
  IF array_length(chain, 1) < 2 THEN
    RETURN FALSE;
  END IF;
  
  -- Check each adjacent pair of words
  FOR i IN 1..array_length(chain, 1) - 1 LOOP
    word1 := chain[i];
    word2 := chain[i + 1];
    
    -- Words must be same length
    IF length(word1) != length(word2) THEN
      RETURN FALSE;
    END IF;
    
    -- Exactly one letter must differ
    diff_count := 0;
    FOR j IN 1..length(word1) LOOP
      IF substr(word1, j, 1) != substr(word2, j, 1) THEN
        diff_count := diff_count + 1;
      END IF;
    END LOOP;
    
    IF diff_count != 1 THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  -- All pairs are valid
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql; 