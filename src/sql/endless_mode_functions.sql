-- Function to update user stats for endless mode
CREATE OR REPLACE FUNCTION update_user_endless_stats(
  score_value INTEGER,
  chains_completed INTEGER,
  max_difficulty TEXT
)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
  difficulty_value INTEGER;
BEGIN
  -- Get the current user
  user_id := auth.uid();
  
  -- Convert difficulty to numeric value for comparison
  CASE max_difficulty
    WHEN 'easy' THEN difficulty_value := 1;
    WHEN 'medium' THEN difficulty_value := 2;
    WHEN 'hard' THEN difficulty_value := 3;
    ELSE difficulty_value := 1;
  END CASE;
  
  -- Update user_stats or insert if not exists
  INSERT INTO user_stats (
    user_id, 
    endless_games_played,
    endless_chains_completed,
    endless_high_score,
    endless_max_difficulty,
    total_score
  )
  VALUES (
    user_id, 
    1, 
    chains_completed, 
    score_value,
    max_difficulty,
    score_value
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    endless_games_played = user_stats.endless_games_played + 1,
    endless_chains_completed = user_stats.endless_chains_completed + chains_completed,
    endless_high_score = GREATEST(user_stats.endless_high_score, score_value),
    endless_max_difficulty = CASE 
      WHEN 
        (max_difficulty = 'hard' AND user_stats.endless_max_difficulty != 'hard') OR
        (max_difficulty = 'medium' AND user_stats.endless_max_difficulty = 'easy')
      THEN max_difficulty
      ELSE user_stats.endless_max_difficulty
    END,
    total_score = user_stats.total_score + score_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get endless mode leaderboard
CREATE OR REPLACE FUNCTION get_endless_leaderboard(entries_limit INTEGER)
RETURNS TABLE (
  username TEXT,
  user_id UUID,
  high_score INTEGER,
  chains_completed INTEGER,
  max_difficulty TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.username,
    u.id AS user_id,
    s.endless_high_score AS high_score,
    s.endless_chains_completed AS chains_completed,
    s.endless_max_difficulty AS max_difficulty
  FROM user_stats s
  JOIN users u ON s.user_id = u.id
  WHERE s.endless_high_score > 0
  ORDER BY s.endless_high_score DESC, s.endless_chains_completed DESC
  LIMIT entries_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 