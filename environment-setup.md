# Environment Setup for ChainReaction

This document explains how to set up environment variables for the ChainReaction project.

## Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Environment (development, production, test)
NODE_ENV=development
```

## Security Considerations

1. **NEVER commit the `.env` file to the repository**
2. The `.env` file is listed in `.gitignore` to prevent accidental commits
3. Ensure you keep your API keys secure and do not share them
4. Different environments (development, production, test) should use different API keys

## Obtaining Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Project Settings > API
3. Copy the URL and anon/public key

![Supabase API Keys](https://supabase.com/docs/img/project-api-keys.png)

## Environment Files for Different Environments

For different environments, you can create:
- `.env.development` for development 
- `.env.test` for testing
- `.env.production` for production

These files are also included in the `.gitignore` file. 