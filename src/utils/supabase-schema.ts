/**
 * This file contains the database schema for the ChainReaction Supabase project
 * It's for reference when setting up tables in the Supabase dashboard
 * and documenting Row Level Security (RLS) policies
 */

/**
 * users table (extends Supabase auth.users)
 * 
 * CREATE TABLE public.profiles (
 *   id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
 *   username TEXT UNIQUE,
 *   display_name TEXT,
 *   avatar_url TEXT,
 *   bio TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- RLS Policies
 * -- Enable read access for all users
 * CREATE POLICY "Public profiles are viewable by everyone."
 *   ON public.profiles FOR SELECT
 *   USING ( true );
 * 
 * -- Enable update for users on their own profile
 * CREATE POLICY "Users can update their own profile."
 *   ON public.profiles FOR UPDATE
 *   USING ( auth.uid() = id )
 *   WITH CHECK ( auth.uid() = id );
 * 
 * -- Enable insert for authenticated users
 * CREATE POLICY "Users can insert their own profile."
 *   ON public.profiles FOR INSERT
 *   WITH CHECK ( auth.uid() = id );
 */

/**
 * words dictionary table
 * 
 * CREATE TABLE public.words (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   word TEXT UNIQUE NOT NULL,
 *   difficulty INTEGER NOT NULL DEFAULT 1,
 *   frequency FLOAT NOT NULL DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- RLS Policies
 * -- Enable read access for all users
 * CREATE POLICY "Words are viewable by everyone."
 *   ON public.words FOR SELECT
 *   USING ( true );
 * 
 * -- Only allow admins to update or insert
 * CREATE POLICY "Admins can update words."
 *   ON public.words FOR ALL
 *   USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );
 */

/**
 * daily_challenges table
 * 
 * CREATE TABLE public.daily_challenges (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   date DATE UNIQUE NOT NULL,
 *   start_word TEXT NOT NULL REFERENCES public.words(word),
 *   end_word TEXT NOT NULL REFERENCES public.words(word),
 *   chain_length INTEGER NOT NULL,
 *   difficulty INTEGER NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- RLS Policies
 * -- Everyone can read
 * CREATE POLICY "Daily challenges are viewable by everyone."
 *   ON public.daily_challenges FOR SELECT
 *   USING ( true );
 * 
 * -- Only admins can create/update
 * CREATE POLICY "Only admins can create daily challenges."
 *   ON public.daily_challenges FOR ALL
 *   USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );
 */

/**
 * user_solutions table
 * 
 * CREATE TABLE public.user_solutions (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users NOT NULL,
 *   challenge_id UUID REFERENCES public.daily_challenges NOT NULL,
 *   time_to_complete INTEGER NOT NULL,
 *   attempts INTEGER NOT NULL,
 *   solution TEXT[] NOT NULL,
 *   score INTEGER NOT NULL,
 *   completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
 *   UNIQUE(user_id, challenge_id)
 * );
 * 
 * -- RLS Policies
 * -- Users can view their own solutions and others' solutions
 * CREATE POLICY "Users can view all solutions."
 *   ON public.user_solutions FOR SELECT
 *   USING ( true );
 * 
 * -- Users can only insert their own solutions
 * CREATE POLICY "Users can insert their own solutions."
 *   ON public.user_solutions FOR INSERT
 *   WITH CHECK ( auth.uid() = user_id );
 * 
 * -- Users can only update their own solutions
 * CREATE POLICY "Users can update their own solutions."
 *   ON public.user_solutions FOR UPDATE
 *   USING ( auth.uid() = user_id )
 *   WITH CHECK ( auth.uid() = user_id );
 */

/**
 * user_stats table
 * 
 * CREATE TABLE public.user_stats (
 *   user_id UUID REFERENCES auth.users PRIMARY KEY,
 *   games_played INTEGER NOT NULL DEFAULT 0,
 *   games_won INTEGER NOT NULL DEFAULT 0,
 *   average_time INTEGER NOT NULL DEFAULT 0,
 *   average_attempts FLOAT NOT NULL DEFAULT 0,
 *   elo_rating INTEGER NOT NULL DEFAULT 1000,
 *   streak_current INTEGER NOT NULL DEFAULT 0,
 *   streak_best INTEGER NOT NULL DEFAULT 0,
 *   badges TEXT[] NOT NULL DEFAULT '{}',
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- RLS Policies
 * -- Everyone can view stats
 * CREATE POLICY "Stats are viewable by everyone."
 *   ON public.user_stats FOR SELECT
 *   USING ( true );
 * 
 * -- Only the user or admin can update stats
 * CREATE POLICY "Users can only update their own stats."
 *   ON public.user_stats FOR UPDATE
 *   USING ( auth.uid() = user_id OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' )
 *   WITH CHECK ( auth.uid() = user_id OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );
 * 
 * -- Users can insert their own stats
 * CREATE POLICY "Users can insert their own stats."
 *   ON public.user_stats FOR INSERT
 *   WITH CHECK ( auth.uid() = user_id );
 */

/**
 * user_subscriptions table
 * 
 * CREATE TABLE public.user_subscriptions (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
 *   is_premium BOOLEAN NOT NULL DEFAULT false,
 *   subscription_start TIMESTAMP WITH TIME ZONE,
 *   subscription_end TIMESTAMP WITH TIME ZONE,
 *   stripe_customer_id TEXT,
 *   stripe_subscription_id TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- RLS Policies
 * -- Users can view their own subscription
 * CREATE POLICY "Users can view their own subscription."
 *   ON public.user_subscriptions FOR SELECT
 *   USING ( auth.uid() = user_id );
 * 
 * -- Only admins can manage subscriptions
 * CREATE POLICY "Only admins can manage subscriptions."
 *   ON public.user_subscriptions FOR ALL
 *   USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );
 */

/**
 * audit_logs table for security monitoring
 * 
 * CREATE TABLE public.audit_logs (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users,
 *   action TEXT NOT NULL,
 *   details JSONB NOT NULL DEFAULT '{}',
 *   ip_address TEXT,
 *   timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- RLS Policies
 * -- Only admins can view audit logs
 * CREATE POLICY "Only admins can view audit logs."
 *   ON public.audit_logs FOR SELECT
 *   USING ( auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' );
 * 
 * -- Anyone can insert an audit log
 * CREATE POLICY "Anyone can insert an audit log."
 *   ON public.audit_logs FOR INSERT
 *   WITH CHECK ( true );
 */ 