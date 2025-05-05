// User types
export interface User {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
}

// Game types
export interface Word {
  id: string;
  word: string;
  difficulty: number;
  frequency: number;
}

export interface Chain {
  startWord: string;
  endWord: string;
  currentWords: string[];
  isComplete: boolean;
}

export interface GameState {
  chain: Chain;
  timer: number;
  score: number;
  attempts: number;
}

// Challenge types
export interface DailyChallenge {
  id: string;
  date: string;
  startWord: string;
  endWord: string;
  difficulty: number;
  chainLength: number;
}

export interface UserSolution {
  id: string;
  userId: string;
  challengeId: string;
  timeToComplete: number;
  attempts: number;
  solution: string[];
  score: number;
  completedAt: string;
}

// Tournament types
export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  format: string;
  prizeInfo: string;
  entryRequirements: string;
}

export interface TournamentRound {
  id: string;
  tournamentId: string;
  roundNumber: number;
  startDate: string;
  endDate: string;
  matchups: Matchup[];
}

export interface Matchup {
  id: string;
  tournamentRoundId: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  player1Score?: number;
  player2Score?: number;
}

// User stats types
export interface UserStats {
  userId: string;
  gamesPlayed: number;
  gamesWon: number;
  averageTime: number;
  averageAttempts: number;
  eloRating: number;
  streakCurrent: number;
  streakBest: number;
  badges: string[];
} 