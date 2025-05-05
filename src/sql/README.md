# Supabase Database Setup

This directory contains SQL scripts for setting up the necessary database tables and functions for the ChainReaction application.

## How to Use

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Go to the SQL Editor
4. Create a new query
5. Copy and paste the contents of the SQL scripts in the following order:
   - First run `setup_tables.sql` - Sets up base tables (profiles, words)
   - Then run `additional_tables.sql` - Sets up game-specific tables and functions
6. Click "Run" to execute the SQL

## Included Setup

### Base Tables (`setup_tables.sql`)

1. **profiles table** - Extends the built-in auth.users table with additional user profile information
2. **words table** - For storing the dictionary of valid words for the game
3. **Row Level Security (RLS) policies** - Ensures data security by controlling access to rows in tables
4. **Utility functions** - Helper functions like `get_schema_version()` for diagnostics and maintenance

### Game Tables (`additional_tables.sql`)

1. **daily_challenges** - Stores daily word chain challenges
2. **user_solutions** - Records user solutions to challenges
3. **tournaments** - Information about tournaments
4. **tournament_participants** - Tracks who has joined each tournament
5. **tournament_rounds** - Rounds within tournaments
6. **round_matchups** - Player pairings within rounds
7. **user_stats** - Aggregated statistics for users
8. **badges** - Available achievements
9. **user_badges** - Badges earned by users

### Functions and Triggers

1. **users_with_admin_role()** - Helper function for RLS policies
2. **calculate_solution_score()** - Calculates scores based on performance
3. **update_user_stats_on_solution()** - Trigger function to maintain user stats
4. **validate_word_chain()** - Validates that a word chain follows game rules

## Verifying Setup

After running the setup scripts, you can verify it worked by:

1. Checking the "Tables" section in your Supabase dashboard to see the new tables
2. Running a SQL query to test the utility functions:
   ```sql
   SELECT validate_word_chain(ARRAY['CHAIN', 'CHAIR', 'CHEER', 'SHEER', 'SHEEP', 'SLEEP', 'SLEPT', 'SWEPT', 'SWEET', 'TWEET', 'TWEEN', 'QUEEN', 'QUEST', 'GUEST', 'GUST', 'MUST', 'MUSE', 'FUSE', 'FUSS', 'MOSS', 'LOSS', 'LOST', 'LOFT', 'LIFT', 'GIFT', 'SIFT', 'SOFT', 'SORT', 'PORT', 'PART', 'MART', 'MARK', 'PARK', 'PERK', 'PEAK', 'PEAL', 'REAL', 'REEL', 'REEF', 'BEEF', 'BEER', 'BEET', 'BENT', 'RENT', 'REST', 'RUST', 'RUNT', 'HUNT', 'HINT', 'LINT', 'LINE', 'LONE', 'LONG', 'SONG', 'SUNG', 'LUNG', 'LUND', 'LAND', 'LARD', 'CARD', 'CURD', 'CURE', 'PURE', 'SURE', 'SERE', 'MERE', 'MARE', 'MALE', 'MOLE', 'HOLE', 'HOPE', 'HYPE', 'TYPE', 'TAPE', 'TAME', 'TARE', 'TIRE', 'TIDE', 'RIDE', 'RICE', 'RICH', 'RICK', 'RICK', 'PICK', 'PUCK', 'PECK', 'PEEK', 'SEEK', 'SEEM', 'SEEN', 'BEEN', 'BEER', 'BEES', 'FEES', 'FEDS', 'BEDS', 'BIDS', 'LIDS', 'LIES', 'LIEN', 'LIED', 'DIED', 'DIET', 'DIRT', 'DART', 'PART', 'PACT', 'FACT', 'FACE', 'PACE', 'PALE', 'POLE', 'POPE', 'ROPE', 'ROSE', 'RISE', 'RISK', 'DISK', 'DUSK', 'DUCK', 'LUCK', 'LICK', 'LINK', 'SINK', 'SINE', 'SITE', 'SIDE', 'RIDE', 'HIDE', 'HIKE', 'LIKE', 'LIVE', 'LOVE', 'MOVE', 'MORE', 'MARE', 'CARE', 'CARD', 'HARD', 'HARM', 'FARM', 'FORM', 'FORT', 'FORE', 'FIRE', 'HIRE', 'WIRE', 'WISE', 'WIPE', 'RIPE', 'RIFE', 'LIFE', 'LIFT', 'LIST', 'LAST', 'LUST', 'JUST', 'JEST', 'REST', 'PEST', 'PEAT', 'PENT', 'CENT', 'SENT', 'SEAT', 'SEAL', 'SEAM', 'SLAM', 'SLAP', 'SNAP', 'SNAG', 'STAG', 'STAR', 'SEAR', 'BEAR', 'HEAR', 'HEAP', 'HEAL', 'HELL', 'HELP', 'HEMP', 'HEMS', 'HEWS', 'JEWS', 'JAWS', 'JAMS', 'JABS', 'JOBS', 'JOTS', 'JETS', 'LETS', 'LETS', 'LENS', 'LEND', 'LAND', 'LANE', 'LATE', 'FATE', 'FADE', 'FAME', 'TAME', 'TIME', 'TILE', 'TILL', 'TELL', 'SELL', 'SEAL', 'MEAL', 'MEAT', 'MEET', 'MELT', 'MELD', 'MILD', 'MIND', 'MINT', 'HINT', 'HUNT', 'HURT', 'HURL', 'HULL', 'DULL', 'DOLL', 'DOLT', 'BOLT', 'BOAT', 'BEAT', 'BEAD', 'BEAM', 'REAM', 'REAP', 'LEAP', 'LEAK', 'LEAD', 'LOAD', 'LOAF', 'LOAN', 'LEAN', 'BEAN', 'BEAT', 'HEAT', 'FEAT', 'FEAR', 'NEAR', 'NEAT', 'NEST', 'BEST', 'BELT', 'MELT', 'MEET', 'FEET', 'FEED', 'WEED', 'WEEK', 'MEEK', 'MOCK', 'ROCK', 'RACK', 'RACE', 'LACE', 'LACK', 'PACK', 'BACK', 'BARK', 'DARK', 'DARE', 'CARE', 'CORE', 'CONE', 'HONE', 'HOME', 'HOSE', 'NOSE', 'NOTE', 'MOTE', 'MODE', 'CODE', 'COLD', 'CORD', 'WORD', 'WORK', 'WORM', 'WARM', 'WARD', 'CARD', 'CART', 'PART', 'PAST', 'PANT', 'PUNT', 'RUNT', 'RANT', 'RANK', 'RAND', 'WAND', 'WANT', 'WART', 'WARN', 'YARN', 'YAWN', 'PAWN', 'PAIN', 'PAIR', 'LAIR', 'LAIN', 'RAIN', 'RAID', 'RAIL', 'TAIL', 'TALL', 'TALK', 'WALK', 'WALL', 'MALL', 'MALT', 'SALT', 'SALTY', 'SALLY', 'RALLY', 'RAILS', 'SAILS', 'FAILS', 'FALLS', 'CALLS', 'CELLS', 'SELLS', 'SEEDS', 'REEDS', 'READS', 'READY', 'REACH', 'REACT']);
   
   SELECT calculate_solution_score(5, 120, 7, 3);
   ```

## Next Steps

After setting up your database, you can:

1. Load word data into the `words` table
2. Create test daily challenges
3. Set up admin users with the 'admin' role in their metadata
4. Test the game functionality

## Troubleshooting

If you encounter any issues:

- Check the SQL Editor error messages
- Ensure you have the correct permissions in your Supabase project
- Verify that your application's environment variables are set correctly 