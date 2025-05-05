# ChainReaction: Product Requirements Document

## Product Overview
ChainReaction is a competitive word puzzle game where players must complete word chains by finding the connecting words between a given start and end word. Each word in the chain differs from the adjacent word by exactly one letter. The game combines vocabulary skills with strategic thinking in a fast-paced, competitive environment.

## Target Audience
- Word game enthusiasts
- Puzzle solvers
- Competitive gamers
- Educational market (vocabulary building)
- Age range: 12+

## Tech Stack
- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express (TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with OAuth integrations
- **Real-time**: Supabase Realtime for multiplayer functionality
- **Hosting**: Vercel/Netlify for frontend, Supabase for backend functions

## Game Mechanics

### Core Gameplay
1. **The Chain**: Players are presented with two words (start and end) and must find all connecting words that form a valid chain
2. **Word Transformation**: Each word in the chain must differ from the adjacent word by changing exactly one letter
3. **Word Validity**: All words must be valid dictionary words (stored in Supabase)
4. **Chain Length**: Variable chain lengths (3-7 words total) based on difficulty level

### Game Modes
1. **Daily Challenge**: One official puzzle per day (same for all players)
2. **Timed Mode**: Complete chains as quickly as possible
3. **Endless Mode**: Solve as many chains as possible within a set time
4. **Versus Mode**: Head-to-head competition against other players
5. **Tournament Mode**: Bracketed competition with elimination rounds

### Difficulty Levels
- **Beginner**: Shorter chains (3-4 words) using common vocabulary
- **Intermediate**: Medium chains (4-5 words) with moderate vocabulary
- **Expert**: Longer chains (5-7 words) with advanced vocabulary
- **Master**: Longer chains with multiple valid pathways, requiring optimal path discovery

## Supabase Database Structure

### Tables
1. **users**
   - Leveraging Supabase Auth for user management
   - Additional profile information (display name, avatar, settings)

2. **words**
   - Dictionary of valid words
   - Difficulty rating
   - Usage frequency

3. **daily_challenges**
   - Start word, end word
   - Expected chain length
   - Difficulty rating
   - Valid date

4. **user_solutions**
   - User ID
   - Challenge ID
   - Time to complete
   - Number of attempts
   - Solution path
   - Score

5. **tournaments**
   - Tournament ID
   - Start/end dates
   - Format
   - Prize information
   - Entry requirements

6. **tournament_rounds**
   - Round information
   - Player matchups
   - Results

7. **user_stats**
   - Aggregated performance metrics
   - Win/loss records
   - ELO rating
   - Badges/achievements

### Supabase Functions
1. **Word validation function**
2. **Score calculation function**
3. **Tournament pairing algorithm**
4. **Daily challenge generation**

### Supabase Realtime
1. Multiplayer game state synchronization
2. Live leaderboard updates
3. Tournament progress tracking

## User Interface

### Main Game Screen
- Clear display of start and end words
- Chain visualization with empty slots for connecting words
- Word entry field
- Timer display
- Score/points counter
- Attempt counter

### Feedback System
- **Green**: Valid word that connects properly with adjacent words
- **Yellow**: Valid dictionary word but doesn't connect properly
- **Red**: Invalid word (not in dictionary)
- **Chain Progress Visualization**: Visual representation of completed portions

### Game Flow
1. Player sees start and end words with empty slots between
2. Player enters a guess for any position in the chain
3. System validates the word and provides color-coded feedback
4. Player continues filling slots until chain is complete
5. Score is calculated based on time, attempts, and difficulty

## Competitive Elements

### Scoring System
- Base points for completing a chain
- Time multiplier (faster = higher score)
- Attempt efficiency bonus (fewer attempts = higher score)
- Difficulty multiplier
- Streak bonuses for consecutive completions

### Leaderboards
- Daily challenge leaderboard (resets daily)
- Weekly leaderboard (aggregated daily scores)
- Monthly championship board
- Friend-based leaderboards
- Global rankings

### Achievements & Progression
- **Chain Master**: Complete chains with minimal attempts
- **Speed Demon**: Complete chains under time thresholds
- **Vocabulary Virtuoso**: Complete chains with advanced vocabulary
- **Perfect Week**: Complete all daily challenges in a week
- **Tournament Champion**: Win competitive tournaments

### Competitive Tournaments
- Weekly knockout tournaments
- Monthly championships with qualification rounds
- Special event tournaments (themed, holiday, etc.)
- In-app rewards and recognition for winners

## Social Features

### Player Profiles
- Username and avatar
- Statistics tracking (chains completed, average time, win rate)
- Achievement showcase
- Ranking history

### Social Sharing
- Share completed chains with animation of solution
- Challenge specific friends to beat your time
- Create private lobbies for friend competitions
- Integration with social media platforms

### Community Features
- Global and friend activity feeds
- Chat functionality in versus mode
- Community-created custom chains
- Spectator mode for tournament finals

## Performance Requirements

- Response time under 100ms for word validation
- Support for concurrent users (scaling plan for 10k+ simultaneous users)
- 99.9% uptime for service availability
- Efficient caching strategy for dictionary lookups

## Monetization Strategy

### Free-to-Play Model
- Daily challenge available to all users
- Limited access to game modes
- Basic profile features

### Premium Subscription
- Unlimited access to all game modes
- Advanced statistics tracking
- Ad-free experience
- Early access to tournaments
- Custom profile customization

### In-App Purchases
- Hint packages (reveal one connecting word)
- Theme packs (UI customization)
- Tournament entry fees with prize pools
- Profile boosters

## Development Roadmap

### Phase 1: MVP Launch (2 months)
- Core game mechanics
- Daily challenge
- Basic profile and statistics
- Web platform release
- Supabase integration

### Phase 2: Competitive Features (2 months)
- Versus mode implementation
- Leaderboards and rankings
- Achievement system
- Premium subscription option

### Phase 3: Tournament Ecosystem (3 months)
- Tournament infrastructure
- Spectator capabilities
- Prize pool system
- Advanced statistics and replay features

### Phase 4: Community Expansion (3 months)
- User-generated chains
- Team competitions
- Language variants
- Educational partnerships

## Success Metrics
- Daily active users (DAU)
- Average session length
- Retention rates (1-day, 7-day, 30-day)
- Conversion rate to premium
- Tournament participation rate
- Social shares per user
- Revenue per daily active user (ARPDAU)
