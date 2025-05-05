-- Create user_stats table with trigger functions

-- First ensure user_solutions table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_solutions') THEN
    RAISE EXCEPTION 'user_solutions table must be created first';
  END IF;
END $$;

-- Create user_stats table for aggregated user statistics
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY, -- Not using REFERENCES for now
  total_challenges_completed INTEGER NOT NULL DEFAULT 0,
  total_tournaments_entered INTEGER NOT NULL DEFAULT 0,
  total_tournament_wins INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  average_completion_time FLOAT,
  average_score FLOAT,
  elo_rating INTEGER NOT NULL DEFAULT 1200,
  total_matches INTEGER NOT NULL DEFAULT 0,
  matches_won INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_stats
-- Users can view their own stats
CREATE POLICY "Users can view their own stats" 
  ON public.user_stats 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Public can view all user stats for leaderboards
CREATE POLICY "Public can view user stats for leaderboards" 
  ON public.user_stats 
  FOR SELECT 
  USING (true);

-- Only the system or authorized users can update stats (commented out admin check for now)
CREATE POLICY "Only system can update stats" 
  ON public.user_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger function to update user stats when a solution is added
CREATE OR REPLACE FUNCTION update_user_stats_on_solution()
RETURNS TRIGGER AS $$
DECLARE
  current_date_challenge_id UUID;
  is_daily_challenge BOOLEAN;
BEGIN
  -- Get today's challenge ID
  SELECT id INTO current_date_challenge_id
  FROM public.daily_challenges
  WHERE valid_date = CURRENT_DATE;

  -- Check if this is the daily challenge
  is_daily_challenge := (NEW.challenge_id = current_date_challenge_id);

  -- Insert or update user stats
  INSERT INTO public.user_stats (
    user_id, 
    total_challenges_completed,
    current_streak,
    last_active_date
  ) VALUES (
    NEW.user_id, 
    1,
    CASE WHEN is_daily_challenge THEN 1 ELSE 0 END,
    CURRENT_DATE
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    total_challenges_completed = user_stats.total_challenges_completed + 1,
    current_streak = CASE 
      WHEN is_daily_challenge AND (user_stats.last_active_date = CURRENT_DATE - INTERVAL '1 day' OR user_stats.last_active_date IS NULL)
      THEN user_stats.current_streak + 1
      WHEN is_daily_challenge AND user_stats.last_active_date != CURRENT_DATE
      THEN 1
      ELSE user_stats.current_streak
    END,
    best_streak = GREATEST(
      user_stats.best_streak, 
      CASE 
        WHEN is_daily_challenge AND (user_stats.last_active_date = CURRENT_DATE - INTERVAL '1 day' OR user_stats.last_active_date IS NULL)
        THEN user_stats.current_streak + 1
        WHEN is_daily_challenge AND user_stats.last_active_date != CURRENT_DATE
        THEN 1
        ELSE user_stats.current_streak
      END
    ),
    average_completion_time = (
      (user_stats.average_completion_time * user_stats.total_challenges_completed + NEW.time_taken) / 
      (user_stats.total_challenges_completed + 1)
    ),
    average_score = (
      (user_stats.average_score * user_stats.total_challenges_completed + NEW.score) / 
      (user_stats.total_challenges_completed + 1)
    ),
    last_active_date = CURRENT_DATE,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user stats
CREATE TRIGGER update_stats_after_solution
AFTER INSERT ON public.user_solutions
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_on_solution(); 