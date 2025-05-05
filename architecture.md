# ChainReaction Architecture

This document outlines the architectural approach for the ChainReaction word game, particularly focusing on how the application interacts with Supabase.

## Overview

ChainReaction uses a hybrid architecture that combines:

1. **Direct Frontend-to-Supabase Communication** for most operations
2. **Specialized Backend API** for complex game logic and sensitive operations

This approach balances simplicity, performance, and security while leveraging Supabase's capabilities.

## Frontend Architecture

### Direct Supabase Integration

The React frontend communicates directly with Supabase using the `@supabase/supabase-js` client library:

```typescript
// src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

This client is used throughout the application for:

- Authentication (sign up, sign in, sign out)
- Basic database queries (e.g., fetching user profiles, word dictionary)
- Real-time subscriptions (for multiplayer games)
- Storage operations (e.g., user avatars)

### Security Considerations

Security is maintained through Supabase's Row Level Security (RLS) policies, which are defined in SQL and enforced at the database level. These policies ensure users can only access data they're authorized to see.

## Backend Architecture (Planned)

For complex operations that shouldn't be performed client-side, we'll implement a Node.js/Express backend. This will handle:

1. **Complex Game Logic**
   - Word chain validation algorithms
   - Score calculation
   - Game state verification

2. **Tournament Management**
   - Tournament pairing algorithms
   - Bracket generation
   - Results validation

3. **Challenge Generation**
   - Daily challenge creation
   - Difficulty calibration
   - Chain validity verification

4. **External Integrations**
   - Dictionary API connections
   - Social sharing functionality
   - Notification services

### Backend-to-Supabase Communication

The backend will communicate with Supabase using the service role key for elevated permissions:

```typescript
// Example backend code (planned)
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Backend operations can now bypass RLS for administrative functions
```

## Data Flow

1. **Authentication Flow**:
   - User credentials → React Frontend → Supabase Auth → JWT Token → Client Storage
   - The token is used for subsequent requests

2. **Game Play Flow**:
   - User actions → React Frontend → Supabase Directly for simple operations
   - Complex validation → React Frontend → Express Backend → Supabase → Frontend

3. **Multiplayer Flow**:
   - Game state changes → Supabase Realtime → All connected clients
   - Match results → Express Backend → Supabase → Leaderboard updates

## Key Technical Decisions

1. **Why Direct Supabase Access?**
   - Simplifies architecture (fewer API hops)
   - Leverages Supabase's built-in security
   - Enables real-time capabilities without extra infrastructure

2. **Why Add a Backend?**
   - Protects sensitive business logic
   - Enables complex operations that shouldn't run client-side
   - Provides a security boundary for critical operations

3. **Why Not Next.js Server Components?**
   - Prioritizing simplicity with CRA for initial development
   - Avoiding architectural conflicts between Next.js middleware and direct client approach
   - Maintaining clear separation of concerns

## Implementation Status

- **Implemented**: Frontend-direct Supabase communication
- **Implemented**: Authentication flows
- **Implemented**: Basic game mechanics
- **Planned**: Express backend for advanced features
- **Planned**: Tournament system and multiplayer capabilities

## Future Considerations

As the application grows, we may consider:
- Migrating to a complete Next.js application if server-side rendering becomes important
- Expanding the backend API for additional game features
- Implementing microservices for specific game components when scale requires 