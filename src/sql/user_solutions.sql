-- Create user_solutions table with basic policies

-- First ensure daily_challenges table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'daily_challenges') THEN
    RAISE EXCEPTION 'daily_challenges table must be created first';
  END IF;
END $$;

-- Create user_solutions table
CREATE TABLE IF NOT EXISTS public.user_solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Not using REFERENCES for now
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