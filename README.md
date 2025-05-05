# ChainReaction

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Version](https://img.shields.io/badge/Version-0.7.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20|%20TypeScript%20|%20Node.js%20|%20Supabase-informational)

A competitive word puzzle game where players complete word chains by finding connecting words between a given start and end word. Each word in the chain differs from the adjacent word by exactly one letter.

## Overview

ChainReaction combines vocabulary skills with strategic thinking in a fast-paced, competitive environment. The game challenges players to find the missing links in word chains, where each word differs from its neighbors by exactly one letter.

## Key Features

- **Word Chain Puzzles**: Complete chains by finding words that differ by exactly one letter
- **Multiple Game Modes**:
  - **Daily Challenge**: One official puzzle per day (same for all players)
  - **Timed Mode**: Complete chains as quickly as possible
  - **Endless Mode**: Solve as many chains as possible within a set time
  - **Versus Mode**: Head-to-head competition against other players *(coming soon)*
  - **Tournament Mode**: Bracketed competition with elimination rounds *(coming soon)*
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

## Development Status

ChainReaction is currently in active development. The following features have been implemented:

- ✅ Project structure and configuration
- ✅ Tailwind CSS setup
- ✅ Supabase client utilities
- ✅ Authentication components and context
- ✅ TypeScript interfaces for data model
- ✅ Layout and UI components
- ✅ WordChain game component with validation logic
- ✅ Daily Challenge mode
- ✅ Timed Mode
- ✅ Endless Mode with progressive difficulty
- ✅ Leaderboard functionality across game modes
- ✅ User profile statistics display
- ✅ Interactive game demo

For detailed changes, please see the [Changelog](./changelog.md).

## Current Goals

- Implement Versus Mode for player-vs-player gameplay
- Create Tournament Mode with brackets and elimination rounds
- Enhance social features and sharing capabilities
- Improve word difficulty rating system
- Optimize performance for mobile devices

## Coming Soon

- Mobile-responsive design improvements
- Advanced statistics tracking
- Friend challenges
- Custom word chains
- Weekly tournaments

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
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run start`: Starts the production server
- `npm run lint`: Runs the linter to check code quality
- `npm run test`: Runs tests

## Contributing

Contributions are welcome! Please check the [developer-todo.md](./developer-todo.md) file for the current development roadmap and areas that need implementation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
