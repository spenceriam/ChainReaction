-- Create daily_challenges table only

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_word TEXT NOT NULL,
  end_word TEXT NOT NULL,
  expected_chain_length INTEGER NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  valid_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID -- References auth.users(id) removed temporarily
);

-- Enable Row Level Security
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_challenges
-- Everyone can view today's and past challenges
CREATE POLICY "Public can view current and past daily challenges" 
  ON public.daily_challenges 
  FOR SELECT 
  USING (valid_date <= CURRENT_DATE);

-- Only admin users can create/update challenges
-- Comment out admin policies for now to test basic table creation
/*
CREATE POLICY "Only admins can insert daily challenges" 
  ON public.daily_challenges 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));

CREATE POLICY "Only admins can update daily challenges" 
  ON public.daily_challenges 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM users_with_admin_role()))
  WITH CHECK (auth.uid() IN (SELECT id FROM users_with_admin_role()));
*/ 