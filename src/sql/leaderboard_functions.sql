-- Function to get daily leaderboard
CREATE OR REPLACE FUNCTION get_daily_leaderboard(challenge_date DATE, entries_limit INTEGER)
RETURNS TABLE (
  username TEXT,
  user_id UUID,
  completion_time INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.username,
    u.id AS user_id,
    s.completion_time,
    s.completed_at,
    s.attempts
  FROM user_solutions s
  JOIN users u ON s.user_id = u.id
  JOIN daily_challenges c ON s.challenge_id = c.id
  WHERE c.date = challenge_date
  ORDER BY s.completion_time ASC, s.attempts ASC, s.completed_at ASC
  LIMIT entries_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get weekly leaderboard
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(entries_limit INTEGER)
RETURNS TABLE (
  username TEXT,
  user_id UUID,
  total_score INTEGER,
  challenges_completed INTEGER
) AS $$
DECLARE
  week_start DATE := date_trunc('week', CURRENT_DATE)::DATE;
  week_end DATE := (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::DATE;
BEGIN
  RETURN QUERY
  SELECT 
    u.username,
    u.id AS user_id,
    SUM(s.score) AS total_score,
    COUNT(DISTINCT s.challenge_id) AS challenges_completed
  FROM user_solutions s
  JOIN users u ON s.user_id = u.id
  JOIN daily_challenges c ON s.challenge_id = c.id
  WHERE c.date BETWEEN week_start AND week_end
  GROUP BY u.username, u.id
  ORDER BY total_score DESC, challenges_completed DESC
  LIMIT entries_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user stats when they complete a challenge
CREATE OR REPLACE FUNCTION update_user_stats_on_completion(challenge_id UUID, completion_time INTEGER)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
  challenge_difficulty TEXT;
  user_solution_id UUID;
  challenge_date DATE;
  score INTEGER;
  time_bonus INTEGER;
  attempts INTEGER;
BEGIN
  -- Get the current user
  user_id := auth.uid();
  
  -- Get the challenge difficulty and date
  SELECT c.difficulty, c.date 
  INTO challenge_difficulty, challenge_date
  FROM daily_challenges c 
  WHERE c.id = challenge_id;
  
  -- Get the user's solution
  SELECT id, attempts
  INTO user_solution_id, attempts
  FROM user_solutions
  WHERE user_id = auth.uid() AND challenge_id = update_user_stats_on_completion.challenge_id;
  
  -- Calculate score based on difficulty and completion time
  -- Base score depends on difficulty
  CASE challenge_difficulty
    WHEN 'easy' THEN score := 100;
    WHEN 'medium' THEN score := 200;
    WHEN 'hard' THEN score := 300;
    ELSE score := 100;
  END CASE;
  
  -- Time bonus decreases as completion time increases
  time_bonus := GREATEST(0, 100 - (completion_time / 10));
  
  -- Add time bonus to score
  score := score + time_bonus;
  
  -- Penalize for more attempts
  score := score - (attempts * 5);
  
  -- Ensure minimum score
  score := GREATEST(score, 10);
  
  -- Update the solution with the score
  UPDATE user_solutions
  SET score = update_user_stats_on_completion.score
  WHERE id = user_solution_id;
  
  -- Update user_stats or insert if not exists
  INSERT INTO user_stats (user_id, challenges_completed, total_score, streak, last_completed_date)
  VALUES (
    user_id, 
    1, 
    score, 
    1, 
    challenge_date
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    challenges_completed = user_stats.challenges_completed + 1,
    total_score = user_stats.total_score + score,
    streak = CASE 
      WHEN user_stats.last_completed_date = challenge_date - INTERVAL '1 day' THEN user_stats.streak + 1
      WHEN user_stats.last_completed_date = challenge_date THEN user_stats.streak
      ELSE 1
    END,
    last_completed_date = challenge_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 