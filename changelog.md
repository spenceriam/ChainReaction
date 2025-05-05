# Changelog

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

## [0.2.0] - 2025-05-05

### Added
- Defined Phase 1 development priorities focusing on core single-player experience
- Created detailed checklist for Phase 1 completion tasks
- Refined frontend component requirements to focus on single-player features

### Changed
- Restructured development roadmap to prioritize single-player experience before multiplayer features
- Updated game mode implementation plan to complete single-player modes first
- Deferred multiplayer features, social features, and premium features to Phase 2

### Deprecated
- None

### Removed
- None

### Fixed
- None

## [0.1.0] - 2025-05-05

### Added
- Set up proper directory structure following development guidelines
- Configured Tailwind CSS with proper configuration files
- Created Supabase client utility for database connection
- Implemented TypeScript interfaces for application data model
- Created auth components (AuthForm) for user authentication
- Implemented authentication context and hooks for managing user sessions
- Created basic layout component with responsive design
- Implemented simple WordChain game component with core game logic
- Updated App component to use the new components and layout
- Completely revised README.md with project description, features, and setup instructions
- Enhanced Supabase client with security best practices
- Added security utilities for user role-based access control
- Created protected route hook for authenticated routes
- Added database schema reference with Row Level Security policies
- Created environment setup documentation
- Updated .gitignore to exclude all environment files with sensitive information
- Added comprehensive architecture documentation defining frontend-direct Supabase approach
- Created cleanup plan to standardize codebase architecture
- Implemented complete database schema with all required tables for the game
- Added SQL functions for word validation, score calculation, and user stats tracking
- Created Row Level Security (RLS) policies for all database tables
- Added database triggers for automatic statistics updates
- Updated SQL documentation with setup instructions and examples
- Created sample word dictionary with 100 carefully selected words and appropriate difficulty ratings
- Added sample daily challenges for testing all game functionality
- Improved database setup guide with testing instructions

### Changed
- Improved Supabase client with additional configuration options and validation
- Enhanced error messaging for missing environment variables
- Updated environment setup documentation for Next.js integration
- Migrated from React app to Next.js App Router for improved performance and SEO
- Standardized on frontend-direct Supabase integration approach
- Removed Next.js server components and middleware to eliminate architectural conflicts
- Simplified authentication hooks to use direct Supabase client
- Updated component structure to follow consistent architectural pattern
- Enhanced SQL structure organization with separate files for clarity
- Reorganized SQL scripts into modular files for better maintenance and troubleshooting

### Deprecated
- None

### Removed
- Next.js App Router components and pages
- Server-side Supabase client utilities
- Middleware for authentication token handling

### Fixed
- Resolved TypeScript errors from conflicting architectural approaches
- Fixed authentication flow to use consistent pattern
- Fixed SQL function definition order to prevent dependency errors
- Fixed SQL script syntax error by removing BEGIN/END transaction block that was causing issues with DDL statements
- Created separate admin_role_fix.sql script to fix column name reference issue in users_with_admin_role function
- Improved database setup with modular SQL scripts to isolate and fix issues with table creation and RLS policies

