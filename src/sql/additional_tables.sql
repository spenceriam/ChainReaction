-- Additional tables for ChainReaction game
-- This script creates the remaining tables needed according to the PRD

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_word TEXT NOT NULL,
  end_word TEXT NOT NULL,
  expected_chain_length INTEGER NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  valid_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_challenges
-- Everyone can view today's and past challenges
CREATE POLICY "Public can view current and past daily challenges" 
  ON public.daily_challenges 
  FOR SELECT 
  USING (valid_date <= CURRENT_DATE);

-- Only admin users can create/update challenges (will be defined in a separate function)
CREATE POLICY "Only admins can insert daily challenges" 
  ON public.daily_challenges 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

CREATE POLICY "Only admins can update daily challenges" 
  ON public.daily_challenges 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM users_with_admin_role()))
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Create user_solutions table
CREATE TABLE IF NOT EXISTS public.user_solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  challenge_id UUID REFERENCES public.daily_challenges(id) NOT NULL,
  solution_path TEXT[] NOT NULL, -- Store the actual word chain as an array
  time_taken INTEGER NOT NULL, -- Time in seconds
  attempts INTEGER NOT NULL,
  score INTEGER NOT NULL, -- Calculated score
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_id) -- User can only have one successful solution per challenge
);

-- Enable Row Level Security
ALTER TABLE public.user_solutions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_solutions
-- Users can view their own solutions
CREATE POLICY "Users can view their own solutions" 
  ON public.user_solutions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can view solutions on public leaderboards
CREATE POLICY "Users can view solutions on leaderboards" 
  ON public.user_solutions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.daily_challenges 
    WHERE id = challenge_id AND valid_date <= CURRENT_DATE
  ));

-- Users can insert their own solutions
CREATE POLICY "Users can insert their own solutions" 
  ON public.user_solutions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own solutions
CREATE POLICY "Users can update their own solutions" 
  ON public.user_solutions 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  format TEXT NOT NULL, -- e.g., 'knockout', 'round-robin', 'swiss'
  entry_requirements JSONB, -- Flexible format for requirements
  prize_info JSONB, -- Flexible format for prize information
  max_participants INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Create policies for tournaments
-- Everyone can view tournaments
CREATE POLICY "Public can view tournaments" 
  ON public.tournaments 
  FOR SELECT 
  USING (true);

-- Only admin users can create/update tournaments
CREATE POLICY "Only admins can insert tournaments" 
  ON public.tournaments 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

CREATE POLICY "Only admins can update tournaments" 
  ON public.tournaments 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM users_with_admin_role()))
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Create tournament_participants table for tracking who enters tournaments
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disqualified', 'withdrawn')),
  UNIQUE(tournament_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for tournament_participants
-- Everyone can view tournament participants
CREATE POLICY "Public can view tournament participants" 
  ON public.tournament_participants 
  FOR SELECT 
  USING (true);

-- Users can join tournaments (insert their own participation)
CREATE POLICY "Users can join tournaments" 
  ON public.tournament_participants 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.tournaments 
      WHERE id = tournament_id AND status IN ('upcoming', 'active')
    )
  );

-- Users can update their own participation (e.g., withdraw)
CREATE POLICY "Users can update their tournament participation" 
  ON public.tournament_participants 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create tournament_rounds table
CREATE TABLE IF NOT EXISTS public.tournament_rounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) NOT NULL,
  round_number INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed')),
  challenges JSONB, -- Array of challenge IDs or embedded challenge data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tournament_id, round_number)
);

-- Enable Row Level Security
ALTER TABLE public.tournament_rounds ENABLE ROW LEVEL SECURITY;

-- Create policies for tournament_rounds
-- Everyone can view tournament rounds
CREATE POLICY "Public can view tournament rounds" 
  ON public.tournament_rounds 
  FOR SELECT 
  USING (true);

-- Only admin users can manage rounds
CREATE POLICY "Only admins can insert tournament rounds" 
  ON public.tournament_rounds 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

CREATE POLICY "Only admins can update tournament rounds" 
  ON public.tournament_rounds 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM users_with_admin_role()))
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Create round_matchups table for pairings within tournament rounds
CREATE TABLE IF NOT EXISTS public.round_matchups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID REFERENCES public.tournament_rounds(id) NOT NULL,
  player1_id UUID REFERENCES auth.users(id) NOT NULL,
  player2_id UUID REFERENCES auth.users(id) NOT NULL,
  player1_score INTEGER,
  player2_score INTEGER,
  winner_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'forfeit')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  challenge_id UUID REFERENCES public.daily_challenges(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CHECK (player1_id != player2_id) -- Ensure players are different
);

-- Enable Row Level Security
ALTER TABLE public.round_matchups ENABLE ROW LEVEL SECURITY;

-- Create policies for round_matchups
-- Everyone can view matchups
CREATE POLICY "Public can view matchups" 
  ON public.round_matchups 
  FOR SELECT 
  USING (true);

-- Only admin users can create matchups
CREATE POLICY "Only admins can insert matchups" 
  ON public.round_matchups 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Only admin users can update matchups
CREATE POLICY "Only admins can update matchups" 
  ON public.round_matchups 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM users_with_admin_role()))
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Create user_stats table for aggregated user statistics
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
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

-- Only the system or authorized functions can update stats
CREATE POLICY "Only system can update stats" 
  ON public.user_stats 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM users_with_admin_role()))
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Create badges table for user achievements
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_url TEXT,
  criteria JSONB, -- Requirements to earn the badge
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Create policies for badges
-- Everyone can view badges
CREATE POLICY "Public can view badges" 
  ON public.badges 
  FOR SELECT 
  USING (true);

-- Only admin users can create/update badges
CREATE POLICY "Only admins can manage badges" 
  ON public.badges 
  FOR ALL 
  USING (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Create user_badges table for tracking earned badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  badge_id UUID REFERENCES public.badges(id) NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for user_badges
-- Everyone can view user badges
CREATE POLICY "Public can view user badges" 
  ON public.user_badges 
  FOR SELECT 
  USING (true);

-- Only the system can award badges
CREATE POLICY "Only system can award badges" 
  ON public.user_badges 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

-- Create admin role function for policy use
CREATE OR REPLACE FUNCTION public.users_with_admin_role()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT id FROM auth.users
  WHERE raw_user_meta_data->>'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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