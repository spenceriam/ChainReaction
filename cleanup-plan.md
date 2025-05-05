# ChainReaction Codebase Cleanup Plan

This document outlines the plan to resolve conflicts between React and Next.js approaches in the ChainReaction codebase.

## Current Situation

The codebase currently has a mix of:
- Standard React app structure using Create React App (CRA)
- Next.js App Router components and utilities
- Conflicting Supabase integration approaches

These conflicts are causing TypeScript errors and architectural confusion.

## Cleanup Approach

We will standardize on the **Frontend-Direct Supabase Integration** approach as documented in `architecture.md`, removing Next.js-specific code while preserving the core functionality.

## Files to Remove or Update

### Files to Remove

These Next.js-specific files are causing conflicts and should be removed:

1. **Next.js App Router Files**
   - `src/app/` directory and all contents
   - `src/middleware.ts`

2. **Next.js Supabase Utilities**
   - `src/utils/supabase-browser.ts`
   - `src/utils/supabase-server.ts`
   - `src/auth/actions.ts`

### Files to Keep and Update

1. **Core Utilities**
   - `src/utils/supabase.ts` - Main Supabase client for direct integration

2. **Authentication**
   - `src/hooks/useAuth.ts` - Update to use direct Supabase client approach
   - `src/components/auth/AuthForm.tsx` - Already uses direct approach, keep as is

3. **Game Components**
   - `src/components/game/WordChain.tsx` - Keep as is
   - Other game components - Keep as is

## Implementation Steps

1. **Remove Next.js Files**
   ```bash
   rm -rf src/app/
   rm src/middleware.ts
   rm src/utils/supabase-browser.ts
   rm src/utils/supabase-server.ts
   rm -rf src/auth/
   ```

2. **Update `useAuth.ts` Hook**
   - Simplify to use direct Supabase client
   - Ensure it provides necessary user state and auth functions

3. **Update `App.tsx`**
   - Remove commented-out AuthProvider references
   - Ensure it uses the cleaned-up components

4. **Fix TypeScript Configuration**
   - Update `tsconfig.json` if needed to resolve any remaining TypeScript errors

## Testing Plan

After cleanup, test the following functionality:

1. **Authentication**
   - User signup
   - User login
   - User logout

2. **Game Functionality**
   - Word chain validation
   - Game state management

3. **Database Access**
   - Profile data fetching
   - Game data saving

## Future Work

After cleaning up the codebase, these next steps are planned:

1. **Express Backend Development**
   - Set up Express server structure
   - Implement API endpoints for complex game logic
   - Configure secure Supabase access from backend

2. **Enhanced Game Features**
   - Tournament system
   - Multiplayer functionality
   - Daily challenges

## Documentation Updates

After cleanup, ensure these documents are updated:

1. **README.md** - Update with clear architecture explanation
2. **CHANGELOG.md** - Document the architectural change
3. **environment-setup.md** - Update if environment variables change 