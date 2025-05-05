-- Function to update user stats for timed mode
CREATE OR REPLACE FUNCTION update_user_timed_stats(
  score_value INTEGER,
  level_reached INTEGER,
  chains_completed INTEGER
)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
  current_high_score INTEGER;
  current_best_level INTEGER;
BEGIN
  -- Get the current user
  user_id := auth.uid();
  
  -- Get the user's current stats
  SELECT 
    timed_high_score,
    timed_best_level
  INTO 
    current_high_score,
    current_best_level
  FROM user_stats
  WHERE user_id = auth.uid();
  
  -- Update user_stats or insert if not exists
  INSERT INTO user_stats (
    user_id, 
    timed_games_played,
    timed_chains_completed,
    timed_high_score,
    timed_best_level,
    total_score
  )
  VALUES (
    user_id, 
    1, 
    chains_completed, 
    score_value,
    level_reached,
    score_value
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    timed_games_played = user_stats.timed_games_played + 1,
    timed_chains_completed = user_stats.timed_chains_completed + chains_completed,
    timed_high_score = GREATEST(user_stats.timed_high_score, score_value),
    timed_best_level = GREATEST(user_stats.timed_best_level, level_reached),
    total_score = user_stats.total_score + score_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get timed mode leaderboard
CREATE OR REPLACE FUNCTION get_timed_leaderboard(entries_limit INTEGER)
RETURNS TABLE (
  username TEXT,
  user_id UUID,
  high_score INTEGER,
  best_level INTEGER,
  games_played INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.username,
    u.id AS user_id,
    s.timed_high_score AS high_score,
    s.timed_best_level AS best_level,
    s.timed_games_played AS games_played
  FROM user_stats s
  JOIN users u ON s.user_id = u.id
  WHERE s.timed_high_score > 0
  ORDER BY s.timed_high_score DESC, s.timed_best_level DESC
  LIMIT entries_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 