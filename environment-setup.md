# ChainReaction Environment Setup

## Environment Variables

ChainReaction requires the following environment variables to be set:

### For Next.js App with Supabase Auth

Create a `.env.local` file in the root of your project with the following:

```
# Supabase
APP_SUPABASE_URL=your-supabase-project-url
APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Your Supabase Credentials

1. Go to [Supabase](https://app.supabase.com) and log in to your account
2. Select your project (or create a new one)
3. Go to Project Settings
4. Click on "API" in the sidebar
5. Under "Project API keys", you'll find:
   - Project URL: Use this for `APP_SUPABASE_URL`
   - `anon` `public` key: Use this for `APP_SUPABASE_ANON_KEY`

## Application URL

The `NEXT_PUBLIC_APP_URL` should point to the URL where your application is running:

- Local development: `http://localhost:3000`
- Production: Your deployed application URL (e.g., `https://chainreaction.vercel.app`)

This is used for auth redirects and other functionality that needs to know the base URL of your application.

## Security Notes

- Never commit your `.env.local` file to version control
- Make sure `.env.local` is included in your `.gitignore` file
- For production deployments, set these environment variables in your hosting provider's dashboard

## Next Steps

After setting up your environment variables:

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Visit `http://localhost:3000` to view the application 