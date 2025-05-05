# ChainReaction

ChainReaction is a competitive word puzzle game where players must complete word chains by finding the connecting words between a given start and end word. Each word in the chain differs from the adjacent word by exactly one letter. The game combines vocabulary skills with strategic thinking in a fast-paced, competitive environment.

## Key Features

- **Word Chain Puzzles**: Complete chains by finding words that differ by exactly one letter
- **Multiple Game Modes**:
  - Daily Challenge: One official puzzle per day (same for all players)
  - Timed Mode: Complete chains as quickly as possible
  - Endless Mode: Solve as many chains as possible within a set time
  - Versus Mode: Head-to-head competition against other players
  - Tournament Mode: Bracketed competition with elimination rounds
- **Competitive Elements**: Leaderboards, achievements, and tournaments
- **Social Features**: Player profiles, challenges, and social sharing

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime for multiplayer functionality
- **State Management**: Zustand
- **Form Management**: React Hook Form
- **Animations**: Framer Motion

## Current Development Status

ChainReaction is currently in early development. The following components have been implemented:

- Project structure and configuration
- Tailwind CSS setup
- Supabase client utility
- Authentication components and context
- TypeScript interfaces for data model
- Basic layout and UI components
- Simple WordChain game component with core validation logic

For detailed changes, please see the [Changelog](./changelog.md).

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account for backend services

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ChainReaction.git
cd ChainReaction
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm build`: Builds the app for production
- `npm eject`: Ejects from Create React App configuration

## Contributing

Contributions are welcome! Please check the [developer-todo.md](./developer-todo.md) file for the current development roadmap and areas that need implementation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
